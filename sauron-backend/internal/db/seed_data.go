package db

// Complete list of firearm models by category
var allFirearmModels = map[string][]string{
	"Bolt-Action Rifles": {
		"Remington 700",
		"Winchester Model 70",
		"Ruger American Rifle",
		"Savage 110",
		"Tikka T3x",
		"Mauser M98",
		"Mosin-Nagant M91/30",
	},
	"Assault Rifles": {
		"AK-47",
		"AK-74",
		"AKM",
		"AR-15",
		"M16",
		"M4 Carbine",
		"FN SCAR-L",
		"FN SCAR-H",
		"Steyr AUG",
		"HK G36",
		"HK416",
		"SIG Sauer MCX",
		"Tavor TAR-21",
		"Galil ACE",
	},
	"Semi-Auto Rifles": {
		"AR-10",
		"Ruger Mini-14",
		"SKS",
		"FN FAL",
		"HK G3",
		"Browning BAR",
	},
	"Lever-Action Rifles": {
		"Winchester 1894",
		"Marlin 336",
		"Henry Golden Boy",
		"Winchester 1873",
		"Marlin 1895",
	},
	"Semi-Auto Pistols": {
		"Glock 17",
		"Glock 19",
		"Colt M1911",
		"SIG Sauer P226",
		"SIG Sauer P320",
		"Beretta 92FS",
		"HK VP9",
		"CZ 75",
		"Smith & Wesson M&P",
		"Walther PPQ",
	},
	"Revolvers": {
		"Colt Single Action Army",
		"Colt Python",
		"Smith & Wesson Model 29",
		"Smith & Wesson Model 686",
		"Ruger GP100",
		"Taurus Judge",
	},
	"Shotguns": {
		"Remington 870",
		"Mossberg 500",
		"Mossberg 590",
		"Benelli M4",
		"Beretta 1301",
	},
}

// Complete parts breakdown by category
var allParts = map[string]map[string][]string{
	"Upper Assembly": {
		"Bolt Carrier Group": {
			"Complete BCG",
			"Bolt",
			"Bolt Carrier",
			"Firing Pin",
			"Firing Pin Retaining Pin",
			"Cam Pin",
			"Gas Key",
			"Gas Key Screws",
			"Extractor",
			"Extractor Spring",
			"Extractor Pin",
			"Ejector",
			"Ejector Spring",
			"Ejector Roll Pin",
		},
		"Barrel": {
			"16\" 5.56 NATO Barrel",
			"14.5\" 5.56 NATO Barrel",
			"18\" .223 Wylde Barrel",
			"20\" 5.56 NATO Barrel",
			"Barrel Extension",
			"Barrel Nut",
			"Gas Block",
			"Gas Tube",
		},
		"Muzzle Devices": {
			"A2 Flash Hider",
			"Compensator",
			"Muzzle Brake",
			"Thread Protector",
			"Suppressor Mount",
		},
	},
	"Lower Assembly": {
		"Lower Receiver": {
			"Stripped Lower Receiver",
			"Complete Lower Receiver",
			"Receiver Extension",
			"Castle Nut",
			"End Plate",
		},
		"Trigger Assembly": {
			"Single Stage Trigger",
			"Two Stage Trigger",
			"Drop-In Trigger Group",
			"Trigger Spring",
			"Trigger Pin",
			"Hammer",
			"Hammer Spring",
			"Hammer Pin",
			"Disconnector",
			"Disconnector Spring",
		},
		"Buffer System": {
			"Carbine Buffer",
			"H1 Buffer",
			"H2 Buffer",
			"H3 Buffer",
			"Rifle Buffer",
			"Buffer Spring",
			"Buffer Tube",
		},
	},
	"Furniture": {
		"Stocks": {
			"M4 Stock",
			"Fixed A2 Stock",
			"Magpul CTR",
			"B5 SOPMOD",
			"MFT Minimalist",
		},
		"Grips": {
			"A2 Grip",
			"Magpul MOE Grip",
			"BCM Gunfighter",
			"Hogue OverMolded",
		},
		"Handguards": {
			"M-LOK 15\"",
			"M-LOK 13\"",
			"Quad Rail 12\"",
			"KeyMod 15\"",
			"Drop-In Handguard",
		},
	},
	"Optics": {
		"Red Dots": {
			"Aimpoint PRO",
			"EOTech XPS2",
			"Trijicon MRO",
			"Holosun 510C",
		},
		"Magnified": {
			"Vortex Strike Eagle 1-6x",
			"Primary Arms 1-6x",
			"Leupold VX-Freedom",
			"Nightforce NX8",
		},
		"Mounts": {
			"Aero Ultralight",
			"LaRue QD Mount",
			"ADM Recon",
			"Scalarworks LEAP",
		},
	},
}

// Compatibility rules by firearm type
var compatibilityTemplates = map[string]map[string][]string{
	"AR-15": {
		"required_parts": {
			"Upper Receiver",
			"Lower Receiver",
			"Bolt Carrier Group",
			"Charging Handle",
			"Buffer System",
		},
		"compatible_calibers": {
			"5.56 NATO",
			".223 Remington",
			".300 Blackout",
			"6.5 Grendel",
		},
	},
	"AK-47": {
		"required_parts": {
			"Barrel Assembly",
			"Bolt Carrier Group",
			"Gas System",
			"Receiver",
		},
		"compatible_calibers": {
			"7.62x39mm",
		},
	},
	"Glock 17": {
		"required_parts": {
			"Slide Assembly",
			"Frame",
			"Barrel",
			"Recoil Spring",
		},
		"compatible_calibers": {
			"9mm Luger",
		},
	},
}

// Additional sellers
var additionalSellers = []string{
	"Optics Planet",
	"Aero Precision",
	"BCM",
	"Rainier Arms",
	"Joe Bob Outfitters",
	"DSG Arms",
	"AIM Surplus",
	"Graf & Sons",
	"Sportsman's Guide",
	"Kentucky Gun Co",
}
