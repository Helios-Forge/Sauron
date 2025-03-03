package models

import (
	"time"
)

// PartSellerLink represents the relationship between parts and sellers, with pricing and availability information
// @Description Links parts to multiple sellers with specific pricing, availability, and affiliate details
type PartSellerLink struct {
	// Unique identifier for the link
	ID int `json:"id" gorm:"primaryKey" example:"1"`

	// Reference to the part being sold
	PartID int  `json:"part_id" gorm:"index;uniqueIndex:part_seller" example:"1"`
	Part   Part `json:"-" gorm:"foreignKey:PartID"`

	// Reference to the seller offering the part
	SellerID int    `json:"seller_id" gorm:"index;uniqueIndex:part_seller" example:"1"`
	Seller   Seller `json:"-" gorm:"foreignKey:SellerID"`

	// Seller-specific price for the part
	Price float64 `json:"price" gorm:"type:decimal(10,2)" example:"18.50"`

	// Availability status at the seller
	Availability string `json:"availability" gorm:"size:50" example:"in_stock"`

	// Seller-specific stock-keeping unit
	SKU string `json:"sku" gorm:"size:100" example:"BRN-12345"`

	// Non-affiliate link to the part on the seller's website
	DirectLink string `json:"direct_link" gorm:"size:255" example:"https://www.brownells.com/pmag-30"`

	// Affiliate link to the part on the seller's website (NULL if not affiliate)
	AffiliateLink string `json:"affiliate_link" gorm:"size:255" example:"https://www.brownells.com/pmag-30?aff=gunguru_123"`

	// When this link/info was last updated
	LastUpdated time.Time `json:"last_updated" gorm:"default:current_timestamp"`

	// Creation timestamp
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	// Last update timestamp
	UpdatedAt time.Time `json:"updated_at" gorm:"default:current_timestamp"`
}
