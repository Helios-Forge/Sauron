package models

import (
	"time"
)

// PrebuiltSellerLink represents the relationship between prebuilt firearms and sellers
// @Description Links prebuilt firearms to multiple sellers with specific pricing, availability, and affiliate details
type PrebuiltSellerLink struct {
	// Unique identifier for the link
	ID int `json:"id" gorm:"primaryKey" example:"1"`

	// Reference to the prebuilt firearm being sold
	PrebuiltID int             `json:"prebuilt_id" gorm:"index;uniqueIndex:prebuilt_seller" example:"1"`
	Prebuilt   PrebuiltFirearm `json:"-" gorm:"foreignKey:PrebuiltID"`

	// Reference to the seller offering the prebuilt firearm
	SellerID int    `json:"seller_id" gorm:"index;uniqueIndex:prebuilt_seller" example:"1"`
	Seller   Seller `json:"-" gorm:"foreignKey:SellerID"`

	// Seller-specific price for the prebuilt firearm
	Price float64 `json:"price" gorm:"type:decimal(10,2)" example:"950.00"`

	// Availability status at the seller
	Availability string `json:"availability" gorm:"size:50" example:"in_stock"`

	// Seller-specific stock-keeping unit
	SKU string `json:"sku" gorm:"size:100" example:"PSA-M4-001"`

	// Non-affiliate link to the prebuilt firearm on the seller's website
	DirectLink string `json:"direct_link" gorm:"size:255" example:"https://www.palmettostatearmory.com/m4-carbine"`

	// Affiliate link to the prebuilt firearm on the seller's website (NULL if not affiliate)
	AffiliateLink string `json:"affiliate_link" gorm:"size:255" example:"https://www.palmettostatearmory.com/m4-carbine?aff=gunguru_456"`

	// When this link/info was last updated
	LastUpdated time.Time `json:"last_updated" gorm:"default:current_timestamp"`

	// Creation timestamp
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	// Last update timestamp
	UpdatedAt time.Time `json:"updated_at" gorm:"default:current_timestamp"`
}
