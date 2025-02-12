package handlers

import (
	"net/http"
	"sauron-backend/internal/db"
	"sauron-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// @Summary     Get all user suggestions
// @Description Get a list of all user suggestions in the database
// @Tags        User Suggestions
// @Accept      json
// @Produce     json
// @Success     200 {array}  models.UserSuggestion
// @Router      /user-suggestions [get]
func GetUserSuggestions(c *gin.Context) {
	var suggestions []models.UserSuggestion
	db.DB.Find(&suggestions)
	c.JSON(http.StatusOK, suggestions)
}

// @Summary     Create a new user suggestion
// @Description Add a new user suggestion to the database
// @Tags        User Suggestions
// @Accept      json
// @Produce     json
// @Param       suggestion body models.UserSuggestion true "User Suggestion Info"
// @Success     201 {object} models.UserSuggestion
// @Failure     400 {object} map[string]string
// @Router      /user-suggestions [post]
func CreateUserSuggestion(c *gin.Context) {
	var suggestion models.UserSuggestion
	if err := c.ShouldBindJSON(&suggestion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	suggestion.Status = "pending" // Set default status
	db.DB.Create(&suggestion)
	c.JSON(http.StatusCreated, suggestion)
}

// @Summary     Get a user suggestion by ID
// @Description Get details of a specific user suggestion
// @Tags        User Suggestions
// @Accept      json
// @Produce     json
// @Param       id path int true "User Suggestion ID"
// @Success     200 {object} models.UserSuggestion
// @Failure     404 {object} map[string]string
// @Router      /user-suggestions/{id} [get]
func GetUserSuggestionByID(c *gin.Context) {
	id := c.Param("id")
	var suggestion models.UserSuggestion
	if err := db.DB.First(&suggestion, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Suggestion not found"})
		return
	}
	c.JSON(http.StatusOK, suggestion)
}

// @Summary     Update a user suggestion
// @Description Update details of a specific user suggestion
// @Tags        User Suggestions
// @Accept      json
// @Produce     json
// @Param       id path int true "User Suggestion ID"
// @Param       suggestion body models.UserSuggestion true "Updated User Suggestion Info"
// @Success     200 {object} models.UserSuggestion
// @Failure     400 {object} map[string]string
// @Failure     404 {object} map[string]string
// @Router      /user-suggestions/{id} [put]
func UpdateUserSuggestion(c *gin.Context) {
	id := c.Param("id")
	var suggestion models.UserSuggestion
	if err := db.DB.First(&suggestion, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Suggestion not found"})
		return
	}
	if err := c.ShouldBindJSON(&suggestion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Save(&suggestion)
	c.JSON(http.StatusOK, suggestion)
}

// @Summary     Delete a user suggestion
// @Description Delete a specific user suggestion
// @Tags        User Suggestions
// @Accept      json
// @Produce     json
// @Param       id path int true "User Suggestion ID"
// @Success     204 "No Content"
// @Failure     404 {object} map[string]string
// @Router      /user-suggestions/{id} [delete]
func DeleteUserSuggestion(c *gin.Context) {
	id := c.Param("id")
	if err := db.DB.Delete(&models.UserSuggestion{}, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Suggestion not found"})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

// @Summary     Get user suggestions by status
// @Description Get all user suggestions with a specific status
// @Tags        User Suggestions
// @Accept      json
// @Produce     json
// @Param       status path string true "Suggestion Status" Enums(pending, approved, rejected)
// @Success     200 {array} models.UserSuggestion
// @Router      /user-suggestions/status/{status} [get]
func GetUserSuggestionsByStatus(c *gin.Context) {
	status := c.Param("status")
	var suggestions []models.UserSuggestion
	db.DB.Where("status = ?", status).Find(&suggestions)
	c.JSON(http.StatusOK, suggestions)
}

// @Summary     Update user suggestion status
// @Description Update the status of a specific user suggestion
// @Tags        User Suggestions
// @Accept      json
// @Produce     json
// @Param       id path int true "User Suggestion ID"
// @Param       status body object true "Status Update Info"
// @Success     200 {object} models.UserSuggestion
// @Failure     400 {object} map[string]string
// @Failure     404 {object} map[string]string
// @Router      /user-suggestions/{id}/status [patch]
func UpdateUserSuggestionStatus(c *gin.Context) {
	id := c.Param("id")
	var suggestion models.UserSuggestion
	if err := db.DB.First(&suggestion, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Suggestion not found"})
		return
	}

	var input struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	suggestion.Status = input.Status
	db.DB.Save(&suggestion)
	c.JSON(http.StatusOK, suggestion)
}
