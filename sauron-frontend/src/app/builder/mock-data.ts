// Types for Builder components
export interface FirearmPart {
  id: string;
  name: string;
  description: string;
  price: number;
  compatibility: string[];
  inStock: boolean;
  rating: number;
  image?: string;
  restrictions?: {
    state: string;
    reason: string;
  }[];
}

export interface FirearmCategory {
  id: string;
  name: string;
  description: string;
  parts: FirearmPart[];
  required: boolean;
  subCategories?: FirearmCategory[];
}

export interface FirearmConfig {
  id: string;
  name: string;
  description: string;
  categories: FirearmCategory[];
}

// Sample AR-15 configuration
export const AR15Config: FirearmConfig = {
  id: "ar15",
  name: "AR-15",
  description: "Modern sporting rifle platform based on the ArmaLite AR-15 design",
  categories: [
    {
      id: "upper",
      name: "Upper Receiver Group",
      description: "The upper portion of the firearm that contains the barrel and bolt",
      required: true,
      parts: [],
      subCategories: [
        {
          id: "upper-receiver",
          name: "Upper Receiver",
          description: "Houses the bolt carrier group and attaches to the barrel",
          required: true,
          parts: [
            {
              id: "upper-1",
              name: "Aero Precision M4E1 Upper Receiver",
              description: "Enhanced upper receiver with improved design features",
              price: 159.99,
              compatibility: ["AR-15"],
              inStock: true,
              rating: 4.8,
              image: "/mock-upper-1.jpg"
            },
            {
              id: "upper-2",
              name: "BCM M4 Upper Receiver Assembly",
              description: "Mil-spec upper receiver with laser engraved T-marks",
              price: 119.95,
              compatibility: ["AR-15"],
              inStock: true,
              rating: 4.7,
              image: "/mock-upper-2.jpg"
            }
          ]
        },
        {
          id: "barrel",
          name: "Barrel",
          description: "The tube that guides the projectile",
          required: true,
          parts: [
            {
              id: "barrel-1",
              name: "Criterion 16\" .223 Wylde Barrel - Chrome Lined",
              description: "Match-grade barrel with chrome lining for durability",
              price: 289.99,
              compatibility: ["AR-15"],
              inStock: true,
              rating: 4.9,
              image: "/mock-barrel-1.jpg",
              restrictions: [
                {
                  state: "California",
                  reason: "Overall firearm length must be at least 30 inches"
                }
              ]
            },
            {
              id: "barrel-2",
              name: "Faxon 14.5\" Pencil Barrel - 5.56 NATO",
              description: "Lightweight profile barrel with pinned & welded muzzle device for 16\" OAL",
              price: 189.99,
              compatibility: ["AR-15"],
              inStock: false,
              rating: 4.6,
              image: "/mock-barrel-2.jpg",
              restrictions: [
                {
                  state: "New York",
                  reason: "May create an 'assault weapon' depending on other features"
                }
              ]
            }
          ]
        },
        {
          id: "handguard",
          name: "Handguard",
          description: "Covers the barrel and provides attachment points for accessories",
          required: true,
          parts: [
            {
              id: "handguard-1",
              name: "BCM MCMR 15\" M-LOK Handguard",
              description: "Lightweight free-float handguard with M-LOK attachment points",
              price: 189.99,
              compatibility: ["AR-15"],
              inStock: true,
              rating: 4.8,
              image: "/mock-handguard-1.jpg"
            },
            {
              id: "handguard-2",
              name: "Geissele 13\" Super Modular Rail MK4",
              description: "Rigid, free-float design with superior cooling",
              price: 325.00,
              compatibility: ["AR-15"],
              inStock: true,
              rating: 4.9,
              image: "/mock-handguard-2.jpg"
            }
          ]
        },
        {
          id: "gas-system",
          name: "Gas System",
          description: "Directs gas from fired rounds to cycle the action",
          required: true,
          parts: [
            {
              id: "gas-1",
              name: "Mid-length Gas System Kit",
              description: "Complete gas system with gas block and tube",
              price: 49.99,
              compatibility: ["AR-15", "16\" Barrel"],
              inStock: true,
              rating: 4.7,
              image: "/mock-gas-1.jpg"
            },
            {
              id: "gas-2",
              name: "Adjustable Gas Block - .750\"",
              description: "Allows tuning of gas system for different loads",
              price: 89.99,
              compatibility: ["AR-15", ".750\" Barrel"],
              inStock: true,
              rating: 4.8,
              image: "/mock-gas-2.jpg"
            }
          ]
        },
        {
          id: "bolt",
          name: "Bolt Carrier Group",
          description: "The mechanism that loads and extracts rounds",
          required: true,
          parts: [
            {
              id: "bcg-1",
              name: "BCM Bolt Carrier Group - MPI",
              description: "Mil-spec BCG with properly staked gas key",
              price: 189.99,
              compatibility: ["AR-15"],
              inStock: true,
              rating: 4.9,
              image: "/mock-bcg-1.jpg"
            },
            {
              id: "bcg-2",
              name: "Aero Precision Nickel Boron BCG",
              description: "NiB coating for smooth operation and easy cleaning",
              price: 169.99,
              compatibility: ["AR-15"],
              inStock: false,
              rating: 4.7,
              image: "/mock-bcg-2.jpg"
            }
          ]
        },
        {
          id: "charging-handle",
          name: "Charging Handle",
          description: "Used to pull the bolt carrier group to the rear",
          required: true,
          parts: [
            {
              id: "ch-1",
              name: "Radian Raptor Charging Handle",
              description: "Ambidextrous charging handle with enhanced grip",
              price: 89.95,
              compatibility: ["AR-15"],
              inStock: true,
              rating: 4.9,
              image: "/mock-ch-1.jpg"
            },
            {
              id: "ch-2",
              name: "BCM Gunfighter Charging Handle",
              description: "Designed for one-handed operation",
              price: 59.95,
              compatibility: ["AR-15"],
              inStock: true,
              rating: 4.8,
              image: "/mock-ch-2.jpg"
            }
          ]
        }
      ]
    },
    {
      id: "lower",
      name: "Lower Receiver Group",
      description: "The lower portion of the firearm that contains the fire control group",
      required: true,
      parts: [],
      subCategories: [
        {
          id: "lower-receiver",
          name: "Lower Receiver",
          description: "The serialized part that houses the trigger group",
          required: true,
          parts: [
            {
              id: "lower-1",
              name: "Aero Precision M4E1 Lower Receiver",
              description: "Enhanced lower with integrated trigger guard and threaded bolt catch pin",
              price: 149.99,
              compatibility: ["AR-15"],
              inStock: true,
              rating: 4.8,
              image: "/mock-lower-1.jpg"
            },
            {
              id: "lower-2",
              name: "Anderson Manufacturing AR-15 Lower",
              description: "Mil-spec lower receiver at an affordable price",
              price: 89.99,
              compatibility: ["AR-15"],
              inStock: true,
              rating: 4.5,
              image: "/mock-lower-2.jpg"
            }
          ]
        },
        {
          id: "lpk",
          name: "Lower Parts Kit",
          description: "Small parts for the lower receiver",
          required: true,
          parts: [
            {
              id: "lpk-1",
              name: "CMMG AR-15 Lower Parts Kit",
              description: "Complete kit with all small parts needed for lower assembly",
              price: 79.99,
              compatibility: ["AR-15"],
              inStock: true,
              rating: 4.7,
              image: "/mock-lpk-1.jpg"
            },
            {
              id: "lpk-2",
              name: "Aero Precision Builder LPK",
              description: "Essential parts needed for lower assembly",
              price: 49.99,
              compatibility: ["AR-15"],
              inStock: false,
              rating: 4.6,
              image: "/mock-lpk-2.jpg"
            }
          ]
        },
        {
          id: "trigger",
          name: "Trigger",
          description: "The fire control mechanism",
          required: true,
          parts: [
            {
              id: "trigger-1",
              name: "Geissele SSA-E Trigger",
              description: "Premium two-stage trigger with light pull",
              price: 240.00,
              compatibility: ["AR-15"],
              inStock: true,
              rating: 4.9,
              image: "/mock-trigger-1.jpg"
            },
            {
              id: "trigger-2",
              name: "LaRue MBT-2S Trigger",
              description: "High-quality two-stage trigger at a great value",
              price: 89.99,
              compatibility: ["AR-15"],
              inStock: true,
              rating: 4.8,
              image: "/mock-trigger-2.jpg"
            }
          ]
        },
        {
          id: "stock",
          name: "Buffer System & Stock",
          description: "Controls recoil and provides a surface to shoulder the rifle",
          required: true,
          parts: [
            {
              id: "stock-1",
              name: "B5 Systems SOPMOD Stock with H2 Buffer Kit",
              description: "Enhanced buttstock with storage compartments and buffer system",
              price: 149.99,
              compatibility: ["AR-15"],
              inStock: true,
              rating: 4.8,
              image: "/mock-stock-1.jpg",
              restrictions: [
                {
                  state: "California",
                  reason: "Fixed stock required unless featureless build"
                },
                {
                  state: "New York",
                  reason: "Adjustable stocks are prohibited feature"
                }
              ]
            },
            {
              id: "stock-2",
              name: "Magpul MOE Fixed Stock with Buffer Kit",
              description: "Lightweight fixed stock ideal for restricted states",
              price: 79.99,
              compatibility: ["AR-15"],
              inStock: true,
              rating: 4.6,
              image: "/mock-stock-2.jpg"
            }
          ]
        },
        {
          id: "grip",
          name: "Grip",
          description: "Provides a surface to hold the rifle",
          required: true,
          parts: [
            {
              id: "grip-1",
              name: "Magpul MOE K2+ Grip",
              description: "Ergonomic grip with rubber overmolding",
              price: 24.99,
              compatibility: ["AR-15"],
              inStock: true,
              rating: 4.8,
              image: "/mock-grip-1.jpg",
              restrictions: [
                {
                  state: "California",
                  reason: "Pistol grip not allowed with detachable magazine"
                }
              ]
            },
            {
              id: "grip-2",
              name: "Sparrow Dynamics Featureless Grip",
              description: "Compliant grip for restricted states",
              price: 39.99,
              compatibility: ["AR-15"],
              inStock: true,
              rating: 4.5,
              image: "/mock-grip-2.jpg"
            }
          ]
        }
      ]
    },
    {
      id: "magazine",
      name: "Magazine",
      description: "Holds and feeds ammunition into the chamber",
      required: true,
      parts: [
        {
          id: "mag-1",
          name: "Magpul PMAG 30-round Magazine",
          description: "Reliable polymer magazine",
          price: 12.99,
          compatibility: ["AR-15", "5.56 NATO", ".223 Rem"],
          inStock: true,
          rating: 4.9,
          image: "/mock-mag-1.jpg",
          restrictions: [
            {
              state: "California",
              reason: "Magazines over 10 rounds prohibited"
            },
            {
              state: "New York",
              reason: "Magazines over 10 rounds prohibited"
            },
            {
              state: "Connecticut",
              reason: "Magazines over 10 rounds prohibited"
            }
          ]
        },
        {
          id: "mag-2",
          name: "Magpul PMAG 10-round Magazine",
          description: "Compliant magazine for restricted states",
          price: 12.99,
          compatibility: ["AR-15", "5.56 NATO", ".223 Rem"],
          inStock: true,
          rating: 4.7,
          image: "/mock-mag-2.jpg"
        }
      ]
    },
    {
      id: "accessories",
      name: "Accessories",
      description: "Optional add-ons to enhance functionality",
      required: false,
      parts: [],
      subCategories: [
        {
          id: "optics",
          name: "Optics",
          description: "Sighting systems for target acquisition",
          required: false,
          parts: [
            {
              id: "optic-1",
              name: "Vortex SPARC AR Red Dot",
              description: "Compact red dot sight with 2 MOA dot",
              price: 249.99,
              compatibility: ["Picatinny Rail"],
              inStock: true,
              rating: 4.8,
              image: "/mock-optic-1.jpg"
            },
            {
              id: "optic-2",
              name: "Vortex Strike Eagle 1-6x24 LPVO",
              description: "Variable power scope for close to medium range",
              price: 399.99,
              compatibility: ["Picatinny Rail"],
              inStock: true,
              rating: 4.7,
              image: "/mock-optic-2.jpg"
            }
          ]
        },
        {
          id: "muzzle",
          name: "Muzzle Devices",
          description: "Devices attached to the end of the barrel",
          required: false,
          parts: [
            {
              id: "muzzle-1",
              name: "SureFire SOCOM Muzzle Brake",
              description: "Reduces recoil and serves as suppressor mount",
              price: 149.99,
              compatibility: ["AR-15", "5.56 NATO", "1/2x28 Thread"],
              inStock: true,
              rating: 4.9,
              image: "/mock-muzzle-1.jpg",
              restrictions: [
                {
                  state: "California",
                  reason: "Muzzle brakes may qualify as 'assault weapon' feature with detachable magazine"
                }
              ]
            },
            {
              id: "muzzle-2",
              name: "VG6 Precision Gamma 556",
              description: "Hybrid muzzle device with brake and flash hider properties",
              price: 84.99,
              compatibility: ["AR-15", "5.56 NATO", "1/2x28 Thread"],
              inStock: true,
              rating: 4.7,
              image: "/mock-muzzle-2.jpg",
              restrictions: [
                {
                  state: "California",
                  reason: "Flash hiders are prohibited feature with detachable magazine"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Pre-built configurations
export const preBuiltConfigurations = [
  {
    id: "entry-level-ar15",
    name: "Entry Level AR-15",
    description: "Budget-friendly complete rifle",
    baseFirearm: "ar15",
    parts: [
      "upper-2", "barrel-1", "handguard-1", "gas-1", "bcg-2", "ch-2",
      "lower-2", "lpk-1", "trigger-2", "stock-2", "grip-1", "mag-2"
    ]
  },
  {
    id: "premium-ar15",
    name: "Premium AR-15 Build",
    description: "High-end performance configuration",
    baseFirearm: "ar15",
    parts: [
      "upper-1", "barrel-1", "handguard-2", "gas-2", "bcg-1", "ch-1",
      "lower-1", "lpk-2", "trigger-1", "stock-1", "grip-1", "mag-1",
      "optic-2", "muzzle-1"
    ]
  },
  {
    id: "ca-compliant-ar15",
    name: "California Compliant AR-15",
    description: "Featureless build for restricted states",
    baseFirearm: "ar15",
    parts: [
      "upper-1", "barrel-1", "handguard-1", "gas-1", "bcg-1", "ch-2",
      "lower-1", "lpk-1", "trigger-2", "stock-2", "grip-2", "mag-2"
    ]
  }
];

// U.S. States for compliance checks
export const usStates = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California", restrictive: true },
  { code: "CO", name: "Colorado", restrictive: true },
  { code: "CT", name: "Connecticut", restrictive: true },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii", restrictive: true },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois", restrictive: true },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland", restrictive: true },
  { code: "MA", name: "Massachusetts", restrictive: true },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey", restrictive: true },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York", restrictive: true },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island", restrictive: true },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington", restrictive: true },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" }
]; 