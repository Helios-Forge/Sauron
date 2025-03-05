package handlers

import (
	"net/http"
	"sauron-backend/internal/db"
	"sauron-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// Get all manufacturers
func GetManufacturers(c *gin.Context) {
	var manufacturers []models.Manufacturer
	db.DB.Find(&manufacturers)
	c.JSON(http.StatusOK, manufacturers)
}

// Create a new manufacturer
func CreateManufacturer(c *gin.Context) {
	var manufacturer models.Manufacturer
	if err := c.ShouldBindJSON(&manufacturer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Create(&manufacturer)
	c.JSON(http.StatusCreated, manufacturer)
}

// Get a manufacturer by ID
func GetManufacturerByID(c *gin.Context) {
	id := c.Param("id")
	var manufacturer models.Manufacturer
	if err := db.DB.First(&manufacturer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Manufacturer not found"})
		return
	}
	c.JSON(http.StatusOK, manufacturer)
}

// Update a manufacturer
func UpdateManufacturer(c *gin.Context) {
	id := c.Param("id")
	var manufacturer models.Manufacturer
	if err := db.DB.First(&manufacturer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Manufacturer not found"})
		return
	}
	if err := c.ShouldBindJSON(&manufacturer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Save(&manufacturer)
	c.JSON(http.StatusOK, manufacturer)
}

// Delete a manufacturer
func DeleteManufacturer(c *gin.Context) {
	id := c.Param("id")
	if err := db.DB.Delete(&models.Manufacturer{}, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Manufacturer not found"})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}
