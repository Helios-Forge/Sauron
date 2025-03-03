package db

import (
	"fmt"
	"log"
	"math/rand"
	"os"
	"sauron-backend/internal/models"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Check if tables exist and get their state
	hasExistingData := hasExistingData()

	// Auto Migrate the schemas
	log.Println("Starting database migration...")

	// First, migrate the base models
	err = DB.AutoMigrate(
		&models.Manufacturer{},
		&models.Seller{},
	)
	if err != nil {
		log.Fatal("Failed to migrate manufacturer and seller tables:", err)
	}

	// Then migrate the models that depend on manufacturers
	err = DB.AutoMigrate(
		&models.FirearmModel{},
		&models.Part{},
	)
	if err != nil {
		log.Fatal("Failed to migrate firearm model and part tables:", err)
	}

	// Finally migrate the rest of the models
	err = DB.AutoMigrate(
		&models.PartSellerLink{},
		&models.PrebuiltFirearm{},
		&models.PrebuiltSellerLink{},
		&models.UserSuggestion{},
		&models.ProductListing{},
	)
	if err != nil {
		log.Fatal("Failed to migrate remaining tables:", err)
	}

	// If there was existing data, we need to update it to match the new schema
	if hasExistingData {
		log.Println("Updating existing data to match new schema...")
		updateExistingData()
	}

	// Initialize random seed
	rand.Seed(time.Now().UnixNano())

	// Check if database is empty and needs seeding
	var count int64
	DB.Model(&models.Seller{}).Count(&count)
	if count == 0 {
		log.Println("Empty database detected, starting data seeding...")
		SeedDatabase()
	} else {
		log.Println("Database already contains data, skipping seeding")
	}

	log.Println("Database connection established and ready")
}

// Check if there's existing data in the database
func hasExistingData() bool {
	var sellerCount int64
	DB.Model(&models.Seller{}).Count(&sellerCount)
	return sellerCount > 0
}

// Update existing data to match the new schema
func updateExistingData() {
	// Update existing parts that might have null compatible_models
	var parts []models.Part
	DB.Where("compatible_models IS NULL").Find(&parts)

	for _, part := range parts {
		// Create a default compatible_models value based on the category
		compatibleModels := []string{"Universal"}
		if part.Category == "Upper Assembly" || part.Category == "Lower Assembly" {
			compatibleModels = []string{"AR-15", "M4", "M16"}
		}

		// Serialize to JSON and update
		DB.Model(&part).Update("compatible_models", compatibleModels)
	}

	log.Printf("Updated %d parts with default compatible_models values", len(parts))
}
