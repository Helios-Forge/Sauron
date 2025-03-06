package handlers

import (
	"net/http"
	"sauron-backend/internal/db"
	"sauron-backend/internal/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

// @Summary Get part categories for a firearm model
// @Description Retrieves all part categories associated with a specific firearm model
// @Tags Firearm Models
// @Accept json
// @Produce json
// @Param id path int true "Firearm Model ID"
// @Param required query bool false "Filter by required status (true=required, false=optional, omit=both)"
// @Success 200 {array} models.PartCategory
// @Router /firearm-models/{id}/categories [get]
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
	type CategoryWithRequiredStatus struct {
		models.PartCategory
		IsRequired bool `json:"is_required"`
	}

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

// @Summary Add part category to firearm model
// @Description Associates a part category with a firearm model
// @Tags Firearm Models
// @Accept json
// @Produce json
// @Param id path int true "Firearm Model ID"
// @Param category_id path int true "Part Category ID"
// @Param relation body object true "Relationship details"
// @Success 201 {object} models.FirearmModelPartCategory
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

// @Summary Update firearm model-category relationship
// @Description Updates the relationship between a firearm model and a part category
// @Tags Firearm Models
// @Accept json
// @Produce json
// @Param id path int true "Firearm Model ID"
// @Param category_id path int true "Part Category ID"
// @Param relation body object true "Relationship details"
// @Success 200 {object} models.FirearmModelPartCategory
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

// @Summary Remove part category from firearm model
// @Description Removes the association between a part category and a firearm model
// @Tags Firearm Models
// @Accept json
// @Produce json
// @Param id path int true "Firearm Model ID"
// @Param category_id path int true "Part Category ID"
// @Success 204 "No Content"
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
