package db

import (
	"encoding/json"
	"log"
	"sauron-backend/internal/models"
)

// Helper function to create pointer to int
func intPtr(i int) *int {
	return &i
}

// SeedCategoriesAndRelationships populates the new schema tables with data
func SeedCategoriesAndRelationships() {
	log.Println("Seeding part categories and relationships...")

	// Insert part categories
	for _, category := range categoryData {
		// Check if category already exists
		var count int64
		DB.Model(&models.PartCategory{}).Where("id = ?", category.ID).Count(&count)

		if count == 0 {
			result := DB.Create(&category)
			if result.Error != nil {
				log.Printf("Error creating part category %s: %v", category.Name, result.Error)
			} else {
				log.Printf("Created part category: %s", category.Name)
			}
		} else {
			log.Printf("Part category already exists: %s", category.Name)
		}
	}

	// Process all firearm models to create category relationships
	var firearmModels []models.FirearmModel
	if err := DB.Find(&firearmModels).Error; err != nil {
		log.Printf("Error fetching firearm models: %v", err)
		return
	}

	for _, model := range firearmModels {
		// For each model, extract categories from JSONB data and create relationships
		MigrateFirearmModelCategories(model)
	}

	// Process all parts to associate them with categories
	var parts []models.Part
	if err := DB.Find(&parts).Error; err != nil {
		log.Printf("Error fetching parts: %v", err)
		return
	}

	for _, part := range parts {
		// For each part, associate with a category
		MigratePartCategory(part)
	}

	log.Println("Part category and relationship seeding completed")
}

// MigrateFirearmModelCategories extracts categories from JSONB and creates relationships
func MigrateFirearmModelCategories(model models.FirearmModel) {
	log.Printf("Migrating categories for firearm model: %s (ID: %d)", model.Name, model.ID)

	// Extract required parts from Parts JSONB
	var partsData map[string]interface{}
	if err := json.Unmarshal([]byte(model.Parts.String()), &partsData); err != nil {
		log.Printf("Error unmarshaling Parts JSON for model %s: %v", model.Name, err)
		return
	}

	// For each top-level category in Parts
	for categoryName, data := range partsData {
		// Find category in our part_categories table
		var category models.PartCategory
		if err := DB.Where("name = ?", categoryName).First(&category).Error; err != nil {
			log.Printf("Category not found: %s", categoryName)
			continue
		}

		// Create relationship
		relationship := models.FirearmModelPartCategory{
			FirearmModelID: model.ID,
			PartCategoryID: category.ID,
			IsRequired:     true, // Parts from the Parts field are required
		}

		// Check if relationship already exists
		var count int64
		DB.Model(&models.FirearmModelPartCategory{}).
			Where("firearm_model_id = ? AND part_category_id = ?", relationship.FirearmModelID, relationship.PartCategoryID).
			Count(&count)

		if count == 0 {
			if err := DB.Create(&relationship).Error; err != nil {
				log.Printf("Error creating relationship for model %s, category %s: %v", model.Name, category.Name, err)
			} else {
				log.Printf("Created required relationship: %s -> %s", model.Name, category.Name)
			}
		}

		// Process sub-parts recursively if present
		categoriesDataMap, ok := data.(map[string]interface{})
		if !ok {
			continue
		}

		subPartsData, hasSubParts := categoriesDataMap["sub_parts"].(map[string]interface{})
		if hasSubParts {
			for subCategoryName := range subPartsData {
				var subCategory models.PartCategory
				if err := DB.Where("name = ?", subCategoryName).First(&subCategory).Error; err != nil {
					log.Printf("Subcategory not found: %s", subCategoryName)
					continue
				}

				subRelationship := models.FirearmModelPartCategory{
					FirearmModelID: model.ID,
					PartCategoryID: subCategory.ID,
					IsRequired:     true,
				}

				DB.Model(&models.FirearmModelPartCategory{}).
					Where("firearm_model_id = ? AND part_category_id = ?", subRelationship.FirearmModelID, subRelationship.PartCategoryID).
					Count(&count)

				if count == 0 {
					if err := DB.Create(&subRelationship).Error; err != nil {
						log.Printf("Error creating relationship for model %s, subcategory %s: %v", model.Name, subCategory.Name, err)
					} else {
						log.Printf("Created required relationship: %s -> %s", model.Name, subCategory.Name)
					}
				}
			}
		}
	}

	// Extract optional parts from CompatibleParts JSONB
	var compatiblePartsData map[string]interface{}
	if err := json.Unmarshal([]byte(model.CompatibleParts.String()), &compatiblePartsData); err != nil {
		log.Printf("Error unmarshaling CompatibleParts JSON for model %s: %v", model.Name, err)
		return
	}

	// For each top-level category in CompatibleParts
	for categoryName, data := range compatiblePartsData {
		var category models.PartCategory
		if err := DB.Where("name = ?", categoryName).First(&category).Error; err != nil {
			log.Printf("Category not found: %s", categoryName)
			continue
		}

		// Create relationship
		relationship := models.FirearmModelPartCategory{
			FirearmModelID: model.ID,
			PartCategoryID: category.ID,
			IsRequired:     false, // Parts from CompatibleParts are optional
		}

		// Check if relationship already exists
		var count int64
		DB.Model(&models.FirearmModelPartCategory{}).
			Where("firearm_model_id = ? AND part_category_id = ?", relationship.FirearmModelID, relationship.PartCategoryID).
			Count(&count)

		if count == 0 {
			if err := DB.Create(&relationship).Error; err != nil {
				log.Printf("Error creating relationship for model %s, category %s: %v", model.Name, category.Name, err)
			} else {
				log.Printf("Created optional relationship: %s -> %s", model.Name, category.Name)
			}
		}

		// Process subcategories
		subCategoriesMap, ok := data.(map[string]interface{})
		if !ok {
			continue
		}

		for subCategoryName := range subCategoriesMap {
			var subCategory models.PartCategory
			if err := DB.Where("name = ?", subCategoryName).First(&subCategory).Error; err != nil {
				log.Printf("Subcategory not found: %s", subCategoryName)
				continue
			}

			subRelationship := models.FirearmModelPartCategory{
				FirearmModelID: model.ID,
				PartCategoryID: subCategory.ID,
				IsRequired:     false,
			}

			DB.Model(&models.FirearmModelPartCategory{}).
				Where("firearm_model_id = ? AND part_category_id = ?", subRelationship.FirearmModelID, subRelationship.PartCategoryID).
				Count(&count)

			if count == 0 {
				if err := DB.Create(&subRelationship).Error; err != nil {
					log.Printf("Error creating relationship for model %s, subcategory %s: %v", model.Name, subCategory.Name, err)
				} else {
					log.Printf("Created optional relationship: %s -> %s", model.Name, subCategory.Name)
				}
			}
		}
	}
}

// MigratePartCategory associates a part with a category based on its Category/Subcategory fields
func MigratePartCategory(part models.Part) {
	log.Printf("Migrating part %s (ID: %d) to category", part.Name, part.ID)

	// If part already has a part_category_id, skip
	if part.PartCategoryID != nil {
		log.Printf("Part %s already has category ID %d", part.Name, *part.PartCategoryID)
		return
	}

	// Look for a category matching the part's subcategory first (more specific)
	if part.Subcategory != "" {
		var category models.PartCategory
		if err := DB.Where("name = ?", part.Subcategory).First(&category).Error; err == nil {
			// Found a matching category for subcategory
			part.PartCategoryID = &category.ID
			if err := DB.Save(&part).Error; err != nil {
				log.Printf("Error associating part %s with subcategory %s: %v", part.Name, part.Subcategory, err)
			} else {
				log.Printf("Associated part %s with subcategory %s", part.Name, part.Subcategory)
			}
			return
		}
	}

	// If no subcategory match, try with the main category
	if part.Category != "" {
		var category models.PartCategory
		if err := DB.Where("name = ?", part.Category).First(&category).Error; err == nil {
			// Found a matching category
			part.PartCategoryID = &category.ID
			if err := DB.Save(&part).Error; err != nil {
				log.Printf("Error associating part %s with category %s: %v", part.Name, part.Category, err)
			} else {
				log.Printf("Associated part %s with category %s", part.Name, part.Category)
			}
			return
		}
	}

	log.Printf("No matching category found for part %s (category: %s, subcategory: %s)", part.Name, part.Category, part.Subcategory)
}

// Define part categories for the new schema
var categoryData = []models.PartCategory{
	// Top-level categories
	{
		ID:          1,
		Name:        "Lower Assembly",
		Description: "Core lower receiver components",
	},
	{
		ID:          2,
		Name:        "Upper Assembly",
		Description: "Core upper receiver components",
	},
	{
		ID:          17,
		Name:        "Miscellaneous Accessories",
		Description: "Optional accessories",
	},
	{
		ID:          18,
		Name:        "Magazines and Feeding Devices",
		Description: "Magazine options",
	},
	{
		ID:          19,
		Name:        "Rails and Mounting Accessories",
		Description: "Mounting systems",
	},

	// Lower Assembly Sub-Categories
	{
		ID:               3,
		Name:             "Grip",
		ParentCategoryID: intPtr(1),
		Description:      "Pistol grip components",
	},
	{
		ID:               4,
		Name:             "Bolt Catch",
		ParentCategoryID: intPtr(1),
		Description:      "Bolt catch mechanism",
	},
	{
		ID:               5,
		Name:             "Buffer System",
		ParentCategoryID: intPtr(1),
		Description:      "Buffer and recoil components",
	},
	{
		ID:               6,
		Name:             "Lower Receiver",
		ParentCategoryID: intPtr(1),
		Description:      "Lower receiver structure",
	},
	{
		ID:               7,
		Name:             "Magazine Release",
		ParentCategoryID: intPtr(1),
		Description:      "Magazine release mechanism",
	},
	{
		ID:               8,
		Name:             "Trigger Assembly",
		ParentCategoryID: intPtr(1),
		Description:      "Trigger and fire control components",
	},
	{
		ID:               9,
		Name:             "Fire Control Group",
		ParentCategoryID: intPtr(1),
		Description:      "Safety and selector components",
	},

	// Upper Assembly Sub-Categories
	{
		ID:               10,
		Name:             "Barrel",
		ParentCategoryID: intPtr(2),
		Description:      "Barrel and gas system components",
	},
	{
		ID:               11,
		Name:             "Gas System",
		ParentCategoryID: intPtr(2),
		Description:      "Gas operation components",
	},
	{
		ID:               12,
		Name:             "Upper Receiver",
		ParentCategoryID: intPtr(2),
		Description:      "Upper receiver structure",
	},
	{
		ID:               13,
		Name:             "Bolt Carrier Group",
		ParentCategoryID: intPtr(2),
		Description:      "Bolt and carrier components",
	},
	{
		ID:               14,
		Name:             "Handguard/Foregrip",
		ParentCategoryID: intPtr(2),
		Description:      "Handguard and rail components",
	},

	// Deeper Sub-Categories
	{
		ID:               15,
		Name:             "Grip Screw",
		ParentCategoryID: intPtr(3),
		Description:      "Screw for securing grip",
	},
	{
		ID:               16,
		Name:             "Bolt",
		ParentCategoryID: intPtr(13),
		Description:      "Bolt component of BCG",
	},

	// Compatible Sub-Categories
	{
		ID:               20,
		Name:             "Slings",
		ParentCategoryID: intPtr(17),
		Description:      "Sling attachments",
	},
	{
		ID:               21,
		Name:             "Rail Systems",
		ParentCategoryID: intPtr(19),
		Description:      "Rail mounting options",
	},
	{
		ID:               22,
		Name:             "Two-Point Sling",
		ParentCategoryID: intPtr(20),
		Description:      "Two-point sling option",
	},
}
