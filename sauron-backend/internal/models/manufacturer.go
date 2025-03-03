package models

import (
	"time"

	"gorm.io/datatypes"
)

// Manufacturer represents manufacturers of parts and firearms
// @Description Detailed information about manufacturers of parts and firearms
type Manufacturer struct {
	// Unique identifier for the manufacturer
	ID int `json:"id" gorm:"primaryKey" example:"1"`

	// Name of the manufacturer
	Name string `json:"name" gorm:"size:255;not null" example:"Magpul"`

	// Description of the manufacturer
	Description string `json:"description" gorm:"type:text" example:"Leading manufacturer of firearm accessories and components."`

	// Contact information for the manufacturer
	ContactInfo datatypes.JSON `json:"contact_info" gorm:"type:jsonb" swaggertype:"string" example:"{\"phone\": \"123-456-7890\", \"email\": \"info@manufacturer.com\", \"website\": \"www.manufacturer.com\"}"`

	// Country of origin
	Country string `json:"country" gorm:"size:100" example:"USA"`

	// Year the manufacturer was founded
	FoundedYear int `json:"founded_year" gorm:"type:integer" example:"1963"`

	// URL to the manufacturer's logo
	LogoURL string `json:"logo_url" gorm:"size:255" example:"https://example.com/logo.png"`

	// Creation timestamp
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	// Last update timestamp
	UpdatedAt time.Time `json:"updated_at" gorm:"default:current_timestamp"`
}
