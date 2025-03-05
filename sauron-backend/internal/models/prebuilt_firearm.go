package models

import (
	"time"

	"gorm.io/datatypes"
)

// PrebuiltFirearm represents a pre-configured firearm build
// @Description Complete firearm configuration with hierarchical parts structure
type PrebuiltFirearm struct {
	// Unique identifier for the prebuilt firearm
	ID int `json:"id" gorm:"primaryKey" example:"1"`

	// Reference to the base firearm model
	FirearmModelID int          `json:"firearm_model_id" gorm:"index" example:"1"`
	FirearmModel   FirearmModel `json:"-" gorm:"foreignKey:FirearmModelID"`

	// Name of the prebuilt configuration
	Name string `json:"name" gorm:"size:255;not null" example:"Colt M4 Carbine"`

	// Description of the prebuilt firearm
	Description string `json:"description" gorm:"type:text" example:"A prebuilt M4 variant with a 14.5-inch barrel."`

	// Specifications specific to this prebuilt configuration
	Specifications datatypes.JSON `json:"specifications" gorm:"type:jsonb" swaggertype:"string" example:"{\"weight\": \"6.5 lbs\", \"caliber\": \"5.56x45mm NATO\"}"`

	// Hierarchical structure of actual parts used in this prebuilt with IDs
	Parts datatypes.JSON `json:"parts" gorm:"column:components;type:jsonb;not null" swaggertype:"string" example:"{\"Upper Assembly\": {\"id\": 1, \"sub_parts\": {\"Bolt Carrier Group\": {\"id\": 5}}}}"`

	// Compatible accessories specifically for this prebuilt configuration
	CompatibleParts datatypes.JSON `json:"compatible_parts" gorm:"type:jsonb" swaggertype:"string" example:"{\"Magazines and Feeding Devices\": {\"Detachable Box Magazine\": {\"id\": 12}}}"`

	// Base price of the prebuilt firearm
	Price float64 `json:"price" gorm:"type:decimal(10,2)" example:"999.99"`

	// Image URLs for the prebuilt firearm
	Images datatypes.JSON `json:"images" gorm:"type:jsonb" swaggertype:"array,string" example:"[\"https://example.com/images/firearms/AR-15_prebuilt.jpg\"]"`

	// Availability status
	Availability string `json:"availability" gorm:"size:50" example:"in_stock"`

	// Creation timestamp
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	// Last update timestamp
	UpdatedAt time.Time `json:"updated_at" gorm:"default:current_timestamp"`
}
