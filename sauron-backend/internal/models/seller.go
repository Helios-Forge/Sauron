package models

import (
	"time"

	"gorm.io/datatypes"
)

// Seller represents a vendor or retailer in the system
// @Description Information about sellers and their API integrations
type Seller struct {
	// Unique identifier for the seller
	ID int `json:"id" gorm:"primaryKey" example:"1"`

	// Name of the seller
	Name string `json:"name" gorm:"size:255;not null" example:"Brownells"`

	// Website URL of the seller
	Website string `json:"website" gorm:"size:255;not null" example:"https://www.brownells.com"`

	// API endpoint for the seller's integration
	ApiEndpoint string `json:"api_endpoint" gorm:"size:255" example:"https://api.brownells.com/v1"`

	// Encrypted API key for authentication
	ApiKey string `json:"api_key" gorm:"size:255" example:"encrypted_api_key_here"`

	// Current status of the seller (active, inactive, suspended)
	Status string `json:"status" gorm:"size:50;default:'active'" example:"active"`

	// Additional seller-specific settings
	// @Description JSON object containing seller configuration
	Settings datatypes.JSON `json:"settings" gorm:"type:jsonb" swaggertype:"string" example:"{\"api_version\":\"v1\",\"update_frequency\":\"daily\",\"preferred_currency\":\"USD\"}"`

	// Creation timestamp
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	// Last update timestamp
	UpdatedAt time.Time `json:"updated_at" gorm:"default:current_timestamp"`
}
