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
  getFirearmModelCategories
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

  // Fetch firearm model and parts when component mounts
  useEffect(() => {
    loadFirearmModelAndParts();
  }, [firearmId]);

  // Load firearm model and available parts
  async function loadFirearmModelAndParts() {
    try {
      setLoading(true);
      
      // Fetch the specific firearm model
      const model = await getFirearmModelById(parseInt(firearmId));
      console.log('Loaded firearm model:', model);
      
      if (!model) {
        setError(new Error(`Firearm model with ID ${firearmId} not found`));
        setLoading(false);
        return;
      }
      
      // Set the firearm model first to ensure it's available
      setFirearmModel(model);
      
      // Fetch all available parts
      const parts = await getParts();
      setAvailableParts(parts);
      
      // Fetch model categories using the new API (if available)
      try {
        const categories = await getFirearmModelCategories(parseInt(firearmId));
        setModelCategories(categories);
        console.log('Loaded model categories:', categories);
      } catch (categoryError) {
        console.warn('Could not load model categories, falling back to legacy schema:', categoryError);
      }
      
      // Check if we have a saved state for this firearm
      if (hasStoredStateForFirearm(firearmId)) {
        // Load the state and apply it to our component structure
        const storedState = loadBuilderState();
        
        if (storedState) {
          console.log('Loading stored state for firearm', firearmId, storedState);
          // Now that we have the model, build the component structure
          await buildComponentStructure();
          
          // Apply the stored selections based on component ID
          applyStoredComponentSelections(storedState.components);
        }
      } else {
        // No stored state, just build the basic component structure
        // Make sure we have the model before building
        console.log('No stored state, building component structure with model:', model);
        await buildComponentStructure();
      }
      
      updateBuildSummary(componentStructure);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }

  // Build component structure when firearmModel or availableParts change
  useEffect(() => {
    if (firearmModel && availableParts.length > 0) {
      buildComponentStructure();
    }
  }, [firearmModel, availableParts]);

  // Build component structure based on the model requirements and available parts
  const buildComponentStructure = async () => {
    console.log('Building component structure for model:', firearmModel);
    
    if (!firearmModel) {
      console.warn('No model found, setting empty component structure');
      setComponentStructure([]);
      return;
    }
    
    const allParts = availableParts.slice();
    const components: ComponentItem[] = [];
    let nextComponentId = 1;
    
    // Check if we can use the new schema (part categories)
    if (modelCategories && modelCategories.length > 0) {
      console.log('Using new schema with part categories:', modelCategories);
      
      // Organize parts by category_id for easy lookup
      const partsByCategoryId: Record<number, Part[]> = {};
      
      allParts.forEach(part => {
        if (part.part_category_id) {
          if (!partsByCategoryId[part.part_category_id]) {
            partsByCategoryId[part.part_category_id] = [];
          }
          partsByCategoryId[part.part_category_id].push(part);
        }
      });
      
      // Create a map of category IDs to their data for faster lookup
      const categoryMap: Record<number, PartCategory> = {};
      modelCategories.forEach(cat => {
        categoryMap[cat.id] = cat;
      });
      
      // Process top-level categories first (those with null parent_category_id)
      const topLevelCategories = modelCategories.filter(cat => !cat.parent_category_id);
      
      // Recursive function to build component structure with unlimited depth
      const buildCategoryTree = (category: PartCategory, parentId?: number): ComponentItem => {
        const isRequired = category.is_required || false;
        
        // Create component item for this category
        const component: ComponentItem = {
          id: nextComponentId++,
          name: category.name,
          description: category.description || '',
          category: category.name, // Keep legacy field for backward compatibility
          subcategory: '', // Keep legacy field for backward compatibility
          part_category_id: category.id,
          part_category: category,
          isRequired,
          isPrebuilt: false,
          selectedPart: null,
          parentId,
          subComponents: [],
          partData: {} as Part // Placeholder
        };
        
        // Find all child categories and process them
        const childCategories = modelCategories.filter(cat => 
          cat.parent_category_id === category.id
        );
        
        if (childCategories.length > 0) {
          console.log(`Category ${category.name} has child categories:`, childCategories.map(c => c.name));
          // Process all children recursively
          component.subComponents = childCategories.map(child => 
            buildCategoryTree(child, component.id)
          );
        }
        
        return component;
      };
      
      // Build the complete tree
      for (const topCategory of topLevelCategories) {
        components.push(buildCategoryTree(topCategory));
      }
    } 
    // Fallback to legacy schema
    else if (firearmModel.parts) {
      console.log('Using legacy schema with firearmModel.parts');
      
      // Organize parts by category for easier lookup
      const partsByCategory: Record<string, Part[]> = {};
      
      allParts.forEach(part => {
        if (!part.category) return;
        
        if (!partsByCategory[part.category]) {
          partsByCategory[part.category] = [];
        }
        partsByCategory[part.category].push(part);
        
        // Also add to subcategory if it exists
        if (part.subcategory) {
          if (!partsByCategory[part.subcategory]) {
            partsByCategory[part.subcategory] = [];
          }
          partsByCategory[part.subcategory].push(part);
        }
      });
      
      console.log('Parts organized by category:', Object.keys(partsByCategory));
      
      // Extract main categories from the model.parts structure
      const mainCategories = Object.keys(firearmModel.parts || {});
      console.log('Main categories from model:', mainCategories);
      
      // Process each main category using the existing code
      for (const category of mainCategories) {
        const categoryDetails = firearmModel.parts[category];
        const isRequired = categoryDetails.type === 'required';
        
        console.log(`Processing category: ${category}, required: ${isRequired}`);
        
        // Create component for this category
        const component: ComponentItem = {
          id: nextComponentId++,
          name: category,
          description: '',
          category,
          subcategory: '',
          isRequired,
          isPrebuilt: false,
          selectedPart: null,
          subComponents: [],
          partData: {} as Part // This is a placeholder
        };
        
        // Check if there are sub-parts defined
        if (categoryDetails.sub_parts && Object.keys(categoryDetails.sub_parts).length > 0) {
          console.log(`Category ${category} has sub-parts:`, Object.keys(categoryDetails.sub_parts));
          
          // Process sub-parts and create child components
          component.subComponents = processSubParts(
            categoryDetails.sub_parts, 
            component.id, 
            partsByCategory,
            isRequired
          );
        }
        
        components.push(component);
      }
    } else {
      console.warn('No model.parts structure found, using empty component structure');
    }
    
    console.log('Final component structure:', components);
    setComponentStructure(components);
    // Initialize all top-level components as expanded
    setExpandedItems(components.map(c => c.id));
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

  // Toggle expansion of an assembly
  const toggleExpand = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
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
    // Navigate to catalog with appropriate filters
    console.log('handleAddPart called with component:', component);
    
    const modelName = firearmModel?.name || "";
    let componentCategory = component.name || component.category || "";
    let categoryId: number | undefined = undefined;
    
    // If we have the new category structure, use that for precise filtering
    if (component.part_category_id) {
      categoryId = component.part_category_id;
      console.log(`Using part_category_id ${categoryId} for filtering`);
    }
    // Legacy handling for string-based categories
    else {
      console.log(`Using legacy component category: ${componentCategory}`);
    }
    
    console.log(`Navigating to catalog with component category: ${componentCategory}`);
    
    // For certain component categories, we want to include both regular parts and pre-built assemblies
    // This allows parts like "Complete Lower Receiver" to show up in category filters like "Lower Receiver"
    const includeAssemblies = ["Lower Receiver", "Upper Receiver"].includes(componentCategory);
    
    // Construct the URL with the query parameters needed for filtering in the catalog
    const queryParams = new URLSearchParams({
      componentFilter: componentCategory,
      isAssembly: includeAssemblies ? "true" : "false",
      returnToBuilder: "true",
      modelName,
      firearmId: firearmId.toString(),
      component_category: componentCategory
    });
    
    // Add category_id parameter if available (new schema)
    if (categoryId !== undefined) {
      queryParams.append("category_id", categoryId.toString());
    }
    
    router.push(`/catalog?${queryParams}`);
  };

  // Open assembly selection page
  const handleAddAssembly = (component: ComponentItem) => {
    // Navigate to catalog with appropriate filters for assemblies
    console.log('handleAddAssembly called with component:', component);
    
    const modelName = firearmModel?.name || "";
    const componentCategory = component.name || component.category || "";
    let categoryId: number | undefined = undefined;
    
    // If we have the new category structure, use that for precise filtering
    if (component.part_category_id) {
      categoryId = component.part_category_id;
      console.log(`Using part_category_id ${categoryId} for filtering assemblies`);
    }
    
    console.log(`Navigating to catalog with component category: ${componentCategory} (for assembly)`);
    
    // Construct the URL with query parameters for filtering
    const queryParams = new URLSearchParams({
      componentFilter: componentCategory,
      compatibility: modelName,
      returnToBuilder: "true",
      firearmId: firearmId,
      component_category: componentCategory,
      isAssembly: "true"
    });
    
    // Add category_id parameter if available (new schema)
    if (categoryId !== undefined) {
      queryParams.append("category_id", categoryId.toString());
    }
    
    router.push(`/catalog?${queryParams}`);
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

  // Handle returning from catalog with selected part
  useEffect(() => {
    if (!searchParams) return;
    const selectedPartId = searchParams.get('selected_part_id');
    const componentCategory = searchParams.get('component_category');
    const isAssemblyParam = searchParams.get('isAssembly');
    const categoryIdParam = searchParams.get('category_id');
    
    if (selectedPartId) {
      console.log(`Returning from catalog with part ID ${selectedPartId}`);
      console.log(`Category info - name: ${componentCategory}, id: ${categoryIdParam}, isAssembly: ${isAssemblyParam}`);
      
      // Find the right component by category or category ID
      const findMatchingComponent = (items: ComponentItem[]): ComponentItem | null => {
        for (const item of items) {
          // First try to match by part_category_id (most precise)
          if (categoryIdParam && item.part_category_id && item.part_category_id === parseInt(categoryIdParam)) {
            console.log(`Found matching component by part_category_id: ${item.name} (ID: ${item.part_category_id})`);
            return item;
          }
          
          // Fall back to category name matching if needed
          if (componentCategory && (item.name === componentCategory || item.category === componentCategory)) {
            console.log(`Found matching component by name/category: ${item.name}`);
            return item;
          }
          
          // Recursively check subcomponents
          if (item.subComponents && item.subComponents.length > 0) {
            const found = findMatchingComponent(item.subComponents);
            if (found) return found;
          }
        }
        return null;
      };
      
      const component = findMatchingComponent(componentStructure);
      if (component) {
        // Get the part details
        getPartById(parseInt(selectedPartId)).then(part => {
          if (part) {
            console.log(`Found part:`, part);
            
            // If we have categoryIdParam, update the part's category_id if not already set
            if (categoryIdParam && !part.part_category_id) {
              console.log(`Setting part ${part.id} category_id to ${categoryIdParam}`);
              part.part_category_id = parseInt(categoryIdParam);
            }
            
            // If isAssembly is true, use the assembly selection handling
            if (isAssemblyParam === 'true') {
              handleSelectAssembly(component.id, part);
            } else {
              handleSelectPart(component.id, part);
            }
          }
        }).catch(err => {
          console.error('Error fetching part details:', err);
        });
      } else {
        console.error(`No matching component found for category: ${componentCategory}, category_id: ${categoryIdParam}`);
      }
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

  // Render loading state
  if (loading) {
    return <div className="p-6 text-center">Loading build worksheet...</div>;
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 dark:bg-red-900/10 dark:border-red-800 rounded-lg p-6 my-4">
        <h3 className="text-red-800 dark:text-red-400 font-medium">Error Loading Build Worksheet</h3>
        <p className="text-red-700 dark:text-red-300 text-sm mt-2">
          {error.message || "Unable to load the firearm model and parts. Please try again later."}
        </p>
        <button 
          className="mt-3 px-4 py-2 text-sm bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700"
          onClick={() => window.location.reload()}
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

  // Render component rows recursively, with each component only shown once
  const renderComponentRows = (components: ComponentItem[], level = 0): ReactElement[] => {
    return components.flatMap((component, index) => {
      const rows: ReactElement[] = [];
      const isComponentAnAssembly = isComponentAssembly(component);
      const hasSubComponents = component.subComponents && component.subComponents.length > 0;
      
      // Generate a unique key using index and component id to avoid duplicate keys
      const componentKey = `component-${component.id}-${level}-${index}`;
      
      // Check if there's an assembly option available for this component
      const hasAssemblyOption = availableParts.some(part => 
        part.part_category_id === component.part_category_id && 
        part.is_prebuilt && 
        isAssembly(part)
      );
      
      // Check if this component is fulfilled by a parent assembly
      const isFulfilledByAssembly = component.selectedPart && 
                                    (component.selectedPart as any).fulfilled_by_assembly === true;
      
      // Main component row
      rows.push(
        <tr key={componentKey} className={level === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-700"}>
          <td className="px-4 py-3 flex items-center">
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
              <div className="w-6 ml-1" /> 
            )}
            
            <span className={`${level > 0 ? "ml-" + (level * 4) : "font-medium"} ${isFulfilledByAssembly ? "text-blue-600 dark:text-blue-400" : ""}`}>
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
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Component</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Selected Part</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Compatibility</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Render component rows recursively, with each component only shown once */}
          {renderComponentRows(componentStructure)}
        </tbody>
      </table>
    </div>
  );
}