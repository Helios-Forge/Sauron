package handlers

import (
	"net/http"
	"sauron-backend/internal/db"
	"sauron-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// @Summary     Get all product listings
// @Description Get a list of all product listings in the database
// @Tags        Product Listings
// @Accept      json
// @Produce     json
// @Success     200 {array}  models.ProductListing
// @Router      /listings [get]
func GetProductListings(c *gin.Context) {
	var listings []models.ProductListing
	db.DB.Preload("Seller").Find(&listings)
	c.JSON(http.StatusOK, listings)
}

// @Summary     Create a new product listing
// @Description Add a new product listing to the database
// @Tags        Product Listings
// @Accept      json
// @Produce     json
// @Param       listing body models.ProductListing true "Product Listing Info"
// @Success     201 {object} models.ProductListing
// @Failure     400 {object} map[string]string
// @Router      /listings [post]
func CreateProductListing(c *gin.Context) {
	var listing models.ProductListing
	if err := c.ShouldBindJSON(&listing); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Create(&listing)
	c.JSON(http.StatusCreated, listing)
}

// @Summary     Get a product listing by ID
// @Description Get details of a specific product listing
// @Tags        Product Listings
// @Accept      json
// @Produce     json
// @Param       id path int true "Product Listing ID"
// @Success     200 {object} models.ProductListing
// @Failure     404 {object} map[string]string
// @Router      /listings/{id} [get]
func GetProductListingByID(c *gin.Context) {
	id := c.Param("id")
	var listing models.ProductListing
	if err := db.DB.Preload("Seller").First(&listing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
		return
	}
	c.JSON(http.StatusOK, listing)
}

// @Summary     Update a product listing
// @Description Update details of a specific product listing
// @Tags        Product Listings
// @Accept      json
// @Produce     json
// @Param       id path int true "Product Listing ID"
// @Param       listing body models.ProductListing true "Updated Product Listing Info"
// @Success     200 {object} models.ProductListing
// @Failure     400 {object} map[string]string
// @Failure     404 {object} map[string]string
// @Router      /listings/{id} [put]
func UpdateProductListing(c *gin.Context) {
	id := c.Param("id")
	var listing models.ProductListing
	if err := db.DB.First(&listing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
		return
	}
	if err := c.ShouldBindJSON(&listing); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Save(&listing)
	c.JSON(http.StatusOK, listing)
}

// @Summary     Delete a product listing
// @Description Delete a specific product listing
// @Tags        Product Listings
// @Accept      json
// @Produce     json
// @Param       id path int true "Product Listing ID"
// @Success     204 "No Content"
// @Failure     404 {object} map[string]string
// @Router      /listings/{id} [delete]
func DeleteProductListing(c *gin.Context) {
	id := c.Param("id")
	if err := db.DB.Delete(&models.ProductListing{}, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

// @Summary     Get listings by part ID
// @Description Get all product listings for a specific part
// @Tags        Product Listings
// @Accept      json
// @Produce     json
// @Param       partId path int true "Part ID"
// @Success     200 {array} models.ProductListing
// @Router      /listings/part/{partId} [get]
func GetListingsByPartID(c *gin.Context) {
	partID := c.Param("partId")
	var listings []models.ProductListing
	db.DB.Preload("Seller").Where("part_id = ?", partID).Find(&listings)
	c.JSON(http.StatusOK, listings)
}

// @Summary     Get listings by prebuilt ID
// @Description Get all product listings for a specific prebuilt firearm
// @Tags        Product Listings
// @Accept      json
// @Produce     json
// @Param       prebuiltId path int true "Prebuilt Firearm ID"
// @Success     200 {array} models.ProductListing
// @Router      /listings/prebuilt/{prebuiltId} [get]
func GetListingsByPrebuiltID(c *gin.Context) {
	prebuiltID := c.Param("prebuiltId")
	var listings []models.ProductListing
	db.DB.Preload("Seller").Where("prebuilt_id = ?", prebuiltID).Find(&listings)
	c.JSON(http.StatusOK, listings)
}

// @Summary     Get listings by seller
// @Description Get all product listings for a specific seller
// @Tags        Product Listings
// @Accept      json
// @Produce     json
// @Param       sellerId path int true "Seller ID"
// @Success     200 {array} models.ProductListing
// @Router      /listings/seller/{sellerId} [get]
func GetListingsBySeller(c *gin.Context) {
	sellerID := c.Param("sellerId")
	var listings []models.ProductListing
	db.DB.Preload("Seller").Where("seller_id = ?", sellerID).Find(&listings)
	c.JSON(http.StatusOK, listings)
}

// @Summary     Update listing availability
// @Description Update the availability and optionally the price of a specific listing
// @Tags        Product Listings
// @Accept      json
// @Produce     json
// @Param       id path int true "Product Listing ID"
// @Param       availability body object true "Availability Update Info"
// @Success     200 {object} models.ProductListing
// @Failure     400 {object} map[string]string
// @Failure     404 {object} map[string]string
// @Router      /listings/{id}/availability [patch]
func UpdateListingAvailability(c *gin.Context) {
	id := c.Param("id")
	var listing models.ProductListing
	if err := db.DB.First(&listing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
		return
	}

	var input struct {
		Availability string  `json:"availability" binding:"required"`
		Price        float64 `json:"price,omitempty"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	listing.Availability = input.Availability
	if input.Price > 0 {
		listing.Price = input.Price
	}
	db.DB.Save(&listing)
	c.JSON(http.StatusOK, listing)
}
