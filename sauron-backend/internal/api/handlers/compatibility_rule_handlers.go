package handlers

import (
	"net/http"
	"sauron-backend/internal/db"
	"sauron-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// @Summary     Get all compatibility rules
// @Description Get a list of all compatibility rules in the database
// @Tags        Compatibility Rules
// @Accept      json
// @Produce     json
// @Success     200 {array}  models.CompatibilityRule
// @Router      /compatibility-rules [get]
func GetCompatibilityRules(c *gin.Context) {
	var rules []models.CompatibilityRule
	db.DB.Find(&rules)
	c.JSON(http.StatusOK, rules)
}

// @Summary     Create a new compatibility rule
// @Description Add a new compatibility rule to the database
// @Tags        Compatibility Rules
// @Accept      json
// @Produce     json
// @Param       rule body models.CompatibilityRule true "Compatibility Rule Info"
// @Success     201 {object} models.CompatibilityRule
// @Failure     400 {object} map[string]string
// @Router      /compatibility-rules [post]
func CreateCompatibilityRule(c *gin.Context) {
	var rule models.CompatibilityRule
	if err := c.ShouldBindJSON(&rule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Create(&rule)
	c.JSON(http.StatusCreated, rule)
}

// @Summary     Get a compatibility rule by ID
// @Description Get details of a specific compatibility rule
// @Tags        Compatibility Rules
// @Accept      json
// @Produce     json
// @Param       id path int true "Compatibility Rule ID"
// @Success     200 {object} models.CompatibilityRule
// @Failure     404 {object} map[string]string
// @Router      /compatibility-rules/{id} [get]
func GetCompatibilityRuleByID(c *gin.Context) {
	id := c.Param("id")
	var rule models.CompatibilityRule
	if err := db.DB.First(&rule, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Rule not found"})
		return
	}
	c.JSON(http.StatusOK, rule)
}

// @Summary     Update a compatibility rule
// @Description Update details of a specific compatibility rule
// @Tags        Compatibility Rules
// @Accept      json
// @Produce     json
// @Param       id path int true "Compatibility Rule ID"
// @Param       rule body models.CompatibilityRule true "Updated Compatibility Rule Info"
// @Success     200 {object} models.CompatibilityRule
// @Failure     400 {object} map[string]string
// @Failure     404 {object} map[string]string
// @Router      /compatibility-rules/{id} [put]
func UpdateCompatibilityRule(c *gin.Context) {
	id := c.Param("id")
	var rule models.CompatibilityRule
	if err := db.DB.First(&rule, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Rule not found"})
		return
	}
	if err := c.ShouldBindJSON(&rule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Save(&rule)
	c.JSON(http.StatusOK, rule)
}

// @Summary     Delete a compatibility rule
// @Description Delete a specific compatibility rule
// @Tags        Compatibility Rules
// @Accept      json
// @Produce     json
// @Param       id path int true "Compatibility Rule ID"
// @Success     204 "No Content"
// @Failure     404 {object} map[string]string
// @Router      /compatibility-rules/{id} [delete]
func DeleteCompatibilityRule(c *gin.Context) {
	id := c.Param("id")
	if err := db.DB.Delete(&models.CompatibilityRule{}, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Rule not found"})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

// @Summary     Get compatibility rules by part ID
// @Description Get all compatibility rules for a specific part
// @Tags        Compatibility Rules
// @Accept      json
// @Produce     json
// @Param       partId path int true "Part ID"
// @Success     200 {array} models.CompatibilityRule
// @Router      /compatibility-rules/part/{partId} [get]
func GetCompatibilityRulesByPartID(c *gin.Context) {
	partID := c.Param("partId")
	var rules []models.CompatibilityRule
	db.DB.Where("part_id = ?", partID).Find(&rules)
	c.JSON(http.StatusOK, rules)
}

// @Summary     Get compatibility rules by firearm and part
// @Description Get all compatibility rules for a specific firearm model and part
// @Tags        Compatibility Rules
// @Accept      json
// @Produce     json
// @Param       firearmId path int true "Firearm Model ID"
// @Param       partId path int true "Part ID"
// @Success     200 {array} models.CompatibilityRule
// @Router      /compatibility-rules/firearm/{firearmId}/part/{partId} [get]
func GetCompatibilityRulesByFirearmAndPart(c *gin.Context) {
	firearmModelID := c.Param("firearmId")
	partID := c.Param("partId")
	var rules []models.CompatibilityRule
	db.DB.Where("firearm_model_id = ? AND (part_id = ? OR compatible_with_part_id = ?)",
		firearmModelID, partID, partID).Find(&rules)
	c.JSON(http.StatusOK, rules)
}

// @Summary     Check parts compatibility
// @Description Check if two parts are compatible for a specific firearm model
// @Tags        Compatibility Rules
// @Accept      json
// @Produce     json
// @Param       firearmId query int true "Firearm Model ID"
// @Param       part1 query int true "First Part ID"
// @Param       part2 query int true "Second Part ID"
// @Success     200 {object} map[string]interface{}
// @Router      /compatibility-check [get]
func CheckPartsCompatibility(c *gin.Context) {
	firearmModelID := c.Query("firearmId")
	partID1 := c.Query("part1")
	partID2 := c.Query("part2")

	var rule models.CompatibilityRule
	result := db.DB.Where(
		"firearm_model_id = ? AND ((part_id = ? AND compatible_with_part_id = ?) OR (part_id = ? AND compatible_with_part_id = ?))",
		firearmModelID, partID1, partID2, partID2, partID1,
	).First(&rule)

	if result.Error != nil {
		c.JSON(http.StatusOK, gin.H{
			"compatible": false,
			"message":    "Parts are not compatible for this firearm model",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"compatible": true,
		"rule":       rule,
	})
}
