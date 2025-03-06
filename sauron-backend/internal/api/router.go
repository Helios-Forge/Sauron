package api

import (
	"sauron-backend/internal/api/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()

	// Configure CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Firearm Models
	router.GET("/firearm-models", handlers.GetFirearmModels)
	router.POST("/firearm-models", handlers.CreateFirearmModel)
	router.GET("/firearm-models/:id", handlers.GetFirearmModelByID)
	router.PUT("/firearm-models/:id", handlers.UpdateFirearmModel)
	router.DELETE("/firearm-models/:id", handlers.DeleteFirearmModel)

	// NEW: Firearm Model Part Categories
	router.GET("/firearm-models/:id/categories", handlers.GetFirearmModelCategories)
	router.POST("/firearm-models/:id/categories/:category_id", handlers.AddCategoryToFirearmModel)
	router.PUT("/firearm-models/:id/categories/:category_id", handlers.UpdateFirearmModelCategoryRelation)
	router.DELETE("/firearm-models/:id/categories/:category_id", handlers.RemoveCategoryFromFirearmModel)

	// NEW: Alternative endpoint for part categories by firearm - maps to the same handler
	router.GET("/part-categories/firearm/:id", handlers.GetFirearmModelCategories)

	// Parts
	router.GET("/parts", handlers.GetParts)
	router.POST("/parts", handlers.CreatePart)
	router.GET("/parts/:id", handlers.GetPartByID)
	router.PUT("/parts/:id", handlers.UpdatePart)
	router.DELETE("/parts/:id", handlers.DeletePart)
	router.GET("/parts/category/:category", handlers.GetPartsByCategory)
	router.GET("/parts/:id/compatible", handlers.GetCompatibleParts)

	// Legacy Part metadata endpoints (will be deprecated)
	router.GET("/legacy/part-categories", handlers.GetLegacyPartCategories)
	router.GET("/part-subcategories", handlers.GetPartSubcategories)
	router.GET("/part-subcategories/:category", handlers.GetSubcategoriesByCategory)
	router.GET("/compatible-models", handlers.GetCompatibleFirearmModels)
	router.GET("/part-hierarchy", handlers.GetPartHierarchy)

	// NEW: Part Categories (new schema)
	router.GET("/part-categories", handlers.GetPartCategories)
	router.GET("/part-categories/:id", handlers.GetPartCategoryByID)
	router.POST("/part-categories", handlers.CreatePartCategory)
	router.PUT("/part-categories/:id", handlers.UpdatePartCategory)
	router.DELETE("/part-categories/:id", handlers.DeletePartCategory)

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

	// Manufacturers
	router.GET("/manufacturers", handlers.GetManufacturers)
	router.POST("/manufacturers", handlers.CreateManufacturer)
	router.GET("/manufacturers/:id", handlers.GetManufacturerByID)
	router.PUT("/manufacturers/:id", handlers.UpdateManufacturer)
	router.DELETE("/manufacturers/:id", handlers.DeleteManufacturer)

	return router
}
