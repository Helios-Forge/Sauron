export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  manufacturer: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  specifications: Record<string, string | number>;
  compatibility: string[];
  sellers: {
    name: string;
    price: number;
    shipping: number;
    logo: string;
  }[];
}

export const products: Product[] = [
  {
    id: "p1",
    name: "AR-15 Lower Receiver",
    category: "Parts",
    subcategory: "Lower Receivers",
    manufacturer: "Aero Precision",
    price: 149.99,
    rating: 4.8,
    reviewCount: 245,
    image: "/placeholder.jpg",
    description: "Precision-machined AR-15 lower receiver made from 7075-T6 aluminum with a durable anodized finish.",
    specifications: {
      material: "7075-T6 Aluminum",
      finish: "Type III Hard Coat Anodized",
      weight: "8.35 oz",
      caliber: "Multi",
      fireControl: "Semi-Auto",
    },
    compatibility: ["AR-15", "M4", "M16"],
    sellers: [
      {
        name: "GunBroker",
        price: 149.99,
        shipping: 10.00,
        logo: "/placeholder-logo.jpg"
      },
      {
        name: "Brownells",
        price: 159.99,
        shipping: 0,
        logo: "/placeholder-logo.jpg"
      },
      {
        name: "Palmetto State Armory",
        price: 154.99,
        shipping: 7.50,
        logo: "/placeholder-logo.jpg"
      }
    ]
  },
  {
    id: "p2",
    name: "AR-15 Bolt Carrier Group",
    category: "Parts",
    subcategory: "Bolt Carrier Groups",
    manufacturer: "Bravo Company",
    price: 189.99,
    rating: 4.9,
    reviewCount: 312,
    image: "/placeholder.jpg",
    description: "Complete bolt carrier group for AR-15 rifles, featuring a properly staked gas key and shot-peened bolt.",
    specifications: {
      material: "Carpenter 158 Steel",
      finish: "Manganese Phosphate",
      weight: "11.6 oz",
      caliber: "5.56 NATO",
      extractor: "O-Ring Upgrade",
    },
    compatibility: ["AR-15", "M4", "M16"],
    sellers: [
      {
        name: "Bravo Company",
        price: 189.99,
        shipping: 5.00,
        logo: "/placeholder-logo.jpg"
      },
      {
        name: "Primary Arms",
        price: 199.99,
        shipping: 0,
        logo: "/placeholder-logo.jpg"
      },
      {
        name: "Midway USA",
        price: 194.99,
        shipping: 7.50,
        logo: "/placeholder-logo.jpg"
      }
    ]
  },
  {
    id: "p3",
    name: "AR-15 Barrel - 16\" 5.56 NATO",
    category: "Parts",
    subcategory: "Barrels",
    manufacturer: "Faxon Firearms",
    price: 219.99,
    rating: 4.7,
    reviewCount: 178,
    image: "/placeholder.jpg",
    description: "16-inch AR-15 barrel chambered in 5.56 NATO with a 1:8 twist rate and mid-length gas system.",
    specifications: {
      material: "4150 CMV Steel",
      finish: "QPQ Nitride",
      length: "16 inches",
      twist: "1:8",
      gasSystem: "Mid-Length",
      caliber: "5.56 NATO",
      weight: "1.5 lbs",
    },
    compatibility: ["AR-15", "M4"],
    sellers: [
      {
        name: "Faxon Firearms",
        price: 219.99,
        shipping: 8.50,
        logo: "/placeholder-logo.jpg"
      },
      {
        name: "OpticsPlanet",
        price: 229.99,
        shipping: 0,
        logo: "/placeholder-logo.jpg"
      },
      {
        name: "Brownells",
        price: 224.99,
        shipping: 5.00,
        logo: "/placeholder-logo.jpg"
      }
    ]
  },
  {
    id: "p4",
    name: "AR-15 Trigger Group - Single Stage",
    category: "Parts",
    subcategory: "Triggers",
    manufacturer: "Geissele Automatics",
    price: 249.99,
    rating: 4.9,
    reviewCount: 426,
    image: "/placeholder.jpg",
    description: "Premium single-stage trigger group for AR-15 platforms with a clean 3.5 lb pull weight.",
    specifications: {
      type: "Single Stage",
      pullWeight: "3.5 lbs",
      material: "Tool Steel",
      finish: "Black Oxide",
      disconnector: "Enhanced Reliability",
      resetType: "Tactile and Audible",
    },
    compatibility: ["AR-15", "M4", "M16", "AR-10"],
    sellers: [
      {
        name: "Geissele Automatics",
        price: 249.99,
        shipping: 0,
        logo: "/placeholder-logo.jpg"
      },
      {
        name: "Brownells",
        price: 259.99,
        shipping: 0,
        logo: "/placeholder-logo.jpg"
      },
      {
        name: "Midway USA",
        price: 254.99,
        shipping: 5.00,
        logo: "/placeholder-logo.jpg"
      }
    ]
  },
  {
    id: "p5",
    name: "AR-15 Handguard - M-LOK 15\"",
    category: "Parts",
    subcategory: "Handguards",
    manufacturer: "Midwest Industries",
    price: 179.99,
    rating: 4.6,
    reviewCount: 203,
    image: "/placeholder.jpg",
    description: "Lightweight 15-inch M-LOK compatible handguard for AR-15 platforms with full-length top rail.",
    specifications: {
      material: "6061 Aluminum",
      finish: "Type III Hard Coat Anodized",
      length: "15 inches",
      weight: "9.6 oz",
      mountingSystem: "Proprietary Barrel Nut",
      railType: "M-LOK with Picatinny Top Rail",
    },
    compatibility: ["AR-15", "M4"],
    sellers: [
      {
        name: "Midwest Industries",
        price: 179.99,
        shipping: 7.50,
        logo: "/placeholder-logo.jpg"
      },
      {
        name: "Primary Arms",
        price: 189.99,
        shipping: 0,
        logo: "/placeholder-logo.jpg"
      },
      {
        name: "OpticsPlanet",
        price: 184.99,
        shipping: 5.00,
        logo: "/placeholder-logo.jpg"
      }
    ]
  }
]; 