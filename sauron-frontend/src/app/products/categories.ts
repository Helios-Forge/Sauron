import { z } from 'zod';

// Category type definition
export const CategorySchema = z.lazy(() => z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  children: z.array(CategorySchema).optional(),
  slug: z.string(),
  parentId: z.string().nullable(),
}));

export type Category = z.infer<typeof CategorySchema>;

// Utility functions with debug logging
export function findCategory(categories: Category[], targetId: string, depth = 0): Category | null {
  console.log(`[DEBUG] Searching for category ${targetId} at depth ${depth}`);
  
  for (const category of categories) {
    console.log(`[DEBUG] Checking category: ${category.name}`);
    
    if (category.id === targetId) {
      console.log(`[DEBUG] Found category: ${category.name}`);
      return category;
    }
    
    if (category.children?.length) {
      const found = findCategory(category.children, targetId, depth + 1);
      if (found) return found;
    }
  }
  
  if (depth === 0) {
    console.log(`[DEBUG] Category ${targetId} not found in tree`);
  }
  return null;
}

export function getBreadcrumb(categories: Category[], targetId: string): Category[] {
  console.log(`[DEBUG] Building breadcrumb for category ${targetId}`);
  const breadcrumb: Category[] = [];
  
  function traverse(cats: Category[]): boolean {
    for (const cat of cats) {
      console.log(`[DEBUG] Traversing category: ${cat.name}`);
      
      if (cat.id === targetId) {
        console.log(`[DEBUG] Found target category: ${cat.name}`);
        breadcrumb.unshift(cat);
        return true;
      }
      
      if (cat.children?.length && traverse(cat.children)) {
        console.log(`[DEBUG] Adding parent category: ${cat.name}`);
        breadcrumb.unshift(cat);
        return true;
      }
    }
    return false;
  }
  
  traverse(categories);
  console.log(`[DEBUG] Final breadcrumb:`, breadcrumb.map(c => c.name));
  return breadcrumb;
}

export function getAllChildCategories(category: Category): string[] {
  console.log(`[DEBUG] Getting all child categories for: ${category.name}`);
  const childIds: string[] = [category.id];
  
  function traverse(cat: Category) {
    if (cat.children?.length) {
      for (const child of cat.children) {
        console.log(`[DEBUG] Adding child category: ${child.name}`);
        childIds.push(child.id);
        traverse(child);
      }
    }
  }
  
  traverse(category);
  console.log(`[DEBUG] Found ${childIds.length} total categories`);
  return childIds;
}

// Validation function
export function validateCategoryTree(categories: Category[]): boolean {
  console.log('[DEBUG] Validating category tree');
  const result = CategorySchema.array().safeParse(categories);
  
  if (!result.success) {
    console.error('[DEBUG] Category validation failed:', result.error);
    return false;
  }
  
  console.log('[DEBUG] Category tree validation successful');
  return true;
}

// Define the categories based on the part-breakdown.md file
export const categories: Category[] = [
  {
    id: "upper-assembly",
    name: "Upper Assembly",
    description: "Components for the upper portion of firearms",
    slug: "upper-assembly",
    subcategories: [
      {
        id: "bolt-carrier-group",
        name: "Bolt Carrier Group (BCG)",
        description: "Complete bolt carrier groups and components",
        slug: "bolt-carrier-group",
        subcategories: [
          { id: "bolt", name: "Bolt", slug: "bolt" },
          { id: "bolt-carrier", name: "Bolt Carrier", slug: "bolt-carrier" },
          { id: "firing-pin", name: "Firing Pin", slug: "firing-pin" },
          { id: "firing-pin-retaining-pin", name: "Firing Pin Retaining Pin", slug: "firing-pin-retaining-pin" },
          { id: "cam-pin", name: "Cam Pin", slug: "cam-pin" },
          { id: "gas-key", name: "Gas Key", slug: "gas-key" },
          { id: "gas-key-screws", name: "Gas Key Screws", slug: "gas-key-screws" },
          { id: "extractor", name: "Extractor", slug: "extractor" },
          { id: "extractor-spring", name: "Extractor Spring", slug: "extractor-spring" },
          { id: "extractor-pin", name: "Extractor Pin", slug: "extractor-pin" },
          { id: "ejector", name: "Ejector", slug: "ejector" },
          { id: "ejector-spring", name: "Ejector Spring", slug: "ejector-spring" },
          { id: "ejector-roll-pin", name: "Ejector Roll Pin", slug: "ejector-roll-pin" }
        ]
      },
      {
        id: "barrel",
        name: "Barrel",
        description: "Barrels and barrel components",
        slug: "barrel",
        subcategories: [
          { id: "barrel-extension", name: "Barrel Extension", slug: "barrel-extension" },
          { id: "barrel-nut", name: "Barrel Nut", slug: "barrel-nut" },
          { id: "gas-block", name: "Gas Block", slug: "gas-block" },
          { id: "gas-tube", name: "Gas Tube", slug: "gas-tube" },
          {
            id: "muzzle-device",
            name: "Muzzle Device",
            slug: "muzzle-device",
            subcategories: [
              { id: "flash-suppressor", name: "Flash Suppressor", slug: "flash-suppressor" },
              { id: "muzzle-brake", name: "Muzzle Brake", slug: "muzzle-brake" },
              { id: "compensator", name: "Compensator", slug: "compensator" },
              { id: "silencer-suppressor", name: "Silencer/Suppressor", slug: "silencer-suppressor" }
            ]
          },
          { id: "thread-protector", name: "Thread Protector", slug: "thread-protector" },
          { id: "barrel-shroud", name: "Barrel Shroud", slug: "barrel-shroud" }
        ]
      },
      {
        id: "handguard-foregrip",
        name: "Handguard/Foregrip",
        description: "Handguards and foregrips for firearms",
        slug: "handguard-foregrip",
        subcategories: [
          { id: "free-float-handguard", name: "Free-Float Handguard", slug: "free-float-handguard" },
          { id: "drop-in-handguard", name: "Drop-In Handguard", slug: "drop-in-handguard" },
          { id: "rail-system", name: "Rail System", slug: "rail-system" },
          { id: "heat-shield", name: "Heat Shield", slug: "heat-shield" },
          { id: "foregrip", name: "Foregrip", slug: "foregrip" }
        ]
      },
      {
        id: "upper-receiver",
        name: "Upper Receiver",
        description: "Upper receivers and components",
        slug: "upper-receiver",
        subcategories: [
          { id: "stripped-upper-receiver", name: "Stripped Upper Receiver", slug: "stripped-upper-receiver" },
          { id: "complete-upper-receiver", name: "Complete Upper Receiver", slug: "complete-upper-receiver" },
          { id: "forward-assist", name: "Forward Assist", slug: "forward-assist" },
          { id: "forward-assist-spring", name: "Forward Assist Spring", slug: "forward-assist-spring" },
          { id: "forward-assist-pin", name: "Forward Assist Pin", slug: "forward-assist-pin" },
          { id: "dust-cover", name: "Dust Cover", slug: "dust-cover" },
          { id: "dust-cover-spring", name: "Dust Cover Spring", slug: "dust-cover-spring" },
          { id: "dust-cover-pin", name: "Dust Cover Pin", slug: "dust-cover-pin" },
          { id: "charging-handle", name: "Charging Handle", slug: "charging-handle" },
          { id: "charging-handle-latch", name: "Charging Handle Latch", slug: "charging-handle-latch" }
        ]
      },
      {
        id: "gas-system",
        name: "Gas System",
        description: "Gas system components",
        slug: "gas-system",
        subcategories: [
          { id: "gas-tube", name: "Gas Tube", slug: "gas-tube" },
          { id: "gas-block", name: "Gas Block", slug: "gas-block" },
          { id: "gas-piston", name: "Gas Piston", slug: "gas-piston" },
          { id: "gas-rings", name: "Gas Rings", slug: "gas-rings" }
        ]
      }
    ]
  },
  {
    id: "lower-assembly",
    name: "Lower Assembly",
    description: "Components for the lower portion of firearms",
    slug: "lower-assembly",
    subcategories: [
      {
        id: "lower-receiver",
        name: "Lower Receiver",
        description: "Lower receivers and components",
        slug: "lower-receiver",
        subcategories: [
          { id: "stripped-lower-receiver", name: "Stripped Lower Receiver", slug: "stripped-lower-receiver" },
          { id: "complete-lower-receiver", name: "Complete Lower Receiver", slug: "complete-lower-receiver" },
          { id: "receiver-extension", name: "Receiver Extension (Buffer Tube)", slug: "receiver-extension" },
          { id: "buffer-tube-castle-nut", name: "Buffer Tube Castle Nut", slug: "buffer-tube-castle-nut" },
          { id: "buffer-tube-end-plate", name: "Buffer Tube End Plate", slug: "buffer-tube-end-plate" }
        ]
      },
      {
        id: "trigger-assembly",
        name: "Trigger Assembly",
        description: "Trigger components and assemblies",
        slug: "trigger-assembly",
        subcategories: [
          { id: "trigger", name: "Trigger", slug: "trigger" },
          { id: "trigger-spring", name: "Trigger Spring", slug: "trigger-spring" },
          { id: "trigger-pin", name: "Trigger Pin", slug: "trigger-pin" },
          { id: "hammer", name: "Hammer", slug: "hammer" },
          { id: "hammer-spring", name: "Hammer Spring", slug: "hammer-spring" },
          { id: "hammer-pin", name: "Hammer Pin", slug: "hammer-pin" },
          { id: "disconnector", name: "Disconnector", slug: "disconnector" },
          { id: "disconnector-spring", name: "Disconnector Spring", slug: "disconnector-spring" },
          { id: "trigger-guard", name: "Trigger Guard", slug: "trigger-guard" },
          { id: "trigger-guard-roll-pin", name: "Trigger Guard Roll Pin", slug: "trigger-guard-roll-pin" }
        ]
      },
      {
        id: "fire-control-group",
        name: "Fire Control Group (FCG)",
        description: "Fire control group components",
        slug: "fire-control-group",
        subcategories: [
          { id: "safety-selector", name: "Safety Selector", slug: "safety-selector" },
          { id: "safety-selector-detent", name: "Safety Selector Detent", slug: "safety-selector-detent" },
          { id: "safety-selector-spring", name: "Safety Selector Spring", slug: "safety-selector-spring" },
          { id: "single-stage-trigger-kit", name: "Single-Stage Trigger Kit", slug: "single-stage-trigger-kit" },
          { id: "two-stage-trigger-kit", name: "Two-Stage Trigger Kit", slug: "two-stage-trigger-kit" }
        ]
      },
      {
        id: "magazine-release",
        name: "Magazine Release",
        description: "Magazine release components",
        slug: "magazine-release",
        subcategories: [
          { id: "magazine-catch", name: "Magazine Catch", slug: "magazine-catch" },
          { id: "magazine-catch-spring", name: "Magazine Catch Spring", slug: "magazine-catch-spring" },
          { id: "magazine-catch-button", name: "Magazine Catch Button", slug: "magazine-catch-button" }
        ]
      },
      {
        id: "bolt-catch",
        name: "Bolt Catch",
        description: "Bolt catch components",
        slug: "bolt-catch",
        subcategories: [
          { id: "bolt-catch", name: "Bolt Catch", slug: "bolt-catch" },
          { id: "bolt-catch-spring", name: "Bolt Catch Spring", slug: "bolt-catch-spring" },
          { id: "bolt-catch-roll-pin", name: "Bolt Catch Roll Pin", slug: "bolt-catch-roll-pin" },
          { id: "bolt-catch-plunger", name: "Bolt Catch Plunger", slug: "bolt-catch-plunger" }
        ]
      },
      {
        id: "buffer-system",
        name: "Buffer System",
        description: "Buffer system components",
        slug: "buffer-system",
        subcategories: [
          { id: "buffer", name: "Buffer", slug: "buffer" },
          { id: "buffer-spring", name: "Buffer Spring", slug: "buffer-spring" },
          { id: "buffer-retainer", name: "Buffer Retainer", slug: "buffer-retainer" },
          { id: "buffer-retainer-spring", name: "Buffer Retainer Spring", slug: "buffer-retainer-spring" }
        ]
      },
      {
        id: "pistol-grip",
        name: "Pistol Grip",
        description: "Pistol grip components",
        slug: "pistol-grip",
        subcategories: [
          { id: "grip", name: "Grip", slug: "grip" },
          { id: "grip-screw", name: "Grip Screw", slug: "grip-screw" },
          { id: "grip-washer", name: "Grip Washer", slug: "grip-washer" }
        ]
      },
      {
        id: "stock",
        name: "Stock",
        description: "Stock components",
        slug: "stock",
        subcategories: [
          { id: "fixed-stock", name: "Fixed Stock", slug: "fixed-stock" },
          { id: "collapsible-stock", name: "Collapsible Stock", slug: "collapsible-stock" },
          { id: "folding-stock", name: "Folding Stock", slug: "folding-stock" },
          { id: "stock-latch", name: "Stock Latch", slug: "stock-latch" },
          { id: "cheek-riser", name: "Cheek Riser", slug: "cheek-riser" },
          { id: "recoil-pad", name: "Recoil Pad", slug: "recoil-pad" }
        ]
      }
    ]
  },
  {
    id: "sights-optics",
    name: "Sights and Optics",
    description: "Sighting systems and optics",
    slug: "sights-optics",
    subcategories: [
      {
        id: "iron-sights",
        name: "Iron Sights",
        description: "Iron sight components",
        slug: "iron-sights",
        subcategories: [
          { id: "front-sight-post", name: "Front Sight Post", slug: "front-sight-post" },
          { id: "front-sight-base", name: "Front Sight Base", slug: "front-sight-base" },
          { id: "rear-sight-aperture", name: "Rear Sight Aperture", slug: "rear-sight-aperture" },
          { id: "rear-sight-base", name: "Rear Sight Base", slug: "rear-sight-base" },
          { id: "sight-adjustment-tool", name: "Sight Adjustment Tool", slug: "sight-adjustment-tool" }
        ]
      },
      {
        id: "optical-sights",
        name: "Optical Sights",
        description: "Optical sighting systems",
        slug: "optical-sights",
        subcategories: [
          { id: "red-dot-sight", name: "Red Dot Sight", slug: "red-dot-sight" },
          { id: "holographic-sight", name: "Holographic Sight", slug: "holographic-sight" },
          { id: "reflex-sight", name: "Reflex Sight", slug: "reflex-sight" },
          { id: "magnified-scope", name: "Magnified Scope", slug: "magnified-scope" },
          { id: "night-vision-scope", name: "Night Vision Scope", slug: "night-vision-scope" },
          { id: "thermal-scope", name: "Thermal Scope", slug: "thermal-scope" }
        ]
      },
      {
        id: "mounting-systems",
        name: "Mounting Systems",
        description: "Optic mounting systems",
        slug: "mounting-systems",
        subcategories: [
          { id: "scope-rings", name: "Scope Rings", slug: "scope-rings" },
          { id: "scope-mount", name: "Scope Mount", slug: "scope-mount" },
          { id: "rail-riser", name: "Rail Riser", slug: "rail-riser" },
          { id: "optic-base-plate", name: "Optic Base Plate", slug: "optic-base-plate" }
        ]
      },
      {
        id: "accessories",
        name: "Accessories",
        description: "Optic accessories",
        slug: "accessories",
        subcategories: [
          { id: "lens-covers", name: "Lens Covers", slug: "lens-covers" },
          { id: "anti-reflective-device", name: "Anti-Reflective Device (ARD)", slug: "anti-reflective-device" },
          { id: "kill-flash", name: "Kill Flash", slug: "kill-flash" },
          { id: "scope-turret-caps", name: "Scope Turret Caps", slug: "scope-turret-caps" }
        ]
      }
    ]
  },
  {
    id: "magazines-feeding",
    name: "Magazines and Feeding Devices",
    description: "Magazines and feeding components",
    slug: "magazines-feeding",
    subcategories: [
      {
        id: "magazines",
        name: "Magazines",
        description: "Magazine components",
        slug: "magazines",
        subcategories: [
          { id: "detachable-box-magazine", name: "Detachable Box Magazine", slug: "detachable-box-magazine" },
          { id: "drum-magazine", name: "Drum Magazine", slug: "drum-magazine" },
          { id: "extended-magazine", name: "Extended Magazine", slug: "extended-magazine" },
          { id: "magazine-base-pad", name: "Magazine Base Pad", slug: "magazine-base-pad" },
          { id: "magazine-follower", name: "Magazine Follower", slug: "magazine-follower" },
          { id: "magazine-spring", name: "Magazine Spring", slug: "magazine-spring" }
        ]
      },
      {
        id: "shotgun-shell-holders",
        name: "Shotgun Shell Holders",
        description: "Shotgun shell holding devices",
        slug: "shotgun-shell-holders",
        subcategories: [
          { id: "side-saddle", name: "Side Saddle", slug: "side-saddle" },
          { id: "shell-carrier", name: "Shell Carrier", slug: "shell-carrier" }
        ]
      },
      {
        id: "speed-loaders",
        name: "Speed Loaders",
        description: "Speed loading devices",
        slug: "speed-loaders",
        subcategories: [
          { id: "circular-speed-loader", name: "Circular Speed Loader", slug: "circular-speed-loader" },
          { id: "strip-speed-loader", name: "Strip Speed Loader", slug: "strip-speed-loader" }
        ]
      },
      {
        id: "magazine-accessories",
        name: "Magazine Accessories",
        description: "Magazine accessories",
        slug: "magazine-accessories",
        subcategories: [
          { id: "magazine-coupler", name: "Magazine Coupler", slug: "magazine-coupler" },
          { id: "magazine-loader-unloader", name: "Magazine Loader/Unloader", slug: "magazine-loader-unloader" },
          { id: "magazine-extension-tube", name: "Magazine Extension Tube", slug: "magazine-extension-tube" }
        ]
      }
    ]
  },
  {
    id: "muzzle-devices",
    name: "Muzzle Devices and Barrel Accessories",
    description: "Muzzle devices and barrel accessories",
    slug: "muzzle-devices",
    subcategories: [
      {
        id: "muzzle-devices",
        name: "Muzzle Devices",
        description: "Muzzle device components",
        slug: "muzzle-devices",
        subcategories: [
          { id: "flash-hider", name: "Flash Hider", slug: "flash-hider" },
          { id: "muzzle-brake", name: "Muzzle Brake", slug: "muzzle-brake" },
          { id: "compensator", name: "Compensator", slug: "compensator" },
          { id: "suppressor", name: "Suppressor", slug: "suppressor" },
          { id: "linear-compensator", name: "Linear Compensator", slug: "linear-compensator" }
        ]
      },
      {
        id: "barrel-accessories",
        name: "Barrel Accessories",
        description: "Barrel accessory components",
        slug: "barrel-accessories",
        subcategories: [
          { id: "barrel-nut-wrench", name: "Barrel Nut Wrench", slug: "barrel-nut-wrench" },
          { id: "barrel-shims", name: "Barrel Shims", slug: "barrel-shims" },
          { id: "crush-washer", name: "Crush Washer", slug: "crush-washer" },
          { id: "peel-washer", name: "Peel Washer", slug: "peel-washer" },
          { id: "thread-adapter", name: "Thread Adapter", slug: "thread-adapter" }
        ]
      }
    ]
  },
  // Add more top-level categories as needed
];

// Helper function to find a category by its slug path
export function findCategoryByPath(path: string[]): Category | null {
  if (!path || path.length === 0) return null;

  const findInCategories = (categories: Category[], pathSegments: string[], currentIndex: number): Category | null => {
    if (currentIndex >= pathSegments.length) return null;
    
    const currentSlug = pathSegments[currentIndex];
    const category = categories.find(cat => cat.slug === currentSlug);
    
    if (!category) return null;
    
    if (currentIndex === pathSegments.length - 1) {
      return category;
    }
    
    if (!category.subcategories) return null;
    
    return findInCategories(category.subcategories, pathSegments, currentIndex + 1);
  };
  
  return findInCategories(categories, path, 0);
}

// Helper function to get all categories flattened
export function getAllCategories(): Category[] {
  const result: Category[] = [];
  
  const flattenCategories = (categories: Category[]) => {
    for (const category of categories) {
      result.push(category);
      if (category.subcategories && category.subcategories.length > 0) {
        flattenCategories(category.subcategories);
      }
    }
  };
  
  flattenCategories(categories);
  return result;
}

// Helper function to get breadcrumb path for a category
export function getCategoryBreadcrumbs(path: string[]): { name: string; slug: string; path: string[] }[] {
  const result: { name: string; slug: string; path: string[] }[] = [];
  
  let currentPath: string[] = [];
  for (let i = 0; i < path.length; i++) {
    currentPath = [...currentPath, path[i]];
    const category = findCategoryByPath(currentPath);
    if (category) {
      result.push({
        name: category.name,
        slug: category.slug,
        path: [...currentPath]
      });
    }
  }
  
  return result;
}
