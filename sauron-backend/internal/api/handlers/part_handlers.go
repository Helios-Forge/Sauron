package handlers

import (
	"net/http"
	"sauron-backend/internal/db"
	"sauron-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// Get all parts
func GetParts(c *gin.Context) {
	var parts []models.Part
	db.DB.Find(&parts)
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
