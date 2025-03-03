package models

import (
	"time"

	"gorm.io/datatypes"
)

// UserSuggestion represents a user-submitted suggestion for new firearm models or parts
// @Description User suggestions for new models, parts, or configurations
type UserSuggestion struct {
	// Unique identifier for the suggestion
	ID int `json:"id" gorm:"primaryKey" example:"1"`

	// Name of the suggested model or configuration
	ModelName string `json:"model_name" gorm:"size:255" example:"Custom AR-10 Build"`

	// List of suggested parts or modifications
	SuggestedParts datatypes.JSON `json:"suggested_parts" gorm:"type:jsonb" swaggertype:"string" example:"{\"Barrel\": {\"name\": \"20in 308 Barrel\"}, \"Stock\": {\"name\": \"Magpul PRS\"}}"`

	// Description of the suggestion
	Description string `json:"description" gorm:"type:text" example:"A suggestion for a long-range AR-10 configuration."`

	// Current status of the suggestion (pending, approved, rejected)
	Status string `json:"status" gorm:"size:50;default:'pending'" example:"pending"`

	// Creation timestamp
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	// Last update timestamp
	UpdatedAt time.Time `json:"updated_at" gorm:"default:current_timestamp"`
}
