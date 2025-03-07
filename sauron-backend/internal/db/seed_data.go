package db

// This file contains ALL data used for seeding the database
// It is imported by seed.go which handles the actual insertion into the database

// Mock manufacturers data - focused on AR-15 manufacturers
var ManufacturerData = []struct {
	Name        string
	Description string
	Country     string
	LogoURL     string
}{
	{
		Name:        "Colt",
		Description: "American firearms manufacturer known for producing the original AR-15 and M16 military rifles",
		Country:     "USA",
		LogoURL:     "https://example.com/colt_logo.png",
	},
	{
		Name:        "Brownells",
		Description: "American firearms and parts manufacturer specializing in AR-15 components",
		Country:     "USA",
		LogoURL:     "https://example.com/brownells_logo.png",
	},
	{
		Name:        "Magpul",
		Description: "American firearm accessories manufacturer known for innovative AR-15 parts",
		Country:     "USA",
		LogoURL:     "https://example.com/magpul_logo.png",
	},
	{
		Name:        "BCM",
		Description: "American firearms and parts manufacturer specializing in high-quality AR-15 components",
		Country:     "USA",
		LogoURL:     "https://example.com/bcm_logo.png",
	},
	{
		Name:        "Aero Precision",
		Description: "American firearms and parts manufacturer known for precision AR-15 components",
		Country:     "USA",
		LogoURL:     "https://example.com/aero_logo.png",
	},
}

// Mock sellers data
var SellerData = []struct {
	Name                  string
	WebsiteURL            string
	Description           string
	IsAffiliate           bool
	AffiliateLinkTemplate string
	LogoURL               string
}{
	{
		Name:                  "Brownells",
		WebsiteURL:            "https://www.brownells.com",
		Description:           "A trusted retailer of AR-15 parts and accessories.",
		IsAffiliate:           true,
		AffiliateLinkTemplate: "https://www.brownells.com/?aff=gunguru_{product_id}",
		LogoURL:               "https://example.com/brownells_logo.png",
	},
	{
		Name:                  "Midway USA",
		WebsiteURL:            "https://www.midwayusa.com",
		Description:           "Quality AR-15 parts and accessories with industry-best customer service.",
		IsAffiliate:           true,
		AffiliateLinkTemplate: "https://www.midwayusa.com/?aff=gunguru_{product_id}",
		LogoURL:               "https://example.com/midway_logo.png",
	},
	{
		Name:                  "Primary Arms",
		WebsiteURL:            "https://www.primaryarms.com",
		Description:           "Provider of high-quality AR-15 parts, optics, and accessories.",
		IsAffiliate:           true,
		AffiliateLinkTemplate: "https://www.primaryarms.com/?aff=gunguru_{product_id}",
		LogoURL:               "https://example.com/primaryarms_logo.png",
	},
	{
		Name:                  "Palmetto State Armory",
		WebsiteURL:            "https://palmettostatearmory.com",
		Description:           "American AR-15 firearms, ammunition, and accessories at great prices.",
		IsAffiliate:           true,
		AffiliateLinkTemplate: "https://palmettostatearmory.com/?aff=gunguru_{product_id}",
		LogoURL:               "https://example.com/psa_logo.png",
	},
}

// Complete list of firearm models - ONLY AR-15
var AllFirearmModels = map[string][]string{
	"Assault Rifles": {
		"AR-15",
	},
}

// AR-15 parts by category and subcategory
var AllParts = map[string]map[string][]string{
	"Upper Assembly": {
		"Bolt Carrier Group": {
			"Complete BCG (AR-15)",
			"Bolt (AR-15)",
			"Bolt Carrier (AR-15)",
			"Firing Pin (AR-15)",
			"Cam Pin (AR-15)",
		},
		"Barrel": {
			"16\" 5.56 NATO Barrel (AR-15)",
			"14.5\" 5.56 NATO Barrel (AR-15)",
			"18\" 5.56 NATO Barrel (AR-15)",
			"20\" 5.56 NATO Barrel (AR-15)",
			"10.5\" 5.56 NATO Barrel (AR-15)",
		},
		"Muzzle Devices": {
			"A2 Flash Hider (AR-15)",
			"Muzzle Brake (AR-15)",
			"Compensator (AR-15)",
			"Flash Suppressor (AR-15)",
		},
		"Upper Receiver": {
			"Stripped Upper Receiver (AR-15)",
			"Complete Upper Receiver (AR-15)",
			"Billet Upper Receiver (AR-15)",
			"Forged Upper Receiver (AR-15)",
		},
		"Handguard/Foregrip": {
			"M-LOK Handguard (AR-15)",
			"KeyMod Handguard (AR-15)",
			"Quad Rail Handguard (AR-15)",
			"Free Float Handguard (AR-15)",
			"Drop-In Handguard (AR-15)",
		},
		"Gas System": {
			"Carbine Gas Tube (AR-15)",
			"Mid-Length Gas Tube (AR-15)",
			"Rifle-Length Gas Tube (AR-15)",
			"Low-Profile Gas Block (AR-15)",
			"Adjustable Gas Block (AR-15)",
		},
		"Charging Handle": {
			"Standard Charging Handle (AR-15)",
			"Ambidextrous Charging Handle (AR-15)",
			"Extended Latch Charging Handle (AR-15)",
		},
	},
	"Lower Assembly": {
		"Lower Receiver": {
			"Stripped Lower Receiver (AR-15)",
			"Complete Lower Receiver (AR-15)",
			"Billet Lower Receiver (AR-15)",
			"Forged Lower Receiver (AR-15)",
		},
		"Trigger Assembly": {
			"Mil-Spec Trigger (AR-15)",
			"Single-Stage Trigger (AR-15)",
			"Two-Stage Trigger (AR-15)",
			"Drop-In Trigger (AR-15)",
		},
		"Fire Control Group": {
			"Standard Safety Selector (AR-15)",
			"Ambidextrous Safety Selector (AR-15)",
			"45/90 Degree Safety Selector (AR-15)",
		},
		"Magazine Release": {
			"Standard Magazine Release (AR-15)",
			"Extended Magazine Release (AR-15)",
			"Ambidextrous Magazine Release (AR-15)",
		},
		"Bolt Catch": {
			"Standard Bolt Catch (AR-15)",
			"Enhanced Bolt Catch (AR-15)",
			"Ambidextrous Bolt Catch (AR-15)",
		},
		"Buffer System": {
			"Carbine Buffer (AR-15)",
			"H1 Buffer (AR-15)",
			"H2 Buffer (AR-15)",
			"H3 Buffer (AR-15)",
			"Carbine Buffer Spring (AR-15)",
			"Standard Buffer Tube (AR-15)",
		},
		"Grip": {
			"Standard A2 Grip (AR-15)",
			"Magpul MOE Grip (AR-15)",
			"BCM Gunfighter Grip (AR-15)",
			"Ergo Grip (AR-15)",
		},
		"Stock": {
			"M4 Collapsible Stock (AR-15)",
			"Magpul CTR Stock (AR-15)",
			"B5 SOPMOD Stock (AR-15)",
			"Fixed A2 Stock (AR-15)",
		},
	},
	"Accessories": {
		"Magazines": {
			"PMAG 30-Round (AR-15)",
			"PMAG 20-Round (AR-15)",
			"USGI 30-Round (AR-15)",
			"Lancer 30-Round (AR-15)",
		},
		"Sights and Optics": {
			"MBUS Backup Sights (AR-15)",
			"Fixed Front Sight (AR-15)",
			"Fixed Rear Sight (AR-15)",
			"Red Dot Mount (AR-15)",
		},
		"Slings and Attachments": {
			"Two-Point Sling (AR-15)",
			"Single-Point Sling (AR-15)",
			"QD Sling Swivel (AR-15)",
			"Sling Mount (AR-15)",
		},
	},
}

// Assembly parts data - AR-15 focused
var AssemblyParts = []struct {
	Name          string
	Category      string
	Subcategory   string
	SubComponents []string
}{
	{
		Name:        "AR-15 Complete Upper Assembly",
		Category:    "Upper Assembly",
		Subcategory: "Complete Uppers",
		SubComponents: []string{
			"Stripped Upper Receiver (AR-15)",
			"16\" 5.56 NATO Barrel (AR-15)",
			"A2 Flash Hider (AR-15)",
			"M-LOK Handguard (AR-15)",
			"Complete BCG (AR-15)",
			"Standard Charging Handle (AR-15)",
		},
	},
	{
		Name:        "AR-15 Complete Lower Assembly",
		Category:    "Lower Assembly",
		Subcategory: "Complete Lowers",
		SubComponents: []string{
			"Stripped Lower Receiver (AR-15)",
			"Mil-Spec Trigger (AR-15)",
			"Standard Safety Selector (AR-15)",
			"Standard Magazine Release (AR-15)",
			"Standard Bolt Catch (AR-15)",
			"Standard A2 Grip (AR-15)",
			"M4 Collapsible Stock (AR-15)",
		},
	},
	{
		Name:        "AR-15 Complete BCG Assembly",
		Category:    "Upper Assembly",
		Subcategory: "Bolt Carrier Group",
		SubComponents: []string{
			"Bolt (AR-15)",
			"Bolt Carrier (AR-15)",
			"Firing Pin (AR-15)",
			"Cam Pin (AR-15)",
		},
	},
}
