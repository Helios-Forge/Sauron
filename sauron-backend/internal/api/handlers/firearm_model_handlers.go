package handlers

import (
	"net/http"
	"sauron-backend/internal/db"
	"sauron-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// @Summary     Get all firearm models
// @Description Get a list of all firearm models in the database
// @Tags        Firearm Models
// @Accept      json
// @Produce     json
// @Success     200 {array}  models.FirearmModel
// @Router      /firearm-models [get]
func GetFirearmModels(c *gin.Context) {
	var models []models.FirearmModel
	db.DB.Find(&models)
	c.JSON(http.StatusOK, models)
}

// @Summary     Create a new firearm model
// @Description Add a new firearm model to the database
// @Tags        Firearm Models
// @Accept      json
// @Produce     json
// @Param       model body models.FirearmModel true "Firearm Model Info"
// @Success     201 {object} models.FirearmModel
// @Failure     400 {object} map[string]string
// @Router      /firearm-models [post]
func CreateFirearmModel(c *gin.Context) {
	var model models.FirearmModel
	if err := c.ShouldBindJSON(&model); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Create(&model)
	c.JSON(http.StatusCreated, model)
}

// @Summary     Get a firearm model by ID
// @Description Get details of a specific firearm model
// @Tags        Firearm Models
// @Accept      json
// @Produce     json
// @Param       id path int true "Firearm Model ID"
// @Success     200 {object} models.FirearmModel
// @Failure     404 {object} map[string]string
// @Router      /firearm-models/{id} [get]
func GetFirearmModelByID(c *gin.Context) {
	id := c.Param("id")
	var model models.FirearmModel
	if err := db.DB.First(&model, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Model not found"})
		return
	}
	c.JSON(http.StatusOK, model)
}

// @Summary     Update a firearm model
// @Description Update details of a specific firearm model
// @Tags        Firearm Models
// @Accept      json
// @Produce     json
// @Param       id path int true "Firearm Model ID"
// @Param       model body models.FirearmModel true "Updated Firearm Model Info"
// @Success     200 {object} models.FirearmModel
// @Failure     400 {object} map[string]string
// @Failure     404 {object} map[string]string
// @Router      /firearm-models/{id} [put]
func UpdateFirearmModel(c *gin.Context) {
	id := c.Param("id")
	var model models.FirearmModel
	if err := db.DB.First(&model, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Model not found"})
		return
	}
	if err := c.ShouldBindJSON(&model); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Save(&model)
	c.JSON(http.StatusOK, model)
}

// @Summary     Delete a firearm model
// @Description Delete a specific firearm model
// @Tags        Firearm Models
// @Accept      json
// @Produce     json
// @Param       id path int true "Firearm Model ID"
// @Success     204 "No Content"
// @Failure     404 {object} map[string]string
// @Router      /firearm-models/{id} [delete]
func DeleteFirearmModel(c *gin.Context) {
	id := c.Param("id")
	if err := db.DB.Delete(&models.FirearmModel{}, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Model not found"})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}
