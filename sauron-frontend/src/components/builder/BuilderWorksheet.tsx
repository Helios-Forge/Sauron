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
  FirearmModel 
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
  
  // Keep track of whether we've processed URL parameters
  const processedUrlParams = React.useRef(false);
  
  // Add router for navigation
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch firearm model and parts when component mounts
  useEffect(() => {
    async function loadFirearmModelAndParts() {
      try {
        setLoading(true);
        console.log(`Loading firearm model and parts for ID: ${firearmId}`);
        
        // Check if we have stored state for this firearm
        if (hasStoredStateForFirearm(firearmId)) {
          const storedState = loadBuilderState();
          if (storedState) {
            console.log('Found stored state for firearm:', storedState);
            
            // Restore state from storage
            setFirearmModel(storedState.firearmModel ? {
              id: storedState.firearmModel.id,
              name: storedState.firearmModel.name,
              // Add required properties with defaults
              description: "",
              manufacturer_id: 0,
              category: "",
              subcategory: "",
              variant: "",
              specifications: {},
              compatible_parts: {},
              parts: {},
              images: [],
              price_range: "",
              created_at: "",
              updated_at: ""
            } as FirearmModel : null);
            
            // Convert ComponentState[] to ComponentItem[]
            const storedComponentItems = convertStoredToComponentItems(storedState.components);
            console.log('Converted stored components to component items:', storedComponentItems);
            setComponentStructure(storedComponentItems);
            setExpandedItems(storedState.expandedItems);
            
            // Update the build summary with the loaded components
            updateBuildSummary(storedComponentItems);
            
            setLoading(false);
            return;
          }
        }
        
        // If no stored state, load from API
        console.log('No stored state found, loading from API');
        // Fetch the firearm model
        const model = await getFirearmModelById(parseInt(firearmId));
        console.log('Fetched firearm model:', model);
        setFirearmModel(model);
        
        // Fetch all parts
        const parts = await getParts();
        console.log(`Fetched ${parts.length} parts`);
        setAvailableParts(parts);
        
        // Process model details to create component structure
        if (model) {
          await buildComponentStructure();
        }
      } catch (error) {
        console.error('Error loading firearm model:', error);
        setError(error instanceof Error ? error : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    }
    
    loadFirearmModelAndParts();
  }, [firearmId]);

  // Build component structure when firearmModel or availableParts change
  useEffect(() => {
    if (firearmModel && availableParts.length > 0) {
      buildComponentStructure();
    }
  }, [firearmModel, availableParts]);

  // Build component structure based on the model requirements and available parts
  const buildComponentStructure = async () => {
    console.log('Building component structure for model:', firearmModel);
    
    if (!firearmModel || !firearmModel.parts) {
      console.warn('No model or model.parts found, setting empty component structure');
      setComponentStructure([]);
      return;
    }
    
    const allParts = availableParts.slice();
    
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
    
    // Process required categories from the firearm model
    const components: ComponentItem[] = [];
    let nextComponentId = 1;
    
    // Extract main categories from the model.parts structure
    const mainCategories = Object.keys(firearmModel.parts || {});
    console.log('Main categories from model:', mainCategories);
    
    // Process each main category
    for (const category of mainCategories) {
      const categoryDetails = firearmModel.parts[category];
      const isRequired = categoryDetails.type === 'required';
      
      console.log(`Processing category: ${category}, required: ${isRequired}`);
      
      // Create the main component item
      const component: ComponentItem = {
        id: nextComponentId++,
        name: category,
        category: category,
        subcategory: '',
        description: '',
        isRequired: isRequired,
        isPrebuilt: false,
        selectedPart: null,
        subComponents: [],
        partData: {} as Part
      };
      
      // Process subparts if they exist
      if (categoryDetails.sub_parts) {
        const subParts = categoryDetails.sub_parts;
        console.log(`Processing ${Object.keys(subParts).length} sub-parts for ${category}`);
        
        // Create component items for each subpart
        for (const subPartName in subParts) {
          const subPartDetails = subParts[subPartName];
          const isSubPartRequired = subPartDetails.type === 'required';
          
          console.log(`  Sub-part: ${subPartName}, required: ${isSubPartRequired}`);
          
          const subComponent: ComponentItem = {
            id: nextComponentId++,
            name: subPartName,
            category: subPartName,
            subcategory: category, // Parent category as subcategory
            description: '',
            isRequired: isSubPartRequired,
            isPrebuilt: false,
            selectedPart: null,
            parentId: component.id,
            subComponents: [],
            partData: {} as Part
          };
          
          // If the subpart has its own sub-parts, process them too
          if (subPartDetails.sub_parts) {
            // Process sub-sub-parts (third level)
            // This is a simplified version, actual logic would be recursive
            console.log(`  Processing sub-sub-parts for ${subPartName}`);
            // ... recursively process sub-parts
          }
          
          component.subComponents.push(subComponent);
        }
      }
      
      components.push(component);
    }
    
    console.log('Final component structure:', components);
    setComponentStructure(components);
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
    console.log(`handleSelectPart called for component ${componentId} with part:`, part);
    
    // Check if the componentId exists in our structure
    let componentExists = false;
    const checkComponentExists = (items: ComponentItem[]): boolean => {
      for (const item of items) {
        if (item.id === componentId) {
          componentExists = true;
          return true;
        }
        if (item.subComponents && item.subComponents.length > 0) {
          if (checkComponentExists(item.subComponents)) {
            return true;
          }
        }
      }
      return false;
    };
    
    checkComponentExists(componentStructure);
    
    if (!componentExists) {
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
    
    setComponentStructure(prevStructure => {
      console.log('Previous component structure:', prevStructure);
      const newStructure = [...prevStructure];
      
      const updateComponent = (items: ComponentItem[]): boolean => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === componentId) {
            console.log(`Found matching component to update:`, items[i]);
            items[i].selectedPart = part;
            items[i].isPrebuilt = false;
            console.log(`Component updated with new part`);
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
      console.log(`Component ${found ? 'was' : 'was NOT'} found and updated`);
      
      // Update stored state
      updateStoredComponent(firearmId, componentId, part, false);
      console.log('Builder state updated in localStorage');
      
      return newStructure;
    });
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
    let componentCategory = component.category || "";
    
    // Special handling for Lower Assembly components
    // If we're looking at a Lower Assembly component, we want to find parts that match both
    // the category and subcategory for better filtering
    if (componentCategory === "Lower Assembly" && component.subcategory) {
      // For Lower Assembly, we need to be more specific to find specific parts like Complete Lower Receiver
      componentCategory = component.subcategory;
      console.log(`Using subcategory ${componentCategory} for Lower Assembly component`);
    }
    
    console.log(`Navigating to catalog with component category: ${componentCategory}`);
    
    // For certain component categories, we want to include both regular parts and pre-built assemblies
    // This allows parts like "Complete Lower Receiver" to show up in category filters like "Lower Receiver"
    const includeAssemblies = ["Lower Receiver", "Upper Receiver"].includes(componentCategory);
    
    // If this is a category that should include prebuilt parts, don't filter by isAssembly
    const assemblyParam = includeAssemblies ? "" : "&isAssembly=false";
    
    // Construct the URL with query parameters for filtering
    router.push(`/catalog?component=${encodeURIComponent(componentCategory)}&compatibility=${encodeURIComponent(modelName)}&returnToBuilder=true&firearmId=${firearmId}&component_category=${encodeURIComponent(componentCategory)}${assemblyParam}`);
  };

  // Open assembly selection page
  const handleAddAssembly = (component: ComponentItem) => {
    // Navigate to catalog with appropriate filters for assemblies
    console.log('handleAddAssembly called with component:', component);
    
    const modelName = firearmModel?.name || "";
    const componentCategory = component.category || "";
    
    console.log(`Navigating to catalog with component category: ${componentCategory} (for assembly)`);
    
    // Construct the URL with query parameters for filtering
    router.push(`/catalog?component=${encodeURIComponent(componentCategory)}&compatibility=${encodeURIComponent(modelName)}&returnToBuilder=true&firearmId=${firearmId}&component_category=${encodeURIComponent(componentCategory)}&isAssembly=true`);
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

  // Effect to handle URL parameters for part selection
  useEffect(() => {
    if (processedUrlParams.current) return;
    
    // Using new parameter names for clarity
    const componentCategory = searchParams.get('component_category');
    const selectedPartId = searchParams.get('selected_part_id');
    const isAssemblyParamStr = searchParams.get('isAssembly');
    const isAssemblyParam = isAssemblyParamStr !== null ? isAssemblyParamStr === 'true' : undefined;
    
    console.log('Raw URL Parameters:', { 
      componentCategory, 
      selectedPartId, 
      isAssemblyParam,
      searchParamsEntries: Array.from(searchParams.entries())
    });
    
    // If we have URL parameters and the component structure is loaded
    if (componentCategory && selectedPartId && componentStructure.length > 0 && !loading) {
      processedUrlParams.current = true;
      console.log('Processing URL parameters to select part by category');
      
      // Parse the part ID
      const partId = parseInt(selectedPartId, 10);
      if (isNaN(partId)) {
        console.error(`Failed to parse selected part ID "${selectedPartId}" as number`);
        return;
      }
      
      console.log(`Looking for component matching category: ${componentCategory}`);
      
      // Find the component with matching category
      const findComponentByCategory = (items: ComponentItem[]): ComponentItem | null => {
        for (const item of items) {
          // Check for an exact category match or a case-insensitive match
          if (item.category === componentCategory || 
              item.category.toLowerCase() === componentCategory.toLowerCase()) {
            return item;
          }
          
          if (item.subComponents && item.subComponents.length > 0) {
            const found = findComponentByCategory(item.subComponents);
            if (found) return found;
          }
        }
        return null;
      };
      
      const matchingComponent = findComponentByCategory(componentStructure);
      
      if (!matchingComponent) {
        console.error(`No component found matching category: ${componentCategory}`);
        return;
      }
      
      console.log(`Found matching component:`, matchingComponent);
      
      // Function to process the selection
      const applyPartSelection = async () => {
        try {
          // Fetch the part details
          console.log(`Fetching part with ID ${partId}`);
          const part = await getPartById(partId);
          
          if (part) {
            console.log(`Successfully fetched part:`, part);
            
            // Apply the selection to the component
            if (isAssemblyParam !== undefined) {
              // If isAssemblyParam is specified, use it to determine if we should add as assembly
              if (isAssemblyParam && isAssembly(part)) {
                console.log(`Selecting as assembly for component ${matchingComponent.id}`);
                handleSelectAssembly(matchingComponent.id, part);
              } else {
                console.log(`Selecting as regular part for component ${matchingComponent.id}`);
                handleSelectPart(matchingComponent.id, part);
              }
            } else {
              // If isAssemblyParam is not specified, determine based on the part properties
              if (isAssembly(part)) {
                console.log(`Auto-selecting as assembly for component ${matchingComponent.id} based on part properties`);
                handleSelectAssembly(matchingComponent.id, part);
              } else {
                console.log(`Auto-selecting as regular part for component ${matchingComponent.id} based on part properties`);
                handleSelectPart(matchingComponent.id, part);
              }
            }
          } else {
            console.error(`Part with ID ${partId} not found`);
          }
        } catch (error) {
          console.error("Error fetching selected part:", error);
        }
      };
      
      applyPartSelection();
    }
  }, [searchParams, componentStructure, loading]);

  // Update the build summary whenever the component structure changes
  useEffect(() => {
    if (componentStructure.length > 0) {
      updateBuildSummary(componentStructure);
    }
  }, [componentStructure]);

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
        part.category === component.category && 
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
            
            <span className={`${level > 0 ? "ml-4" : "font-medium"} ${isFulfilledByAssembly ? "text-blue-600 dark:text-blue-400" : ""}`}>
              {component.category}
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
    <div className="p-6 text-center">
      {/* Render component rows recursively, with each component only shown once */}
      {renderComponentRows(componentStructure)}
    </div>
  );
}