import { useEffect, useState } from 'react';

// Base API URL - should be configured based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Types based on backend models
export interface FirearmModel {
  id: number;
  name: string;
  description: string;
  manufacturer_id: number;
  category: string;
  subcategory: string;
  variant: string;
  specifications: Record<string, any>;
  // Legacy fields - may not be used anymore
  required_parts?: Record<string, boolean>;
  compatible_parts: Record<string, any>;
  // New schema field with nested structure
  parts: Record<string, {
    type: string;
    sub_parts: Record<string, any>;
  }>;
  images: string[];
  price_range: string;
  created_at: string;
  updated_at: string;
}

export interface Part {
  id: number;
  name: string;
  description: string;
  manufacturer_id: number;
  category: string;
  subcategory: string;
  is_prebuilt: boolean;
  sub_components: Array<{
    name: string;
    type: string;
  }>;
  compatible_models: Array<{
    model: string;
    attachment_point?: string;
    is_required?: boolean;
  }>;
  requires: Array<{
    part_id: number;
    name: string;
  }>;
  specifications: Record<string, any>;
  images: string[];
  price: number;
  availability: string;
  weight: number;
  dimensions: string;
  created_at: string;
  updated_at: string;
}

export interface Manufacturer {
  id: number;
  name: string;
  description: string;
  website: string;
  logo_url: string;
  contact_info: Record<string, any>;
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
  return part.is_prebuilt && 
         part.sub_components && 
         (Array.isArray(part.sub_components) ? 
           part.sub_components.length > 0 : 
           Object.keys(part.sub_components as any).length > 0);
}

// Helper function to extract sub-component names from a part
export function getSubComponentNames(part: Part): string[] {
  if (!part.sub_components) return [];

  if (Array.isArray(part.sub_components)) {
    // New schema format - array of objects with name and type
    return part.sub_components.map(subComp => subComp.name);
  } 
  
  // Legacy format - object with keys as component names
  // This is kept for backward compatibility
  if (typeof part.sub_components === 'object') {
    return Object.keys(part.sub_components as any);
  }
  
  return [];
}

// Helper function to find the parts that correspond to an assembly's sub-components
export function getSubComponentParts(assembly: Part, allParts: Part[]): Part[] {
  if (!assembly.sub_components) return [];
  
  const subComponentNames = getSubComponentNames(assembly);
  
  return subComponentNames.flatMap(name => {
    return allParts.filter(part => 
      part.category.toLowerCase() === name.toLowerCase() ||
      part.subcategory.toLowerCase() === name.toLowerCase() ||
      part.name.toLowerCase().includes(name.toLowerCase())
    );
  });
}

// Helper function to get parts compatible with a given firearm model
export function getCompatiblePartsForModel(parts: Part[], model: FirearmModel): Part[] {
  if (!parts || !model) return [];
  
  return parts.filter(part => {
    if (!part.compatible_models) return false;
    
    if (Array.isArray(part.compatible_models)) {
      // New schema format - array of objects with model name
      return part.compatible_models.some(compatModel => 
        compatModel.model.toLowerCase() === model.name.toLowerCase()
      );
    }
    
    // Legacy format - array of strings
    if (Array.isArray(part.compatible_models)) {
      return (part.compatible_models as string[]).some(
        modelName => modelName.toLowerCase() === model.name.toLowerCase()
      );
    }
    
    return false;
  });
}

// Helper function to filter parts by firearm model requirements
export function getRequiredPartsForModel(parts: Part[], model: FirearmModel): Part[] {
  if (!model.required_parts) return [];
  
  // Get categories that are required
  const requiredCategories = Object.entries(model.required_parts)
    .filter(([_, isRequired]) => isRequired)
    .map(([category]) => category);
  
  return parts.filter(part => 
    requiredCategories.includes(part.category) || 
    (part.subcategory && requiredCategories.includes(part.subcategory))
  );
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