package models

import (
	"time"

	"gorm.io/datatypes"
)

// FirearmModel represents a firearm model in the database
// @Description Firearm model information including required and compatible parts
type FirearmModel struct {
	// Unique identifier for the firearm model
	ID int `json:"id" gorm:"primaryKey" example:"1"`

	// Name of the firearm model
	Name string `json:"name" gorm:"size:255;not null" example:"AR-15"`

	// Description of the firearm model
	Description string `json:"description" gorm:"type:text" example:"A lightweight semi-automatic rifle based on the ArmaLite design."`

	// Reference to the manufacturer
	ManufacturerID int          `json:"manufacturer_id" gorm:"index" example:"1"`
	Manufacturer   Manufacturer `json:"-" gorm:"foreignKey:ManufacturerID"`

	// Category of the firearm
	Category string `json:"category" gorm:"size:100" example:"Rifle"`

	// Subcategory of the firearm
	Subcategory string `json:"subcategory" gorm:"size:100" example:"Semi-Automatic"`

	// Variant of the firearm model
	Variant string `json:"variant" gorm:"size:50" example:"Carbine"`

	// Specifications of the firearm
	Specifications datatypes.JSON `json:"specifications" gorm:"type:jsonb" swaggertype:"string" example:"{\"caliber\": \"5.56mm\", \"barrel_length\": \"16in\", \"weight\": \"6.5lb\"}"`

	// JSON object of required parts
	RequiredParts datatypes.JSON `json:"required_parts" gorm:"type:jsonb;not null" swaggertype:"string" example:"{\"Upper Assembly\": true, \"Lower Assembly\": true}"`

	// JSON object of compatible parts
	CompatibleParts datatypes.JSON `json:"compatible_parts" gorm:"type:jsonb" swaggertype:"string" example:"{\"Sights and Optics\": true, \"Grips\": true}"`

	// Image URLs for the firearm model
	Images datatypes.JSON `json:"images" gorm:"type:jsonb" swaggertype:"array,string" example:"[\"https://example.com/image1.jpg\", \"https://example.com/image2.jpg\"]"`

	// Price range for the firearm model
	PriceRange string `json:"price_range" gorm:"size:50" example:"$800 - $1200"`

	// Creation timestamp
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	// Last update timestamp
	UpdatedAt time.Time `json:"updated_at" gorm:"default:current_timestamp"`
}
