package models

import (
	"time"

	"gorm.io/datatypes"
)

// ProductListing represents a product listing from a seller
// @Description Product listing information including pricing and availability
type ProductListing struct {
	// Unique identifier for the product listing
	ID int `json:"id" gorm:"primaryKey" example:"1"`

	// ID of the seller offering this product
	SellerID int `json:"seller_id" gorm:"not null" example:"1"`

	// Optional: ID of the part if this listing is for a part
	PartID *int `json:"part_id,omitempty" gorm:"default:null" example:"1"`

	// Optional: ID of the prebuilt firearm if this listing is for a prebuilt
	PrebuiltID *int `json:"prebuilt_id,omitempty" gorm:"default:null" example:"1"`

	// URL to the product on the seller's website
	URL string `json:"url" gorm:"size:500;not null" example:"https://www.brownells.com/products/bcg-standard"`

	// Seller's SKU for the product
	SKU string `json:"sku" gorm:"size:100" example:"BRN-BCG-01"`

	// Current price of the product
	Price float64 `json:"price" gorm:"not null" example:"129.99"`

	// Currency of the price
	Currency string `json:"currency" gorm:"size:3;default:'USD'" example:"USD"`

	// Current availability status (in_stock, out_of_stock, backorder)
	Availability string `json:"availability" gorm:"size:50;default:'in_stock'" example:"in_stock"`

	// Shipping information
	// @Description JSON object containing shipping details
	ShippingInfo datatypes.JSON `json:"shipping_info" gorm:"type:jsonb" swaggertype:"string" example:"{\"free_shipping\":true,\"shipping_cost\":0,\"handling_time\":\"1-3 business days\"}"`

	// Last time the listing was checked/updated
	LastChecked time.Time `json:"last_checked" gorm:"not null"`

	// Additional seller-specific information
	// @Description JSON object containing additional product details
	AdditionalInfo datatypes.JSON `json:"additional_info" gorm:"type:jsonb" swaggertype:"string" example:"{\"condition\":\"new\",\"warranty\":\"lifetime\",\"made_in_usa\":true}"`

	// Creation timestamp
	CreatedAt time.Time `json:"created_at" gorm:"default:current_timestamp"`

	// Last update timestamp
	UpdatedAt time.Time `json:"updated_at" gorm:"default:current_timestamp"`

	// Related seller information
	Seller Seller `json:"seller" gorm:"foreignKey:SellerID"`

	// Related part information if this is a part listing
	Part *Part `json:"part,omitempty" gorm:"foreignKey:PartID"`

	// Related prebuilt firearm information if this is a prebuilt listing
	PrebuiltFirearm *PrebuiltFirearm `json:"prebuilt_firearm,omitempty" gorm:"foreignKey:PrebuiltID"`
}
