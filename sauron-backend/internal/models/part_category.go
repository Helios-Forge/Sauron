package models

import (
	"time"
)

// PartCategory represents a category of firearm parts in the database
// @Description Hierarchical structure of part categories
type PartCategory struct {
	// Unique identifier for the category
	ID int `json:"id" gorm:"primaryKey" example:"1"`

	// Name of the category
	Name string `json:"name" gorm:"size:100;not null" example:"Upper Assembly"`

	// Parent category ID for hierarchical relationships (null for top-level categories)
	ParentCategoryID *int `json:"parent_category_id,omitempty" gorm:"index" example:"0"`

	// Parent category (self-referential relationship)
	ParentCategory *PartCategory `json:"parent_category,omitempty" gorm:"foreignKey:ParentCategoryID"`

	// Child categories (reverse relationship)
	ChildCategories []PartCategory `json:"child_categories,omitempty" gorm:"foreignKey:ParentCategoryID"`

	// Description of the category
	Description string `json:"description" gorm:"type:text" example:"Core upper receiver components"`

	// Creation timestamp
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	// Last update timestamp
	UpdatedAt time.Time `json:"updated_at" gorm:"default:current_timestamp"`
}
