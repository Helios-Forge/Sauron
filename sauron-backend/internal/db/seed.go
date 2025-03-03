package db

import (
	"encoding/json"
	"fmt"
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
			Name:        sellerName,
			WebsiteURL:  "https://www." + strings.ToLower(strings.ReplaceAll(sellerName, " ", "")) + ".com",
			Description: "Retailer of firearm parts and accessories.",
			IsAffiliate: false,
			LogoURL:     "https://example.com/" + strings.ToLower(strings.ReplaceAll(sellerName, " ", "_")) + "_logo.png",
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
			var requiredParts, compatibleParts map[string]bool
			if template, exists := compatibilityTemplates[modelName]; exists {
				// Convert array to object with boolean values
				requiredParts = make(map[string]bool)
				for _, part := range template["required_parts"] {
					requiredParts[part] = true
				}

				// Convert array to object with boolean values
				compatibleParts = make(map[string]bool)
				for _, part := range template["compatible_calibers"] {
					compatibleParts[part] = true
				}
			} else {
				requiredParts = map[string]bool{"Basic Parts": true}      // Default required parts
				compatibleParts = map[string]bool{"Standard Parts": true} // Default compatibility
			}

			requiredPartsJSON, _ := json.Marshal(requiredParts)
			compatiblePartsJSON, _ := json.Marshal(compatibleParts)

			// Create specifications
			specifications := map[string]interface{}{
				"caliber": "Multiple",
				"weight":  "Varies by configuration",
			}
			specificationsJSON, _ := json.Marshal(specifications)

			// Create image URLs
			images := []string{
				"https://example.com/" + strings.ToLower(strings.ReplaceAll(modelName, " ", "_")) + "_1.jpg",
				"https://example.com/" + strings.ToLower(strings.ReplaceAll(modelName, " ", "_")) + "_2.jpg",
			}
			imagesJSON, _ := json.Marshal(images)

			model := models.FirearmModel{
				Name:            modelName,
				Description:     "A popular " + category + " firearm platform.",
				Category:        category,
				Subcategory:     "Standard",
				Variant:         "Standard",
				RequiredParts:   datatypes.JSON(requiredPartsJSON),
				CompatibleParts: datatypes.JSON(compatiblePartsJSON),
				Specifications:  datatypes.JSON(specificationsJSON),
				Images:          datatypes.JSON(imagesJSON),
				PriceRange:      "$" + fmt.Sprintf("%.0f", 500+rand.Float64()*1000) + " - $" + fmt.Sprintf("%.0f", 1500+rand.Float64()*1000),
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
				// Create compatible models list
				compatibleModels := getCompatibleFirearms(mainCategory, subCategory, partName)
				compatibleModelsJSON, _ := json.Marshal(compatibleModels)

				// Create specifications
				specifications := map[string]interface{}{
					"subcategory": subCategory,
				}
				specificationsJSON, _ := json.Marshal(specifications)

				part := models.Part{
					Name:             partName,
					Description:      "A quality " + partName + " for your firearm build.",
					Category:         mainCategory,
					Subcategory:      subCategory,
					IsPrebuilt:       false,
					CompatibleModels: datatypes.JSON(compatibleModelsJSON),
					Specifications:   datatypes.JSON(specificationsJSON),
					Availability:     "in_stock",
					Price:            generatePrice(),
					Weight:           0.5 + rand.Float64(),
					Dimensions:       "5 x 3 x 2 in",
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
				URL:          generateProductURL(seller.WebsiteURL, part.Name),
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
