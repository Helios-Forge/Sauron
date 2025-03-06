package db

import (
	"encoding/json"
	"fmt"
	"hash/fnv"
	"log"
	"math/rand"
	"sauron-backend/internal/models"
	"strings"
	"time"

	"gorm.io/datatypes"
)

// Mock sellers data
var sellers = []models.Seller{
	{
		Name:                  "Brownells",
		WebsiteURL:            "https://www.brownells.com",
		Description:           "A trusted retailer of firearm parts and accessories.",
		IsAffiliate:           true,
		AffiliateLinkTemplate: "https://www.brownells.com/?aff=gunguru_{product_id}",
		LogoURL:               "https://example.com/brownells_logo.png",
	},
	{
		Name:                  "Midway USA",
		WebsiteURL:            "https://www.midwayusa.com",
		Description:           "Quality shooting and hunting supplies with industry-best customer service.",
		IsAffiliate:           true,
		AffiliateLinkTemplate: "https://www.midwayusa.com/?aff=gunguru_{product_id}",
		LogoURL:               "https://example.com/midway_logo.png",
	},
	{
		Name:                  "Primary Arms",
		WebsiteURL:            "https://www.primaryarms.com",
		Description:           "Provider of high-quality firearms, optics, and accessories.",
		IsAffiliate:           true,
		AffiliateLinkTemplate: "https://www.primaryarms.com/?aff=gunguru_{product_id}",
		LogoURL:               "https://example.com/primaryarms_logo.png",
	},
	{
		Name:                  "Palmetto State Armory",
		WebsiteURL:            "https://palmettostatearmory.com",
		Description:           "American firearms, ammunition, and accessories at great prices.",
		IsAffiliate:           true,
		AffiliateLinkTemplate: "https://palmettostatearmory.com/?aff=gunguru_{product_id}",
		LogoURL:               "https://example.com/psa_logo.png",
	},
}

// Firearm categories and their required parts
var firearmCategories = map[string]map[string][]string{
	"AR-15": {
		"required_parts":   {"Upper Assembly", "Lower Assembly", "Bolt Carrier Group", "Charging Handle"},
		"compatible_parts": {"Sights and Optics", "Muzzle Devices", "Handguards", "Stocks", "Grips"},
	},
	"AK-47": {
		"required_parts":   {"Barrel Assembly", "Receiver", "Bolt Carrier Group", "Gas System"},
		"compatible_parts": {"Furniture", "Muzzle Devices", "Optic Mounts", "Magazines"},
	},
	"Glock 17": {
		"required_parts":   {"Slide Assembly", "Frame", "Barrel", "Recoil Spring"},
		"compatible_parts": {"Sights", "Magazines", "Triggers", "Slide Parts"},
	},
}

// Mock parts data structure
var legacyPartCategories = map[string][]string{
	"Upper Assembly": {
		"Complete Upper Receiver",
		"Stripped Upper Receiver",
		"Forward Assist Assembly",
		"Dust Cover Assembly",
	},
	"Lower Assembly": {
		"Complete Lower Receiver",
		"Stripped Lower Receiver",
		"Lower Parts Kit",
		"Buffer Tube Assembly",
	},
	"Bolt Carrier Group": {
		"Complete BCG",
		"Bolt",
		"Carrier",
		"Firing Pin",
	},
	"Barrel": {
		"16\" 5.56 NATO",
		"14.5\" 5.56 NATO",
		"18\" .223 Wylde",
		"20\" 5.56 NATO",
	},
	"Handguard": {
		"15\" M-LOK",
		"13\" Quad Rail",
		"9\" KeyMod",
		"7\" M-LOK",
	},
}

// Define part categories for the new schema
// var categoryData = []models.PartCategory{
//     // Top-level categories
//     { ... },
//     // Lower Assembly Sub-Categories
//     { ... },
//     // ... other categories ...
// }

// Helper function to create pointer to int
// func intPtr(i int) *int {
//     return &i
// }

// SeedCategoriesAndRelationships populates the new schema tables with data
// func SeedCategoriesAndRelationships() {
//     log.Println("Seeding part categories and relationships...")
//
//     // Insert part categories
//     for _, category := range categoryData {
//         // Check if category already exists
//         var count int64
//         DB.Model(&models.PartCategory{}).Where("id = ?", category.ID).Count(&count)
//
//         if count == 0 {
//             result := DB.Create(&category)
//             if result.Error != nil {
//                 log.Printf("Error creating part category %s: %v", category.Name, result.Error)
//             } else {
//                 log.Printf("Created part category: %s", category.Name)
//             }
//         } else {
//             log.Printf("Part category already exists: %s", category.Name)
//         }
//     }
//
//     // Process all firearm models to create category relationships
//     var firearmModels []models.FirearmModel
//     if err := DB.Find(&firearmModels).Error; err != nil {
//         log.Printf("Error fetching firearm models: %v", err)
//         return
//     }
//
//     for _, model := range firearmModels {
//         // For each model, extract categories from JSONB data and create relationships
//         MigrateFirearmModelCategories(model)
//     }
//
//     // Process all parts to associate them with categories
//     var parts []models.Part
//     if err := DB.Find(&parts).Error; err != nil {
//         log.Printf("Error fetching parts: %v", err)
//         return
//     }
//
//     for _, part := range parts {
//         // For each part, associate with a category
//         MigratePartCategory(part)
//     }
//
//     log.Println("Part category and relationship seeding completed")
// }
//
// // MigrateFirearmModelCategories extracts categories from JSONB and creates relationships
// func MigrateFirearmModelCategories(model models.FirearmModel) {
//     log.Printf("Migrating categories for firearm model: %s (ID: %d)", model.Name, model.ID)
//
//     // Extract required parts from Parts JSONB
//     var partsData map[string]interface{}
//     if err := json.Unmarshal([]byte(model.Parts.String()), &partsData); err != nil {
//         log.Printf("Error unmarshaling Parts JSON for model %s: %v", model.Name, err)
//         return
//     }
//
//     // For each top-level category in Parts
//     for categoryName, data := range partsData {
//         // Find category in our part_categories table
//         var category models.PartCategory
//         if err := DB.Where("name = ?", categoryName).First(&category).Error; err != nil {
//             log.Printf("Category not found: %s", categoryName)
//             continue
//         }
//
//         // Create relationship
//         relationship := models.FirearmModelPartCategory{
//             FirearmModelID: model.ID,
//             PartCategoryID: category.ID,
//             IsRequired:     true, // Parts from the Parts field are required
//         }
//
//         // Check if relationship already exists
//         var count int64
//         DB.Model(&models.FirearmModelPartCategory{}).
//             Where("firearm_model_id = ? AND part_category_id = ?", relationship.FirearmModelID, relationship.PartCategoryID).
//             Count(&count)
//
//         if count == 0 {
//             if err := DB.Create(&relationship).Error; err != nil {
//                 log.Printf("Error creating relationship for model %s, category %s: %v", model.Name, category.Name, err)
//             } else {
//                 log.Printf("Created required relationship: %s -> %s", model.Name, category.Name)
//             }
//         }
//
//         // Process sub-parts recursively if present
//         categoriesDataMap, ok := data.(map[string]interface{})
//         if !ok {
//             continue
//         }
//
//         subPartsData, hasSubParts := categoriesDataMap["sub_parts"].(map[string]interface{})
//         if hasSubParts {
//             for subCategoryName := range subPartsData {
//                 var subCategory models.PartCategory
//                 if err := DB.Where("name = ?", subCategoryName).First(&subCategory).Error; err != nil {
//                     log.Printf("Subcategory not found: %s", subCategoryName)
//                     continue
//                 }
//
//                 subRelationship := models.FirearmModelPartCategory{
//                     FirearmModelID: model.ID,
//                     PartCategoryID: subCategory.ID,
//                     IsRequired:     true,
//                 }
//
//                 DB.Model(&models.FirearmModelPartCategory{}).
//                     Where("firearm_model_id = ? AND part_category_id = ?", subRelationship.FirearmModelID, subRelationship.PartCategoryID).
//                     Count(&count)
//
//                 if count == 0 {
//                     if err := DB.Create(&subRelationship).Error; err != nil {
//                         log.Printf("Error creating relationship for model %s, subcategory %s: %v", model.Name, subCategory.Name, err)
//                     } else {
//                         log.Printf("Created required relationship: %s -> %s", model.Name, subCategory.Name)
//                     }
//                 }
//             }
//         }
//     }
//
//     // Extract optional parts from CompatibleParts JSONB
//     var compatiblePartsData map[string]interface{}
//     if err := json.Unmarshal([]byte(model.CompatibleParts.String()), &compatiblePartsData); err != nil {
//         log.Printf("Error unmarshaling CompatibleParts JSON for model %s: %v", model.Name, err)
//         return
//     }
//
//     // For each top-level category in CompatibleParts
//     for categoryName, data := range compatiblePartsData {
//         var category models.PartCategory
//         if err := DB.Where("name = ?", categoryName).First(&category).Error; err != nil {
//             log.Printf("Category not found: %s", categoryName)
//             continue
//         }
//
//         // Create relationship
//         relationship := models.FirearmModelPartCategory{
//             FirearmModelID: model.ID,
//             PartCategoryID: category.ID,
//             IsRequired:     false, // Parts from CompatibleParts are optional
//         }
//
//         // Check if relationship already exists
//         var count int64
//         DB.Model(&models.FirearmModelPartCategory{}).
//             Where("firearm_model_id = ? AND part_category_id = ?", relationship.FirearmModelID, relationship.PartCategoryID).
//             Count(&count)
//
//         if count == 0 {
//             if err := DB.Create(&relationship).Error; err != nil {
//                 log.Printf("Error creating relationship for model %s, category %s: %v", model.Name, category.Name, err)
//             } else {
//                 log.Printf("Created optional relationship: %s -> %s", model.Name, category.Name)
//             }
//         }
//
//         // Process subcategories
//         subCategoriesMap, ok := data.(map[string]interface{})
//         if !ok {
//             continue
//         }
//
//         for subCategoryName := range subCategoriesMap {
//             var subCategory models.PartCategory
//             if err := DB.Where("name = ?", subCategoryName).First(&subCategory).Error; err != nil {
//                 log.Printf("Subcategory not found: %s", subCategoryName)
//                 continue
//             }
//
//             subRelationship := models.FirearmModelPartCategory{
//                 FirearmModelID: model.ID,
//                 PartCategoryID: subCategory.ID,
//                 IsRequired:     false,
//             }
//
//             DB.Model(&models.FirearmModelPartCategory{}).
//                 Where("firearm_model_id = ? AND part_category_id = ?", subRelationship.FirearmModelID, subRelationship.PartCategoryID).
//                 Count(&count)
//
//             if count == 0 {
//                 if err := DB.Create(&subRelationship).Error; err != nil {
//                     log.Printf("Error creating relationship for model %s, subcategory %s: %v", model.Name, subCategory.Name, err)
//                 } else {
//                     log.Printf("Created optional relationship: %s -> %s", model.Name, subCategory.Name)
//                 }
//             }
//         }
//     }
// }
//
// // MigratePartCategory associates a part with a category based on its Category/Subcategory fields
// func MigratePartCategory(part models.Part) {
//     log.Printf("Migrating part %s (ID: %d) to category", part.Name, part.ID)
//
//     // If part already has a part_category_id, skip
//     if part.PartCategoryID != nil {
//         log.Printf("Part %s already has category ID %d", part.Name, *part.PartCategoryID)
//         return
//     }
//
//     // Look for a category matching the part's subcategory first (more specific)
//     if part.Subcategory != "" {
//         var category models.PartCategory
//         if err := DB.Where("name = ?", part.Subcategory).First(&category).Error; err == nil {
//             // Found a matching category for subcategory
//             part.PartCategoryID = &category.ID
//             if err := DB.Save(&part).Error; err != nil {
//                 log.Printf("Error associating part %s with subcategory %s: %v", part.Name, part.Subcategory, err)
//             } else {
//                 log.Printf("Associated part %s with subcategory %s", part.Name, part.Subcategory)
//             }
//             return
//         }
//     }
//
//     // If no subcategory match, try with the main category
//     if part.Category != "" {
//         var category models.PartCategory
//         if err := DB.Where("name = ?", part.Category).First(&category).Error; err == nil {
//             // Found a matching category
//             part.PartCategoryID = &category.ID
//             if err := DB.Save(&part).Error; err != nil {
//                 log.Printf("Error associating part %s with category %s: %v", part.Name, part.Category, err)
//             } else {
//                 log.Printf("Associated part %s with category %s", part.Name, part.Category)
//             }
//             return
//         }
//     }
//
//     log.Printf("No matching category found for part %s (category: %s, subcategory: %s)", part.Name, part.Category, part.Subcategory)
// }

// getDefaultCaliberForModel returns appropriate caliber based on the firearm model name
func getDefaultCaliberForModel(modelName string) string {
	// AR platform rifles typically come in 5.56 NATO
	if strings.Contains(modelName, "AR-15") || strings.Contains(modelName, "M4") ||
		strings.Contains(modelName, "M16") || strings.Contains(modelName, "SIG M400") {
		return "5.56x45mm NATO"
	}

	// AK platform rifles typically come in 7.62x39mm
	if strings.Contains(modelName, "AK-47") || strings.Contains(modelName, "AKM") {
		return "7.62x39mm"
	}

	// AK-74 variants use 5.45x39mm
	if strings.Contains(modelName, "AK-74") {
		return "5.45x39mm"
	}

	// Battle rifles and some hunting rifles
	if strings.Contains(modelName, "AR-10") || strings.Contains(modelName, "SR-25") {
		return "7.62x51mm NATO"
	}

	// Common pistol calibers
	if strings.Contains(modelName, "Glock") || strings.Contains(modelName, "SIG P320") ||
		strings.Contains(modelName, "M&P") || strings.Contains(modelName, "CZ P-10") {
		return "9x19mm Parabellum"
	}

	// 1911 style pistols typically come in .45 ACP
	if strings.Contains(modelName, "1911") || strings.Contains(modelName, "P220") {
		return ".45 ACP"
	}

	// Common revolver calibers
	if strings.Contains(modelName, "Model 686") || strings.Contains(modelName, "Python") {
		return ".357 Magnum"
	}

	// Shotguns are typically 12 gauge
	if strings.Contains(modelName, "Mossberg") || strings.Contains(modelName, "Remington") ||
		strings.Contains(modelName, "Benelli") || strings.Contains(modelName, "Beretta") {
		return "12 Gauge"
	}

	// Default for other models
	return "Multiple"
}

// SeedDatabase populates the database with initial mock data
func SeedDatabase() {
	log.Println("Starting database seeding...")

	// Initialize random seed for consistent results
	rand.Seed(time.Now().UnixNano())

	// 1. First seed Manufacturers (no foreign key dependencies)
	log.Println("Seeding manufacturers...")
	seedManufacturers()

	// 2. Next seed Sellers (no foreign key dependencies)
	log.Println("Seeding sellers...")
	seedSellers()

	// 3. Seed FirearmModels (depends on manufacturers)
	log.Println("Seeding firearm models...")
	seedFirearmModels()

	// 4. Seed Parts (depends on manufacturers)
	log.Println("Seeding parts...")
	seedParts()

	// 5. Seed PrebuiltFirearms (depends on firearm models)
	log.Println("Seeding prebuilt firearms...")
	seedPrebuiltFirearms()

	// 6. Seed ProductListings (depends on parts and sellers)
	log.Println("Seeding product listings...")
	seedProductListings()

	log.Println("Database seeding completed!")
}

// Seed manufacturers
func seedManufacturers() {
	for _, mfg := range ManufacturerData {
		manufacturer := models.Manufacturer{
			Name:        mfg.Name,
			Description: mfg.Description,
			Country:     mfg.Country,
			LogoURL:     mfg.LogoURL,
		}

		result := DB.Create(&manufacturer)
		if result.Error != nil {
			log.Printf("Error seeding manufacturer %s: %v", manufacturer.Name, result.Error)
		} else {
			log.Printf("Created manufacturer: %s", manufacturer.Name)
		}
	}
}

// Seed sellers
func seedSellers() {
	for _, seller := range SellerData {
		newSeller := models.Seller{
			Name:                  seller.Name,
			WebsiteURL:            seller.WebsiteURL,
			Description:           seller.Description,
			IsAffiliate:           seller.IsAffiliate,
			AffiliateLinkTemplate: seller.AffiliateLinkTemplate,
			LogoURL:               seller.LogoURL,
		}

		result := DB.Create(&newSeller)
		if result.Error != nil {
			log.Printf("Error seeding seller %s: %v", seller.Name, result.Error)
		} else {
			log.Printf("Created seller: %s", seller.Name)
		}
	}
}

// Seed firearm models
func seedFirearmModels() {
	log.Println("DEBUG: Starting seedFirearmModels()...")

	// Get manufacturers for reference
	var availableManufacturers []models.Manufacturer
	result := DB.Find(&availableManufacturers)
	if result.Error != nil {
		log.Printf("ERROR: Failed to find manufacturers: %v", result.Error)
		return
	}

	log.Printf("DEBUG: Found %d manufacturers", len(availableManufacturers))

	if len(availableManufacturers) == 0 {
		log.Println("ERROR: No manufacturers found. Cannot seed firearm models.")
		return
	}

	// Check if AR-15 already exists
	var existingModel models.FirearmModel
	if err := DB.Where("name = ?", "AR-15").First(&existingModel).Error; err == nil {
		log.Println("DEBUG: AR-15 model already exists, skipping seeding")
		return
	} else {
		log.Printf("DEBUG: AR-15 doesn't exist yet, proceeding with creation. Error was: %v", err)
	}

	// For AR-15, pick the first manufacturer (which should be Colt based on our seed data)
	manufacturer := availableManufacturers[0]
	log.Printf("DEBUG: Selected manufacturer: %s (ID: %d)", manufacturer.Name, manufacturer.ID)

	modelName := "AR-15"
	mainCategory := "Rifles"
	subCategory := "Assault"
	variant := "Standard" // Adding a variant to ensure it's not null

	// Create specifications object with caliber information
	specs := map[string]interface{}{
		"caliber": "5.56x45mm NATO",
		"weight":  "6.5 lbs",
	}
	specsJSON, _ := json.Marshal(specs)
	log.Printf("DEBUG: Created specifications JSON: %s", string(specsJSON))

	// Get hierarchical parts structure and compatible parts
	partsJSON := getPartsJSON(modelName)
	log.Printf("DEBUG: Created parts JSON length: %d bytes", len(partsJSON))

	compatiblePartsJSON := getCompatiblePartsJSON(modelName)
	log.Printf("DEBUG: Created compatible parts JSON length: %d bytes", len(compatiblePartsJSON))

	// Create image URLs
	images := []string{
		"https://example.com/images/firearms/AR-15.jpg",
	}
	imagesJSON, _ := json.Marshal(images)

	// Generate price range
	minPrice := 800
	maxPrice := 1500
	priceRange := fmt.Sprintf("$%d - $%d", minPrice, maxPrice)

	log.Println("DEBUG: Creating FirearmModel struct...")

	// Use a direct SQL query to insert the model, this allows us to set both 'parts' and 'required_parts'
	// fields to handle the case where the database schema has both columns
	query := `
	INSERT INTO firearm_models (
		name, description, manufacturer_id, category, subcategory, variant, 
		specifications, parts, compatible_parts, images, price_range, 
		required_parts, created_at, updated_at
	) VALUES (
		?, ?, ?, ?, ?, ?,
		?, ?, ?, ?, ?,
		?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
	) RETURNING id
	`

	var id int
	err := DB.Raw(query,
		modelName,
		"A high-quality semi-automatic modular rifle platform.",
		manufacturer.ID,
		mainCategory,
		subCategory,
		variant,
		datatypes.JSON(specsJSON),
		datatypes.JSON(partsJSON),
		datatypes.JSON(compatiblePartsJSON),
		datatypes.JSON(imagesJSON),
		priceRange,
		datatypes.JSON(partsJSON), // Use the same parts JSON for required_parts
	).Scan(&id).Error

	if err != nil {
		log.Printf("ERROR: Failed to seed firearm model %s: %v", modelName, err)
		return
	} else {
		log.Printf("SUCCESS: Created firearm model: %s with ID: %d", modelName, id)
	}

	log.Println("DEBUG: seedFirearmModels() completed")
}

// getPartsJSON generates a hierarchical parts structure for a given firearm model
func getPartsJSON(modelName string) []byte {
	var parts map[string]interface{}

	// AR-15 platform specific structure based on the new schema
	if strings.Contains(modelName, "AR-15") || strings.HasPrefix(modelName, "M4") || strings.HasPrefix(modelName, "M16") {
		parts = map[string]interface{}{
			"Upper Assembly": map[string]interface{}{
				"type": "required",
				"sub_parts": map[string]interface{}{
					"Bolt Carrier Group": map[string]interface{}{
						"type": "required",
						"sub_parts": map[string]interface{}{
							"Bolt":                     "required",
							"Bolt Carrier":             "required",
							"Firing Pin":               "required",
							"Firing Pin Retaining Pin": "required",
							"Cam Pin":                  "required",
							"Gas Key":                  "required",
							"Gas Key Screws":           "required",
							"Extractor":                "required",
							"Extractor Spring":         "required",
							"Extractor Pin":            "required",
							"Ejector":                  "required",
							"Ejector Spring":           "required",
							"Ejector Roll Pin":         "required",
							"Gas Rings":                "required",
						},
					},
					"Barrel": map[string]interface{}{
						"type": "required",
						"sub_parts": map[string]interface{}{
							"Barrel Extension": "required",
							"Barrel Nut":       "required",
							"Gas Block":        "required",
							"Gas Tube":         "required",
						},
					},
					"Handguard/Foregrip": map[string]interface{}{
						"type": "required",
						"sub_parts": map[string]interface{}{
							"Rail System": "required",
						},
					},
					"Upper Receiver": map[string]interface{}{
						"type": "required",
						"sub_parts": map[string]interface{}{
							"Stripped Upper Receiver": "required",
							"Forward Assist":          "required",
							"Forward Assist Spring":   "required",
							"Forward Assist Pin":      "required",
							"Dust Cover":              "required",
							"Dust Cover Spring":       "required",
							"Dust Cover Pin":          "required",
							"Charging Handle":         "required",
							"Charging Handle Latch":   "required",
						},
					},
					"Gas System": map[string]interface{}{
						"type": "required",
						"sub_parts": map[string]interface{}{
							"Gas Tube":  "required",
							"Gas Block": "required",
						},
					},
				},
			},
			"Lower Assembly": map[string]interface{}{
				"type": "required",
				"sub_parts": map[string]interface{}{
					"Lower Receiver": map[string]interface{}{
						"type": "required",
						"sub_parts": map[string]interface{}{
							"Stripped Lower Receiver": "required",
							"Receiver Extension":      "required",
							"Buffer Tube Castle Nut":  "required",
							"Buffer Tube End Plate":   "required",
						},
					},
					"Trigger Assembly": map[string]interface{}{
						"type": "required",
						"sub_parts": map[string]interface{}{
							"Trigger":                "required",
							"Trigger Spring":         "required",
							"Trigger Pin":            "required",
							"Hammer":                 "required",
							"Hammer Spring":          "required",
							"Hammer Pin":             "required",
							"Disconnector":           "required",
							"Disconnector Spring":    "required",
							"Trigger Guard":          "required",
							"Trigger Guard Roll Pin": "required",
						},
					},
					"Fire Control Group": map[string]interface{}{
						"type": "required",
						"sub_parts": map[string]interface{}{
							"Safety Selector":        "required",
							"Safety Selector Detent": "required",
							"Safety Selector Spring": "required",
						},
					},
					"Magazine Release": map[string]interface{}{
						"type": "required",
						"sub_parts": map[string]interface{}{
							"Magazine Catch":        "required",
							"Magazine Catch Spring": "required",
							"Magazine Catch Button": "required",
						},
					},
					"Bolt Catch": map[string]interface{}{
						"type": "required",
						"sub_parts": map[string]interface{}{
							"Bolt Catch":          "required",
							"Bolt Catch Spring":   "required",
							"Bolt Catch Roll Pin": "required",
							"Bolt Catch Plunger":  "required",
						},
					},
					"Buffer System": map[string]interface{}{
						"type": "required",
						"sub_parts": map[string]interface{}{
							"Buffer":                 "required",
							"Buffer Spring":          "required",
							"Buffer Retainer":        "required",
							"Buffer Retainer Spring": "required",
						},
					},
					"Grip": map[string]interface{}{
						"type": "required",
						"sub_parts": map[string]interface{}{
							"Grip":        "required",
							"Grip Screw":  "required",
							"Grip Washer": "required",
						},
					},
				},
			},
		}
	} else if strings.Contains(modelName, "AK-47") {
		// AK-47 platform specific structure
		parts = map[string]interface{}{
			"Receiver": map[string]interface{}{
				"type": "required",
				"sub_parts": map[string]interface{}{
					"Receiver Body": "required",
					"Trigger Guard": "required",
					"Trunnion":      "required",
				},
			},
			"Barrel Assembly": map[string]interface{}{
				"type": "required",
				"sub_parts": map[string]interface{}{
					"Barrel":      "required",
					"Front Sight": "required",
					"Gas Block":   "required",
				},
			},
			"Bolt Carrier Group": map[string]interface{}{
				"type": "required",
				"sub_parts": map[string]interface{}{
					"Bolt":       "required",
					"Carrier":    "required",
					"Firing Pin": "required",
					"Extractor":  "required",
				},
			},
			"Gas System": map[string]interface{}{
				"type": "required",
				"sub_parts": map[string]interface{}{
					"Piston":   "required",
					"Gas Tube": "required",
				},
			},
			"Furniture": map[string]interface{}{
				"type": "required",
				"sub_parts": map[string]interface{}{
					"Handguard": "required",
					"Grip":      "required",
					"Stock":     "required",
				},
			},
		}
	} else if strings.Contains(modelName, "Glock") {
		// Glock pistol platform specific structure
		parts = map[string]interface{}{
			"Frame Assembly": map[string]interface{}{
				"type": "required",
				"sub_parts": map[string]interface{}{
					"Frame":            "required",
					"Trigger Assembly": "required",
					"Magazine Catch":   "required",
					"Slide Lock":       "required",
				},
			},
			"Slide Assembly": map[string]interface{}{
				"type": "required",
				"sub_parts": map[string]interface{}{
					"Slide":         "required",
					"Barrel":        "required",
					"Recoil Spring": "required",
					"Extractor":     "required",
					"Firing Pin":    "required",
					"Sights":        "required",
				},
			},
		}
	} else {
		// Generic structure for other firearm types
		parts = map[string]interface{}{
			"Main Assembly": map[string]interface{}{
				"type": "required",
				"sub_parts": map[string]interface{}{
					"Receiver/Frame": "required",
					"Barrel":         "required",
					"Action":         "required",
				},
			},
			"Furniture": map[string]interface{}{
				"type": "required",
				"sub_parts": map[string]interface{}{
					"Stock/Grip": "required",
				},
			},
		}
	}

	jsonData, err := json.Marshal(parts)
	if err != nil {
		log.Printf("Error marshaling parts for %s: %v", modelName, err)
		return []byte("{}")
	}

	return jsonData
}

// Get compatible parts as JSON for the given firearm model
func getCompatiblePartsJSON(modelName string) []byte {
	var compatibleParts map[string]interface{}

	// AR-15 platform specific compatible parts
	if strings.Contains(modelName, "AR-15") || strings.HasPrefix(modelName, "M4") || strings.HasPrefix(modelName, "M16") {
		compatibleParts = map[string]interface{}{
			"Magazines and Feeding Devices": map[string]interface{}{
				"Detachable Box Magazine": "optional",
				"Drum Magazine":           "optional",
				"Extended Magazine":       "optional",
			},
			"Rails and Mounting Accessories": map[string]interface{}{
				"Rail Systems": map[string]interface{}{
					"Picatinny Rail Section": "optional",
					"M-LOK Rail Section":     "optional",
					"KeyMod Rail Section":    "optional",
				},
			},
			"Miscellaneous Accessories": map[string]interface{}{
				"Slings": map[string]interface{}{
					"Single-Point Sling": "optional",
					"Two-Point Sling":    "optional",
					"Three-Point Sling":  "optional",
				},
				"Bipods and Tripods": map[string]interface{}{
					"Folding Bipod":    "optional",
					"Adjustable Bipod": "optional",
					"Tripod Adapter":   "optional",
				},
			},
		}
	} else if strings.Contains(modelName, "AK-47") {
		// AK-47 platform specific compatible parts
		compatibleParts = map[string]interface{}{
			"Magazines": map[string]interface{}{
				"Standard Magazine":      "optional",
				"High-Capacity Magazine": "optional",
			},
			"Accessories": map[string]interface{}{
				"Optic Mounts":    "optional",
				"Muzzle Devices":  "optional",
				"Handguard Rails": "optional",
			},
		}
	} else if strings.Contains(modelName, "Glock") {
		// Glock pistol platform specific compatible parts
		compatibleParts = map[string]interface{}{
			"Magazines": map[string]interface{}{
				"Standard Magazine":   "optional",
				"Extended Magazine":   "optional",
				"Magazine Base Plate": "optional",
			},
			"Sighting Systems": map[string]interface{}{
				"Iron Sights":   "optional",
				"Red Dot Mount": "optional",
			},
			"Accessories": map[string]interface{}{
				"Grip Enhancements":   "optional",
				"Magazine Extensions": "optional",
			},
		}
	} else {
		// Generic compatible parts for other models
		compatibleParts = map[string]interface{}{
			"Accessories": map[string]interface{}{
				"Sights":         "optional",
				"Muzzle Devices": "optional",
				"Slings":         "optional",
				"Magazines":      "optional",
			},
		}
	}

	jsonData, err := json.Marshal(compatibleParts)
	if err != nil {
		log.Printf("Error marshaling compatible parts for %s: %v", modelName, err)
		return []byte("{}")
	}

	return jsonData
}

// Seed parts
func seedParts() {
	// Get manufacturers for reference
	var availableManufacturers []models.Manufacturer
	DB.Find(&availableManufacturers)

	if len(availableManufacturers) == 0 {
		log.Println("No manufacturers found. Cannot seed parts.")
		return
	}

	// Create parts for AR-15 only
	for mainCategory, subCategories := range AllParts {
		for subCategory, parts := range subCategories {
			for _, partName := range parts {
				// Select a random manufacturer
				manufacturer := availableManufacturers[rand.Intn(len(availableManufacturers))]

				// Create compatible models with the new format
				var compatibleModels []map[string]interface{}

				// Determine attachment point based on the category
				attachmentPoint := "General"
				if mainCategory == "Upper Assembly" {
					attachmentPoint = "Upper Receiver"
				} else if mainCategory == "Lower Assembly" {
					attachmentPoint = "Lower Receiver"
				}

				// All parts are compatible with AR-15
				compatibleModels = append(compatibleModels, map[string]interface{}{
					"model":            "AR-15",
					"attachment_point": attachmentPoint,
					"is_required":      false,
				})

				compatibleModelsJSON, _ := json.Marshal(compatibleModels)

				// Create sub-components based on part type
				var subComponents []map[string]string
				// Add some default sub-components for specific parts
				if strings.Contains(partName, "Charging Handle") {
					subComponents = append(subComponents,
						map[string]string{"name": "Charging Handle Latch", "type": "required"},
						map[string]string{"name": "Charging Handle Spring", "type": "required"},
					)
				} else if strings.Contains(partName, "BCG") {
					subComponents = append(subComponents,
						map[string]string{"name": "Bolt", "type": "required"},
						map[string]string{"name": "Carrier", "type": "required"},
						map[string]string{"name": "Firing Pin", "type": "required"},
					)
				} else if partName == "Complete Lower Receiver (AR-15)" {
					// Add all required sub-components for Complete Lower Receiver
					subComponents = append(subComponents,
						map[string]string{"name": "Stripped Lower Receiver (AR-15)", "type": "required"},
						map[string]string{"name": "Mil-Spec Trigger (AR-15)", "type": "required"},
						map[string]string{"name": "Standard Safety Selector (AR-15)", "type": "required"},
						map[string]string{"name": "Standard Magazine Release (AR-15)", "type": "required"},
						map[string]string{"name": "Standard Bolt Catch (AR-15)", "type": "required"},
						map[string]string{"name": "Standard A2 Grip (AR-15)", "type": "required"},
						map[string]string{"name": "M4 Collapsible Stock (AR-15)", "type": "required"},
					)
				}

				subComponentsJSON, _ := json.Marshal(subComponents)

				// Create requires fields - parts that this component depends on
				var requires []map[string]interface{}
				// Define requirements based on logical dependencies
				if strings.Contains(partName, "Bolt") || strings.Contains(partName, "Charging Handle") {
					requires = append(requires, map[string]interface{}{
						"part_id": 0, // We'll leave this as 0 since we don't have real IDs yet
						"name":    "Upper Receiver",
					})
				} else if strings.Contains(partName, "Barrel") {
					requires = append(requires, map[string]interface{}{
						"part_id": 0,
						"name":    "Upper Receiver",
					})
				} else if strings.Contains(partName, "Trigger") {
					requires = append(requires, map[string]interface{}{
						"part_id": 0,
						"name":    "Lower Receiver",
					})
				}

				requiresJSON, _ := json.Marshal(requires)

				// Create specifications
				specifications := map[string]interface{}{
					"subcategory": subCategory,
				}

				// Add specific specifications based on part type
				if strings.Contains(partName, "Barrel") {
					if strings.Contains(partName, "16\"") {
						specifications["length"] = "16 inches"
					} else if strings.Contains(partName, "14.5\"") {
						specifications["length"] = "14.5 inches"
					} else if strings.Contains(partName, "18\"") {
						specifications["length"] = "18 inches"
					} else if strings.Contains(partName, "20\"") {
						specifications["length"] = "20 inches"
					} else if strings.Contains(partName, "10.5\"") {
						specifications["length"] = "10.5 inches"
					}
					specifications["caliber"] = "5.56x45mm NATO"
					specifications["twist_rate"] = "1:7"
					specifications["material"] = "4150 Chrome Moly Steel"
				} else if strings.Contains(partName, "BCG") || strings.Contains(partName, "Bolt Carrier") {
					specifications["finish"] = "Nickel Boron"
					specifications["material"] = "8620 steel"
					specifications["bolt_material"] = "9310 steel"
				} else if strings.Contains(partName, "Buffer") {
					specifications["weight"] = "3.0 oz"
					specifications["material"] = "Aluminum/Steel"
				}

				specificationsJSON, _ := json.Marshal(specifications)

				// Generate images
				images := []string{
					fmt.Sprintf("https://example.com/images/parts/%s.jpg",
						strings.ReplaceAll(partName, " ", "-")),
				}
				imagesJSON, _ := json.Marshal(images)

				part := models.Part{
					Name:             partName,
					Description:      "A quality " + partName + " for your AR-15 build.",
					Category:         mainCategory,
					Subcategory:      subCategory,
					ManufacturerID:   manufacturer.ID,
					IsPrebuilt:       false,
					SubComponents:    datatypes.JSON(subComponentsJSON),
					CompatibleModels: datatypes.JSON(compatibleModelsJSON),
					Requires:         datatypes.JSON(requiresJSON),
					Specifications:   datatypes.JSON(specificationsJSON),
					Images:           datatypes.JSON(imagesJSON),
					Availability:     "in_stock",
					Price:            generatePrice(),
					Weight:           0.5 + rand.Float64(),
					Dimensions:       "5 x 3 x 2 in",
				}

				// Set Complete Lower Receiver (AR-15) as prebuilt
				if partName == "Complete Lower Receiver (AR-15)" {
					part.IsPrebuilt = true
					part.Price = generatePrice() * 1.5 // Prebuilt parts are more expensive
					part.Description = "A completely assembled lower receiver for your AR-15 build, ready to be paired with an upper receiver."
				}

				if result := DB.Create(&part); result.Error != nil {
					log.Printf("Error seeding part %s: %v", partName, result.Error)
				} else {
					log.Printf("Created part: %s", partName)
				}
			}
		}
	}

	// Now, seed prebuilt assemblies
	seedAssemblyParts(availableManufacturers)
}

// seedAssemblyParts creates prebuilt assembly parts with their sub-components
func seedAssemblyParts(availableManufacturers []models.Manufacturer) {
	// Use the assemblies defined in seed_data.go
	for _, assembly := range AssemblyParts {
		// Select a random manufacturer
		manufacturer := availableManufacturers[rand.Intn(len(availableManufacturers))]

		// Convert the sub-components list to the new format
		var subComponents []map[string]string
		for _, componentName := range assembly.SubComponents {
			subComponents = append(subComponents, map[string]string{
				"name": componentName,
				"type": "required",
			})
		}

		subComponentsJSON, _ := json.Marshal(subComponents)

		// Create compatible models with the new format
		var compatibleModels []map[string]interface{}

		// Determine attachment point based on the category
		attachmentPoint := "General"
		if assembly.Category == "Upper Assembly" {
			attachmentPoint = "Upper Receiver"
		} else if assembly.Category == "Lower Assembly" {
			attachmentPoint = "Lower Receiver"
		}

		// All assembly parts are compatible with AR-15
		compatibleModels = append(compatibleModels, map[string]interface{}{
			"model":            "AR-15",
			"attachment_point": attachmentPoint,
			"is_required":      true,
		})

		compatibleModelsJSON, _ := json.Marshal(compatibleModels)

		// Create requirements for this assembly
		var requires []map[string]interface{}
		if assembly.Category == "Upper Assembly" {
			requires = append(requires, map[string]interface{}{
				"part_id": 0, // We'll leave this as 0 since we don't have real IDs yet
				"name":    "Lower Assembly",
			})
		} else if assembly.Category == "Lower Assembly" {
			requires = append(requires, map[string]interface{}{
				"part_id": 0,
				"name":    "Upper Assembly",
			})
		}

		requiresJSON, _ := json.Marshal(requires)

		// Create specifications based on the assembly type
		specifications := map[string]interface{}{
			"subcategory": assembly.Subcategory,
		}

		if strings.Contains(assembly.Name, "Upper") {
			specifications["finish"] = "Anodized"
			specifications["material"] = "7075-T6 Aluminum"
			if strings.Contains(assembly.Name, "16\"") {
				specifications["barrel_length"] = "16 inches"
			}
		} else if strings.Contains(assembly.Name, "Lower") {
			specifications["finish"] = "Anodized"
			specifications["material"] = "7075-T6 Aluminum"
			specifications["trigger_type"] = "Mil-Spec Single Stage"
		} else if strings.Contains(assembly.Name, "BCG") {
			specifications["finish"] = "Nickel Boron"
			specifications["material"] = "Carpenter 158 Steel"
		}

		specificationsJSON, _ := json.Marshal(specifications)

		// Create images for the assembly
		images := []string{
			fmt.Sprintf("https://example.com/images/parts/%s.jpg",
				strings.ReplaceAll(assembly.Name, " ", "-")),
		}
		imagesJSON, _ := json.Marshal(images)

		part := models.Part{
			Name:             assembly.Name,
			Description:      "A complete " + assembly.Name + " with all necessary components.",
			Category:         assembly.Category,
			Subcategory:      assembly.Subcategory,
			ManufacturerID:   manufacturer.ID,
			IsPrebuilt:       true,
			SubComponents:    datatypes.JSON(subComponentsJSON),
			CompatibleModels: datatypes.JSON(compatibleModelsJSON),
			Requires:         datatypes.JSON(requiresJSON),
			Specifications:   datatypes.JSON(specificationsJSON),
			Images:           datatypes.JSON(imagesJSON),
			Availability:     generateAvailability(),
			Price:            generatePrice() * 1.5, // Prebuilt assemblies are more expensive
			Weight:           1.5 + rand.Float64(),
			Dimensions:       "10 x 8 x 4 in",
		}

		if result := DB.Create(&part); result.Error != nil {
			log.Printf("Error seeding assembly part %s: %v", assembly.Name, result.Error)
		} else {
			log.Printf("Created assembly part: %s", assembly.Name)
		}
	}
}

// Seed product listings
func seedProductListings() {
	var parts []models.Part
	DB.Find(&parts)

	var sellers []models.Seller
	DB.Find(&sellers)

	var prebuilts []models.PrebuiltFirearm
	DB.Find(&prebuilts)

	if len(parts) == 0 || len(sellers) == 0 {
		log.Println("No parts or sellers found. Cannot seed product listings.")
		return
	}

	// Create listings for parts
	for _, part := range parts {
		// Create listings for 1-3 random sellers for each part
		numSellers := 1 + rand.Intn(3)
		selectedSellers := getRandomSellers(sellers, numSellers)

		for _, seller := range selectedSellers {
			shippingInfo := map[string]interface{}{
				"free_shipping": rand.Float64() > 0.5,
				"shipping_cost": 5.99 + rand.Float64()*15,
				"handling_time": "1-3 business days",
			}
			shippingInfoJSON, _ := json.Marshal(shippingInfo)

			listing := models.ProductListing{
				SellerID:     seller.ID,
				PartID:       &part.ID,
				URL:          generateProductURL(seller.WebsiteURL, part.Name),
				SKU:          generateSKU(seller.Name, part.Name),
				Price:        generatePrice(),
				Currency:     "USD",
				Availability: generateAvailability(),
				ShippingInfo: datatypes.JSON(shippingInfoJSON),
				LastChecked:  time.Now(),
			}

			if result := DB.Create(&listing); result.Error != nil {
				log.Printf("Error seeding product listing for part %s with seller %s: %v", part.Name, seller.Name, result.Error)
			} else {
				log.Printf("Created product listing: %s at %s", part.Name, seller.Name)
			}
		}
	}

	// Create listings for prebuilt firearms
	if len(prebuilts) > 0 {
		for _, prebuilt := range prebuilts {
			// Create listings for 1-3 random sellers for each prebuilt
			numSellers := 1 + rand.Intn(3)
			selectedSellers := getRandomSellers(sellers, numSellers)

			for _, seller := range selectedSellers {
				// Randomize price slightly for each seller
				prebuiltPrice := prebuilt.Price * (0.9 + rand.Float64()*0.2) // ±10% variation

				// Create shipping info
				shippingInfo := map[string]interface{}{
					"free_shipping": rand.Float64() > 0.7, // More likely to have free shipping for prebuilts
					"shipping_cost": 9.99 + rand.Float64()*20,
					"handling_time": "3-5 business days", // Longer handling time for prebuilts
				}
				shippingInfoJSON, _ := json.Marshal(shippingInfo)

				// Create additional info
				additionalInfo := map[string]interface{}{
					"condition":    "new",
					"warranty":     "1 year manufacturer warranty",
					"made_in_usa":  rand.Float64() > 0.3,
					"special_note": fmt.Sprintf("Official %s configuration", prebuilt.Name),
				}
				additionalInfoJSON, _ := json.Marshal(additionalInfo)

				listing := models.ProductListing{
					SellerID:       seller.ID,
					PrebuiltID:     &prebuilt.ID,
					URL:            generateProductURL(seller.WebsiteURL, prebuilt.Name),
					SKU:            generateSKU(seller.Name, prebuilt.Name),
					Price:          prebuiltPrice,
					Currency:       "USD",
					Availability:   generatePrebuiltAvailability(),
					ShippingInfo:   datatypes.JSON(shippingInfoJSON),
					AdditionalInfo: datatypes.JSON(additionalInfoJSON),
					LastChecked:    time.Now(),
				}

				if result := DB.Create(&listing); result.Error != nil {
					log.Printf("Error seeding product listing for prebuilt %s with seller %s: %v", prebuilt.Name, seller.Name, result.Error)
				} else {
					log.Printf("Created product listing: Prebuilt %s at %s", prebuilt.Name, seller.Name)
				}
			}
		}
	} else {
		log.Println("No prebuilt firearms found. Skipping prebuilt listings.")
	}
}

// Helper function for prebuilt availability (weighted differently than parts)
func generatePrebuiltAvailability() string {
	availabilityOptions := []string{"in_stock", "limited_stock", "pre_order", "back_order"}
	weights := []int{50, 30, 10, 10} // Different weights for prebuilts

	// Generate a random number
	total := 0
	for _, w := range weights {
		total += w
	}

	r := rand.Intn(total)

	cumulative := 0
	for i, w := range weights {
		cumulative += w
		if r < cumulative {
			return availabilityOptions[i]
		}
	}

	return "in_stock" // Default
}

// Helper functions

// getCompatibleFirearms returns a list of compatible firearms for the given part
func getCompatibleFirearms(category, subCategory, partName string) []string {
	// Logic to determine which firearms are compatible with this part
	// This is a simplified version - in reality, this would be more complex
	switch category {
	case "Upper Assembly":
		return []string{"AR-15", "M4", "M16"}
	case "Lower Assembly":
		return []string{"AR-15", "M4", "M16"}
	case "Furniture":
		if strings.Contains(partName, "AR") || strings.Contains(partName, "M4") {
			return []string{"AR-15", "M4", "M16"}
		}
		return []string{"Universal"}
	default:
		return []string{"Universal"}
	}
}

// getRandomSellers returns a random subset of sellers
func getRandomSellers(sellers []models.Seller, count int) []models.Seller {
	if count > len(sellers) {
		count = len(sellers)
	}

	// Create a copy of the sellers slice
	shuffled := make([]models.Seller, len(sellers))
	copy(shuffled, sellers)

	// Fisher-Yates shuffle
	for i := len(shuffled) - 1; i > 0; i-- {
		j := rand.Intn(i + 1)
		shuffled[i], shuffled[j] = shuffled[j], shuffled[i]
	}

	return shuffled[:count]
}

// Helper function for product listings
func generateProductURL(baseURL, partName string) string {
	// Generate a URL-friendly version of the part name
	partSlug := strings.ReplaceAll(partName, " ", "-")
	partSlug = strings.ReplaceAll(partSlug, "(", "")
	partSlug = strings.ReplaceAll(partSlug, ")", "")
	partSlug = strings.ToLower(partSlug)

	return fmt.Sprintf("%s/product/%s", baseURL, partSlug)
}

// Generate a SKU for a product
func generateSKU(sellerName, partName string) string {
	// Use the first 3 characters of the seller name
	sellerPrefix := ""
	if len(sellerName) >= 3 {
		sellerPrefix = strings.ToUpper(sellerName[0:3])
	} else {
		sellerPrefix = strings.ToUpper(sellerName)
	}

	// Use a hash of the part name to generate a unique number
	h := fnv.New32a()
	h.Write([]byte(partName))
	hash := h.Sum32() % 10000 // Keep it to 4 digits

	return fmt.Sprintf("%s-%04d", sellerPrefix, hash)
}

// generatePrice generates a random price for a part
func generatePrice() float64 {
	// Generate random price between $20 and $2000
	return 20.0 + float64(rand.Intn(198000))/100.0
}

// generateAvailability generates a random availability status for a product
func generateAvailability() string {
	options := []string{"in_stock", "in_stock", "in_stock", "low_stock", "out_of_stock"}
	return options[rand.Intn(len(options))]
}

// seedPrebuiltFirearms creates prebuilt firearm configurations
func seedPrebuiltFirearms() {
	// Get the AR-15 firearm model
	var arModel models.FirearmModel
	DB.Where("name = ?", "AR-15").First(&arModel)

	if arModel.ID == 0 {
		log.Println("AR-15 model not found. Cannot seed prebuilt firearms.")
		return
	}

	// Create one prebuilt configuration for the AR-15
	prebuiltName := "Colt M4A1 Carbine"
	description := "A premium pre-built AR-15 configuration featuring a 14.5-inch barrel and high-quality components."

	// Create specifications
	specs := map[string]interface{}{
		"caliber":       "5.56x45mm NATO",
		"weight":        "6.36 lbs",
		"barrel_length": "14.5 inches",
		"finish":        "Matte Black",
		"twist_rate":    "1:7",
	}
	specsJSON, _ := json.Marshal(specs)

	// Parse the base parts structure
	var basePartsStructure map[string]interface{}
	json.Unmarshal([]byte(arModel.Parts), &basePartsStructure)

	// Transform the structure to include IDs
	prebuiltParts := addPartIDsToStructure(basePartsStructure)
	partsJSON, _ := json.Marshal(prebuiltParts)

	// Parse compatible parts
	var compatiblePartsStructure map[string]interface{}
	json.Unmarshal([]byte(arModel.CompatibleParts), &compatiblePartsStructure)

	// Add IDs to compatible parts
	prebuiltCompatibleParts := addCompatiblePartIDsToStructure(compatiblePartsStructure)
	compatiblePartsJSON, _ := json.Marshal(prebuiltCompatibleParts)

	// Generate price
	price := 1299.99

	// Create images
	images := []string{
		"https://example.com/images/firearms/AR-15_prebuilt.jpg",
	}
	imagesJSON, _ := json.Marshal(images)

	// Create the prebuilt model using raw SQL to set both components and parts columns
	query := `
		INSERT INTO prebuilt_firearms 
		(firearm_model_id, name, description, specifications, components, parts, compatible_parts, price, images, availability, created_at, updated_at) 
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	`

	result := DB.Exec(
		query,
		arModel.ID,
		prebuiltName,
		description,
		specsJSON,
		partsJSON, // Set components column
		partsJSON, // Set parts column with the same value
		compatiblePartsJSON,
		price,
		imagesJSON,
		"in_stock",
	)

	if result.Error != nil {
		log.Printf("Error seeding prebuilt firearm %s: %v", prebuiltName, result.Error)
	} else {
		log.Printf("Created prebuilt firearm: %s", prebuiltName)
	}
}

// Helper function to generate prebuilt name suffixes
func getPrebuiltSuffix(index int) string {
	suffixes := []string{
		"Tactical", "Premium", "Elite", "Professional", "Custom",
		"Competition", "Defender", "Hunter", "Operator", "Classic",
	}

	return suffixes[index%len(suffixes)]
}

// Helper function to add random IDs to parts in the hierarchical structure
func addPartIDsToStructure(structure map[string]interface{}) map[string]interface{} {
	result := make(map[string]interface{})

	for key, value := range structure {
		if valueMap, ok := value.(map[string]interface{}); ok {
			// This is a map (like Upper Assembly or Lower Assembly)
			newMap := make(map[string]interface{})

			// Add an ID for this assembly
			assemblyID := rand.Intn(1000) + 1
			newMap["id"] = assemblyID

			// If it has a type, preserve it
			if partType, hasType := valueMap["type"]; hasType {
				newMap["type"] = partType
			}

			// Process sub_parts if they exist
			if subParts, hasSubParts := valueMap["sub_parts"]; hasSubParts {
				if subPartsMap, isMap := subParts.(map[string]interface{}); isMap {
					// Process the sub_parts recursively if they are maps
					newMap["sub_parts"] = addPartIDsToStructure(subPartsMap)
				} else {
					// Otherwise just preserve the sub_parts
					newMap["sub_parts"] = subParts
				}
			}

			result[key] = newMap
		} else {
			// Just a simple value, preserve it
			result[key] = value
		}
	}

	return result
}

// Helper function to add IDs to compatible parts
func addCompatiblePartIDsToStructure(structure map[string]interface{}) map[string]interface{} {
	result := make(map[string]interface{})

	for key, value := range structure {
		if valueMap, ok := value.(map[string]interface{}); ok {
			// This is a map of accessory categories
			newMap := make(map[string]interface{})

			for subKey, subValue := range valueMap {
				// For each item, add an ID about 50% of the time
				if rand.Float64() < 0.5 {
					newMap[subKey] = map[string]interface{}{
						"id": rand.Intn(1000) + 1,
					}
				} else {
					// Otherwise just preserve the value
					newMap[subKey] = subValue
				}
			}

			result[key] = newMap
		} else {
			// Just a simple value, preserve it
			result[key] = value
		}
	}

	return result
}

// Helper function to get random availability status
func getRandomAvailability() string {
	availabilityOptions := []string{"in_stock", "limited_stock", "pre_order", "back_order"}
	weights := []int{70, 15, 10, 5} // Weighted probabilities

	// Generate a random number
	total := 0
	for _, w := range weights {
		total += w
	}

	r := rand.Intn(total)

	cumulative := 0
	for i, w := range weights {
		cumulative += w
		if r < cumulative {
			return availabilityOptions[i]
		}
	}

	return "in_stock" // Default
}
