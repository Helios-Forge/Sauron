package db

import (
	"fmt"
	"log"
	"sauron-backend/internal/models"

	"gorm.io/gorm"
)

// WipeDatabase clears all data from the database tables
func WipeDatabase() error {
	log.Println("Wiping database...")

	// Temporarily disable foreign key constraint checks for PostgreSQL
	DB.Exec("SET session_replication_role = 'replica';")

	// List of all models to wipe in a specific order due to dependencies
	models := []interface{}{
		&models.ProductListing{},
		&models.PartSellerLink{},
		&models.PrebuiltSellerLink{},
		&models.UserSuggestion{},
		&models.FirearmModelPartCategory{}, // Must be deleted before FirearmModel and PartCategory
		&models.Part{},
		&models.PrebuiltFirearm{},
		&models.FirearmModel{},
		&models.PartCategory{}, // Delete after all tables that reference it
		&models.Seller{},
		&models.Manufacturer{},
	}

	// Wipe each table
	for _, model := range models {
		if err := DB.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(model).Error; err != nil {
			log.Printf("Error wiping table for %T: %v", model, err)
			// Continue with other tables even if one fails
			continue
		}
		log.Printf("Wiped table for %T", model)
	}

	// Re-enable foreign key constraint checks
	DB.Exec("SET session_replication_role = 'origin';")

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

// ResetDatabase drops and recreates all tables
func ResetDatabase() error {
	log.Println("Completely resetting database schema...")

	// Check if DB is initialized
	if DB == nil {
		return fmt.Errorf("database connection not initialized")
	}

	// Drop all tables using PostgreSQL's cascading drop feature
	log.Println("Dropping ALL tables...")
	result := DB.Exec(`
		DO $$ DECLARE
			r RECORD;
		BEGIN
			-- Disable triggers temporarily to avoid constraint errors
			EXECUTE 'SET session_replication_role = ''replica''';
			
			FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
				EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
			END LOOP;
			
			-- Re-enable triggers
			EXECUTE 'SET session_replication_role = ''origin''';
		END $$;
	`)

	if result.Error != nil {
		log.Printf("Error dropping tables: %v", result.Error)
		return result.Error
	}

	// Create fresh schema with the new model definitions
	log.Println("Creating fresh schema with updated models...")

	// Migrate all tables in the proper order for foreign key constraints
	err := DB.AutoMigrate(
		&models.Manufacturer{},
		&models.Seller{},
		&models.PartCategory{},
		&models.FirearmModel{},
		&models.FirearmModelPartCategory{},
		&models.Part{},
		&models.PartSellerLink{},
		&models.PrebuiltFirearm{},
		&models.PrebuiltSellerLink{},
		&models.UserSuggestion{},
		&models.ProductListing{},
	)
	if err != nil {
		log.Fatalf("Failed to create new schema: %v", err)
		return err
	}

	// Add database constraints and indexes
	log.Println("Adding constraints and indexes...")
	addDatabaseConstraints()

	log.Println("Database schema has been completely reset to the latest version")
	return nil
}

// addDatabaseConstraints adds necessary constraints and indexes to the database
func addDatabaseConstraints() {
	// Add unique constraint for firearm_model_part_categories table
	// PostgreSQL doesn't support IF NOT EXISTS for constraints directly, so we need to check if it exists first
	var constraintExists int64
	DB.Raw(`
		SELECT COUNT(*) 
		FROM pg_constraint 
		WHERE conname = 'unique_model_category' 
		AND conrelid = 'firearm_model_part_categories'::regclass
	`).Count(&constraintExists)

	// Only add if it doesn't exist
	if constraintExists == 0 {
		err := DB.Exec("ALTER TABLE firearm_model_part_categories ADD CONSTRAINT unique_model_category UNIQUE (firearm_model_id, part_category_id)").Error
		if err != nil {
			log.Printf("Warning: Failed to add unique constraint to firearm_model_part_categories: %v", err)
		}
	}

	// Add additional indexes
	indexes := []struct {
		query string
		name  string
	}{
		{"CREATE INDEX IF NOT EXISTS idx_part_categories_parent ON part_categories (parent_category_id)", "idx_part_categories_parent"},
		{"CREATE INDEX IF NOT EXISTS idx_firearm_model_part_categories_model ON firearm_model_part_categories (firearm_model_id)", "idx_firearm_model_part_categories_model"},
		{"CREATE INDEX IF NOT EXISTS idx_firearm_model_part_categories_category ON firearm_model_part_categories (part_category_id)", "idx_firearm_model_part_categories_category"},
		{"CREATE INDEX IF NOT EXISTS idx_parts_category ON parts (part_category_id)", "idx_parts_category"},
	}

	for _, idx := range indexes {
		err := DB.Exec(idx.query).Error
		if err != nil {
			log.Printf("Warning: Failed to create index %s: %v", idx.name, err)
		}
	}
}
