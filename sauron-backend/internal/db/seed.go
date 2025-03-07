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

// Helper function to create pointer to int
func intPtr(i int) *int {
	return &i
}

// SeedCategoriesAndRelationships creates part categories in the database
func SeedCategoriesAndRelationships() {
	log.Println("Seeding part categories...")

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

	log.Println("Part category seeding completed")
}

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

	// Create a FirearmModel instance using the new schema
	firearmModel := models.FirearmModel{
		Name:           modelName,
		Description:    "A high-quality semi-automatic modular rifle platform.",
		ManufacturerID: manufacturer.ID,
		Category:       mainCategory,
		Subcategory:    subCategory,
		Variant:        variant,
		Specifications: datatypes.JSON(specsJSON),
		Images:         datatypes.JSON(imagesJSON),
		PriceRange:     priceRange,
	}

	// Save the model to get an ID
	err := DB.Create(&firearmModel).Error
	if err != nil {
		log.Printf("ERROR: Failed to seed firearm model %s: %v", modelName, err)
		return
	}

	log.Printf("SUCCESS: Created firearm model: %s with ID: %d", modelName, firearmModel.ID)

	// Now we need to create the part category relationships using the new schema
	// Instead of using the parts JSON directly, we'll create relationships with part categories

	// Get the part categories we want to associate with this model
	var partCategories []models.PartCategory
	err = DB.Find(&partCategories).Error
	if err != nil {
		log.Printf("ERROR: Failed to fetch part categories: %v", err)
		return
	}

	// Create relationships for top-level categories that should be associated with AR-15
	topLevelCategories := []string{"Lower Assembly", "Upper Assembly", "Magazines and Feeding Devices", "Rails and Mounting Accessories", "Miscellaneous Accessories"}

	for _, categoryName := range topLevelCategories {
		var category models.PartCategory
		if err := DB.Where("name = ?", categoryName).First(&category).Error; err != nil {
			log.Printf("WARNING: Could not find category: %s", categoryName)
			continue
		}

		// Create the relationship with isRequired flag
		isRequired := (categoryName == "Lower Assembly" || categoryName == "Upper Assembly")

		relationship := models.FirearmModelPartCategory{
			FirearmModelID: firearmModel.ID,
			PartCategoryID: category.ID,
			IsRequired:     isRequired,
		}

		if err := DB.Create(&relationship).Error; err != nil {
			log.Printf("ERROR: Failed to create relationship for category %s: %v", categoryName, err)
		} else {
			log.Printf("SUCCESS: Associated model %s with category %s (required: %v)", modelName, categoryName, isRequired)
		}

		// If this is a top-level category that should have child categories associated too
		if categoryName == "Lower Assembly" || categoryName == "Upper Assembly" {
			// Find child categories
			var childCategories []models.PartCategory
			if err := DB.Where("parent_category_id = ?", category.ID).Find(&childCategories).Error; err != nil {
				log.Printf("ERROR: Failed to fetch child categories for %s: %v", categoryName, err)
				continue
			}

			// Associate all child categories
			for _, childCategory := range childCategories {
				childRelationship := models.FirearmModelPartCategory{
					FirearmModelID: firearmModel.ID,
					PartCategoryID: childCategory.ID,
					IsRequired:     true, // Child categories are typically required
				}

				if err := DB.Create(&childRelationship).Error; err != nil {
					log.Printf("ERROR: Failed to create relationship for child category %s: %v", childCategory.Name, err)
				} else {
					log.Printf("SUCCESS: Associated model %s with child category %s", modelName, childCategory.Name)
				}
			}
		}
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

	// Get part categories
	var partCategories []models.PartCategory
	DB.Find(&partCategories)

	if len(partCategories) == 0 {
		log.Println("No part categories found. Seeding part categories first.")
		SeedCategoriesAndRelationships()
		DB.Find(&partCategories)
	}

	// Create a map of category names to their IDs for easy lookup
	categoryMap := make(map[string]int)
	for _, category := range partCategories {
		categoryMap[category.Name] = category.ID
	}

	// Create parts for AR-15 only
	for mainCategory, subCategories := range AllParts {
		for subCategory, parts := range subCategories {
			for _, partName := range parts {
				// Select a random manufacturer
				manufacturer := availableManufacturers[rand.Intn(len(availableManufacturers))]

				// Look up the part category ID
				var partCategoryID *int

				// Try to find a category matching the subcategory first (more specific)
				if categoryID, ok := categoryMap[subCategory]; ok {
					partCategoryID = &categoryID
				} else if categoryID, ok := categoryMap[mainCategory]; ok {
					// Fall back to main category
					partCategoryID = &categoryID
				} else {
					// If no match, log warning and continue
					log.Printf("Warning: No category found for %s / %s. Creating part without category.", mainCategory, subCategory)
				}

				// Generate images
				images := []string{
					fmt.Sprintf("https://example.com/images/parts/%s.jpg",
						strings.ReplaceAll(partName, " ", "-")),
				}
				imagesJSON, _ := json.Marshal(images)

				part := models.Part{
					Name:           partName,
					Description:    "A quality " + partName + " for your AR-15 build.",
					ManufacturerID: manufacturer.ID,
					PartCategoryID: partCategoryID,
					IsPrebuilt:     false,
					Images:         datatypes.JSON(imagesJSON),
					Weight:         0.5 + rand.Float64(),
					Dimensions:     "5 x 3 x 2 in",
				}

				// Set Complete Lower Receiver (AR-15) as prebuilt
				if partName == "Complete Lower Receiver (AR-15)" {
					part.IsPrebuilt = true
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
	log.Println("Seeding assembly parts...")

	// Get part categories
	var partCategories []models.PartCategory
	DB.Find(&partCategories)

	// Create a map of category names to their IDs for easy lookup
	categoryMap := make(map[string]int)
	for _, category := range partCategories {
		categoryMap[category.Name] = category.ID
	}

	// Sample prebuilt assemblies data
	assemblies := []struct {
		Name        string
		Category    string
		Subcategory string
	}{
		{
			Name:        "Complete Upper Assembly (AR-15)",
			Category:    "Upper Assembly",
			Subcategory: "Complete Upper Assembly",
		},
		{
			Name:        "Complete Lower Assembly (AR-15)",
			Category:    "Lower Assembly",
			Subcategory: "Complete Lower Assembly",
		},
		{
			Name:        "Premium Bolt Carrier Group (AR-15)",
			Category:    "Upper Assembly",
			Subcategory: "Bolt Carrier Group",
		},
	}

	for _, assembly := range assemblies {
		// Select a random manufacturer
		manufacturer := availableManufacturers[rand.Intn(len(availableManufacturers))]

		// Generate images
		images := []string{
			fmt.Sprintf("https://example.com/images/parts/%s.jpg",
				strings.ReplaceAll(assembly.Name, " ", "-")),
		}
		imagesJSON, _ := json.Marshal(images)

		// Look up the part category ID
		var partCategoryID *int

		// Try to find a category matching the subcategory first (more specific)
		if categoryID, ok := categoryMap[assembly.Subcategory]; ok {
			partCategoryID = &categoryID
		} else if categoryID, ok := categoryMap[assembly.Category]; ok {
			// Fall back to main category
			partCategoryID = &categoryID
		}

		part := models.Part{
			Name:           assembly.Name,
			Description:    "A complete " + assembly.Name + " with all necessary components.",
			ManufacturerID: manufacturer.ID,
			PartCategoryID: partCategoryID,
			IsPrebuilt:     true,
			Images:         datatypes.JSON(imagesJSON),
			Weight:         1.5 + rand.Float64(),
			Dimensions:     "10 x 8 x 4 in",
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
	log.Println("Seeding prebuilt firearms...")

	// Get AR-15 model
	var arModel models.FirearmModel
	if err := DB.Where("name LIKE ?", "%AR-15%").First(&arModel).Error; err != nil {
		log.Printf("Could not find AR-15 model, seeding prebuilt firearms failed: %v", err)
		return
	}

	// Create a basic prebuilt AR-15
	prebuiltName := "Standard AR-15 Rifle" + getPrebuiltSuffix(1)
	description := "A complete AR-15 rifle with all mil-spec components. Ready to fire out of the box."

	// Create specs
	specs := map[string]interface{}{
		"caliber":       "5.56x45mm NATO",
		"weight":        "6.36 lbs",
		"barrel_length": "14.5 inches",
		"finish":        "Matte Black",
		"twist_rate":    "1:7",
	}
	specsJSON, _ := json.Marshal(specs)

	// Create a placeholder for parts structure
	// (we'll use the category relationships instead of hardcoded JSON)
	placeholderPartsStructure := map[string]interface{}{
		"Upper Assembly": map[string]interface{}{
			"type": "required",
			"sub_parts": map[string]interface{}{
				"Bolt Carrier Group": map[string]interface{}{
					"type": "required",
				},
			},
		},
		"Lower Assembly": map[string]interface{}{
			"type": "required",
			"sub_parts": map[string]interface{}{
				"Lower Parts Kit": map[string]interface{}{
					"type": "required",
				},
			},
		},
	}

	partsJSON, _ := json.Marshal(placeholderPartsStructure)

	// Create placeholder for compatible parts
	placeholderCompatibleParts := map[string]interface{}{
		"Magazines": map[string]interface{}{
			"type": "optional",
		},
		"Sights": map[string]interface{}{
			"type": "optional",
		},
	}
	compatiblePartsJSON, _ := json.Marshal(placeholderCompatibleParts)

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
