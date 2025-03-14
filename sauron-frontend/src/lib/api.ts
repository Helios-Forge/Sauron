import { useEffect, useState } from 'react';

// Base API URL - should be configured based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Types based on backend models
export interface PartCategory {
  id: number;
  name: string;
  parent_category_id?: number | null;
  description?: string;
  child_categories?: PartCategory[];
  ChildCategories?: PartCategory[];
  is_required?: boolean; // For FirearmModelPartCategory relationships
  created_at?: string;
  updated_at?: string;
}

export interface FirearmModelPartCategory {
  id: number;
  firearm_model_id: number;
  part_category_id: number;
  is_required: boolean;
  created_at?: string;
}

export interface FirearmModel {
  id: number;
  name: string;
  description: string;
  manufacturer_id: number;
  category: string;
  subcategory: string;
  variant: string;
  specifications: Record<string, any>;
  // New schema field with nested structure
  part_categories?: PartCategory[];
  images: string[];
  price_range: string;
  created_at: string;
  updated_at: string;
}

export interface Manufacturer {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  country?: string;
  founded?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Part {
  id: number;
  name: string;
  description: string;
  manufacturer_id: number;
  // New schema field for part category
  part_category_id?: number;
  part_category?: PartCategory;
  is_prebuilt: boolean;
  images: string[];
  weight: number;
  dimensions: string;
  created_at: string;
  updated_at: string;
}

export interface ProductListing {
  id: number;
  seller_id: number;
  part_id: number;
  prebuilt_id: number;
  price: number;
  shipping_cost: number;
  availability: string;
  product_url: string;
  created_at: string;
  updated_at: string;
}

export interface Seller {
  id: number;
  name: string;
  website: string;
  logo_url: string;
  description: string;
  contact_info: Record<string, any>;
  is_affiliate: boolean;
  affiliate_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Part Hierarchy interface
export interface PartHierarchyItem {
  name: string;
  id: string;
  children?: PartHierarchyItem[];
}

// API Functions

// Fetch all firearm models
export async function getFirearmModels(): Promise<FirearmModel[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/firearm-models`);
    if (!response.ok) {
      throw new Error(`Error fetching firearm models: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch firearm models:', error);
    return [];
  }
}

// Fetch a specific firearm model by ID
export async function getFirearmModelById(id: number): Promise<FirearmModel | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/firearm-models/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching firearm model: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch firearm model with ID ${id}:`, error);
    return null;
  }
}

// Fetch all parts
export async function getParts(): Promise<Part[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/parts`);
    if (!response.ok) {
      throw new Error(`Error fetching parts: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch parts:', error);
    return [];
  }
}

// Fetch a specific part by ID
export async function getPartById(id: number): Promise<Part | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/parts/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching part: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch part with ID ${id}:`, error);
    return null;
  }
}

// Fetch parts by category
export async function getPartsByCategory(category: string): Promise<Part[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/parts/category/${category}`);
    if (!response.ok) {
      throw new Error(`Error fetching parts by category: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch parts for category ${category}:`, error);
    return [];
  }
}

// Fetch compatible parts for a specific part
export async function getCompatibleParts(partId: number): Promise<Part[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/parts/${partId}/compatible`);
    if (!response.ok) {
      throw new Error(`Error fetching compatible parts: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch compatible parts for part ID ${partId}:`, error);
    return [];
  }
}

// Fetch product listings for a part
export async function getProductListingsByPartId(partId: number): Promise<ProductListing[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/listings/part/${partId}`);
    if (!response.ok) {
      throw new Error(`Error fetching product listings: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch product listings for part ID ${partId}:`, error);
    return [];
  }
}

// Fetch sellers
export async function getSellers(): Promise<Seller[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sellers`);
    if (!response.ok) {
      throw new Error(`Error fetching sellers: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch sellers:', error);
    return [];
  }
}

// Fetch a specific seller by ID
export async function getSellerById(id: number): Promise<Seller | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/sellers/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching seller: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch seller with ID ${id}:`, error);
    return null;
  }
}

// Helper function to check if a part is an assembly (pre-built)
export function isAssembly(part: Part): boolean {
  // Now we just check the is_prebuilt flag
  return part.is_prebuilt;
}

// Helper function to extract sub-component names from a part
export function getSubComponentNames(part: Part): string[] {
  // With the removal of sub_components, we can't directly determine this
  // This is now a stub function maintained for compatibility
  console.warn('getSubComponentNames is deprecated - sub_components field has been removed');
  return [];
}

// Helper function to find the parts that correspond to an assembly's sub-components
export function getSubComponentParts(assembly: Part, allParts: Part[]): Part[] {
  // This functionality now requires using part categories instead
  // This is a stub function maintained for compatibility
  console.warn('getSubComponentParts is deprecated - sub_components field has been removed');
  return [];
}

// Helper function to get parts compatible with a given firearm model
export function getCompatiblePartsForModel(parts: Part[], model: FirearmModel): Part[] {
  // With the removal of compatible_models, compatibility is now determined by FirearmModelPartCategory
  // This is a stub function maintained for compatibility
  console.warn('getCompatiblePartsForModel is deprecated - compatible_models field has been removed');
  return [];
}

// Helper function to get required parts for a firearm model
export function getRequiredPartsForModel(parts: Part[], model: FirearmModel): Part[] {
  // With the migration to PartCategories and FirearmModelPartCategory, this is now determined differently
  // This is a stub function maintained for compatibility
  console.warn('getRequiredPartsForModel is deprecated - required_parts field has been removed');
  return [];
}

// Custom hook for fetching firearm models with loading state
export function useFirearmModels() {
  const [models, setModels] = useState<FirearmModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const data = await getFirearmModels();
        setModels(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  return { models, loading, error };
}

// Custom hook for fetching parts with loading state
export function useParts() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        setLoading(true);
        const data = await getParts();
        setParts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, []);

  return { parts, loading, error };
}

// Fetch all manufacturers
export async function getManufacturers(): Promise<Manufacturer[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/manufacturers`);
    if (!response.ok) {
      throw new Error(`Error fetching manufacturers: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch manufacturers:', error);
    return [];
  }
}

// Fetch a specific manufacturer by ID
export async function getManufacturerById(id: number): Promise<Manufacturer | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/manufacturers/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching manufacturer: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch manufacturer with ID ${id}:`, error);
    return null;
  }
}

// Get hierarchical part categories from backend endpoint
export async function getCategories(recursive: boolean = true): Promise<PartCategory[]> {
  try {
    // Ensure we always get the complete hierarchy by setting recursive=true
    const response = await fetch(`${API_BASE_URL}/part-categories?recursive=true`);
    
    if (!response.ok) {
      throw new Error(`Error fetching categories: ${response.statusText}`);
    }
    
    // Log the response to help with debugging
    const data = await response.json();
    console.log('Part categories hierarchy:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

// Get subcategories for a specific category from backend endpoint
export async function getSubcategories(category: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/part-subcategories/${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error(`Error fetching subcategories: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch subcategories for category ${category}:`, error);
    return [];
  }
}

// Get all subcategories grouped by category from backend endpoint
export async function getAllSubcategories(): Promise<Record<string, string[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/part-subcategories`);
    if (!response.ok) {
      throw new Error(`Error fetching subcategories: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch all subcategories:', error);
    return {};
  }
}

// Get all compatible firearm models from backend endpoint
export async function getCompatibleFirearmModels(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/compatible-models`);
    if (!response.ok) {
      throw new Error(`Error fetching compatible models: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch compatible firearm models:', error);
    return [];
  }
}

// Custom hook for fetching manufacturers with loading state
export function useManufacturers() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchManufacturers = async () => {
      try {
        setLoading(true);
        const data = await getManufacturers();
        if (isMounted) {
          setManufacturers(data);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error occurred'));
          setLoading(false);
        }
      }
    };

    fetchManufacturers();
    
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array so it only runs once

  return { manufacturers, loading, error };
}

// Enhanced hook for fetching the complete part category hierarchy
export function useCategoriesAndSubcategories() {
  const [categoryHierarchy, setCategoryHierarchy] = useState<PartCategory[]>([]);
  const [flatCategories, setFlatCategories] = useState<Record<string, PartCategory>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get hierarchical categories data from the API
        const hierarchicalCategories = await getCategories(true);
        
        if (isMounted) {
          // Log the hierarchical structure for debugging
          console.log('Received hierarchical categories:', hierarchicalCategories);
          
          // Process the categories to normalize the field names
          const processedCategories = hierarchicalCategories.map(normalizeCategory);
          
          // Save the hierarchical structure
          setCategoryHierarchy(processedCategories);
          
          // Create a flat map of all categories for easy lookup
          const categoriesMap: Record<string, PartCategory> = {};
          
          // Function to recursively flatten the category hierarchy
          const flattenCategories = (categories: PartCategory[]): void => {
            if (!categories) return;
            
            categories.forEach(category => {
              if (!category) return;
              
              categoriesMap[category.id.toString()] = category;
              
              if (category.child_categories && category.child_categories.length > 0) {
                flattenCategories(category.child_categories);
              }
            });
          };
          
          flattenCategories(processedCategories);
          console.log('Flattened categories map:', categoriesMap);
          setFlatCategories(categoriesMap);
          
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error occurred'));
          setLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array so it only runs once

  return { categoryHierarchy, flatCategories, loading, error };
}

// Helper function to normalize category field names
function normalizeCategory(category: PartCategory): PartCategory {
  // Create a new object with the normalized field names
  const normalized: PartCategory = {
    ...category,
    // Use ChildCategories if available, otherwise use child_categories or empty array
    child_categories: category.ChildCategories || category.child_categories || []
  };
  
  // Process child categories recursively
  if (normalized.child_categories && normalized.child_categories.length > 0) {
    normalized.child_categories = normalized.child_categories.map(normalizeCategory);
  }
  
  return normalized;
}

// Custom hook for fetching compatible firearm models with loading state
export function useCompatibleFirearmModels() {
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchModels = async () => {
      try {
        setLoading(true);
        const data = await getCompatibleFirearmModels();
        if (isMounted) {
          setModels(data);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error occurred'));
          setLoading(false);
        }
      }
    };

    fetchModels();
    
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array so it only runs once

  return { models, loading, error };
}

// Get part hierarchy from backend
export async function getPartHierarchy(): Promise<PartHierarchyItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/part-hierarchy`);
    if (!response.ok) {
      throw new Error(`Error fetching part hierarchy: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch part hierarchy:', error);
    return [];
  }
}

// Custom hook for fetching part hierarchy
export function usePartHierarchy() {
  const [hierarchy, setHierarchy] = useState<PartHierarchyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchHierarchy = async () => {
      try {
        setLoading(true);
        const data = await getPartHierarchy();
        if (isMounted) {
          setHierarchy(data);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error occurred'));
          setLoading(false);
        }
      }
    };

    fetchHierarchy();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return { hierarchy, loading, error };
}

// Fetch part categories with optional recursive flag
export async function getPartCategories(recursive: boolean = false): Promise<PartCategory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/part-categories?recursive=${recursive}`);
    if (!response.ok) {
      throw new Error('Failed to fetch part categories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching part categories:', error);
    return [];
  }
}

// Fetch a single part category by ID with optional recursive flag
export async function getPartCategoryById(id: number, recursive: boolean = false): Promise<PartCategory | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/part-categories/${id}?recursive=${recursive}`);
    if (!response.ok) {
      throw new Error('Failed to fetch part category');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching part category with ID ${id}:`, error);
    return null;
  }
}

// Fetch parts by category ID (new schema)
export async function getPartsByCategoryId(categoryId: number): Promise<Part[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/parts?category_id=${categoryId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch parts by category ID');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching parts for category ID ${categoryId}:`, error);
    return [];
  }
}

// Fetch categories for a specific firearm model using the proper part_categories tables
export async function getFirearmModelCategories(
  modelId: number, 
  required: boolean | null = null,
  recursive: boolean = true
): Promise<PartCategory[]> {
  try {
    // Use the proper endpoint that connects to the part_categories and firearm-model-part-categories tables
    let url = `${API_BASE_URL}/part-categories/firearm/${modelId}?recursive=${recursive}`;
    if (required !== null) {
      url += `&required=${required}`;
    }
    
    console.log(`Fetching firearm model categories from part-categories endpoint: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch firearm model categories: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully retrieved ${data.length} categories using proper part_categories endpoint`);
    
    // Process data to ensure hierarchical relationships are clear
    if (data.length > 0) {
      // Log the structure of a sample item to help with debugging
      console.log('Sample category structure:', data[0]);
      
      // Check if we're receiving the proper hierarchical data
      const hasChildCategories = data.some((cat: PartCategory) => 
        (cat.child_categories && cat.child_categories.length > 0) || 
        (cat.ChildCategories && cat.ChildCategories.length > 0)
      );
      
      if (!hasChildCategories && recursive) {
        console.warn('Received data does not contain child_categories property despite recursive=true');
      }
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching categories for firearm model with ID ${modelId}:`, error);
    return [];
  }
}

// Hook to use part categories
export function usePartCategories(recursive: boolean = false) {
  const [categories, setCategories] = useState<PartCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getPartCategories(recursive);
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error('Error in usePartCategories:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [recursive]);

  return { categories, loading, error };
}

// Fetch complete hierarchical structure of categories for a specific firearm model
export async function getFirearmModelCategoriesHierarchy(modelId: number): Promise<PartCategory[]> {
  try {
    // Use the dedicated endpoint that returns a complete hierarchy for a firearm model
    const url = `${API_BASE_URL}/firearm-models/${modelId}/categories-hierarchy`;
    
    console.log(`Fetching complete category hierarchy for firearm model: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch hierarchical categories: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully retrieved hierarchical categories: ${data.length} top-level categories`);
    
    // Process data to ensure is_required flag is properly set
    if (data.length > 0) {
      console.log('Sample category structure:', JSON.stringify(data[0], null, 2));
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching hierarchical categories for firearm model with ID ${modelId}:`, error);
    throw error; // Rethrow to allow proper error handling in the component
  }
} 