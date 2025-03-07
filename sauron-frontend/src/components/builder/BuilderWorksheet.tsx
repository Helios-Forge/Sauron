"use client";

import { useState, useEffect, ReactElement } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  getFirearmModelById, 
  getParts, 
  isAssembly, 
  getSubComponentNames, 
  getSubComponentParts,
  getCompatiblePartsForModel,
  getRequiredPartsForModel,
  getPartById,
  Part, 
  FirearmModel,
  PartCategory,
  getFirearmModelCategories,
  getFirearmModelCategoriesHierarchy
} from '@/lib/api';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { 
  saveBuilderState, 
  loadBuilderState, 
  hasStoredStateForFirearm, 
  BuilderState,
  ComponentState,
  updateStoredComponent
} from '@/lib/builderStorage';
import React from 'react';

interface BuilderWorksheetProps {
  firearmId: string;
  onBuildUpdate: (
    selectedCount: number, 
    requiredCount: number, 
    price: number, 
    compatibility: 'compatible' | 'warning' | 'incompatible',
    components?: any[]
  ) => void;
}

// Interface for component data structure in the table
interface ComponentItem {
  id: number;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  part_category_id?: number;
  part_category?: PartCategory;
  isRequired: boolean;
  isPrebuilt: boolean;
  selectedPart: Part | null;
  parentId?: number;
  subComponents: ComponentItem[];
  partData: Part;
}

export default function BuilderWorksheet({ firearmId, onBuildUpdate }: BuilderWorksheetProps) {
  const [firearmModel, setFirearmModel] = useState<FirearmModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [availableParts, setAvailableParts] = useState<Part[]>([]);
  const [componentStructure, setComponentStructure] = useState<ComponentItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [compatibility, setCompatibility] = useState<'compatible' | 'warning' | 'incompatible'>('warning');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null);
  const [modelCategories, setModelCategories] = useState<PartCategory[]>([]); // New state for model categories
  
  // Keep track of whether we've processed URL parameters
  const processedUrlParams = React.useRef(false);
  
  // Add router for navigation
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load firearm model data and parts when component mounts
  useEffect(() => {
    console.log(`BuilderWorksheet mounted, loading data for firearmId: ${firearmId}`);
    loadFirearmModelAndParts();
  }, [firearmId]);

  // Load firearm model and available parts
  async function loadFirearmModelAndParts() {
    try {
      setLoading(true);
      console.log(`Loading data for firearm ID: ${firearmId}`);
      
      // Fetch the specific firearm model
      const model = await getFirearmModelById(parseInt(firearmId));
      console.log('Loaded firearm model:', model?.name || 'No model found');
      
      if (!model) {
        setError(new Error(`Firearm model with ID ${firearmId} not found`));
        setLoading(false);
        return;
      }
      
      // Set the firearm model first to ensure it's available
      setFirearmModel(model);
      
      // Fetch all available parts
      const parts = await getParts();
      console.log(`Loaded ${parts.length} available parts`);
      setAvailableParts(parts);
      
      // Fetch hierarchical part categories data for this firearm model
      try {
        console.log(`Fetching hierarchical categories for firearm model ID: ${firearmId}`);
        const hierarchicalCategories = await getFirearmModelCategoriesHierarchy(parseInt(firearmId));
        console.log(`Loaded ${hierarchicalCategories.length} model categories with hierarchy`);
        
        if (hierarchicalCategories && hierarchicalCategories.length > 0) {
          setModelCategories(hierarchicalCategories);
          
          // Debug logging for hierarchical structure
          const countTotalCategories = (categories: PartCategory[]): number => {
            return categories.reduce((count, cat) => {
              const childCount = cat.child_categories ? countTotalCategories(cat.child_categories) : 0;
              return count + 1 + childCount;
            }, 0);
          };
          
          const totalCategories = countTotalCategories(hierarchicalCategories);
          console.log(`Total categories in hierarchy: ${totalCategories}`);
          
          // Log category relationship tree
          const logHierarchy = (category: PartCategory, depth = 0): void => {
            const indent = '  '.repeat(depth);
            const requiredStatus = category.is_required ? 'Required' : 'Optional';
            console.log(`${indent}- ${category.name} (ID: ${category.id}, ${requiredStatus})`);
            
            if (category.child_categories && category.child_categories.length > 0) {
              console.log(`${indent}  Children: ${category.child_categories.length}`);
              category.child_categories.forEach(child => logHierarchy(child, depth + 1));
            }
          };
          
          console.log('Category hierarchy:');
          hierarchicalCategories.forEach(cat => logHierarchy(cat));
        } else {
          console.warn('No hierarchical categories returned for this firearm model');
        }
      } catch (error) {
        console.error('Error loading hierarchical categories:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Unknown error loading part categories';
        setError(new Error(`Failed to load component structure: ${errorMessage}`));
      }
      
      // Check if we have a saved state for this firearm
      if (hasStoredStateForFirearm(firearmId)) {
        // Load the state and apply it to our component structure
        const storedState = loadBuilderState();
        
        if (storedState) {
          console.log('Loading stored state for firearm', firearmId, storedState);
          
          // Wait for component structure to be built before applying stored selections
          setTimeout(() => {
            applyStoredComponentSelections(storedState.components);
            
            // Apply stored expanded items state
            if (storedState.expandedItems) {
              setExpandedItems(storedState.expandedItems);
            }
            
            updateBuildSummary(componentStructure);
          }, 100);
        }
      } else {
        // No stored state, just build the basic component structure
        console.log('No stored state for this firearm');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }

  // Build component structure when firearmModel, modelCategories, and availableParts change
  useEffect(() => {
    if (
      firearmModel && 
      modelCategories && 
      modelCategories.length > 0 && 
      availableParts.length > 0
    ) {
      console.log('Data changed - rebuilding component structure');
      buildComponentStructure();
    }
  }, [firearmModel, JSON.stringify(modelCategories), availableParts.length]);

  // Trigger buildComponentStructure when all dependencies are loaded but no structure exists
  useEffect(() => {
    // Only run if we have the model, categories, and parts but no structure
    if (
      firearmModel && 
      modelCategories && 
      modelCategories.length > 0 && 
      availableParts.length > 0 && 
      componentStructure.length === 0
    ) {
      console.log('All data loaded but no structure exists - building component structure now');
      buildComponentStructure();
    }
  }, [firearmModel, modelCategories, availableParts, componentStructure]);

  // Enhanced debugging for component structure
  useEffect(() => {
    console.log(`Component structure updated with ${componentStructure.length} top-level components`);
    if (componentStructure.length > 0) {
      // Count total items including all sub-components
      let totalItems = 0;
      const countComponents = (items: ComponentItem[]) => {
        totalItems += items.length;
        items.forEach(item => {
          if (item.subComponents?.length > 0) {
            countComponents(item.subComponents);
          }
        });
      };
      countComponents(componentStructure);
      console.log(`Total components in structure: ${totalItems}`);
      
      // Log structure for debugging
      const logComponent = (item: ComponentItem, level = 0) => {
        const indent = ' '.repeat(level * 2);
        console.log(`${indent}Component: ${item.name} (ID: ${item.id}, Category ID: ${item.part_category_id || 'none'})`);
        if (item.subComponents?.length > 0) {
          console.log(`${indent}Children: ${item.subComponents.length}`);
          item.subComponents.forEach(child => logComponent(child, level + 1));
        }
      };
      
      console.log('Component structure tree:');
      componentStructure.forEach(item => logComponent(item));
    }
  }, [componentStructure]);

  // Enhanced debugging for categories
  useEffect(() => {
    if (modelCategories && modelCategories.length > 0) {
      console.log("Full category data for debugging:");
      modelCategories.forEach(cat => {
        const parentCat = cat.parent_category_id 
          ? modelCategories.find(p => p.id === cat.parent_category_id) 
          : null;
        console.log(`Category: ${cat.name} (ID: ${cat.id}), Parent: ${parentCat ? `${parentCat.name} (ID: ${parentCat.id})` : 'None'}`);
      });
      
      // Specifically check for Bolt and BCG relationship
      const bcg = modelCategories.find(cat => cat.name === 'Bolt Carrier Group');
      const bolt = modelCategories.find(cat => cat.name === 'Bolt');
      
      if (bcg && bolt) {
        console.log(`BCG: ID=${bcg.id}, Bolt: ID=${bolt.id}, Bolt's Parent ID=${bolt.parent_category_id}`);
        if (bolt.parent_category_id !== bcg.id) {
          console.warn(`⚠️ Bolt's parent_category_id (${bolt.parent_category_id}) doesn't match BCG's ID (${bcg.id})`);
        }
      } else {
        console.warn(`⚠️ Unable to find both BCG and Bolt categories`);
      }
    }
  }, [modelCategories]);

  // Build component structure based on the model requirements and available parts
  const buildComponentStructure = async () => {
    console.log('Building component structure for model:', firearmModel?.name, `(ID: ${firearmModel?.id})`);
    
    if (!firearmModel) {
      console.warn('No model found, setting empty component structure');
      setComponentStructure([]);
      return;
    }
    
    if (!modelCategories || modelCategories.length === 0) {
      console.warn('No part categories available for this model, cannot build structure');
      setComponentStructure([]);
      return;
    }
    
    const allParts = availableParts.slice();
    console.log(`Processing ${allParts.length} available parts against ${modelCategories.length} part categories`);
    
    // Debug part category distribution
    const partCategoryCounts: Record<number, number> = {};
    allParts.forEach(part => {
      if (part.part_category_id) {
        partCategoryCounts[part.part_category_id] = (partCategoryCounts[part.part_category_id] || 0) + 1;
      }
    });
    
    const components: ComponentItem[] = [];
    let nextComponentId = 1;
    
    // Check if we have hierarchical data from the backend
    const hasHierarchicalData = modelCategories.some(cat => 
      cat.child_categories && cat.child_categories.length > 0
    );
    
    console.log(`Building component tree using ${hasHierarchicalData ? 'hierarchical' : 'flat'} data structure`);
    
    if (hasHierarchicalData) {
      // Process hierarchical data from backend
      console.log('Using hierarchical data from backend');
      
      // Recursive function to build components from hierarchical categories
      const buildFromHierarchy = (category: PartCategory, parentId?: number): ComponentItem => {
        // Use is_required from the API response
        const isRequired = category.is_required || false;
        
        console.log(`Building component for ${category.name} (ID: ${category.id}, Required: ${isRequired})`);
        
        // Find parts that match this category ID
        const matchingParts = allParts.filter(part => part.part_category_id === category.id);
        console.log(`Found ${matchingParts.length} parts for category ${category.name}`);
        
        // Create component item for this category
        const component: ComponentItem = {
          id: nextComponentId++,
          name: category.name,
          description: category.description || '',
          category: category.name,
          subcategory: '',
          part_category_id: category.id,
          part_category: category,
          isRequired,
          isPrebuilt: false,
          selectedPart: null,
          parentId,
          subComponents: [],
          partData: matchingParts[0] || {} as Part
        };
        
        // Process child categories directly from the hierarchy
        const childCategories = category.child_categories || [];
        
        if (childCategories.length > 0) {
          console.log(`Processing ${childCategories.length} child categories for ${category.name}`);
          component.subComponents = childCategories.map(child => 
            buildFromHierarchy(child, component.id)
          );
        }
        
        return component;
      };
      
      // Process top-level categories from hierarchical data
      for (const topCategory of modelCategories) {
        components.push(buildFromHierarchy(topCategory));
      }
    } else {
      // Fallback to building the hierarchy manually from parent_category_id relationships
      console.log('Building hierarchy manually from flat category list');
      
      // Find the top-level categories (those without parent_category_id)
      const topLevelCategories = modelCategories.filter(cat => !cat.parent_category_id);
      console.log(`Found ${topLevelCategories.length} top-level categories to process`);
      
      // Recursive function to build the component hierarchy
      const buildCategoryTree = (category: PartCategory, parentId?: number): ComponentItem => {
        const isRequired = category.is_required || false;
        
        console.log(`Building tree for category: ${category.name} (ID: ${category.id}), required: ${isRequired}`);
        
        // Find parts that match this category ID
        const matchingParts = allParts.filter(part => part.part_category_id === category.id);
        console.log(`Found ${matchingParts.length} parts for category ${category.name} (ID: ${category.id})`);
        
        // Create component item for this category
        const component: ComponentItem = {
          id: nextComponentId++,
          name: category.name,
          description: category.description || '',
          category: category.name,
          subcategory: '',
          part_category_id: category.id,
          part_category: category,
          isRequired,
          isPrebuilt: false,
          selectedPart: null,
          parentId,
          subComponents: [],
          partData: matchingParts[0] || {} as Part
        };
        
        // Find child categories for this category
        const childCategories = modelCategories.filter(cat => cat.parent_category_id === category.id);
        
        if (childCategories.length > 0) {
          console.log(`Category ${category.name} has ${childCategories.length} child categories`);
          
          // Process child categories recursively
          component.subComponents = childCategories.map(child => 
            buildCategoryTree(child, component.id)
          );
        } else {
          console.log(`Category ${category.name} has no child categories`);
          
          // Special case handling for known relationships
          if (category.name === 'Bolt Carrier Group') {
            const boltCategory = modelCategories.find(cat => cat.name === 'Bolt');
            if (boltCategory && !component.subComponents.some(c => c.name === 'Bolt')) {
              console.log(`Special case: Adding Bolt as a child of BCG`);
              component.subComponents.push(buildCategoryTree(boltCategory, component.id));
            }
          }
        }
        
        return component;
      };
      
      // Process top-level categories
      for (const topCategory of topLevelCategories) {
        components.push(buildCategoryTree(topCategory));
      }
    }
    
    // Log the full component structure for debugging
    const logComponentStructure = (component: ComponentItem, level = 0) => {
      const indent = '  '.repeat(level);
      console.log(`${indent}- ${component.name} (ID: ${component.id})`);
      if (component.subComponents && component.subComponents.length > 0) {
        component.subComponents.forEach(child => logComponentStructure(child, level + 1));
      }
    };
    
    console.log('Full component structure:');
    components.forEach(component => logComponentStructure(component));
    
    // Function to get all component IDs that have children, for auto-expansion
    const getAllComponentIdsWithChildren = (components: ComponentItem[]): number[] => {
      return components.flatMap(component => {
        if (component.subComponents && component.subComponents.length > 0) {
          return [component.id, ...getAllComponentIdsWithChildren(component.subComponents)];
        }
        return [];
      });
    };
    
    // Save the component structure
    console.log(`Built component structure with ${components.length} top-level components`);
    setComponentStructure(components);
    
    // Auto-expand components with children
    const componentsWithChildren = getAllComponentIdsWithChildren(components);
    console.log(`Auto-expanding ${componentsWithChildren.length} components with children`);
    setExpandedItems(componentsWithChildren);
  };

  // Helper function to process sub-parts from the model schema
  const processSubParts = (
    subParts: Record<string, any>, 
    parentId: number, 
    partsByCategory: Record<string, Part[]>,
    isParentRequired: boolean
  ): ComponentItem[] => {
    const result: ComponentItem[] = [];
    
    Object.entries(subParts || {}).forEach(([subPartName, subPartData]) => {
      // Determine if this part is required based on its type
      const isRequired = typeof subPartData === 'string' 
        ? subPartData === 'required' 
        : (subPartData?.type === 'required');
      
      // Find matching parts for this subcomponent
      const subParts = partsByCategory[subPartName] || [];
      
      // Create the component item
      const subComponent: ComponentItem = {
        id: subParts.length > 0 ? subParts[0].id : Math.floor(Math.random() * 10000),
        name: subPartName,
        description: `${subPartName} component`,
        category: subPartName,
        subcategory: subParts.length > 0 ? subParts[0].subcategory || "" : "",
        isRequired: isRequired,
        isPrebuilt: false,
        selectedPart: null,
        parentId: parentId,
        subComponents: [],
        partData: subParts.length > 0 ? subParts[0] : null as any
      };
      
      // Check for nested sub-parts
      if (
        typeof subPartData === 'object' && 
        subPartData !== null && 
        'sub_parts' in subPartData
      ) {
        // Process nested sub-parts recursively
        subComponent.subComponents = processSubParts(
          subPartData.sub_parts, 
          subComponent.id, 
          partsByCategory,
          isRequired
        );
      }
      
      result.push(subComponent);
    });
    
    return result;
  };

  // Helper function to process compatible parts
  const processCompatibleParts = (
    compatibleParts: Record<string, any>,
    parentId: number,
    partsByCategory: Record<string, Part[]>
  ): ComponentItem[] => {
    const result: ComponentItem[] = [];
    
    Object.entries(compatibleParts || {}).forEach(([partName, partData]) => {
      // All compatible parts are optional
      const isRequired = false;
      
      // Find matching parts for this compatible part
      const matchingParts = partsByCategory[partName] || [];
      
      // Create the component item
      const component: ComponentItem = {
        id: matchingParts.length > 0 ? matchingParts[0].id : Math.floor(Math.random() * 10000),
        name: partName,
        description: `${partName} component`,
        category: partName,
        subcategory: matchingParts.length > 0 ? matchingParts[0].subcategory || "" : "",
        isRequired: isRequired,
        isPrebuilt: false,
        selectedPart: null,
        parentId: parentId,
        subComponents: [],
        partData: matchingParts.length > 0 ? matchingParts[0] : null as any
      };
      
      // Check for nested structure
      if (typeof partData === 'object' && partData !== null) {
        component.subComponents = processCompatibleParts(
          partData,
          component.id,
          partsByCategory
        );
      }
      
      result.push(component);
    });
    
    return result;
  };

  // Toggle component expansion state
  const toggleExpand = (id: number) => {
    console.log(`Toggling expand state for component ID: ${id}`);
    setExpandedItems(prevItems => {
      if (prevItems.includes(id)) {
        // If we're collapsing, also collapse all children
        const collapseChildrenRecursively = (itemId: number): number[] => {
          const component = findComponentById(componentStructure, itemId);
          if (!component || !component.subComponents) return [itemId];
          
          const childIds = component.subComponents.flatMap(child => {
            return [child.id, ...collapseChildrenRecursively(child.id)];
          });
          
          return [itemId, ...childIds];
        };
        
        const itemsToCollapse = collapseChildrenRecursively(id);
        console.log(`Collapsing items: ${itemsToCollapse.join(', ')}`);
        
        return prevItems.filter(item => !itemsToCollapse.includes(item));
      } else {
        // If expanding, just add this item (children get expanded when clicked)
        return [...prevItems, id];
      }
    });
  };
  
  // Helper function to find a component by ID
  const findComponentById = (items: ComponentItem[], id: number): ComponentItem | null => {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      
      if (item.subComponents && item.subComponents.length > 0) {
        const found = findComponentById(item.subComponents, id);
        if (found) return found;
      }
    }
    
    return null;
  };

  // Handle selection of a part
  const handleSelectPart = (componentId: number, part: Part) => {
    console.log(`Selecting part ${part.id} (${part.name}) for component ${componentId}`);
    
    // Find the component in our structure
    const findComponentById = (items: ComponentItem[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.id === componentId) {
          item.selectedPart = part;
          
          // If this component has category_id, update the part's category_id too (if not already set)
          if (item.part_category_id && !part.part_category_id) {
            console.log(`Setting part ${part.id} category_id to ${item.part_category_id}`);
            part.part_category_id = item.part_category_id;
          }
          
          return true;
        }
        if (item.subComponents && item.subComponents.length > 0) {
          if (findComponentById(item.subComponents)) {
            return true;
          }
        }
      }
      return false;
    };
    
    const found = findComponentById(componentStructure);
    
    if (found) {
      console.log(`Component ${componentId} found and updated`);
      
      // Update stored state
      updateStoredComponent(firearmId, componentId, part, false);
      console.log('Builder state updated in localStorage');
    } else {
      console.error(`Component with ID ${componentId} not found in the component structure`);
      
      // If we're coming from a URL parameter and can't find the exact component,
      // try to find a component with a matching category name
      if (part && part.category) {
        console.log(`Attempting to find a component matching category: ${part.category}`);
        
        const findComponentIdByCategory = (items: ComponentItem[]): number | null => {
          for (const item of items) {
            if (item.category.toLowerCase() === part.category.toLowerCase()) {
              console.log(`Found matching component by category:`, item);
              return item.id;
            }
            
            if (item.subComponents && item.subComponents.length > 0) {
              const foundId = findComponentIdByCategory(item.subComponents);
              if (foundId !== null) {
                return foundId;
              }
            }
          }
          return null;
        };
        
        const matchingComponentId = findComponentIdByCategory(componentStructure);
        
        if (matchingComponentId !== null) {
          console.log(`Using matching component ID: ${matchingComponentId} instead of ${componentId}`);
          // Update the componentId
          return handleSelectPart(matchingComponentId, part);
        } else {
          console.error(`No matching component found for category: ${part.category}`);
        }
      }
      
      return; // Exit if no component found
    }
  };

  // Handle selection of an assembly
  const handleSelectAssembly = (assemblyId: number, assembly: Part) => {
    console.log(`handleSelectAssembly called for assembly ${assemblyId} with part:`, assembly);
    
    if (!isAssembly(assembly)) {
      console.error('Part is not an assembly, aborting selection');
      return;
    }
    
    setComponentStructure(prevStructure => {
      console.log('Previous component structure:', prevStructure);
      const newStructure = [...prevStructure];
      
      const updateComponent = (items: ComponentItem[]): boolean => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === assemblyId) {
            console.log(`Found matching assembly component to update:`, items[i]);
            items[i].selectedPart = assembly;
            items[i].isPrebuilt = true;
            
            // If we're selecting an assembly, auto-fill its sub-components
            if (items[i].subComponents && items[i].subComponents.length > 0) {
              console.log(`Filling subcomponents from assembly for ${items[i].subComponents.length} items`);
              fulfillSubComponentsFromAssembly(items[i].subComponents, assembly);
            }
            
            console.log(`Assembly component updated`);
            return true;
          }
          
          if (items[i].subComponents && items[i].subComponents.length > 0) {
            if (updateComponent(items[i].subComponents)) {
              return true;
            }
          }
        }
        
        return false;
      };
      
      const found = updateComponent(newStructure);
      console.log(`Assembly component ${found ? 'was' : 'was NOT'} found and updated`);
      
      // Update stored state
      updateStoredComponent(firearmId, assemblyId, assembly, true);
      console.log('Builder state updated in localStorage with assembly');
      
      return newStructure;
    });
  };

  // Helper function to mark sub-components as fulfilled by an assembly
  const fulfillSubComponentsFromAssembly = (subComponents: ComponentItem[], assembly: Part) => {
    subComponents.forEach(subComponent => {
      // Create a virtual part to represent that it's included in the assembly
      subComponent.selectedPart = {
        ...assembly, // Use assembly as base
        id: -100000 - subComponent.id, // Use negative ID to indicate virtual
        name: `Included in ${assembly.name}`,
        price: 0, // Price is already included in assembly
        description: `Part of the ${assembly.name} assembly`,
        category: subComponent.category,
        subcategory: subComponent.subcategory,
        is_prebuilt: false,
        fulfilled_by_assembly: true,
        parent_assembly_id: assembly.id,
        sub_components: [],
        compatible_models: assembly.compatible_models,
        requires: [],
        specifications: {},
        images: [],
        availability: assembly.availability,
        weight: 0,
        dimensions: "",
        created_at: "",
        updated_at: ""
      } as any;
      
      // Recursively process deeper levels if they exist
      if (subComponent.subComponents && subComponent.subComponents.length > 0) {
        fulfillSubComponentsFromAssembly(subComponent.subComponents, assembly);
      }
    });
  };

  // Update build summary and notify parent component
  const updateBuildSummary = (components: ComponentItem[]) => {
    console.log('updateBuildSummary called with components:', components);
    
    let selectedCount = 0;
    let requiredCount = 0;
    let totalPrice = 0;
    let compatibility: 'compatible' | 'warning' | 'incompatible' = 'compatible';
    
    const processComponent = (item: ComponentItem) => {
      if (item.isRequired) {
        requiredCount++;
        if (item.selectedPart) {
          selectedCount++;
        } else {
          // If a required component is not selected, mark as warning
          compatibility = 'warning';
        }
      } else if (item.selectedPart) {
        selectedCount++;
      }
      
      // Add price if part is selected and has a price
      if (item.selectedPart && item.selectedPart.price) {
        totalPrice += item.selectedPart.price;
      }
      
      // Process subcomponents
      if (item.subComponents) {
        item.subComponents.forEach(processComponent);
      }
    };
    
    components.forEach(processComponent);
    
    console.log('Build summary calculated:', {
      selectedCount,
      requiredCount,
      totalPrice,
      compatibility
    });
    
    // Set state to trigger the callback
    setTotalPrice(totalPrice);
    setCompatibility(compatibility);
    
    // Call the parent callback to update the build status
    onBuildUpdate(selectedCount, requiredCount, totalPrice, compatibility, flattenComponents(components));
  };

  // Helper to flatten component structure for parent component
  const flattenComponents = (components: ComponentItem[]): any[] => {
    const flattened: any[] = [];
    
    const processComponent = (item: ComponentItem) => {
      flattened.push({
        category: item.category,
        part: item.selectedPart,
        required: item.isRequired
      });
      
      if (item.subComponents && item.subComponents.length > 0 && (!item.selectedPart || !item.isPrebuilt)) {
        item.subComponents.forEach(processComponent);
      }
    };
    
    components.forEach(processComponent);
    return flattened;
  };

  // Open part selection page
  const handleAddPart = (component: ComponentItem) => {
    // Preserve the state of componentId for when we return from catalog
    console.log(`Adding part for component: ${component.name}, ID: ${component.id}, category ID: ${component.part_category_id}`);
    
    // Check if we should navigate to the catalog or not
    if (component.selectedPart && (!component.partData || !component.partData.is_prebuilt)) {
      console.log('User selected to replace an existing non-assembly part');
    }
    
    // Create the query parameters for catalog page
    const queryParams = new URLSearchParams({
      componentId: component.id.toString(),
      isAssembly: 'false',
      firearmId,
      returnToBuilder: 'true'
    });
    
    // Add category ID if we have it
    if (component.part_category_id) {
      queryParams.set('categoryId', component.part_category_id.toString());
      console.log(`Setting catalog category ID filter to: ${component.part_category_id}`);
    } 
    // Fallback to using component name (legacy)
    else if (component.name) {
      queryParams.set('component', component.name);
      console.log(`Using legacy component name filter: ${component.name}`);
    }
    
    // Save current state before navigating away
    saveBuilderState({
      firearmId,
      components: convertComponentItemsToStored(componentStructure),
      expandedItems: expandedItems
    });
    
    // Navigate to catalog with parameters
    const catalogUrl = `/catalog?${queryParams.toString()}`;
    console.log(`Navigating to catalog with parameters: ${catalogUrl}`);
    router.push(catalogUrl);
  };

  // Open assembly selection page
  const handleAddAssembly = (component: ComponentItem) => {
    // Preserve the state of componentId for when we return from catalog
    console.log(`Adding assembly for component: ${component.name}, ID: ${component.id}, category ID: ${component.part_category_id}`);
    
    // Create the query parameters for catalog page
    const queryParams = new URLSearchParams({
      componentId: component.id.toString(),
      isAssembly: 'true',
      firearmId,
      returnToBuilder: 'true'
    });
    
    // Add category ID if we have it
    if (component.part_category_id) {
      queryParams.set('categoryId', component.part_category_id.toString());
      console.log(`Setting catalog category ID filter to: ${component.part_category_id}`);
    } 
    // Fallback to using component name (legacy)
    else if (component.name) {
      queryParams.set('component', component.name);
      console.log(`Using legacy component name filter: ${component.name}`);
    }
    
    // Save current state before navigating away
    saveBuilderState({
      firearmId,
      components: convertComponentItemsToStored(componentStructure),
      expandedItems: expandedItems
    });
    
    // Navigate to catalog with parameters
    const catalogUrl = `/catalog?${queryParams.toString()}`;
    console.log(`Navigating to catalog with parameters: ${catalogUrl}`);
    router.push(catalogUrl);
  };

  // Add a function to check if a component is an assembly
  const isComponentAssembly = (component: ComponentItem): boolean => {
    return component.isPrebuilt && 
      component.subComponents !== undefined && 
      component.subComponents !== null && 
      component.subComponents.length > 0;
  };

  // Helper function to convert stored component state to component items
  const convertStoredToComponentItems = (storedComponents: ComponentState[]): ComponentItem[] => {
    return storedComponents.map(stored => ({
      id: stored.id,
      name: stored.category, // Use category as name
      description: "",
      category: stored.category,
      subcategory: stored.subcategory,
      isRequired: stored.isRequired,
      isPrebuilt: stored.isPrebuilt,
      selectedPart: stored.selectedPart,
      parentId: stored.parentId,
      subComponents: stored.subComponents ? convertStoredToComponentItems(stored.subComponents) : [],
      partData: {} as Part // This might need proper initialization if used
    }));
  };
  
  // Save state when component structure or expanded items change
  useEffect(() => {
    if (firearmModel && componentStructure.length > 0) {
      // Convert ComponentItem[] to ComponentState[]
      const componentStates = convertComponentItemsToStored(componentStructure);
      
      const stateToSave: BuilderState = {
        firearmId,
        firearmModel: {
          id: firearmModel.id,
          name: firearmModel.name
        },
        components: componentStates,
        expandedItems
      };
      
      saveBuilderState(stateToSave);
    }
  }, [firearmModel, componentStructure, expandedItems, firearmId]);
  
  // Helper function to convert component items to storable state
  const convertComponentItemsToStored = (components: ComponentItem[]): ComponentState[] => {
    return components.map(component => ({
      id: component.id,
      category: component.category,
      subcategory: component.subcategory,
      isRequired: component.isRequired,
      isPrebuilt: component.isPrebuilt,
      selectedPart: component.selectedPart,
      parentId: component.parentId,
      subComponents: component.subComponents ? convertComponentItemsToStored(component.subComponents) : []
    }));
  };

  // Check for selected part from catalog when returning
  useEffect(() => {
    if (!searchParams) return;
    
    const selectedPart = searchParams.get('selectedPart');
    const componentId = searchParams.get('componentId');
    const isAssembly = searchParams.get('isAssembly') === 'true';
    
    console.log(`Search params detected. Selected part: ${selectedPart}, Component ID: ${componentId}, Is Assembly: ${isAssembly}`);
    
    if (selectedPart && componentId) {
      const componentIdNum = parseInt(componentId);
      console.log(`Applying selected part ${selectedPart} for component ID ${componentIdNum}`);
      
      // Find the part by ID
      getPartById(parseInt(selectedPart))
        .then(part => {
          if (!part) {
            console.error(`Part with ID ${selectedPart} not found`);
            return;
          }
          
          console.log(`Found part to apply:`, part);
          
          // Find the component by ID and apply the selected part
          const findComponentById = (items: ComponentItem[]): boolean => {
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              
              // Check if this is the component we're looking for
              if (item.id === componentIdNum) {
                console.log(`Found matching component by ID: ${item.name} (ID: ${item.id})`);
                
                if (isAssembly) {
                  handleSelectAssembly(componentIdNum, part);
                } else {
                  handleSelectPart(componentIdNum, part);
                }
                
                return true;
              }
              
              // Check child components recursively
              if (item.subComponents && item.subComponents.length > 0) {
                if (findComponentById(item.subComponents)) {
                  return true;
                }
              }
            }
            
            return false;
          };
          
          // Start searching from the top-level components
          if (!findComponentById(componentStructure)) {
            console.error(`Component with ID ${componentId} not found in structure`);
          }
        })
        .catch(error => {
          console.error(`Error fetching part with ID ${selectedPart}:`, error);
        });
    }
  }, [searchParams, componentStructure]);

  // Update the build summary whenever the component structure changes
  useEffect(() => {
    if (componentStructure.length > 0) {
      updateBuildSummary(componentStructure);
    }
  }, [componentStructure]);

  // Function to apply stored part selections to the built component structure
  const applyStoredComponentSelections = (storedComponents: ComponentState[]) => {
    if (!storedComponents || !componentStructure) return;
    
    // For each stored component, find the matching component in our structure
    const processComponents = (components: ComponentItem[]) => {
      for (const component of components) {
        // Find this component in stored data
        const storedComponent = storedComponents.find(sc => sc.id === component.id);
        
        if (storedComponent && storedComponent.selectedPart) {
          // Apply the stored part selection
          component.selectedPart = storedComponent.selectedPart;
        }
        
        // Process subcomponents recursively
        if (component.subComponents && component.subComponents.length > 0) {
          processComponents(component.subComponents);
        }
      }
    };
    
    processComponents(componentStructure);
    
    // Update the component structure state
    setComponentStructure([...componentStructure]);
  };

  // Verify if the backend API properly supports hierarchical retrieval
  useEffect(() => {
    const verifyBackendCapabilities = async () => {
      try {
        // Check the hierarchical endpoint
        console.log('Verifying backend hierarchical capabilities...');
        const hierarchicalCategories = await getFirearmModelCategoriesHierarchy(parseInt(firearmId));
        
        if (hierarchicalCategories.length === 0) {
          console.warn('⚠️ No categories returned from hierarchical endpoint');
          return;
        }
        
        // Check if we have proper child_categories structure
        const hasChildCategories = hierarchicalCategories.some(cat => 
          cat.child_categories && cat.child_categories.length > 0
        );
        
        if (hasChildCategories) {
          console.log('✅ Backend properly supports hierarchical category retrieval');
          
          // Check for specific relationships we care about
          const bcg = hierarchicalCategories.find(cat => cat.name === 'Bolt Carrier Group');
          if (bcg) {
            const bcgChildren = bcg.child_categories || [];
            console.log(`Bolt Carrier Group has ${bcgChildren.length} children: ${bcgChildren.map(c => c.name).join(', ')}`);
            
            const hasBolt = bcgChildren.some(c => c.name === 'Bolt');
            if (hasBolt) {
              console.log('✅ Bolt is properly linked as a child of Bolt Carrier Group');
            } else {
              console.warn('⚠️ Bolt is not linked as a child of Bolt Carrier Group');
            }
          }
        } else {
          console.warn('⚠️ Backend returns categories but without proper child_categories structure');
        }
      } catch (error) {
        console.error('Failed to verify backend capabilities:', error);
      }
    };
    
    // Only run this check in development mode
    if (process.env.NODE_ENV === 'development') {
      verifyBackendCapabilities();
    }
  }, [firearmId]);

  // Render loading state
  if (loading) {
    return (
      <div className="p-6 min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading component data...</p>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400">
        <p>Error loading component data: {error.message}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => loadFirearmModelAndParts()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Render empty state
  if (!firearmModel) {
    return <div className="p-6 text-center">No firearm model found with ID {firearmId}</div>;
  }
  
  // Render empty component structure
  if (!componentStructure || componentStructure.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="mb-4">No components found for this firearm model.</p>
        <p className="text-xs text-gray-500">This may happen if the firearm model doesn't have any part categories defined.</p>
      </div>
    );
  }

  // Render component rows recursively, with each component only shown once
  const renderComponentRows = (components: ComponentItem[], level = 0): ReactElement[] => {
    if (!components || components.length === 0) {
      if (level === 0) console.log('⚠️ No components to render in the main structure');
      return [];
    }

    console.log(`Rendering ${components.length} components at level ${level}`);
    
    return components.flatMap((component, index) => {
      const rows: ReactElement[] = [];
      const isComponentAnAssembly = isComponentAssembly(component);
      const hasSubComponents = component.subComponents && component.subComponents.length > 0;
      
      // Generate a unique key using index and component id to avoid duplicate keys
      const componentKey = `component-${component.id}-${level}-${index}`;
      
      // Check if there's an assembly option available for this component
      const hasAssemblyOption = component.part_category_id 
        ? availableParts.some(part => 
            part.part_category_id === component.part_category_id && 
            part.is_prebuilt && 
            isAssembly(part)
          )
        : availableParts.some(part => 
            part.category === component.category && 
            part.is_prebuilt && 
            isAssembly(part)
          );
      
      // Check if this component is fulfilled by a parent assembly
      const isFulfilledByAssembly = component.selectedPart && 
                                   (component.selectedPart as any).fulfilled_by_assembly === true;
      
      // Determine the indentation class for this level
      // Fixed indentation classes that will be recognized by Tailwind
      let indentClass = '';
      if (level === 1) indentClass = 'ml-4';
      else if (level === 2) indentClass = 'ml-8';
      else if (level === 3) indentClass = 'ml-12';
      else if (level >= 4) indentClass = 'ml-16';
      
      // Main component row
      rows.push(
        <tr key={componentKey} className={level === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-700"}>
          <td className="px-4 py-3 flex items-center">
            <div className={`flex items-center ${indentClass}`}>
              {hasSubComponents ? (
                <button 
                  onClick={() => toggleExpand(component.id)}
                  className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {expandedItems.includes(component.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <div className="w-6 mr-2" /> 
              )}
              
              <span className={`${level === 0 ? "font-medium" : ""} ${isFulfilledByAssembly ? "text-blue-600 dark:text-blue-400" : ""}`}>
                {component.name}
                {hasAssemblyOption && !isFulfilledByAssembly && (
                  <span className="ml-2 text-blue-600 dark:text-blue-400 text-xs font-normal">
                    (Assembly Available)
                  </span>
                )}
                {isFulfilledByAssembly && (
                  <span className="ml-2 text-xs font-normal">
                    (From Assembly)
                  </span>
                )}
              </span>
            </div>
          </td>
          <td className="px-4 py-3 text-center">
            {component.isRequired ? (
              <span className="text-red-600 dark:text-red-400 font-medium">Required</span>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">Optional</span>
            )}
          </td>
          <td className="px-4 py-3">
            {component.selectedPart ? (
              <span className={isFulfilledByAssembly ? "text-blue-600 dark:text-blue-400 italic" : ""}>
                {component.selectedPart.name}
              </span>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">Not selected</span>
            )}
          </td>
          <td className="px-4 py-3 text-right">
            {component.selectedPart ? (
              isFulfilledByAssembly ? (
                <span className="text-blue-600 dark:text-blue-400 italic">Included</span>
              ) : (
                `$${component.selectedPart.price.toFixed(2)}`
              )
            ) : (
              '-'
            )}
          </td>
          <td className="px-4 py-3 text-center">
            {component.selectedPart ? (
              <span className="text-green-600 dark:text-green-400">Compatible</span>
            ) : (
              '-'
            )}
          </td>
          <td className="px-4 py-3 text-right">
            <div className="flex space-x-2 justify-end">
              {isFulfilledByAssembly ? (
                <button
                  onClick={() => handleAddPart(component)}
                  className="px-3 py-1 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
                >
                  Replace Part
                </button>
              ) : (
                <button
                  onClick={() => handleAddPart(component)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {component.selectedPart ? 'Change Part' : 'Add Part'}
                </button>
              )}
              
              {hasAssemblyOption && !isFulfilledByAssembly && (
                <button
                  onClick={() => handleAddAssembly(component)}
                  className="px-3 py-1 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                >
                  {component.selectedPart && component.isPrebuilt ? 'Change Assembly' : 'Add Assembly'}
                </button>
              )}
            </div>
          </td>
        </tr>
      );
      
      // Only render sub-components if this component is expanded
      if (hasSubComponents && expandedItems.includes(component.id)) {
        rows.push(...renderComponentRows(component.subComponents || [], level + 1));
      }
      
      return rows;
    });
  };

  return (
    <div className="p-6">
      <table className="min-w-full border-collapse bg-white dark:bg-gray-900 shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Component</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Selected Part</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Compatibility</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {renderComponentRows(componentStructure)}
          {componentStructure.length > 0 && renderComponentRows(componentStructure).length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                <p>No renderable components found.</p>
                <p className="text-xs mt-2">Check console logs for details.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}