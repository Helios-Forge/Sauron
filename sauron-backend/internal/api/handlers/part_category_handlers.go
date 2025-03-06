package handlers

import (
	"net/http"
	"sauron-backend/internal/db"
	"sauron-backend/internal/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

// @Summary Get all part categories
// @Description Retrieves all part categories with optional parent-child relationships
// @Tags Part Categories
// @Accept json
// @Produce json
// @Param recursive query bool false "Whether to include child categories recursively"
// @Success 200 {array} models.PartCategory
// @Router /part-categories [get]
func GetPartCategories(c *gin.Context) {
	recursive := c.Query("recursive") == "true"

	var categories []models.PartCategory

	query := db.DB.Model(&models.PartCategory{})

	// Load parent-child relationships recursively if requested
	if recursive {
		query = query.Preload("ChildCategories")
	}

	// Get only top-level categories when recursive, otherwise get all
	if recursive {
		if err := query.Where("parent_category_id IS NULL").Find(&categories).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch part categories"})
			return
		}
	} else {
		if err := query.Find(&categories).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch part categories"})
			return
		}
	}

	c.JSON(http.StatusOK, categories)
}

// @Summary Get part category by ID
// @Description Retrieves a single part category by ID
// @Tags Part Categories
// @Accept json
// @Produce json
// @Param id path int true "Part Category ID"
// @Param recursive query bool false "Whether to include child categories recursively"
// @Success 200 {object} models.PartCategory
// @Router /part-categories/{id} [get]
func GetPartCategoryByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	recursive := c.Query("recursive") == "true"

	var category models.PartCategory

	query := db.DB.Model(&models.PartCategory{})

	if recursive {
		query = query.Preload("ChildCategories")
	}

	if err := query.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Part category not found"})
		return
	}

	c.JSON(http.StatusOK, category)
}

// @Summary Create part category
// @Description Creates a new part category
// @Tags Part Categories
// @Accept json
// @Produce json
// @Param category body models.PartCategory true "Part Category"
// @Success 201 {object} models.PartCategory
// @Router /part-categories [post]
func CreatePartCategory(c *gin.Context) {
	var category models.PartCategory

	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.DB.Create(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create part category"})
		return
	}

	c.JSON(http.StatusCreated, category)
}

// @Summary Update part category
// @Description Updates an existing part category
// @Tags Part Categories
// @Accept json
// @Produce json
// @Param id path int true "Part Category ID"
// @Param category body models.PartCategory true "Part Category"
// @Success 200 {object} models.PartCategory
// @Router /part-categories/{id} [put]
func UpdatePartCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	var category models.PartCategory

	if err := db.DB.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Part category not found"})
		return
	}

	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.DB.Save(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update part category"})
		return
	}

	c.JSON(http.StatusOK, category)
}

// @Summary Delete part category
// @Description Deletes a part category
// @Tags Part Categories
// @Accept json
// @Produce json
// @Param id path int true "Part Category ID"
// @Success 204 "No Content"
// @Router /part-categories/{id} [delete]
func DeletePartCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}

	// Check for child categories first
	var count int64
	if err := db.DB.Model(&models.PartCategory{}).Where("parent_category_id = ?", id).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check for child categories"})
		return
	}

	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot delete category with child categories"})
		return
	}

	// Check for associated parts
	if err := db.DB.Model(&models.Part{}).Where("part_category_id = ?", id).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check for associated parts"})
		return
	}

	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot delete category with associated parts"})
		return
	}

	// Check for associated firearm models
	if err := db.DB.Model(&models.FirearmModelPartCategory{}).Where("part_category_id = ?", id).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check for associated firearm models"})
		return
	}

	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot delete category associated with firearm models"})
		return
	}

	if err := db.DB.Delete(&models.PartCategory{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete part category"})
		return
	}

	c.Status(http.StatusNoContent)
}
