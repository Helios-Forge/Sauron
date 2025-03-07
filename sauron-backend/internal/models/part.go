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

	// Reference to the part category
	PartCategoryID *int          `json:"part_category_id,omitempty" gorm:"index" example:"18"`
	PartCategory   *PartCategory `json:"part_category,omitempty" gorm:"foreignKey:PartCategoryID"`

	// Whether this is a pre-built component
	IsPrebuilt bool `json:"is_prebuilt" gorm:"default:false" example:"false"`

	// Image URLs for the part
	Images datatypes.JSON `json:"images" gorm:"type:jsonb" swaggertype:"array,string" example:"[\"https://example.com/images/parts/Standard-Charging-Handle-(AR-15).jpg\"]"`

	// Weight of the part in pounds
	Weight float64 `json:"weight" gorm:"type:decimal(6,2)" example:"0.54"`

	// Dimensions of the part
	Dimensions string `json:"dimensions" gorm:"size:50" example:"5 x 3 x 2 in"`

	// Creation timestamp
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	// Last update timestamp
	UpdatedAt time.Time `json:"updated_at" gorm:"default:current_timestamp"`
}
