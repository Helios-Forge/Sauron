package api

import (
	"sauron-backend/internal/api/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()

	// Firearm Models
	router.GET("/firearm-models", handlers.GetFirearmModels)
	router.POST("/firearm-models", handlers.CreateFirearmModel)
	router.GET("/firearm-models/:id", handlers.GetFirearmModelByID)
	router.PUT("/firearm-models/:id", handlers.UpdateFirearmModel)
	router.DELETE("/firearm-models/:id", handlers.DeleteFirearmModel)

	// Parts
	router.GET("/parts", handlers.GetParts)
	router.POST("/parts", handlers.CreatePart)
	router.GET("/parts/:id", handlers.GetPartByID)
	router.PUT("/parts/:id", handlers.UpdatePart)
	router.DELETE("/parts/:id", handlers.DeletePart)
	router.GET("/parts/category/:category", handlers.GetPartsByCategory)
	router.GET("/parts/:id/compatible", handlers.GetCompatibleParts)

	// Compatibility Rules - Removed as per new schema design
	// These routes are no longer needed as compatibility information is now embedded in the models

	// Prebuilt Firearms
	router.GET("/prebuilt-firearms", handlers.GetPrebuiltFirearms)
	router.POST("/prebuilt-firearms", handlers.CreatePrebuiltFirearm)
	router.GET("/prebuilt-firearms/:id", handlers.GetPrebuiltFirearmByID)
	router.PUT("/prebuilt-firearms/:id", handlers.UpdatePrebuiltFirearm)
	router.DELETE("/prebuilt-firearms/:id", handlers.DeletePrebuiltFirearm)
	router.GET("/prebuilt-firearms/model/:modelId", handlers.GetPrebuiltFirearmsByModel)

	// User Suggestions
	router.GET("/user-suggestions", handlers.GetUserSuggestions)
	router.POST("/user-suggestions", handlers.CreateUserSuggestion)
	router.GET("/user-suggestions/:id", handlers.GetUserSuggestionByID)
	router.PUT("/user-suggestions/:id", handlers.UpdateUserSuggestion)
	router.DELETE("/user-suggestions/:id", handlers.DeleteUserSuggestion)
	router.GET("/user-suggestions/status/:status", handlers.GetUserSuggestionsByStatus)
	router.PATCH("/user-suggestions/:id/status", handlers.UpdateUserSuggestionStatus)

	// Sellers
	router.GET("/sellers", handlers.GetSellers)
	router.POST("/sellers", handlers.CreateSeller)
	router.GET("/sellers/:id", handlers.GetSellerByID)
	router.PUT("/sellers/:id", handlers.UpdateSeller)
	router.DELETE("/sellers/:id", handlers.DeleteSeller)
	router.PATCH("/sellers/:id/affiliate-status", handlers.UpdateSellerStatus)

	// Product Listings
	router.GET("/listings", handlers.GetProductListings)
	router.POST("/listings", handlers.CreateProductListing)
	router.GET("/listings/:id", handlers.GetProductListingByID)
	router.PUT("/listings/:id", handlers.UpdateProductListing)
	router.DELETE("/listings/:id", handlers.DeleteProductListing)
	router.GET("/listings/part/:partId", handlers.GetListingsByPartID)
	router.GET("/listings/prebuilt/:prebuiltId", handlers.GetListingsByPrebuiltID)
	router.GET("/listings/seller/:sellerId", handlers.GetListingsBySeller)
	router.PATCH("/listings/:id/availability", handlers.UpdateListingAvailability)

	return router
}
