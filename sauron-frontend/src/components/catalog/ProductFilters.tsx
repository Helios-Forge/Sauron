"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  useCategoriesAndSubcategories, 
  useManufacturers, 
  useCompatibleFirearmModels,
  usePartHierarchy,
  PartHierarchyItem,
  Manufacturer,
  PartCategory
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
import React from 'react';

interface ProductFiltersProps {
  initialComponent?: string;
  initialFilters?: FilterState;
  isAssembly?: boolean;
  onFilterChange?: (filters: FilterState) => void;
  setIsFiltering?: (isFiltering: boolean) => void;
}

interface FilterState {
  // This now only contains category IDs
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

// Create a separate CategoryCheckbox component to prevent re-rendering issues
interface CategoryCheckboxProps {
  category: string;
  displayName: string;
  isSelected: boolean;
  onChange: (category: string, isChecked: boolean) => void;
}

// This is a pure component that won't re-render unless its specific props change
const CategoryCheckbox = React.memo(({ category, displayName, isSelected, onChange }: CategoryCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={`category-${category}`}
        checked={isSelected}
        onCheckedChange={(checked) => onChange(category, checked === true)}
      />
      <Label
        htmlFor={`category-${category}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {displayName}
      </Label>
    </div>
  );
});

// Create subcategory checkbox component
interface SubcategoryCheckboxProps {
  subcategory: string;
  displayName: string;
  isSelected: boolean;
  onChange: (subcategory: string, isChecked: boolean) => void;
}

const SubcategoryCheckbox = React.memo(({ subcategory, displayName, isSelected, onChange }: SubcategoryCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={`subcategory-${subcategory}`}
        checked={isSelected}
        onCheckedChange={(checked) => onChange(subcategory, checked === true)}
      />
      <Label
        htmlFor={`subcategory-${subcategory}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {displayName}
      </Label>
    </div>
  );
});

// Create manufacturer checkbox component 
interface ManufacturerCheckboxProps {
  manufacturer: { id: number; name: string };
  isSelected: boolean;
  onChange: (manufacturerId: string, isChecked: boolean) => void;
}

const ManufacturerCheckbox = React.memo(({ manufacturer, isSelected, onChange }: ManufacturerCheckboxProps) => {
  // Memoize the onCheckedChange handler
  const handleCheckedChange = useCallback((checked: boolean) => {
    onChange(manufacturer.id.toString(), checked === true);
  }, [manufacturer.id, onChange]);
  
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={`manufacturer-${manufacturer.id}`}
        checked={isSelected}
        onCheckedChange={handleCheckedChange}
      />
      <Label
        htmlFor={`manufacturer-${manufacturer.id}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {manufacturer.name}
      </Label>
    </div>
  );
});

// Create assembly checkbox component
interface AssemblyCheckboxProps {
  isSelected: boolean;
  onChange: (isChecked: boolean) => void;
}

const AssemblyCheckbox = React.memo(({ isSelected, onChange }: AssemblyCheckboxProps) => {
  // Memoize the onCheckedChange handler
  const handleCheckedChange = useCallback((checked: boolean) => {
    onChange(checked === true);
  }, [onChange]);
  
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="is-assembly"
        checked={isSelected}
        onCheckedChange={handleCheckedChange}
      />
      <Label
        htmlFor="is-assembly"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Show Assemblies
      </Label>
    </div>
  );
});

// Create a hierarchical category component with collapsible nesting
interface CategoryTreeProps {
  categories: PartCategory[];
  selectedCategories: string[];
  onCategoryChange: (category: string, isChecked: boolean) => void;
}

const CategoryTree = React.memo(({ 
  categories, 
  selectedCategories, 
  onCategoryChange,
}: CategoryTreeProps) => {
  // Memoize the onCheckedChange handlers for each category
  const getCheckedChangeHandler = useCallback((categoryId: string) => {
    return (checked: boolean) => onCategoryChange(categoryId, checked === true);
  }, [onCategoryChange]);
  
  // Default to empty array if categories is undefined
  const categoriesToRender = categories || [];
  
  return (
    <div className="space-y-1">
      {categoriesToRender.map((category) => {
        // Check if this category has children
        const hasChildren = category.child_categories && category.child_categories.length > 0;
        
        // Memoize the handler for this specific category
        const handleCheckedChange = useMemo(() => 
          getCheckedChangeHandler(category.id.toString()),
        [getCheckedChangeHandler, category.id]);
        
        return (
          <div key={category.id} className="rounded-sm">
            {hasChildren ? (
              <Accordion type="single" collapsible defaultValue={category.id.toString()} className="border-none">
                <AccordionItem value={category.id.toString()} className="border-b-0 mb-1">
                  <div className="flex items-center">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id.toString())}
                      onCheckedChange={handleCheckedChange}
                      className="mr-2"
                    />
                    <AccordionTrigger className="py-1 hover:no-underline flex-1">
                      <span className="text-sm font-medium text-left">{category.name}</span>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent className="pl-6 pt-1 pb-0">
                    <CategoryTree
                      categories={category.child_categories || []}
                      selectedCategories={selectedCategories}
                      onCategoryChange={onCategoryChange}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <div className="flex items-center py-1 pl-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm transition-colors">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id.toString())}
                  onCheckedChange={handleCheckedChange}
                  className="mr-2"
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-medium cursor-pointer w-full"
                >
                  {category.name}
                </Label>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

export default function ProductFilters({ 
  initialComponent, 
  initialFilters,
  isAssembly, 
  onFilterChange,
  setIsFiltering
}: ProductFiltersProps) {
  // Fetch data from API
  const { categoryHierarchy, flatCategories, loading: categoriesLoading } = useCategoriesAndSubcategories();
  const { manufacturers, loading: manufacturersLoading } = useManufacturers();
  const { models: compatibilities, loading: compatibilitiesLoading } = useCompatibleFirearmModels();
  const { hierarchy: partHierarchy, loading: hierarchyLoading } = usePartHierarchy();

  // Add this ref at the top level of the component
  const prevFiltersRef = useRef<FilterState | null>(null);

  // State for selected filters - we only need to store category IDs
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [selectedCompatibilities, setSelectedCompatibilities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedIsAssembly, setSelectedIsAssembly] = useState<boolean | undefined>(isAssembly);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  
  // State for expanded accordion items
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Helper function to compare arrays
  const areArraysEqual = useCallback((a: any[], b: any[]) => {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  }, []);

  // Initialize filters based on initialComponent
  useEffect(() => {
    // Skip if categories are still loading
    if (categoriesLoading) return;
    
    // If initialFilters is provided, use those values for our individual state variables
    if (initialFilters) {
      setSelectedCategories(initialFilters.subcategories || []);
      setSelectedManufacturers(initialFilters.manufacturers || []);
      setSelectedCompatibilities(initialFilters.compatibilities || []);
      setPriceRange(initialFilters.priceRange || [0, 1000]);
      setSelectedIsAssembly(initialFilters.isAssembly);
    } else if (initialComponent && flatCategories && Object.keys(flatCategories).length > 0) {
      // Try to find the category by name in our flat categories
      const categoryEntry = Object.values(flatCategories).find(cat => 
        cat.name.toLowerCase() === initialComponent.toLowerCase()
      );
      
      if (categoryEntry) {
        // Only update if it's not already set to prevent loops
        setSelectedCategories(prev => {
          if (prev.length === 0 || !prev.includes(categoryEntry.id.toString())) {
            return [categoryEntry.id.toString()];
          }
          return prev;
        });
        console.log(`Initialized category from initialComponent: ${categoryEntry.name} (ID: ${categoryEntry.id})`);
      }
    }
    
    // Notify parent component that filtering is starting (if provided)
    if (setIsFiltering) {
      setIsFiltering(true);
    }
  }, [initialComponent, initialFilters, categoriesLoading, setIsFiltering]);

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

  // Memoize current filters to prevent unnecessary renders
  const currentFilters = useMemo(() => ({
    subcategories: selectedCategories,
    manufacturers: selectedManufacturers,
    compatibilities: selectedCompatibilities,
    priceRange,
    isAssembly: selectedIsAssembly,
  }), [
    selectedCategories, 
    selectedManufacturers, 
    selectedCompatibilities, 
    priceRange, 
    selectedIsAssembly
  ]);

  // Notify parent component when filters change
  useEffect(() => {
    // Only call onFilterChange if it exists
    if (onFilterChange) {
      // Log the current filters for debugging
      console.log('Current filters:', currentFilters);
      
      const prevFilters = prevFiltersRef.current;
      
      // Only call onFilterChange if the filters have actually changed
      if (!prevFilters || 
          !areArraysEqual(prevFilters.subcategories, currentFilters.subcategories) ||
          !areArraysEqual(prevFilters.manufacturers, currentFilters.manufacturers) ||
          !areArraysEqual(prevFilters.compatibilities, currentFilters.compatibilities) ||
          prevFilters.priceRange[0] !== currentFilters.priceRange[0] ||
          prevFilters.priceRange[1] !== currentFilters.priceRange[1] ||
          prevFilters.isAssembly !== currentFilters.isAssembly) {
        
        // Update the ref with current filters
        prevFiltersRef.current = {...currentFilters};
        
        // Call the callback
        onFilterChange(currentFilters);
      }
    }
  }, [currentFilters, onFilterChange, areArraysEqual]);

  // Handle category selection with deep hierarchy support
  const handleCategoryChange = useCallback((categoryId: string, isChecked: boolean) => {
    if (isChecked) {
      // When selecting a category, add it to selected categories
      setSelectedCategories(prev => {
        // Skip update if already selected
        if (prev.includes(categoryId)) {
          return prev;
        }
        
        // Get the category from our flat map
        const category = flatCategories[categoryId];
        if (!category) {
          return [...prev, categoryId];
        }
        
        // If the category has children, recursively find all child IDs
        if (category.child_categories && category.child_categories.length > 0) {
          // Helper function to collect all child category IDs
          const getAllChildIds = (categories: PartCategory[]): string[] => {
            let ids: string[] = [];
            for (const child of categories) {
              ids.push(child.id.toString());
              if (child.child_categories && child.child_categories.length > 0) {
                ids = [...ids, ...getAllChildIds(child.child_categories)];
              }
            }
            return ids;
          };
          
          // Add all child categories to the selection
          const childIds = getAllChildIds(category.child_categories);
          
          // Combine all IDs and remove duplicates
          const newSelected = [...prev, categoryId, ...childIds];
          return [...new Set(newSelected)];
        }
        
        return [...prev, categoryId];
      });
    } else {
      // When deselecting a category, remove it from selected categories
      setSelectedCategories(prev => {
        // Skip update if not currently selected
        if (!prev.includes(categoryId)) {
          return prev;
        }
        
        // Get the category from our flat map
        const category = flatCategories[categoryId];
        if (!category) {
          return prev.filter(id => id !== categoryId);
        }
        
        // If the category has children, recursively remove all child IDs
        if (category.child_categories && category.child_categories.length > 0) {
          // Helper function to collect all child category IDs
          const getAllChildIds = (categories: PartCategory[]): string[] => {
            let ids: string[] = [];
            for (const child of categories) {
              ids.push(child.id.toString());
              if (child.child_categories && child.child_categories.length > 0) {
                ids = [...ids, ...getAllChildIds(child.child_categories)];
              }
            }
            return ids;
          };
          
          // Remove all child categories from the selection
          const childIds = getAllChildIds(category.child_categories);
          return prev.filter(id => id !== categoryId && !childIds.includes(id));
        }
        
        return prev.filter(id => id !== categoryId);
      });
    }
  }, [flatCategories]);

  // Add handler for manufacturer checkboxes
  const handleManufacturerChange = useCallback((manufacturerId: string, isChecked: boolean) => {
    setSelectedManufacturers(prev => 
      isChecked 
        ? [...prev, manufacturerId] 
        : prev.filter(m => m !== manufacturerId)
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
    setSelectedParts([]);
    setSelectedManufacturers([]);
    setSelectedCompatibilities([]);
    setPriceRange([0, 1000]);
  }, []);

  // Add handler for assembly checkbox
  const handleAssemblyChange = useCallback((isChecked: boolean) => {
    setSelectedIsAssembly(isChecked);
  }, []);

  // Render categories section - memoized with hierarchical accordion
  const renderCategoriesSection = useCallback(() => {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Categories</h3>
        {categoriesLoading ? (
          <div>Loading categories...</div>
        ) : (
          <CategoryTree
            categories={categoryHierarchy}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
        )}
      </div>
    );
  }, [
    categoryHierarchy, 
    categoriesLoading, 
    selectedCategories, 
    handleCategoryChange,
  ]);

  // Show loading state while data is being fetched
  if (categoriesLoading || manufacturersLoading || compatibilitiesLoading) {
    return <div className="p-4">Loading filter options...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      
      {/* Category Filter */}
      {renderCategoriesSection()}
      
      {/* Manufacturer Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Manufacturers</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {manufacturers.map((manufacturer) => (
            <ManufacturerCheckbox
              key={manufacturer.id}
              manufacturer={manufacturer}
              isSelected={selectedManufacturers.includes(manufacturer.id.toString())}
              onChange={handleManufacturerChange}
            />
          ))}
        </div>
      </div>
      
      {/* Assembly Type Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Product Type</h3>
        <AssemblyCheckbox
          isSelected={selectedIsAssembly === true}
          onChange={handleAssemblyChange}
        />
      </div>
    </div>
  );
} 