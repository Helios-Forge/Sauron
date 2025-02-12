package handlers

import (
	"net/http"
	"sauron-backend/internal/db"
	"sauron-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// @Summary     Get all sellers
// @Description Get a list of all sellers in the database
// @Tags        Sellers
// @Accept      json
// @Produce     json
// @Success     200 {array}  models.Seller
// @Router      /sellers [get]
func GetSellers(c *gin.Context) {
	var sellers []models.Seller
	db.DB.Find(&sellers)
	c.JSON(http.StatusOK, sellers)
}

// @Summary     Create a new seller
// @Description Add a new seller to the database
// @Tags        Sellers
// @Accept      json
// @Produce     json
// @Param       seller body models.Seller true "Seller Info"
// @Success     201 {object} models.Seller
// @Failure     400 {object} map[string]string
// @Router      /sellers [post]
func CreateSeller(c *gin.Context) {
	var seller models.Seller
	if err := c.ShouldBindJSON(&seller); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Create(&seller)
	c.JSON(http.StatusCreated, seller)
}

// @Summary     Get a seller by ID
// @Description Get details of a specific seller
// @Tags        Sellers
// @Accept      json
// @Produce     json
// @Param       id path int true "Seller ID"
// @Success     200 {object} models.Seller
// @Failure     404 {object} map[string]string
// @Router      /sellers/{id} [get]
func GetSellerByID(c *gin.Context) {
	id := c.Param("id")
	var seller models.Seller
	if err := db.DB.First(&seller, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Seller not found"})
		return
	}
	c.JSON(http.StatusOK, seller)
}

// @Summary     Update a seller
// @Description Update details of a specific seller
// @Tags        Sellers
// @Accept      json
// @Produce     json
// @Param       id path int true "Seller ID"
// @Param       seller body models.Seller true "Updated Seller Info"
// @Success     200 {object} models.Seller
// @Failure     400 {object} map[string]string
// @Failure     404 {object} map[string]string
// @Router      /sellers/{id} [put]
func UpdateSeller(c *gin.Context) {
	id := c.Param("id")
	var seller models.Seller
	if err := db.DB.First(&seller, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Seller not found"})
		return
	}
	if err := c.ShouldBindJSON(&seller); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Save(&seller)
	c.JSON(http.StatusOK, seller)
}

// @Summary     Delete a seller
// @Description Delete a specific seller
// @Tags        Sellers
// @Accept      json
// @Produce     json
// @Param       id path int true "Seller ID"
// @Success     204 "No Content"
// @Failure     404 {object} map[string]string
// @Router      /sellers/{id} [delete]
func DeleteSeller(c *gin.Context) {
	id := c.Param("id")
	if err := db.DB.Delete(&models.Seller{}, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Seller not found"})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

// @Summary     Update seller status
// @Description Update the status of a specific seller
// @Tags        Sellers
// @Accept      json
// @Produce     json
// @Param       id path int true "Seller ID"
// @Param       status body object true "Status Update Info"
// @Success     200 {object} models.Seller
// @Failure     400 {object} map[string]string
// @Failure     404 {object} map[string]string
// @Router      /sellers/{id}/status [patch]
func UpdateSellerStatus(c *gin.Context) {
	id := c.Param("id")
	var seller models.Seller
	if err := db.DB.First(&seller, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Seller not found"})
		return
	}

	var input struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	seller.Status = input.Status
	db.DB.Save(&seller)
	c.JSON(http.StatusOK, seller)
}
