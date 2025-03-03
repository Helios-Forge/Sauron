package models

import (
	"time"

	"gorm.io/datatypes"
)

// Seller represents a vendor or retailer in the system
// @Description Information about sellers who offer parts and prebuilt firearms
type Seller struct {
	// Unique identifier for the seller
	ID int `json:"id" gorm:"primaryKey" example:"1"`

	// Name of the seller
	Name string `json:"name" gorm:"size:255;not null" example:"Brownells"`

	// Description of the seller
	Description string `json:"description" gorm:"type:text" example:"A trusted retailer of firearm parts and accessories."`

	// Website URL of the seller
	WebsiteURL string `json:"website_url" gorm:"size:255" example:"https://www.brownells.com"`

	// URL to the seller's logo
	LogoURL string `json:"logo_url" gorm:"size:255" example:"https://example.com/brownells_logo.png"`

	// Whether the seller is an affiliate partner
	IsAffiliate bool `json:"is_affiliate" gorm:"default:false" example:"false"`

	// Template for creating affiliate links (NULL if not affiliate)
	AffiliateLinkTemplate string `json:"affiliate_link_template" gorm:"size:255" example:"https://www.brownells.com/?aff=gunguru_{product_id}"`

	// Contact information for the seller
	ContactInfo datatypes.JSON `json:"contact_info" gorm:"type:jsonb" swaggertype:"string" example:"{\"phone\": \"800-741-0015\", \"email\": \"support@brownells.com\"}"`

	// Creation timestamp
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	// Last update timestamp
	UpdatedAt time.Time `json:"updated_at" gorm:"default:current_timestamp"`
}
