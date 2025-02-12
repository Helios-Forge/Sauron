package db

import (
	"encoding/json"
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
		Name:        "Brownells",
		Website:     "https://www.brownells.com",
		ApiEndpoint: "https://api.brownells.com/v1",
		Status:      "active",
	},
	{
		Name:        "Midway USA",
		Website:     "https://www.midwayusa.com",
		ApiEndpoint: "https://api.midwayusa.com/v1",
		Status:      "active",
	},
	{
		Name:        "Primary Arms",
		Website:     "https://www.primaryarms.com",
		ApiEndpoint: "https://api.primaryarms.com/v1",
		Status:      "active",
	},
	{
		Name:        "Palmetto State Armory",
		Website:     "https://palmettostatearmory.com",
		ApiEndpoint: "https://api.palmettostatearmory.com/v1",
		Status:      "active",
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
var partCategories = map[string][]string{
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

// SeedDatabase populates the database with initial mock data
func SeedDatabase() {
	log.Println("Starting database seeding...")

	// Seed Sellers
	log.Println("Seeding sellers...")
	for _, seller := range sellers {
		if err := DB.Create(&seller).Error; err != nil {
			log.Printf("Error seeding seller %s: %v", seller.Name, err)
		}
	}

	// Add additional sellers
	for _, sellerName := range additionalSellers {
		seller := models.Seller{
			Name:    sellerName,
			Website: "https://www." + strings.ToLower(strings.ReplaceAll(sellerName, " ", "")) + ".com",
			Status:  "active",
		}
		if err := DB.Create(&seller).Error; err != nil {
			log.Printf("Error seeding seller %s: %v", sellerName, err)
		}
	}

	// Seed Firearm Models
	log.Println("Seeding firearm models...")
	for category, modelNames := range allFirearmModels {
		for _, modelName := range modelNames {
			// Get compatibility template if it exists, otherwise use default
			var requiredParts, compatibleParts []string
			if template, exists := compatibilityTemplates[modelName]; exists {
				requiredParts = template["required_parts"]
				compatibleParts = template["compatible_calibers"]
			} else {
				requiredParts = []string{"Basic Parts"}        // Default required parts
				compatibleParts = []string{"Standard Caliber"} // Default compatibility
			}

			requiredPartsJSON, _ := json.Marshal(requiredParts)
			compatiblePartsJSON, _ := json.Marshal(compatibleParts)

			model := models.FirearmModel{
				Name:            modelName,
				Category:        category,
				RequiredParts:   datatypes.JSON(requiredPartsJSON),
				CompatibleParts: datatypes.JSON(compatiblePartsJSON),
			}

			if err := DB.Create(&model).Error; err != nil {
				log.Printf("Error seeding firearm model %s: %v", modelName, err)
			}
		}
	}

	// Seed Parts
	log.Println("Seeding parts...")
	for mainCategory, subCategories := range allParts {
		for subCategory, parts := range subCategories {
			for _, partName := range parts {
				compatibility := map[string]interface{}{
					"firearm_models": getCompatibleFirearms(mainCategory, subCategory, partName),
					"subcategory":    subCategory,
				}
				compatibilityJSON, _ := json.Marshal(compatibility)

				part := models.Part{
					Name:          partName,
					Category:      mainCategory,
					Subcategory:   subCategory,
					IsPrebuilt:    false,
					Compatibility: datatypes.JSON(compatibilityJSON),
				}

				if err := DB.Create(&part).Error; err != nil {
					log.Printf("Error seeding part %s: %v", partName, err)
				}
			}
		}
	}

	// Seed Product Listings
	log.Println("Seeding product listings...")
	var parts []models.Part
	DB.Find(&parts)

	var sellers []models.Seller
	DB.Find(&sellers)

	for _, part := range parts {
		// Create listings for 3-5 random sellers for each part
		numSellers := 3 + rand.Intn(3)
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
				URL:          generateProductURL(seller.Website, part.Name),
				SKU:          generateSKU(seller.Name, part.Name),
				Price:        generatePrice(),
				Currency:     "USD",
				Availability: generateAvailability(),
				ShippingInfo: datatypes.JSON(shippingInfoJSON),
				LastChecked:  time.Now(),
			}

			if err := DB.Create(&listing).Error; err != nil {
				log.Printf("Error seeding product listing for part %s: %v", part.Name, err)
			}
		}
	}

	log.Println("Database seeding completed!")
}

// Helper functions
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

func generateProductURL(baseURL, partName string) string {
	slug := strings.ToLower(strings.ReplaceAll(partName, " ", "-"))
	return baseURL + "/products/" + slug
}

func generateAvailability() string {
	options := []string{"in_stock", "in_stock", "in_stock", "low_stock", "out_of_stock"}
	return options[rand.Intn(len(options))]
}

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

func generateSKU(sellerName, partName string) string {
	return sellerName[:3] + "-" + partName[:3] + "-" + time.Now().Format("060102")
}

func generatePrice() float64 {
	// Generate random price between $20 and $2000
	return 20.0 + float64(time.Now().UnixNano()%198000)/100.0
}
