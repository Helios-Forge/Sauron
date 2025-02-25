// Types for Products data
export interface Vendor {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
  shippingCost: number;
  link: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  brand: string;
  compatibility: string[];
  specs: Record<string, string | number>;
  price: number; // Base/MSRP price
  rating: number;
  reviewCount: number;
  image?: string;
  description: string;
  vendors: Vendor[];
  inStock: boolean;
}

// Categories for filtering
export const productCategories = [
  {
    name: "Firearms",
    value: "firearms",
    subCategories: [
      { name: "AR-15", value: "ar15" },
      { name: "AK-47", value: "ak47" },
      { name: "Pistols", value: "pistols" },
      { name: "Shotguns", value: "shotguns" },
      { name: "Bolt-Action", value: "bolt-action" }
    ]
  },
  {
    name: "Upper Components",
    value: "upper-components",
    subCategories: [
      { name: "Upper Receivers", value: "upper-receivers" },
      { name: "Barrels", value: "barrels" },
      { name: "Handguards", value: "handguards" },
      { name: "Bolt Carrier Groups", value: "bcg" },
      { name: "Charging Handles", value: "charging-handles" },
      { name: "Gas Blocks & Tubes", value: "gas-system" }
    ]
  },
  {
    name: "Lower Components",
    value: "lower-components",
    subCategories: [
      { name: "Lower Receivers", value: "lower-receivers" },
      { name: "Lower Parts Kits", value: "lpk" },
      { name: "Triggers", value: "triggers" },
      { name: "Buffer Systems", value: "buffer-systems" },
      { name: "Stocks", value: "stocks" },
      { name: "Grips", value: "grips" }
    ]
  },
  {
    name: "Magazines & Ammo",
    value: "magazines-ammo",
    subCategories: [
      { name: "Magazines", value: "magazines" },
      { name: "Ammunition", value: "ammunition" }
    ]
  },
  {
    name: "Accessories",
    value: "accessories",
    subCategories: [
      { name: "Optics", value: "optics" },
      { name: "Muzzle Devices", value: "muzzle-devices" },
      { name: "Slings", value: "slings" },
      { name: "Lights & Lasers", value: "lights-lasers" },
      { name: "Bipods & Foregrips", value: "bipods-foregrips" }
    ]
  }
];

// Brands for filtering
export const productBrands = [
  { name: "Aero Precision", value: "aero-precision" },
  { name: "BCM", value: "bcm" },
  { name: "Daniel Defense", value: "daniel-defense" },
  { name: "Geissele", value: "geissele" },
  { name: "Magpul", value: "magpul" },
  { name: "Palmetto State Armory", value: "psa" },
  { name: "SIG Sauer", value: "sig-sauer" },
  { name: "Smith & Wesson", value: "smith-wesson" },
  { name: "Trijicon", value: "trijicon" },
  { name: "Vortex", value: "vortex" }
];

// Sample vendors
export const vendors = [
  { id: "brownells", name: "Brownells" },
  { id: "midwayusa", name: "Midway USA" },
  { id: "palmetto", name: "Palmetto State Armory" },
  { id: "primary-arms", name: "Primary Arms" },
  { id: "opticsplanet", name: "OpticsPlanet" },
  { id: "cabelas", name: "Cabela's" },
  { id: "aim-surplus", name: "AIM Surplus" },
  { id: "rainier-arms", name: "Rainier Arms" },
  { id: "joe-bob", name: "Joe Bob Outfitters" }
];

// Sample products data
export const productsData: Product[] = [
  {
    id: "1",
    name: "AR-15 Complete Rifle",
    category: "firearms",
    subCategory: "ar15",
    brand: "daniel-defense",
    compatibility: ["5.56 NATO", ".223 Rem"],
    specs: {
      "Barrel Length": "16 inches",
      "Twist Rate": "1:7",
      "Weight": "6.5 lbs",
      "Overall Length": "32-35.5 inches"
    },
    price: 1899.99,
    rating: 4.9,
    reviewCount: 258,
    image: "/mock-product-1.jpg",
    description: "Complete AR-15 rifle with premium components throughout. Features a free-floating barrel, mid-length gas system, and M-LOK handguard.",
    vendors: [
      { id: "brownells", name: "Brownells", price: 1899.99, inStock: true, shippingCost: 0, link: "#" },
      { id: "primary-arms", name: "Primary Arms", price: 1849.99, inStock: true, shippingCost: 12.99, link: "#" },
      { id: "palmetto", name: "Palmetto State Armory", price: 1924.99, inStock: false, shippingCost: 0, link: "#" }
    ],
    inStock: true
  },
  {
    id: "2",
    name: "AR-15 Upper Receiver Assembly",
    category: "upper-components",
    subCategory: "upper-receivers",
    brand: "bcm",
    compatibility: ["AR-15", "DPMS Pattern"],
    specs: {
      "Material": "7075-T6 Aluminum",
      "Finish": "Hard Coat Anodized",
      "Barrel Thread": "1/2x28",
      "Forward Assist": "Yes"
    },
    price: 149.99,
    rating: 4.8,
    reviewCount: 132,
    image: "/mock-product-2.jpg",
    description: "Mil-spec upper receiver with forward assist and dust cover. Precision machined from forged 7075-T6 aluminum.",
    vendors: [
      { id: "brownells", name: "Brownells", price: 149.99, inStock: true, shippingCost: 8.99, link: "#" },
      { id: "midwayusa", name: "Midway USA", price: 159.99, inStock: true, shippingCost: 5.99, link: "#" },
      { id: "aim-surplus", name: "AIM Surplus", price: 139.99, inStock: true, shippingCost: 7.99, link: "#" }
    ],
    inStock: true
  },
  {
    id: "3",
    name: "16\" 5.56 NATO Barrel - Mid-Length",
    category: "upper-components",
    subCategory: "barrels",
    brand: "aero-precision",
    compatibility: ["AR-15", "5.56 NATO", ".223 Rem"],
    specs: {
      "Length": "16 inches",
      "Gas System": "Mid-Length",
      "Profile": "Government",
      "Twist Rate": "1:7",
      "Material": "4150 Chrome Moly Vanadium"
    },
    price: 199.99,
    rating: 4.7,
    reviewCount: 86,
    image: "/mock-product-3.jpg",
    description: "Chrome-lined 16\" barrel with mid-length gas system. Features 1:7 twist rate and M4 feed ramps for reliable feeding.",
    vendors: [
      { id: "primary-arms", name: "Primary Arms", price: 199.99, inStock: true, shippingCost: 9.99, link: "#" },
      { id: "midwayusa", name: "Midway USA", price: 209.99, inStock: false, shippingCost: 0, link: "#" },
      { id: "joe-bob", name: "Joe Bob Outfitters", price: 189.99, inStock: true, shippingCost: 12.99, link: "#" }
    ],
    inStock: true
  },
  {
    id: "4",
    name: "AR-15 Lower Receiver - Stripped",
    category: "lower-components",
    subCategory: "lower-receivers",
    brand: "aero-precision",
    compatibility: ["AR-15"],
    specs: {
      "Material": "7075-T6 Aluminum",
      "Finish": "Hard Coat Anodized",
      "Fire Control": "Semi-Auto",
      "Markings": "Multi-Caliber"
    },
    price: 129.99,
    rating: 4.9,
    reviewCount: 215,
    image: "/mock-product-4.jpg",
    description: "Precision machined stripped lower receiver. Compatible with all mil-spec AR-15 components and magazines.",
    vendors: [
      { id: "palmetto", name: "Palmetto State Armory", price: 129.99, inStock: true, shippingCost: 0, link: "#" },
      { id: "brownells", name: "Brownells", price: 139.99, inStock: true, shippingCost: 10.99, link: "#" },
      { id: "primary-arms", name: "Primary Arms", price: 129.99, inStock: false, shippingCost: 0, link: "#" }
    ],
    inStock: true
  },
  {
    id: "5",
    name: "AR-15 Bolt Carrier Group - Nickel Boron",
    category: "upper-components",
    subCategory: "bcg",
    brand: "psa",
    compatibility: ["AR-15", "M16", "5.56 NATO", ".223 Rem"],
    specs: {
      "Material": "9310 Steel Bolt",
      "Coating": "Nickel Boron",
      "Extractor": "O-Ring Upgrade",
      "MPI Tested": "Yes",
      "HPT Tested": "Yes"
    },
    price: 169.99,
    rating: 4.7,
    reviewCount: 328,
    image: "/mock-product-5.jpg",
    description: "Full-auto profile bolt carrier group with nickel boron coating for smooth operation and easy cleaning. MPI and HPT tested for quality assurance.",
    vendors: [
      { id: "palmetto", name: "Palmetto State Armory", price: 169.99, inStock: true, shippingCost: 0, link: "#" },
      { id: "primary-arms", name: "Primary Arms", price: 179.99, inStock: true, shippingCost: 7.99, link: "#" },
      { id: "aim-surplus", name: "AIM Surplus", price: 159.99, inStock: true, shippingCost: 8.99, link: "#" }
    ],
    inStock: true
  },
  {
    id: "6",
    name: "AR-15 Charging Handle - Ambidextrous",
    category: "upper-components",
    subCategory: "charging-handles",
    brand: "bcm",
    compatibility: ["AR-15", "M16", "M4"],
    specs: {
      "Material": "7075-T6 Aluminum",
      "Finish": "Hard Coat Anodized",
      "Type": "Ambidextrous",
      "Latch": "Extended"
    },
    price: 89.99,
    rating: 4.9,
    reviewCount: 176,
    image: "/mock-product-6.jpg",
    description: "Ambidextrous charging handle designed for easy operation with either hand. Extended latch for improved grip and leverage.",
    vendors: [
      { id: "brownells", name: "Brownells", price: 89.99, inStock: true, shippingCost: 5.99, link: "#" },
      { id: "midwayusa", name: "Midway USA", price: 94.99, inStock: false, shippingCost: 0, link: "#" },
      { id: "opticsplanet", name: "OpticsPlanet", price: 86.99, inStock: true, shippingCost: 0, link: "#" }
    ],
    inStock: true
  },
  {
    id: "7",
    name: "Two-Stage Match Trigger",
    category: "lower-components",
    subCategory: "triggers",
    brand: "geissele",
    compatibility: ["AR-15", "AR-10"],
    specs: {
      "Pull Weight": "4.5 lbs",
      "Type": "Two-Stage",
      "First Stage": "2.5 lbs",
      "Second Stage": "2.0 lbs",
      "Material": "Tool Steel"
    },
    price: 240.00,
    rating: 4.9,
    reviewCount: 412,
    image: "/mock-product-7.jpg",
    description: "Match-grade two-stage trigger providing a smooth, crisp break with minimal overtravel and a short, positive reset.",
    vendors: [
      { id: "brownells", name: "Brownells", price: 240.00, inStock: true, shippingCost: 0, link: "#" },
      { id: "midwayusa", name: "Midway USA", price: 240.00, inStock: true, shippingCost: 8.99, link: "#" },
      { id: "opticsplanet", name: "OpticsPlanet", price: 234.99, inStock: false, shippingCost: 0, link: "#" }
    ],
    inStock: true
  },
  {
    id: "8",
    name: "AR-15 Buffer Tube Kit - Mil-Spec",
    category: "lower-components",
    subCategory: "buffer-systems",
    brand: "bcm",
    compatibility: ["AR-15"],
    specs: {
      "Buffer Weight": "3.0 oz",
      "Tube Diameter": "1.14 inches",
      "Material": "7075-T6 Aluminum",
      "Spring": "Carbine"
    },
    price: 59.99,
    rating: 4.7,
    reviewCount: 98,
    image: "/mock-product-8.jpg",
    description: "Complete buffer tube kit including mil-spec diameter tube, carbine buffer, spring, end plate, and castle nut.",
    vendors: [
      { id: "palmetto", name: "Palmetto State Armory", price: 59.99, inStock: true, shippingCost: 7.99, link: "#" },
      { id: "primary-arms", name: "Primary Arms", price: 64.99, inStock: true, shippingCost: 5.99, link: "#" },
      { id: "joe-bob", name: "Joe Bob Outfitters", price: 57.99, inStock: true, shippingCost: 6.99, link: "#" }
    ],
    inStock: true
  },
  {
    id: "9",
    name: "Collapsible Stock - Mil-Spec",
    category: "lower-components",
    subCategory: "stocks",
    brand: "magpul",
    compatibility: ["AR-15", "Mil-Spec Buffer Tube"],
    specs: {
      "Material": "Polymer",
      "Weight": "7.5 oz",
      "Positions": "6-Position",
      "QD Socket": "Yes"
    },
    price: 49.99,
    rating: 4.8,
    reviewCount: 347,
    image: "/mock-product-9.jpg",
    description: "Six-position adjustable stock for mil-spec buffer tubes. Features a rubber butt-pad for improved shoulder grip and QD sling mount.",
    vendors: [
      { id: "brownells", name: "Brownells", price: 49.99, inStock: true, shippingCost: 5.99, link: "#" },
      { id: "cabelas", name: "Cabela's", price: 54.99, inStock: true, shippingCost: 0, link: "#" },
      { id: "palmetto", name: "Palmetto State Armory", price: 47.99, inStock: true, shippingCost: 7.99, link: "#" }
    ],
    inStock: true
  },
  {
    id: "10",
    name: "AR-15 Pistol Grip - Ergonomic",
    category: "lower-components",
    subCategory: "grips",
    brand: "magpul",
    compatibility: ["AR-15", "AR-10"],
    specs: {
      "Material": "Polymer",
      "Weight": "2.8 oz",
      "Storage": "Yes",
      "Beavertail": "Yes"
    },
    price: 24.99,
    rating: 4.6,
    reviewCount: 215,
    image: "/mock-product-10.jpg",
    description: "Ergonomic pistol grip with aggressive texturing for enhanced control. Features internal storage compartment for small items.",
    vendors: [
      { id: "primary-arms", name: "Primary Arms", price: 24.99, inStock: true, shippingCost: 3.99, link: "#" },
      { id: "midwayusa", name: "Midway USA", price: 23.99, inStock: true, shippingCost: 4.99, link: "#" },
      { id: "palmetto", name: "Palmetto State Armory", price: 22.99, inStock: false, shippingCost: 0, link: "#" }
    ],
    inStock: true
  },
  {
    id: "11",
    name: "30-Round Magazine - Polymer",
    category: "magazines-ammo",
    subCategory: "magazines",
    brand: "magpul",
    compatibility: ["AR-15", "5.56 NATO", ".223 Rem"],
    specs: {
      "Capacity": "30 Rounds",
      "Material": "Polymer",
      "Weight": "4.3 oz",
      "Anti-Tilt Follower": "Yes"
    },
    price: 14.99,
    rating: 4.9,
    reviewCount: 1287,
    image: "/mock-product-11.jpg",
    description: "Reliable 30-round polymer magazine with anti-tilt follower, stainless steel spring, and textured gripping surface.",
    vendors: [
      { id: "palmetto", name: "Palmetto State Armory", price: 14.99, inStock: true, shippingCost: 7.99, link: "#" },
      { id: "primary-arms", name: "Primary Arms", price: 13.99, inStock: true, shippingCost: 6.99, link: "#" },
      { id: "aim-surplus", name: "AIM Surplus", price: 12.99, inStock: true, shippingCost: 8.99, link: "#" }
    ],
    inStock: true
  },
  {
    id: "12",
    name: "Red Dot Sight",
    category: "accessories",
    subCategory: "optics",
    brand: "trijicon",
    compatibility: ["Picatinny Rail"],
    specs: {
      "Magnification": "1x",
      "Dot Size": "2 MOA",
      "Battery Life": "50,000 hours",
      "Weight": "4.0 oz",
      "Waterproof": "Yes"
    },
    price: 449.99,
    rating: 4.9,
    reviewCount: 567,
    image: "/mock-product-12.jpg",
    description: "Compact, lightweight red dot sight with 2 MOA dot for fast target acquisition. Features extended battery life and multiple brightness settings.",
    vendors: [
      { id: "brownells", name: "Brownells", price: 449.99, inStock: true, shippingCost: 0, link: "#" },
      { id: "opticsplanet", name: "OpticsPlanet", price: 439.99, inStock: true, shippingCost: 0, link: "#" },
      { id: "cabelas", name: "Cabela's", price: 459.99, inStock: false, shippingCost: 0, link: "#" }
    ],
    inStock: true
  },
  {
    id: "13",
    name: "Low-Power Variable Optic (LPVO)",
    category: "accessories",
    subCategory: "optics",
    brand: "vortex",
    compatibility: ["Picatinny Rail"],
    specs: {
      "Magnification": "1-6x",
      "Objective Diameter": "24mm",
      "Eye Relief": "3.5 inches",
      "Tube Size": "30mm",
      "Illuminated": "Yes"
    },
    price: 399.99,
    rating: 4.8,
    reviewCount: 328,
    image: "/mock-product-13.jpg",
    description: "Variable 1-6x optic with illuminated reticle. Perfect for close to medium range engagements with true 1x on the low end.",
    vendors: [
      { id: "brownells", name: "Brownells", price: 399.99, inStock: true, shippingCost: 0, link: "#" },
      { id: "opticsplanet", name: "OpticsPlanet", price: 389.99, inStock: true, shippingCost: 0, link: "#" },
      { id: "midwayusa", name: "Midway USA", price: 409.99, inStock: true, shippingCost: 0, link: "#" }
    ],
    inStock: true
  },
  {
    id: "14",
    name: "Flash Hider",
    category: "accessories",
    subCategory: "muzzle-devices",
    brand: "bcm",
    compatibility: ["AR-15", "1/2x28 Thread"],
    specs: {
      "Material": "Steel",
      "Finish": "Manganese Phosphate",
      "Length": "2.25 inches",
      "Weight": "2.1 oz"
    },
    price: 49.99,
    rating: 4.7,
    reviewCount: 98,
    image: "/mock-product-14.jpg",
    description: "Effective flash hider designed to reduce visible signature. Durable construction with manganese phosphate finish for corrosion resistance.",
    vendors: [
      { id: "primary-arms", name: "Primary Arms", price: 49.99, inStock: true, shippingCost: 4.99, link: "#" },
      { id: "midwayusa", name: "Midway USA", price: 52.99, inStock: true, shippingCost: 6.99, link: "#" },
      { id: "brownells", name: "Brownells", price: 48.99, inStock: false, shippingCost: 0, link: "#" }
    ],
    inStock: true
  },
  {
    id: "15",
    name: "Two-Point Adjustable Sling",
    category: "accessories",
    subCategory: "slings",
    brand: "magpul",
    compatibility: ["Universal"],
    specs: {
      "Material": "Nylon Webbing",
      "Width": "1.25 inches",
      "Length": "Adjustable",
      "Hardware": "High-Strength Polymer",
      "QD Swivels": "Included"
    },
    price: 49.99,
    rating: 4.8,
    reviewCount: 176,
    image: "/mock-product-15.jpg",
    description: "Versatile two-point sling with quick-adjust slider for length adjustment. Features comfortable padded section and high-strength hardware.",
    vendors: [
      { id: "palmetto", name: "Palmetto State Armory", price: 49.99, inStock: true, shippingCost: 4.99, link: "#" },
      { id: "brownells", name: "Brownells", price: 53.99, inStock: true, shippingCost: 5.99, link: "#" },
      { id: "primary-arms", name: "Primary Arms", price: 47.99, inStock: true, shippingCost: 3.99, link: "#" }
    ],
    inStock: true
  }
];

// Helper functions for filtering
export const filterProductsByCategory = (products: Product[], category?: string, subCategory?: string): Product[] => {
  if (!category) return products;
  
  const filtered = products.filter(product => product.category === category);
  if (!subCategory) return filtered;
  
  return filtered.filter(product => product.subCategory === subCategory);
};

export const filterProductsByPrice = (products: Product[], min?: number, max?: number): Product[] => {
  let filtered = [...products];
  
  if (min !== undefined) {
    filtered = filtered.filter(product => product.price >= min);
  }
  
  if (max !== undefined) {
    filtered = filtered.filter(product => product.price <= max);
  }
  
  return filtered;
};

export const filterProductsByBrand = (products: Product[], brands: string[]): Product[] => {
  if (!brands.length) return products;
  return products.filter(product => brands.includes(product.brand));
};

export const filterProductsByCompatibility = (products: Product[], compatibilities: string[]): Product[] => {
  if (!compatibilities.length) return products;
  return products.filter(product => 
    product.compatibility.some(c => compatibilities.includes(c))
  );
};

export const filterProductsByAvailability = (products: Product[], inStockOnly: boolean): Product[] => {
  if (!inStockOnly) return products;
  return products.filter(product => product.inStock);
};

export const filterProductsByRating = (products: Product[], minRating?: number): Product[] => {
  if (minRating === undefined) return products;
  return products.filter(product => product.rating >= minRating);
};

export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  const sorted = [...products];
  
  switch(sortBy) {
    case "price-low-high":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-high-low":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}; 