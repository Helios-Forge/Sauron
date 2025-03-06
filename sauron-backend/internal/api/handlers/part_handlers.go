package handlers

import (
	"encoding/json"
	"net/http"
	"regexp"
	"sauron-backend/internal/db"
	"sauron-backend/internal/models"
	"sort"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

// Get all parts
// @Summary Get all parts
// @Description Get all parts with optional filtering by category, subcategory, or category_id
// @Tags Parts
// @Accept json
// @Produce json
// @Param category query string false "Filter by category name"
// @Param subcategory query string false "Filter by subcategory name"
// @Param category_id query int false "Filter by part category ID (new schema)"
// @Param is_prebuilt query bool false "Filter by prebuilt status"
// @Success 200 {array} models.Part
// @Router /parts [get]
func GetParts(c *gin.Context) {
	var parts []models.Part

	// Build query with filters
	query := db.DB

	// Filter by category (legacy)
	if category := c.Query("category"); category != "" {
		query = query.Where("category = ?", category)
	}

	// Filter by subcategory (legacy)
	if subcategory := c.Query("subcategory"); subcategory != "" {
		query = query.Where("subcategory = ?", subcategory)
	}

	// Filter by part_category_id (new schema)
	if categoryIDStr := c.Query("category_id"); categoryIDStr != "" {
		categoryID, err := strconv.Atoi(categoryIDStr)
		if err == nil {
			query = query.Where("part_category_id = ?", categoryID)
		}
	}

	// Filter by is_prebuilt
	if isPrebuiltStr := c.Query("is_prebuilt"); isPrebuiltStr != "" {
		isPrebuilt := isPrebuiltStr == "true"
		query = query.Where("is_prebuilt = ?", isPrebuilt)
	}

	// Execute query
	query.Find(&parts)

	c.JSON(http.StatusOK, parts)
}

// Create a new part
func CreatePart(c *gin.Context) {
	var part models.Part
	if err := c.ShouldBindJSON(&part); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Create(&part)
	c.JSON(http.StatusCreated, part)
}

// Get a part by ID
func GetPartByID(c *gin.Context) {
	id := c.Param("id")
	var part models.Part
	if err := db.DB.First(&part, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Part not found"})
		return
	}
	c.JSON(http.StatusOK, part)
}

// Update a part
func UpdatePart(c *gin.Context) {
	id := c.Param("id")
	var part models.Part
	if err := db.DB.First(&part, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Part not found"})
		return
	}
	if err := c.ShouldBindJSON(&part); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Save(&part)
	c.JSON(http.StatusOK, part)
}

// Delete a part
func DeletePart(c *gin.Context) {
	id := c.Param("id")
	if err := db.DB.Delete(&models.Part{}, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Part not found"})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

// Get parts by category
func GetPartsByCategory(c *gin.Context) {
	category := c.Param("category")
	var parts []models.Part
	db.DB.Where("category = ?", category).Find(&parts)
	c.JSON(http.StatusOK, parts)
}

// Get compatible parts
func GetCompatibleParts(c *gin.Context) {
	partID := c.Param("id")

	// First get the part to find its compatible models
	var part models.Part
	if err := db.DB.First(&part, partID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Part not found"})
		return
	}

	// Check if CompatibleModels is empty
	if part.CompatibleModels == nil || len(part.CompatibleModels) == 0 {
		c.JSON(http.StatusOK, []models.Part{})
		return
	}

	// Find all parts that are compatible with the same models
	var compatibleParts []models.Part
	db.DB.Where("id != ?", partID).
		Where("JSON_OVERLAPS(compatible_models, ?)", part.CompatibleModels).
		Find(&compatibleParts)

	c.JSON(http.StatusOK, compatibleParts)
}

// Get all unique part categories
// This is the legacy function that returns string categories
// @deprecated Use GetPartCategories from part_category_handlers.go instead
func GetLegacyPartCategories(c *gin.Context) {
	var categories []string
	db.DB.Model(&models.Part{}).Distinct().Pluck("category", &categories)

	// Filter out empty categories
	var filteredCategories []string
	for _, category := range categories {
		if category != "" {
			filteredCategories = append(filteredCategories, category)
		}
	}

	c.JSON(http.StatusOK, filteredCategories)
}

// Get all subcategories grouped by category
func GetPartSubcategories(c *gin.Context) {
	// This query directly gets categories and subcategories with a basic SQL query
	// and avoids any complex JSON handling on the Go side
	rows, err := db.DB.Raw(`
		SELECT category, subcategory
		FROM parts
		WHERE category != '' AND subcategory != ''
		GROUP BY category, subcategory
		ORDER BY category, subcategory
	`).Rows()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query subcategories"})
		return
	}
	defer rows.Close()

	// Map to store category -> subcategories
	subcategoriesByCategory := make(map[string][]string)

	// Process the rows
	for rows.Next() {
		var category, subcategory string
		if err := rows.Scan(&category, &subcategory); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process result"})
			return
		}

		// Add to the map
		subcategoriesByCategory[category] = append(subcategoriesByCategory[category], subcategory)
	}

	c.JSON(http.StatusOK, subcategoriesByCategory)
}

// Get subcategories for a specific category
func GetSubcategoriesByCategory(c *gin.Context) {
	category := c.Param("category")

	var subcategories []string
	db.DB.Model(&models.Part{}).
		Where("category = ? AND subcategory != ''", category).
		Distinct().
		Pluck("subcategory", &subcategories)

	c.JSON(http.StatusOK, subcategories)
}

// Get all compatible firearm models from parts
func GetCompatibleFirearmModels(c *gin.Context) {
	// This query directly extracts distinct model names from the compatible_models JSON array
	// using PostgreSQL's JSON functions
	rows, err := db.DB.Raw(`
		SELECT DISTINCT jsonb_extract_path_text(cm.value, 'model') as model_name
		FROM parts,
		jsonb_array_elements(compatible_models) as cm
		WHERE jsonb_extract_path_text(cm.value, 'model') != ''
	`).Rows()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query compatible models"})
		return
	}
	defer rows.Close()

	var models []string
	for rows.Next() {
		var modelName string
		if err := rows.Scan(&modelName); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process result"})
			return
		}
		models = append(models, modelName)
	}

	c.JSON(http.StatusOK, models)
}

// Get a combined part hierarchy from all firearm models
func GetPartHierarchy(c *gin.Context) {
	// Fetch all firearm models
	var models []models.FirearmModel
	if err := db.DB.Find(&models).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch firearm models"})
		return
	}

	// A map to store the hierarchy - using map to avoid duplicates
	hierarchyMap := make(map[string]map[string]map[string]bool)

	// Process each model's part structure
	for _, model := range models {
		if model.Parts == nil {
			continue
		}

		// Cast model.Parts to a Go map
		var partsMap map[string]interface{}
		if err := json.Unmarshal(model.Parts, &partsMap); err != nil {
			continue // Skip models with invalid JSON
		}

		// Process the top-level categories (assemblies)
		for assembly, details := range partsMap {
			if _, exists := hierarchyMap[assembly]; !exists {
				hierarchyMap[assembly] = make(map[string]map[string]bool)
			}

			// Extract sub-parts
			if detailsMap, ok := details.(map[string]interface{}); ok {
				if subParts, exists := detailsMap["sub_parts"]; exists {
					if subPartsMap, ok := subParts.(map[string]interface{}); ok {
						// Process second-level components
						for component, componentDetails := range subPartsMap {
							if _, exists := hierarchyMap[assembly][component]; !exists {
								hierarchyMap[assembly][component] = make(map[string]bool)
							}

							// Extract third-level parts
							if componentDetailsMap, ok := componentDetails.(map[string]interface{}); ok {
								if subSubParts, exists := componentDetailsMap["sub_parts"]; exists {
									if subSubPartsMap, ok := subSubParts.(map[string]interface{}); ok {
										for subComponent := range subSubPartsMap {
											hierarchyMap[assembly][component][subComponent] = true
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}

	// Convert the map to a nested array structure suitable for the frontend
	type PartItem struct {
		Name     string     `json:"name"`
		ID       string     `json:"id"`
		Children []PartItem `json:"children,omitempty"`
	}

	var hierarchy []PartItem

	// Process top-level assemblies
	for assembly, components := range hierarchyMap {
		assemblyItem := PartItem{
			Name:     assembly,
			ID:       slugify(assembly),
			Children: []PartItem{},
		}

		// Process second-level components
		for component, subComponents := range components {
			componentItem := PartItem{
				Name:     component,
				ID:       slugify(component),
				Children: []PartItem{},
			}

			// Process third-level sub-components
			for subComponent := range subComponents {
				subComponentItem := PartItem{
					Name: subComponent,
					ID:   slugify(subComponent),
				}
				componentItem.Children = append(componentItem.Children, subComponentItem)
			}

			// Sort sub-components by name
			sort.Slice(componentItem.Children, func(i, j int) bool {
				return componentItem.Children[i].Name < componentItem.Children[j].Name
			})

			assemblyItem.Children = append(assemblyItem.Children, componentItem)
		}

		// Sort components by name
		sort.Slice(assemblyItem.Children, func(i, j int) bool {
			return assemblyItem.Children[i].Name < assemblyItem.Children[j].Name
		})

		hierarchy = append(hierarchy, assemblyItem)
	}

	// Sort top-level assemblies by name
	sort.Slice(hierarchy, func(i, j int) bool {
		return hierarchy[i].Name < hierarchy[j].Name
	})

	// Add standalone categories that aren't part of assemblies
	var categories []string
	db.DB.Table("parts").Distinct().Pluck("category", &categories)

	// Add categories that aren't already in the hierarchy
	for _, category := range categories {
		if category == "" {
			continue
		}

		// Check if this category is already included as an assembly
		found := false
		for _, item := range hierarchy {
			if item.Name == category {
				found = true
				break
			}
		}

		if !found {
			hierarchy = append(hierarchy, PartItem{
				Name: category,
				ID:   slugify(category),
			})
		}
	}

	c.JSON(http.StatusOK, hierarchy)
}

// Helper function to convert a string to a slug ID
func slugify(input string) string {
	// Convert to lowercase
	output := strings.ToLower(input)
	// Replace spaces and special characters with hyphens
	output = strings.ReplaceAll(output, " ", "-")
	// Remove any remaining special characters
	reg := regexp.MustCompile("[^a-z0-9-]")
	output = reg.ReplaceAllString(output, "")
	return output
}
