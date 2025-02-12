package models

import (
	"time"

	"gorm.io/datatypes"
)

// CompatibilityRule represents a compatibility rule between parts and firearm models
// @Description Rules defining compatibility between different parts and firearm models
type CompatibilityRule struct {
	// Unique identifier for the compatibility rule
	ID int `json:"id" gorm:"primaryKey" example:"1"`

	// ID of the firearm model this rule applies to
	FirearmModelID int `json:"firearm_model_id" gorm:"not null" example:"1"`

	// ID of the primary part in this compatibility rule
	PartID int `json:"part_id" gorm:"not null" example:"1"`

	// ID of the part that is compatible with the primary part
	CompatibleWithPartID int `json:"compatible_with_part_id" gorm:"not null" example:"2"`

	// Type of compatibility constraint (e.g., "required", "optional", "incompatible")
	ConstraintType string `json:"constraint_type" gorm:"size:50" example:"required"`

	// Additional details about the compatibility rule
	// @Description JSON object containing specific compatibility details
	Details datatypes.JSON `json:"details" gorm:"type:jsonb" swaggertype:"string" example:"{\"notes\":\"Must use correct gas system length\",\"caliber_specific\":true}"`

	// Creation timestamp
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	// Last update timestamp
	UpdatedAt time.Time `json:"updated_at" gorm:"default:current_timestamp"`

	// Related firearm model
	FirearmModel FirearmModel `json:"firearm_model" gorm:"foreignKey:FirearmModelID"`

	// Primary part in the compatibility relationship
	Part Part `json:"part" gorm:"foreignKey:PartID"`

	// Compatible part in the relationship
	CompatibleWithPart Part `json:"compatible_with_part" gorm:"foreignKey:CompatibleWithPartID"`
}
