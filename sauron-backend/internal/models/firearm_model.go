package models

import (
	"time"

	"gorm.io/datatypes"
)

// FirearmModel represents a firearm model in the database
// @Description Firearm model information including hierarchical parts structure
type FirearmModel struct {
	// Unique identifier for the firearm model
	ID int `json:"id" gorm:"primaryKey" example:"1"`

	// Name of the firearm model
	Name string `json:"name" gorm:"size:255;not null" example:"AR-15"`

	// Description of the firearm model
	Description string `json:"description" gorm:"type:text" example:"A high-quality semi-automatic modular rifle platform."`

	// Reference to the manufacturer
	ManufacturerID int          `json:"manufacturer_id" gorm:"index" example:"1"`
	Manufacturer   Manufacturer `json:"-" gorm:"foreignKey:ManufacturerID"`

	// Category of the firearm
	Category string `json:"category" gorm:"size:100" example:"Rifle"`

	// Subcategory of the firearm
	Subcategory string `json:"subcategory" gorm:"size:100" example:"Assault"`

	// Variant of the firearm model
	Variant string `json:"variant" gorm:"size:50" example:""`

	// Specifications of the firearm
	Specifications datatypes.JSON `json:"specifications" gorm:"type:jsonb" swaggertype:"string" example:"{\"weight\": \"6.5 lbs\", \"caliber\": \"5.56x45mm NATO\"}"`

	// Hierarchical structure of parts with required/optional designation
	Parts datatypes.JSON `json:"parts" gorm:"type:jsonb;not null" swaggertype:"string" example:"{\"Upper Assembly\": {\"type\": \"required\", \"sub_parts\": {\"Bolt Carrier Group\": {\"type\": \"required\"}}}}"`

	// List of parts that are compatible but not part of the basic structure
	CompatibleParts datatypes.JSON `json:"compatible_parts" gorm:"type:jsonb" swaggertype:"string" example:"{\"Magazines and Feeding Devices\": {\"Detachable Box Magazine\": \"optional\"}}"`

	// Image URLs for the firearm model
	Images datatypes.JSON `json:"images" gorm:"type:jsonb" swaggertype:"array,string" example:"[\"https://example.com/images/firearms/AR-15.jpg\"]"`

	// Price range for the firearm model
	PriceRange string `json:"price_range" gorm:"size:50" example:"$765 - $1569"`

	// Creation timestamp
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	// Last update timestamp
	UpdatedAt time.Time `json:"updated_at" gorm:"default:current_timestamp"`
}
