package db

import (
	"log"
	"sauron-backend/internal/models"

	"gorm.io/gorm"
)

// WipeDatabase clears all data from the database tables
func WipeDatabase() error {
	log.Println("Wiping database...")

	// Disable foreign key checks while wiping
	DB.Exec("SET FOREIGN_KEY_CHECKS = 0")

	// List of all models to wipe in a specific order due to dependencies
	models := []interface{}{
		&models.ProductListing{},
		&models.PartSellerLink{},
		&models.PrebuiltSellerLink{},
		&models.UserSuggestion{},
		&models.Part{},
		&models.PrebuiltFirearm{},
		&models.FirearmModel{},
		&models.Seller{},
		&models.Manufacturer{},
	}

	// Wipe each table
	for _, model := range models {
		if err := DB.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(model).Error; err != nil {
			log.Printf("Error wiping table for %T: %v", model, err)
			return err
		}
		log.Printf("Wiped table for %T", model)
	}

	// Re-enable foreign key checks
	DB.Exec("SET FOREIGN_KEY_CHECKS = 1")

	log.Println("Database wiping completed successfully")
	return nil
}

// GetDBStats returns basic statistics about the database
func GetDBStats() map[string]int64 {
	stats := make(map[string]int64)

	// Count records in each table
	var count int64

	DB.Model(&models.Manufacturer{}).Count(&count)
	stats["manufacturers"] = count

	DB.Model(&models.Seller{}).Count(&count)
	stats["sellers"] = count

	DB.Model(&models.FirearmModel{}).Count(&count)
	stats["firearm_models"] = count

	DB.Model(&models.Part{}).Count(&count)
	stats["parts"] = count

	DB.Model(&models.ProductListing{}).Count(&count)
	stats["product_listings"] = count

	DB.Model(&models.PrebuiltFirearm{}).Count(&count)
	stats["prebuilt_firearms"] = count

	DB.Model(&models.PartSellerLink{}).Count(&count)
	stats["part_seller_links"] = count

	DB.Model(&models.PrebuiltSellerLink{}).Count(&count)
	stats["prebuilt_seller_links"] = count

	DB.Model(&models.UserSuggestion{}).Count(&count)
	stats["user_suggestions"] = count

	return stats
}

// CleanOrphanedRecords removes any records with invalid foreign keys
func CleanOrphanedRecords() {
	log.Println("Cleaning orphaned records...")

	// Example: Clean ProductListings with missing Part references
	DB.Exec("DELETE FROM product_listings WHERE part_id IS NOT NULL AND part_id NOT IN (SELECT id FROM parts)")

	// Example: Clean ProductListings with missing Seller references
	DB.Exec("DELETE FROM product_listings WHERE seller_id NOT IN (SELECT id FROM sellers)")

	// Add additional cleanup as needed based on data model

	log.Println("Orphaned records cleaning complete")
}
