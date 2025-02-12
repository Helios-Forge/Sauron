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

	// Auto Migrate the schemas
	err = DB.AutoMigrate(
		&models.FirearmModel{},
		&models.Part{},
		&models.CompatibilityRule{},
		&models.PrebuiltFirearm{},
		&models.UserSuggestion{},
		&models.Seller{},
		&models.ProductListing{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
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
