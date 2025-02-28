package models

import (
	"time"

	"gorm.io/datatypes"
)

// UserSuggestion represents a user-submitted suggestion for new firearm models or parts
// @Description User suggestions for new content or improvements
type UserSuggestion struct {
	// Unique identifier for the suggestion
	ID int `json:"id" gorm:"primaryKey" example:"1"`

	// Name of the suggested model or part
	ModelName string `json:"model_name" gorm:"size:255" example:"New AR-15 Variant"`

	// List of suggested parts or modifications
	// @Description JSON object containing detailed suggestions
	SuggestedParts datatypes.JSON `json:"suggested_parts" gorm:"type:jsonb" swaggertype:"string" example:"{\"parts\":[\"Custom Handguard\",\"Modified BCG\"],\"modifications\":[\"Enhanced Feed Ramps\"]}"`

	// Current status of the suggestion (pending, approved, rejected)
	Status string `json:"status" gorm:"size:50;default:'pending'" example:"pending"`

	// Creation timestamp
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	// Last update timestamp
	UpdatedAt time.Time `json:"updated_at" gorm:"default:current_timestamp"`
}
