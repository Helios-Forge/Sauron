package handlers

import (
	"net/http"
	"sauron-backend/internal/db"
	"sauron-backend/internal/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

// CategoryWithRequiredStatus is a response type for part categories with required status
type CategoryWithRequiredStatus struct {
	models.PartCategory
	IsRequired bool `json:"is_required" example:"true"`
}

// CategoryWithRequiredStatusHierarchy is a hierarchical response type for part categories with required status
type CategoryWithRequiredStatusHierarchy struct {
	models.PartCategory
	IsRequired      bool                                  `json:"is_required" example:"true"`
	ChildCategories []CategoryWithRequiredStatusHierarchy `json:"child_categories,omitempty"`
}

// @Summary Get part categories for a firearm model
// @Description Retrieves all part categories associated with a specific firearm model
// @Tags Firearm Models,Part Categories
// @Accept json
// @Produce json
// @Param id path int true "Firearm Model ID"
// @Param required query bool false "Filter by required status (true=required, false=optional, omit=both)"
// @Success 200 {array} object "Array of part categories with required status"
// @Failure 400 {object} map[string]string "Invalid firearm model ID"
// @Failure 404 {object} map[string]string "Firearm model not found"
// @Failure 500 {object} map[string]string "Server error"
// @Router /firearm-models/{id}/categories [get]
// @Router /part-categories/firearm/{id} [get]
func GetFirearmModelCategories(c *gin.Context) {
	modelID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid firearm model ID"})
		return
	}

	// Check if the model exists
	var model models.FirearmModel
	if err := db.DB.First(&model, modelID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Firearm model not found"})
		return
	}

	// Handle required filter
	var requiredFilter *bool
	if requiredParam, exists := c.GetQuery("required"); exists {
		isRequired := requiredParam == "true"
		requiredFilter = &isRequired
	}

	// Get categories with relationship data
	var results []CategoryWithRequiredStatus

	query := db.DB.Table("part_categories").
		Select("part_categories.*, firearm_model_part_categories.is_required").
		Joins("JOIN firearm_model_part_categories ON firearm_model_part_categories.part_category_id = part_categories.id").
		Where("firearm_model_part_categories.firearm_model_id = ?", modelID)

	if requiredFilter != nil {
		query = query.Where("firearm_model_part_categories.is_required = ?", *requiredFilter)
	}

	if err := query.Scan(&results).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	c.JSON(http.StatusOK, results)
}

// @Summary Add a category to a firearm model
// @Description Associates a part category with a firearm model
// @Tags Firearm Models,Part Categories
// @Accept json
// @Produce json
// @Param id path int true "Firearm Model ID"
// @Param category_id path int true "Part Category ID"
// @Param relationship body object true "Relationship parameters"
// @Success 201 {object} map[string]string "Success message"
// @Failure 400 {object} map[string]string "Invalid input"
// @Failure 404 {object} map[string]string "Firearm model or part category not found"
// @Failure 409 {object} map[string]string "Relationship already exists"
// @Failure 500 {object} map[string]string "Server error"
// @Router /firearm-models/{id}/categories/{category_id} [post]
func AddCategoryToFirearmModel(c *gin.Context) {
	modelID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid firearm model ID"})
		return
	}

	categoryID, err := strconv.Atoi(c.Param("category_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	// Check if the model exists
	var model models.FirearmModel
	if err := db.DB.First(&model, modelID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Firearm model not found"})
		return
	}

	// Check if the category exists
	var category models.PartCategory
	if err := db.DB.First(&category, categoryID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Part category not found"})
		return
	}

	// Get relationship details from request body
	type RelationshipParams struct {
		IsRequired bool `json:"is_required"`
	}

	var params RelationshipParams
	if err := c.ShouldBindJSON(&params); err != nil {
		params.IsRequired = false // Default to optional if not specified
	}

	// Check if relationship already exists
	var existing models.FirearmModelPartCategory
	result := db.DB.Where("firearm_model_id = ? AND part_category_id = ?", modelID, categoryID).First(&existing)

	if result.Error == nil {
		// Already exists, return conflict
		c.JSON(http.StatusConflict, gin.H{"error": "This category is already associated with the firearm model"})
		return
	}

	// Create the relationship
	relation := models.FirearmModelPartCategory{
		FirearmModelID: modelID,
		PartCategoryID: categoryID,
		IsRequired:     params.IsRequired,
	}

	if err := db.DB.Create(&relation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to associate category with firearm model"})
		return
	}

	c.JSON(http.StatusCreated, relation)
}

// @Summary Update a firearm model-category relationship
// @Description Updates the relationship between a firearm model and a part category
// @Tags Firearm Models,Part Categories
// @Accept json
// @Produce json
// @Param id path int true "Firearm Model ID"
// @Param category_id path int true "Part Category ID"
// @Param relationship body object true "Updated relationship parameters"
// @Success 200 {object} map[string]string "Success message"
// @Failure 400 {object} map[string]string "Invalid input"
// @Failure 404 {object} map[string]string "Relationship not found"
// @Failure 500 {object} map[string]string "Server error"
// @Router /firearm-models/{id}/categories/{category_id} [put]
func UpdateFirearmModelCategoryRelation(c *gin.Context) {
	modelID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid firearm model ID"})
		return
	}

	categoryID, err := strconv.Atoi(c.Param("category_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	// Get relationship details from request body
	type RelationshipParams struct {
		IsRequired bool `json:"is_required"`
	}

	var params RelationshipParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find existing relationship
	var relation models.FirearmModelPartCategory
	if err := db.DB.Where("firearm_model_id = ? AND part_category_id = ?", modelID, categoryID).First(&relation).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Relationship not found"})
		return
	}

	// Update the relationship
	relation.IsRequired = params.IsRequired

	if err := db.DB.Save(&relation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update relationship"})
		return
	}

	c.JSON(http.StatusOK, relation)
}

// @Summary Remove a category from a firearm model
// @Description Removes the association between a part category and a firearm model
// @Tags Firearm Models,Part Categories
// @Accept json
// @Produce json
// @Param id path int true "Firearm Model ID"
// @Param category_id path int true "Part Category ID"
// @Success 200 {object} map[string]string "Success message"
// @Failure 400 {object} map[string]string "Invalid input"
// @Failure 404 {object} map[string]string "Relationship not found"
// @Failure 500 {object} map[string]string "Server error"
// @Router /firearm-models/{id}/categories/{category_id} [delete]
func RemoveCategoryFromFirearmModel(c *gin.Context) {
	modelID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid firearm model ID"})
		return
	}

	categoryID, err := strconv.Atoi(c.Param("category_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	// Delete the relationship
	result := db.DB.Where("firearm_model_id = ? AND part_category_id = ?", modelID, categoryID).Delete(&models.FirearmModelPartCategory{})

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove category from firearm model"})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Relationship not found"})
		return
	}

	c.Status(http.StatusNoContent)
}

// @Summary Get hierarchical categories for a firearm model
// @Description Retrieves all part categories associated with a specific firearm model in a hierarchical structure
// @Tags Firearm Models,Part Categories
// @Accept json
// @Produce json
// @Param id path int true "Firearm Model ID"
// @Success 200 {array} CategoryWithRequiredStatusHierarchy "Hierarchical array of part categories with required status"
// @Failure 400 {object} map[string]string "Invalid firearm model ID"
// @Failure 404 {object} map[string]string "Firearm model not found"
// @Failure 500 {object} map[string]string "Server error"
// @Router /firearm-models/{id}/categories-hierarchy [get]
func GetFirearmModelCategoriesHierarchy(c *gin.Context) {
	modelID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid firearm model ID"})
		return
	}

	// Check if the model exists
	var model models.FirearmModel
	if err := db.DB.First(&model, modelID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Firearm model not found"})
		return
	}

	// Parse optional required status filter
	var requiredFilter *bool
	requiredParam := c.Query("required")
	if requiredParam != "" {
		required := requiredParam == "true"
		requiredFilter = &required
	}

	// Define the response type that includes the is_required flag and child categories
	var hierarchicalCategories []CategoryWithRequiredStatusHierarchy

	// Step 1: Get all part categories assigned to this firearm model with their required status
	var modelCategoryRelations []models.FirearmModelPartCategory
	query := db.DB.Where("firearm_model_id = ?", modelID)

	// Apply required filter if specified
	if requiredFilter != nil {
		query = query.Where("is_required = ?", *requiredFilter)
	}

	if err := query.Find(&modelCategoryRelations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch model category relations"})
		return
	}

	if len(modelCategoryRelations) == 0 {
		c.JSON(http.StatusOK, []CategoryWithRequiredStatusHierarchy{})
		return
	}

	// Create a map of category ID to required status for quick lookup
	categoryIsRequired := make(map[int]bool)
	var categoryIDs []int
	for _, relation := range modelCategoryRelations {
		categoryIDs = append(categoryIDs, relation.PartCategoryID)
		categoryIsRequired[relation.PartCategoryID] = relation.IsRequired
	}

	// Step 2: Get all categories
	var allCategories []models.PartCategory
	if err := db.DB.Find(&allCategories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch all categories"})
		return
	}

	// Create a map for fast category lookup
	categoryByID := make(map[int]models.PartCategory)
	for _, cat := range allCategories {
		categoryByID[cat.ID] = cat
	}

	// Function to build the category hierarchy with required status
	var buildCategoryHierarchy func(categoryID int, isRequired bool) *CategoryWithRequiredStatusHierarchy
	buildCategoryHierarchy = func(categoryID int, isRequired bool) *CategoryWithRequiredStatusHierarchy {
		category, exists := categoryByID[categoryID]
		if !exists {
			return nil
		}

		// Create the response structure with the required status
		result := CategoryWithRequiredStatusHierarchy{
			PartCategory:    category,
			IsRequired:      isRequired,
			ChildCategories: []CategoryWithRequiredStatusHierarchy{},
		}

		// Find child categories
		for _, cat := range allCategories {
			if cat.ParentCategoryID != nil && *cat.ParentCategoryID == categoryID {
				// Check if this child category is directly assigned to the model
				childIsRequired, childAssigned := categoryIsRequired[cat.ID]

				// If not directly assigned, inherit parent's required status
				if !childAssigned {
					childIsRequired = isRequired
				}

				// Recursively build the child's hierarchy
				childResult := buildCategoryHierarchy(cat.ID, childIsRequired)
				if childResult != nil {
					result.ChildCategories = append(result.ChildCategories, *childResult)
				}
			}
		}

		return &result
	}

	// Start with top-level categories (those without parent or with parent outside the model)
	var result []CategoryWithRequiredStatusHierarchy
	for _, relation := range modelCategoryRelations {
		category, exists := categoryByID[relation.PartCategoryID]
		if !exists {
			continue
		}

		// Check if this is a top-level category (no parent or parent not in the model)
		isTopLevel := category.ParentCategoryID == nil
		if !isTopLevel {
			// Check if parent is assigned to this model
			_, parentAssigned := categoryIsRequired[*category.ParentCategoryID]
			isTopLevel = !parentAssigned
		}

		if isTopLevel {
			// Build hierarchy starting from this top-level category
			categoryHierarchy := buildCategoryHierarchy(category.ID, relation.IsRequired)
			if categoryHierarchy != nil {
				result = append(result, *categoryHierarchy)
			}
		}
	}

	hierarchicalCategories = result
	c.JSON(http.StatusOK, hierarchicalCategories)
}
