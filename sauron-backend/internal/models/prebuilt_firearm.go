package models

import (
	"time"

	"gorm.io/datatypes"
)

// PrebuiltFirearm represents a pre-configured firearm build
// @Description Complete firearm configuration with specific components
type PrebuiltFirearm struct {
	// Unique identifier for the prebuilt firearm
	ID int `json:"id" gorm:"primaryKey" example:"1"`

	// ID of the base firearm model
	FirearmModelID int `json:"firearm_model_id" gorm:"not null" example:"1"`

	// Name of the prebuilt configuration
	Name string `json:"name" gorm:"size:255;not null" example:"Custom AR-15 Build"`

	// List of components included in this build
	// @Description JSON object containing component details and specifications
	Components datatypes.JSON `json:"components" gorm:"type:jsonb;not null" swaggertype:"string" example:"{\"upper_receiver\":\"BCM Complete Upper\",\"lower_receiver\":\"Aero M4E1\",\"barrel\":\"16 inch 5.56 NATO\"}"`

	// Creation timestamp
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	// Last update timestamp
	UpdatedAt time.Time `json:"updated_at" gorm:"default:current_timestamp"`

	// Base firearm model
	FirearmModel FirearmModel `json:"firearm_model" gorm:"foreignKey:FirearmModelID"`
}
