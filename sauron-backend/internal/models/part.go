package models

import (
	"time"

	"gorm.io/datatypes"
)

// Part represents a firearm part or component in the database
// @Description Detailed information about a firearm part including compatibility and specifications
type Part struct {
	// Unique identifier for the part
	ID int `json:"id" gorm:"primaryKey" example:"1"`

	// Name of the part
	Name string `json:"name" gorm:"size:255;not null" example:"PMAG 30 AR/M4 GEN M3"`

	// Description of the part
	Description string `json:"description" gorm:"type:text" example:"A 30-round 5.56x45 NATO polymer magazine for AR-15 rifles."`

	// Reference to the manufacturer
	ManufacturerID int          `json:"manufacturer_id" gorm:"index" example:"1"`
	Manufacturer   Manufacturer `json:"-" gorm:"foreignKey:ManufacturerID"`

	// Main category of the part
	Category string `json:"category" gorm:"size:100" example:"Magazines"`

	// Subcategory for more specific classification
	Subcategory string `json:"subcategory" gorm:"size:100" example:"Polymer Magazines"`

	// Whether this is a pre-built component
	IsPrebuilt bool `json:"is_prebuilt" gorm:"default:false" example:"false"`

	// SubComponents that make up this part (for prebuilt parts)
	SubComponents datatypes.JSON `json:"sub_components" gorm:"type:jsonb" swaggertype:"string" example:"{\"Barrel\": {\"id\": 5}, \"Gas Block\": {\"id\": 6}}"`

	// List of compatible firearm models - removed NOT NULL constraint for migration
	CompatibleModels datatypes.JSON `json:"compatible_models" gorm:"type:jsonb" swaggertype:"array,string" example:"[\"AR-15\", \"M4\"]"`

	// Requirements for compatibility
	Requires datatypes.JSON `json:"requires" gorm:"type:jsonb" swaggertype:"string" example:"{\"thread\": \"1/2-28\", \"exclude\": \"Non-Mil-Spec\"}"`

	// Specifications of the part
	Specifications datatypes.JSON `json:"specifications" gorm:"type:jsonb" swaggertype:"string" example:"{\"caliber\": \"5.56mm\", \"capacity\": \"30 rounds\", \"material\": \"Polymer\", \"thread\": \"1/2-28\"}"`

	// Image URLs for the part
	Images datatypes.JSON `json:"images" gorm:"type:jsonb" swaggertype:"array,string" example:"[\"https://example.com/part1.jpg\", \"https://example.com/part2.jpg\"]"`

	// Base price of the part
	Price float64 `json:"price" gorm:"type:decimal(10,2)" example:"19.99"`

	// Availability status
	Availability string `json:"availability" gorm:"size:50" example:"in_stock"`

	// Weight of the part in pounds
	Weight float64 `json:"weight" gorm:"type:decimal(6,2)" example:"0.25"`

	// Dimensions of the part
	Dimensions string `json:"dimensions" gorm:"size:50" example:"7.5 x 3.5 x 1.5 in"`

	// Creation timestamp
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	// Last update timestamp
	UpdatedAt time.Time `json:"updated_at" gorm:"default:current_timestamp"`
}
