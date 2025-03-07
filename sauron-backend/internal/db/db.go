package db

import (
	"fmt"
	"log"
	"os"
	"sauron-backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// ConnectDB establishes a connection to the database and performs migrations
// but does NOT auto-seed the database. Used for read-only operations.
func ConnectDB() {
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

	// Auto Migrate the schemas (still needed to ensure table structure is correct)
	log.Println("Starting database migration...")

	// Migrate all tables
	// Note the order is important for foreign key constraints
	err = DB.AutoMigrate(
		&models.Manufacturer{},
		&models.Seller{},
		&models.PartCategory{}, // Migrate part categories first
		&models.FirearmModel{},
		&models.FirearmModelPartCategory{}, // Then the relationship table
		&models.Part{},
		&models.PartSellerLink{},
		&models.PrebuiltFirearm{},
		&models.PrebuiltSellerLink{},
		&models.UserSuggestion{},
		&models.ProductListing{},
	)
	if err != nil {
		log.Fatal("Failed to migrate tables:", err)
	}

	// Add unique constraint for firearm_model_part_categories table
	// This can't be done in the model definition because GORM doesn't support composite unique constraints directly
	err = DB.Exec("ALTER TABLE firearm_model_part_categories ADD CONSTRAINT unique_model_category UNIQUE (firearm_model_id, part_category_id)").Error
	if err != nil {
		log.Println("Warning: Failed to add unique constraint to firearm_model_part_categories. It may already exist:", err)
	}

	// Add additional indexes
	err = DB.Exec("CREATE INDEX IF NOT EXISTS idx_part_categories_parent ON part_categories (parent_category_id)").Error
	if err != nil {
		log.Println("Warning: Failed to create index idx_part_categories_parent:", err)
	}

	err = DB.Exec("CREATE INDEX IF NOT EXISTS idx_firearm_model_part_categories_model ON firearm_model_part_categories (firearm_model_id)").Error
	if err != nil {
		log.Println("Warning: Failed to create index idx_firearm_model_part_categories_model:", err)
	}

	err = DB.Exec("CREATE INDEX IF NOT EXISTS idx_firearm_model_part_categories_category ON firearm_model_part_categories (part_category_id)").Error
	if err != nil {
		log.Println("Warning: Failed to create index idx_firearm_model_part_categories_category:", err)
	}

	err = DB.Exec("CREATE INDEX IF NOT EXISTS idx_parts_category ON parts (part_category_id)").Error
	if err != nil {
		log.Println("Warning: Failed to create index idx_parts_category:", err)
	}

	log.Println("Database migration completed successfully")

	log.Println("Database connection established for read-only operations")
}

// InitDB initializes the database connection and performs migrations
// It will also automatically seed the database if it's empty
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
	log.Println("Starting database migration...")

	// Migrate all tables
	// Note the order is important for foreign key constraints
	err = DB.AutoMigrate(
		&models.Manufacturer{},
		&models.Seller{},
		&models.PartCategory{}, // Migrate part categories first
		&models.FirearmModel{},
		&models.FirearmModelPartCategory{}, // Then the relationship table
		&models.Part{},
		&models.PartSellerLink{},
		&models.PrebuiltFirearm{},
		&models.PrebuiltSellerLink{},
		&models.UserSuggestion{},
		&models.ProductListing{},
	)
	if err != nil {
		log.Fatal("Failed to migrate tables:", err)
	}

	// Add unique constraint for firearm_model_part_categories table
	// This can't be done in the model definition because GORM doesn't support composite unique constraints directly
	err = DB.Exec("ALTER TABLE firearm_model_part_categories ADD CONSTRAINT IF NOT EXISTS unique_model_category UNIQUE (firearm_model_id, part_category_id)").Error
	if err != nil {
		log.Println("Warning: Failed to add unique constraint to firearm_model_part_categories. It may already exist:", err)
	}

	// Add additional indexes
	err = DB.Exec("CREATE INDEX IF NOT EXISTS idx_part_categories_parent ON part_categories (parent_category_id)").Error
	if err != nil {
		log.Println("Warning: Failed to create index idx_part_categories_parent:", err)
	}

	err = DB.Exec("CREATE INDEX IF NOT EXISTS idx_firearm_model_part_categories_model ON firearm_model_part_categories (firearm_model_id)").Error
	if err != nil {
		log.Println("Warning: Failed to create index idx_firearm_model_part_categories_model:", err)
	}

	err = DB.Exec("CREATE INDEX IF NOT EXISTS idx_firearm_model_part_categories_category ON firearm_model_part_categories (part_category_id)").Error
	if err != nil {
		log.Println("Warning: Failed to create index idx_firearm_model_part_categories_category:", err)
	}

	err = DB.Exec("CREATE INDEX IF NOT EXISTS idx_parts_category ON parts (part_category_id)").Error
	if err != nil {
		log.Println("Warning: Failed to create index idx_parts_category:", err)
	}

	log.Println("Database migration completed successfully")

	// Check if database is empty and needs seeding
	var count int64
	DB.Model(&models.Seller{}).Count(&count)
	if count == 0 {
		log.Println("Empty database detected, starting data seeding...")
		SeedDatabase()
	} else {
		log.Println("Database already contains data, skipping basic seeding")
	}

	// Always run the schema migration process
	// This will populate the new schema tables and migrate existing data
	MigrateSchema()

	log.Println("Database connection established and ready")
}

// MigrateSchema handles database schema setup
func MigrateSchema() {
	log.Println("Setting up database schema...")

	// Check if we have any part categories already
	var categoryCount int64
	DB.Model(&models.PartCategory{}).Count(&categoryCount)

	if categoryCount == 0 {
		log.Println("No part categories found - initializing category data...")
		SeedCategoriesAndRelationships()
	} else {
		log.Printf("Found %d existing part categories, no migration needed", categoryCount)
	}

	log.Println("Schema setup completed")
}

// Check if there's existing data in the database
func hasExistingData() bool {
	var sellerCount int64
	DB.Model(&models.Seller{}).Count(&sellerCount)
	return sellerCount > 0
}

// Update existing data to match the new schema
func updateExistingData() {
	// This function has been deprecated as we've removed the compatible_models field
	// We only keep it as a placeholder in case new schema migrations need to be done
	log.Println("Schema has changed - no compatible_models field to update")
}
