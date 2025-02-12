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

	// Category of the firearm
	Category string `json:"category" gorm:"size:100" example:"Assault Rifles"`

	// Subcategory of the firearm
	Subcategory string `json:"subcategory" gorm:"size:100" example:"Semi-Automatic"`

	// Variant of the firearm model
	Variant string `json:"variant" gorm:"size:50" example:"M4"`

	// List of required parts for this firearm model
	// @Description JSON array of required part names
	RequiredParts datatypes.JSON `json:"required_parts" gorm:"type:jsonb;not null" swaggertype:"array,string" example:"['Upper Receiver', 'Lower Receiver', 'Bolt Carrier Group']"`

	// List of compatible parts for this firearm model
	// @Description JSON array of compatible part categories
	CompatibleParts datatypes.JSON `json:"compatible_parts" gorm:"type:jsonb" swaggertype:"array,string" example:"['5.56 NATO', '.223 Remington']"`

	// Creation timestamp
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	// Last update timestamp
	UpdatedAt time.Time `json:"updated_at" gorm:"default:current_timestamp"`
}
