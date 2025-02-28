package models

import (
	"time"

	"gorm.io/datatypes"
)

// Part represents a firearm part or component in the database
// @Description Detailed information about a firearm part including compatibility and restrictions
type Part struct {
	// Unique identifier for the part
	ID int `json:"id" gorm:"primaryKey" example:"1"`

	// Name of the part
	Name string `json:"name" gorm:"size:255;not null" example:"Bolt Carrier Group"`

	// Main category of the part
	Category string `json:"category" gorm:"size:100" example:"Upper Assembly"`

	// Subcategory for more specific classification
	Subcategory string `json:"subcategory" gorm:"size:100" example:"Bolt Carrier Group"`

	// Whether this is a pre-built component
	IsPrebuilt bool `json:"is_prebuilt" gorm:"default:false" example:"false"`

	// List of sub-components that make up this part
	// @Description JSON array of sub-component details
	SubComponents datatypes.JSON `json:"sub_components" gorm:"type:jsonb" swaggertype:"string" example:"{\"pins\":[\"firing pin\",\"cam pin\"],\"springs\":[\"extractor spring\"]}"`

	// List of required sub-components for this part
	// @Description JSON array of required sub-component names
	RequiredSubComponents datatypes.JSON `json:"required_sub_components" gorm:"type:jsonb" swaggertype:"string" example:"[\"bolt\",\"carrier\",\"firing pin\"]"`

	// Compatibility information with other parts and models
	// @Description JSON object containing compatibility rules
	Compatibility datatypes.JSON `json:"compatibility" gorm:"type:jsonb" swaggertype:"string" example:"{\"firearm_models\":[\"AR-15\",\"M4\"],\"calibers\":[\"5.56 NATO\"]}"`

	// Legal restrictions or requirements for this part
	// @Description JSON object containing legal restriction details
	LegalRestrictions datatypes.JSON `json:"legal_restrictions" gorm:"type:jsonb" swaggertype:"string" example:"{\"restricted_states\":[\"CA\",\"NY\"],\"license_required\":true}"`

	// Creation timestamp
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	// Last update timestamp
	UpdatedAt time.Time `json:"updated_at" gorm:"default:current_timestamp"`
}
