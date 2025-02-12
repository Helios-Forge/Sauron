package handlers

import (
	"net/http"
	"sauron-backend/internal/db"
	"sauron-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// @Summary     Get all prebuilt firearms
// @Description Get a list of all prebuilt firearms in the database
// @Tags        Prebuilt Firearms
// @Accept      json
// @Produce     json
// @Success     200 {array}  models.PrebuiltFirearm
// @Router      /prebuilt-firearms [get]
func GetPrebuiltFirearms(c *gin.Context) {
	var firearms []models.PrebuiltFirearm
	db.DB.Find(&firearms)
	c.JSON(http.StatusOK, firearms)
}

// @Summary     Create a new prebuilt firearm
// @Description Add a new prebuilt firearm to the database
// @Tags        Prebuilt Firearms
// @Accept      json
// @Produce     json
// @Param       firearm body models.PrebuiltFirearm true "Prebuilt Firearm Info"
// @Success     201 {object} models.PrebuiltFirearm
// @Failure     400 {object} map[string]string
// @Router      /prebuilt-firearms [post]
func CreatePrebuiltFirearm(c *gin.Context) {
	var firearm models.PrebuiltFirearm
	if err := c.ShouldBindJSON(&firearm); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Create(&firearm)
	c.JSON(http.StatusCreated, firearm)
}

// @Summary     Get a prebuilt firearm by ID
// @Description Get details of a specific prebuilt firearm
// @Tags        Prebuilt Firearms
// @Accept      json
// @Produce     json
// @Param       id path int true "Prebuilt Firearm ID"
// @Success     200 {object} models.PrebuiltFirearm
// @Failure     404 {object} map[string]string
// @Router      /prebuilt-firearms/{id} [get]
func GetPrebuiltFirearmByID(c *gin.Context) {
	id := c.Param("id")
	var firearm models.PrebuiltFirearm
	if err := db.DB.First(&firearm, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Prebuilt firearm not found"})
		return
	}
	c.JSON(http.StatusOK, firearm)
}

// @Summary     Update a prebuilt firearm
// @Description Update details of a specific prebuilt firearm
// @Tags        Prebuilt Firearms
// @Accept      json
// @Produce     json
// @Param       id path int true "Prebuilt Firearm ID"
// @Param       firearm body models.PrebuiltFirearm true "Updated Prebuilt Firearm Info"
// @Success     200 {object} models.PrebuiltFirearm
// @Failure     400 {object} map[string]string
// @Failure     404 {object} map[string]string
// @Router      /prebuilt-firearms/{id} [put]
func UpdatePrebuiltFirearm(c *gin.Context) {
	id := c.Param("id")
	var firearm models.PrebuiltFirearm
	if err := db.DB.First(&firearm, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Prebuilt firearm not found"})
		return
	}
	if err := c.ShouldBindJSON(&firearm); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Save(&firearm)
	c.JSON(http.StatusOK, firearm)
}

// @Summary     Delete a prebuilt firearm
// @Description Delete a specific prebuilt firearm
// @Tags        Prebuilt Firearms
// @Accept      json
// @Produce     json
// @Param       id path int true "Prebuilt Firearm ID"
// @Success     204 "No Content"
// @Failure     404 {object} map[string]string
// @Router      /prebuilt-firearms/{id} [delete]
func DeletePrebuiltFirearm(c *gin.Context) {
	id := c.Param("id")
	if err := db.DB.Delete(&models.PrebuiltFirearm{}, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Prebuilt firearm not found"})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

// @Summary     Get prebuilt firearms by model
// @Description Get all prebuilt firearms for a specific firearm model
// @Tags        Prebuilt Firearms
// @Accept      json
// @Produce     json
// @Param       modelId path int true "Firearm Model ID"
// @Success     200 {array} models.PrebuiltFirearm
// @Router      /prebuilt-firearms/model/{modelId} [get]
func GetPrebuiltFirearmsByModel(c *gin.Context) {
	modelID := c.Param("modelId")
	var firearms []models.PrebuiltFirearm
	db.DB.Where("firearm_model_id = ?", modelID).Find(&firearms)
	c.JSON(http.StatusOK, firearms)
}
