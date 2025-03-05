"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  useCategoriesAndSubcategories, 
  useManufacturers, 
  useCompatibleFirearmModels,
  usePartHierarchy,
  PartHierarchyItem,
  Manufacturer
} from '@/lib/api';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ProductFiltersProps {
  initialComponent?: string;
  isAssembly?: boolean;
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  category: string | null;
  subcategories: string[];
  manufacturers: string[];
  compatibilities: string[];
  priceRange: [number, number];
  isAssembly?: boolean;
}

// Map component IDs to their categories and subcategories
const componentCategoryMap: Record<string, { category: string, subcategory: string }> = {
  'upper-receiver': { category: 'Upper Assembly', subcategory: 'Upper Receiver' },
  'lower-receiver': { category: 'Lower Assembly', subcategory: 'Lower Receiver' },
  'barrel': { category: 'Upper Assembly', subcategory: 'Barrel' },
  'handguard': { category: 'Upper Assembly', subcategory: 'Handguard' },
  'bolt-carrier-group': { category: 'Upper Assembly', subcategory: 'Bolt Carrier Group' },
  'trigger': { category: 'Lower Assembly', subcategory: 'Trigger Group' },
  'grip': { category: 'Lower Assembly', subcategory: 'Grip' },
  'stock': { category: 'Lower Assembly', subcategory: 'Stock' },
  'optics': { category: 'Optics', subcategory: 'Optics' },
};

export default function ProductFilters({ initialComponent, isAssembly, onFilterChange }: ProductFiltersProps) {
  // Fetch data from API
  const { categories, subcategories, loading: categoriesLoading } = useCategoriesAndSubcategories();
  const { manufacturers, loading: manufacturersLoading } = useManufacturers();
  const { models: compatibilities, loading: compatibilitiesLoading } = useCompatibleFirearmModels();
  const { hierarchy: partHierarchy, loading: hierarchyLoading } = usePartHierarchy();

  // State for selected filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [selectedCompatibilities, setSelectedCompatibilities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  
  // State for expanded accordion items
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Initialize filters based on initialComponent
  useEffect(() => {
    if (initialComponent && componentCategoryMap[initialComponent]) {
      const { category, subcategory } = componentCategoryMap[initialComponent];
      setSelectedCategories([category]);
      setSelectedSubcategories([subcategory]);
      setExpandedCategories([category]); // Expand the relevant category
      setExpandedItems([subcategory]); // Expand the relevant subcategory
    }
  }, [initialComponent]);

  // Find the ID of a part in the hierarchy by its name
  const findPartIdByName = useCallback((name: string, hierarchy: PartHierarchyItem[]): string | null => {
    for (const item of hierarchy) {
      if (item.name === name) {
        return item.id;
      }
      if (item.children && item.children.length > 0) {
        const childResult = findPartIdByName(name, item.children);
        if (childResult) {
          return childResult;
        }
      }
    }
    return null;
  }, []);

  // Initialize expanded items when hierarchy loads
  useEffect(() => {
    if (partHierarchy.length > 0 && initialComponent && componentCategoryMap[initialComponent]) {
      const { category } = componentCategoryMap[initialComponent];
      const categoryId = findPartIdByName(category, partHierarchy);
      if (categoryId) {
        setExpandedItems(prev => [...prev, categoryId]);
      }
    }
  }, [partHierarchy, initialComponent, findPartIdByName]);

  // Notify parent component when filters change
  useEffect(() => {
    if (onFilterChange) {
      const currentFilters = {
        category: selectedCategories.length > 0 ? selectedCategories[0] : null,
        subcategories: selectedSubcategories,
        manufacturers: selectedManufacturers,
        compatibilities: selectedCompatibilities,
        priceRange,
        isAssembly,
      };
      
      onFilterChange(currentFilters);
    }
  }, [
    selectedCategories, 
    selectedSubcategories, 
    selectedManufacturers, 
    selectedCompatibilities, 
    priceRange, 
    isAssembly,
    onFilterChange
  ]);

  // Toggle expansion of an item
  const toggleExpand = useCallback((id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  // Handle part selection at any level of the hierarchy
  const handlePartSelection = useCallback((part: PartHierarchyItem, checked: boolean) => {
    // Update selected parts
    if (checked) {
      setSelectedParts(prev => [...prev, part.id]);
      
      // Add parent categories based on the hierarchy level
      if (part.children && part.children.length > 0) {
        // This is a top-level or mid-level category
        setSelectedCategories(prev => [...prev, part.name]);
      } else {
        // This is likely a leaf/component
        setSelectedSubcategories(prev => [...prev, part.id]);
      }
      
      // Expand the item if it has children
      if (part.children && part.children.length > 0) {
        setExpandedItems(prev => [...prev, part.id]);
      }
    } else {
      // Remove this part
      setSelectedParts(prev => prev.filter(id => id !== part.id));
      
      // If it has children, it's a category - remove it and all its children
      if (part.children && part.children.length > 0) {
        setSelectedCategories(prev => prev.filter(category => category !== part.name));
        
        // Remove all child items recursively
        const childIdsToRemove = getAllChildIds(part);
        setSelectedParts(prev => prev.filter(id => !childIdsToRemove.includes(id)));
        setSelectedSubcategories(prev => prev.filter(id => !childIdsToRemove.includes(id)));
      } else {
        // Just remove this subcategory
        setSelectedSubcategories(prev => prev.filter(id => id !== part.id));
      }
    }
  }, []);

  // Helper function to get all child IDs recursively
  const getAllChildIds = useCallback((part: PartHierarchyItem): string[] => {
    const ids: string[] = [part.id];
    
    if (part.children) {
      for (const child of part.children) {
        ids.push(...getAllChildIds(child));
      }
    }
    
    return ids;
  }, []);

  const handleManufacturerChange = useCallback((manufacturerId: string, checked: boolean) => {
    setSelectedManufacturers(prev => 
      checked
        ? [...prev, manufacturerId]
        : prev.filter(id => id !== manufacturerId)
    );
  }, []);

  const handleCompatibilityChange = useCallback((compatibilityId: string, checked: boolean) => {
    setSelectedCompatibilities(prev => 
      checked
        ? [...prev, compatibilityId]
        : prev.filter(id => id !== compatibilityId)
    );
  }, []);

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = value;
      return newRange;
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedParts([]);
    setSelectedManufacturers([]);
    setSelectedCompatibilities([]);
    setPriceRange([0, 1000]);
  }, []);

  // Recursive function to render part hierarchy
  const renderPartHierarchy = useCallback((parts: PartHierarchyItem[], level = 0) => {
    return parts.map(part => {
      const hasChildren = part.children && part.children.length > 0;
      const isSelected = selectedParts.includes(part.id);
      const isExpanded = expandedItems.includes(part.id);
      
      // Calculate the appropriate margin class based on the level
      const marginClass = level === 0 ? '' : level === 1 ? 'ml-4' : level === 2 ? 'ml-8' : 'ml-12';
      
      return (
        <div key={part.id} className={marginClass}>
          <div className="flex items-center py-2">
            {hasChildren ? (
              <button 
                onClick={() => toggleExpand(part.id)}
                className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ) : (
              <span className="w-6 mr-2"></span>
            )}
            <Checkbox 
              id={`part-${part.id}`}
              checked={isSelected}
              onCheckedChange={(checked) => 
                handlePartSelection(part, checked === true)
              }
              className="mr-2"
            />
            <Label 
              htmlFor={`part-${part.id}`}
              className={`text-sm ${level === 0 ? 'font-medium text-gray-900 dark:text-gray-300' : 'text-gray-700 dark:text-gray-400'}`}
            >
              {part.name}
            </Label>
          </div>
          
          {hasChildren && isExpanded && (
            <div className="ml-6">
              {renderPartHierarchy(part.children || [], level + 1)}
            </div>
          )}
        </div>
      );
    });
  }, [expandedItems, selectedParts, toggleExpand, handlePartSelection]);

  // Show loading state while data is being fetched
  if (categoriesLoading || manufacturersLoading || compatibilitiesLoading || hierarchyLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Filters</h2>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Filters</h2>
      
      {isAssembly && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Showing assembly products only
          </p>
        </div>
      )}
      
      {/* Part Type Hierarchy */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Product Type</h3>
        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md max-h-80 overflow-y-auto">
          {partHierarchy.length > 0 ? (
            renderPartHierarchy(partHierarchy)
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No product categories found.</p>
          )}
        </div>
      </div>
      
      {/* Manufacturer Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Manufacturer</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {manufacturers.map(manufacturer => (
            <div key={manufacturer.id} className="flex items-center">
              <Checkbox 
                id={`manufacturer-${manufacturer.id}`}
                checked={selectedManufacturers.includes(manufacturer.id.toString())}
                onCheckedChange={(checked) => 
                  handleManufacturerChange(manufacturer.id.toString(), checked === true)
                }
                className="mr-2"
              />
              <Label 
                htmlFor={`manufacturer-${manufacturer.id}`}
                className="text-sm text-gray-700 dark:text-gray-400"
              >
                {manufacturer.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Compatibility Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Compatibility</h3>
        <div className="space-y-2">
          {compatibilities.map(compatibility => (
            <div key={compatibility} className="flex items-center">
              <Checkbox 
                id={`compatibility-${compatibility}`}
                checked={selectedCompatibilities.includes(compatibility)}
                onCheckedChange={(checked) => 
                  handleCompatibilityChange(compatibility, checked === true)
                }
                className="mr-2"
              />
              <Label 
                htmlFor={`compatibility-${compatibility}`}
                className="text-sm text-gray-700 dark:text-gray-400"
              >
                {compatibility}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Price Range</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-900 dark:text-gray-300">${priceRange[0]}</span>
          <span className="text-gray-900 dark:text-gray-300">${priceRange[1]}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="min-price" className="block text-sm text-gray-900 dark:text-gray-300 mb-1">Min</label>
            <input
              type="number"
              id="min-price"
              min="0"
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(e, 0)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="max-price" className="block text-sm text-gray-900 dark:text-gray-300 mb-1">Max</label>
            <input
              type="number"
              id="max-price"
              min={priceRange[0]}
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(e, 1)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Reset Button */}
      <div className="flex flex-col space-y-2">
        <button
          onClick={handleResetFilters}
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
} 