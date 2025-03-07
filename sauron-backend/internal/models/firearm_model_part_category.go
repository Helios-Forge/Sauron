package models

import (
	"time"
)

// FirearmModelPartCategory represents the relationship between firearm models and part categories
// @Description Many-to-many relationship between firearm models and their required/optional part categories
type FirearmModelPartCategory struct {
	// Unique identifier for the relationship
	ID int `json:"id" gorm:"primaryKey" example:"1"`

	// Firearm model ID
	FirearmModelID int `json:"firearm_model_id" gorm:"index;not null" example:"813"`

	// Firearm model this category belongs to
	FirearmModel FirearmModel `json:"-" gorm:"foreignKey:FirearmModelID"`

	// Part category ID
	PartCategoryID int `json:"part_category_id" gorm:"index;not null" example:"12"`

	// Part category that belongs to this firearm model
	PartCategory PartCategory `json:"part_category" gorm:"foreignKey:PartCategoryID"`

	// Whether this category is required for the firearm model
	IsRequired bool `json:"is_required" gorm:"default:false" example:"true"`

	// Creation timestamp
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	// Unique constraint for firearm_model_id and part_category_id pair
	// This is implemented via a database-level constraint in the migration
}
