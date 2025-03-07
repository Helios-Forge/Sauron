package handlers

import (
	"net/http"
	"regexp"
	"sauron-backend/internal/db"
	"sauron-backend/internal/models"
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

// Get parts compatible with a specific part
// @Summary Get compatible parts
// @Description Get parts that are compatible with a specific part
// @Tags Parts
// @Accept json
// @Produce json
// @Param id path int true "Part ID"
// @Success 200 {array} models.Part
// @Router /parts/{id}/compatible [get]
func GetCompatibleParts(c *gin.Context) {
	partID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid part ID"})
		return
	}

	// First get the part and its category
	var part models.Part
	if err := db.DB.Preload("PartCategory").First(&part, partID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Part not found"})
		return
	}

	// If no part_category_id, return an empty array - can't determine compatibility
	if part.PartCategoryID == nil {
		c.JSON(http.StatusOK, []models.Part{})
		return
	}

	// Find all firearm models that this part category is used in
	var compatibleFirearmModels []int
	rows, err := db.DB.Raw(`
		SELECT firearm_model_id 
		FROM firearm_model_part_categories 
		WHERE part_category_id = ?
	`, *part.PartCategoryID).Rows()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find compatible models"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var modelID int
		if err := rows.Scan(&modelID); err != nil {
			continue
		}
		compatibleFirearmModels = append(compatibleFirearmModels, modelID)
	}

	if len(compatibleFirearmModels) == 0 {
		// If no compatible models found, just return parts with the same category
		var compatibleParts []models.Part
		db.DB.Where("id != ?", partID).
			Where("part_category_id = ?", *part.PartCategoryID).
			Find(&compatibleParts)

		c.JSON(http.StatusOK, compatibleParts)
		return
	}

	// Find all part categories used by these firearm models
	var compatibleCategoryIDs []int
	rows, err = db.DB.Raw(`
		SELECT DISTINCT part_category_id 
		FROM firearm_model_part_categories 
		WHERE firearm_model_id IN (?)
	`, compatibleFirearmModels).Rows()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find compatible categories"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var categoryID int
		if err := rows.Scan(&categoryID); err != nil {
			continue
		}
		compatibleCategoryIDs = append(compatibleCategoryIDs, categoryID)
	}

	// Get all parts that are in these categories (excluding the original part)
	var compatibleParts []models.Part
	db.DB.Where("id != ?", partID).
		Where("part_category_id IN (?)", compatibleCategoryIDs).
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

// GetCompatibleFirearmModels returns a list of unique firearm models that parts are compatible with
// @Summary Get compatible firearm models
// @Description Get a list of unique firearm models that parts are compatible with
// @Tags Parts
// @Accept json
// @Produce json
// @Success 200 {array} string
// @Router /parts/compatible-models [get]
func GetCompatibleFirearmModels(c *gin.Context) {
	// With our new schema, we simply need to fetch all distinct firearm model names
	// from the firearm_models table that have associated part categories

	var modelNames []string
	rows, err := db.DB.Raw(`
		SELECT DISTINCT fm.name 
		FROM firearm_models fm
		JOIN firearm_model_part_categories fmpc ON fm.id = fmpc.firearm_model_id
		ORDER BY fm.name
	`).Rows()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch compatible models"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var modelName string
		if err := rows.Scan(&modelName); err != nil {
			continue
		}
		modelNames = append(modelNames, modelName)
	}

	c.JSON(http.StatusOK, modelNames)
}

// GetPartHierarchy returns a hierarchical view of part categories
// @Summary Get part hierarchy
// @Description Get a hierarchical view of part categories
// @Tags Parts
// @Accept json
// @Produce json
// @Success 200 {array} PartItem
// @Router /parts/hierarchy [get]
func GetPartHierarchy(c *gin.Context) {
	// This endpoint now uses the part_categories table instead of the legacy JSON structure

	// PartItem represents a node in the part hierarchy
	type PartItem struct {
		Name     string     `json:"name"`
		ID       string     `json:"id"`
		Children []PartItem `json:"children,omitempty"`
	}

	// Get all part categories with parent-child relationships
	var categories []models.PartCategory
	if err := db.DB.Preload("ChildCategories").Where("parent_category_id IS NULL").Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	// Convert to the hierarchy format
	var result []PartItem

	// Build the category tree
	for _, category := range categories {
		item := PartItem{
			Name: category.Name,
			ID:   slugify(category.Name),
		}

		// Process child categories
		if len(category.ChildCategories) > 0 {
			for _, child := range category.ChildCategories {
				childItem := PartItem{
					Name: child.Name,
					ID:   slugify(child.Name),
				}

				// Get any third-level categories
				var grandchildren []models.PartCategory
				if err := db.DB.Where("parent_category_id = ?", child.ID).Find(&grandchildren).Error; err == nil && len(grandchildren) > 0 {
					for _, grandchild := range grandchildren {
						grandchildItem := PartItem{
							Name: grandchild.Name,
							ID:   slugify(grandchild.Name),
						}
						childItem.Children = append(childItem.Children, grandchildItem)
					}
				}

				item.Children = append(item.Children, childItem)
			}
		}

		result = append(result, item)
	}

	c.JSON(http.StatusOK, result)
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
