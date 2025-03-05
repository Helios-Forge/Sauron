"use client";

import { useState, useEffect, ReactElement } from 'react';
import { 
  getFirearmModelById, 
  getParts, 
  isAssembly, 
  getSubComponentNames, 
  getSubComponentParts,
  getCompatiblePartsForModel,
  getRequiredPartsForModel,
  Part, 
  FirearmModel 
} from '@/lib/api';
import { ChevronDown, ChevronRight } from 'lucide-react';

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

  // Fetch firearm model and parts when component mounts
  useEffect(() => {
    async function loadFirearmModelAndParts() {
      if (!firearmId) return;
      
      try {
        setLoading(true);
        
        // Load firearm model
        const model = await getFirearmModelById(parseInt(firearmId, 10));
        if (!model) {
          throw new Error(`Firearm model with ID ${firearmId} not found`);
        }
        
        setFirearmModel(model);
        
        // Load all available parts using the standard endpoint
        const allParts = await getParts();
        setAvailableParts(allParts);
        
        // Don't build component structure here, it will be triggered by the firearmModel change
      } catch (err) {
        console.error('Error loading firearm model or parts:', err);
        setError(err instanceof Error ? err : new Error('Failed to load firearm model or parts'));
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
    console.log(`Building component structure for ${firearmModel?.name}`);
    
    // If model doesn't have parts, set empty component structure and return
    if (!firearmModel || !firearmModel.parts) {
      console.log('No parts found in firearm model, setting empty component structure');
      setComponentStructure([]);
      return;
    }
    
    console.log(`Model name: ${firearmModel.name}`);
    console.log(`Model parts:`, firearmModel.parts);
    
    // Get required categories from the model's parts field
    const requiredCategories = Object.keys(firearmModel.parts);
    
    // Optional categories from compatible_parts
    const optionalCategories = firearmModel.compatible_parts ? 
      Object.keys(firearmModel.compatible_parts) : [];
    
    console.log("Required categories:", requiredCategories);
    console.log("Optional categories:", optionalCategories);

    // Filter parts to only include those compatible with this model
    const compatibleParts = availableParts.filter(part => {
      return part.compatible_models && 
             Array.isArray(part.compatible_models) &&
             part.compatible_models.some(compatModel => 
               compatModel && typeof compatModel === 'object' && 
               compatModel.model === firearmModel.name
             );
    });
    
    console.log(`Found ${compatibleParts.length} compatible parts for ${firearmModel.name}`);
    
    // Group parts by category and subcategory for easy lookup
    const partsByCategory: Record<string, Part[]> = {};
    compatibleParts.forEach(part => {
      if (!partsByCategory[part.category]) {
        partsByCategory[part.category] = [];
      }
      partsByCategory[part.category].push(part);
      
      // Also index by subcategory if it exists
      if (part.subcategory) {
        if (!partsByCategory[part.subcategory]) {
          partsByCategory[part.subcategory] = [];
        }
        partsByCategory[part.subcategory].push(part);
      }
    });
    
    // Find all compatible assemblies (pre-built parts)
    const assemblies = compatibleParts.filter(part => part.is_prebuilt && isAssembly(part));
    
    console.log("Compatible assemblies found:", assemblies.map(a => ({
      id: a.id, 
      name: a.name, 
      category: a.category, 
      subcategory: a.subcategory,
      sub_components: a.sub_components
    })));
    
    // Process the top-level components from the parts field
    const topLevelComponents: ComponentItem[] = [];
    
    // Process required categories from the parts field
    for (const category of requiredCategories) {
      const categoryData = firearmModel.parts[category];
      const isRequired = categoryData.type === 'required';
      
      // Find matching assembly for this category
      const matchingAssemblies = assemblies.filter(a => a.category === category);
      const matchingAssembly = matchingAssemblies.length > 0 ? matchingAssemblies[0] : null;
      
      // Create the component item
      const component: ComponentItem = {
        id: matchingAssembly ? matchingAssembly.id : Math.floor(Math.random() * 10000),
        name: category,
        description: `${category} component`,
        category: category,
        subcategory: matchingAssembly?.subcategory || "",
        isRequired: isRequired,
        isPrebuilt: false,
        selectedPart: null,
        subComponents: [],
        partData: matchingAssembly || null as any
      };
      
      // If we found a matching assembly, use its data
      if (matchingAssembly) {
        component.isPrebuilt = true;
        component.partData = matchingAssembly;
      }
      
      // Process sub-parts recursively if they exist
      if (categoryData.sub_parts) {
        component.subComponents = processSubParts(
          categoryData.sub_parts,
          component.id,
          partsByCategory,
          isRequired
        );
      }
      
      topLevelComponents.push(component);
    }
    
    // Process optional categories from compatible_parts
    for (const category of optionalCategories) {
      // Skip if this category is already in the required list
      if (requiredCategories.includes(category)) continue;
      
      // Find matching assembly for this category
      const matchingAssemblies = assemblies.filter(a => a.category === category);
      const matchingAssembly = matchingAssemblies.length > 0 ? matchingAssemblies[0] : null;
      
      // Create the component item
      const component: ComponentItem = {
        id: matchingAssembly ? matchingAssembly.id : Math.floor(Math.random() * 10000),
        name: category,
        description: `${category} component`,
        category: category,
        subcategory: matchingAssembly?.subcategory || "",
        isRequired: false,
        isPrebuilt: false,
        selectedPart: null,
        subComponents: [],
        partData: matchingAssembly || null as any
      };
      
      // If we found a matching assembly, use its data
      if (matchingAssembly) {
        component.isPrebuilt = true;
        component.partData = matchingAssembly;
      }
      
      // Process compatible parts for this category if they exist
      if (firearmModel.compatible_parts[category]) {
        // Handle different formats of compatible_parts data
        const categoryData = firearmModel.compatible_parts[category];
        
        if (typeof categoryData === 'object' && categoryData !== null) {
          component.subComponents = processCompatibleParts(
            categoryData,
            component.id,
            partsByCategory
          );
        }
      }
      
      topLevelComponents.push(component);
    }
    
    // Expand assemblies by default
    setExpandedItems(topLevelComponents.filter(c => c.isPrebuilt || (c.subComponents && c.subComponents.length > 0)).map(c => c.id));
    
    console.log("Final component structure:", topLevelComponents.map(c => ({
      id: c.id,
      category: c.category,
      subcategory: c.subcategory,
      isRequired: c.isRequired,
      isPrebuilt: c.isPrebuilt,
      subComponentsCount: c.subComponents.length
    })));
    
    // Update component structure
    setComponentStructure(topLevelComponents);
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
    setComponentStructure(prev => {
      // Create a copy of the component structure to modify
      const updated = [...prev];
      
      // Find and update the component in the structure
      const updateComponent = (items: ComponentItem[]): boolean => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === componentId) {
            items[i].selectedPart = part;
            return true;
          }
          
          // Check subComponents only if it exists
          if (items[i].subComponents && items[i].subComponents.length > 0) {
            const found = updateComponent(items[i].subComponents);
            if (found) return true;
          }
        }
        return false;
      };
      
      updateComponent(updated);
      
      // Update build statistics
      updateBuildSummary(updated);
      
      return updated;
    });
  };

  // Handle selection of an assembly
  const handleSelectAssembly = (assemblyId: number, assembly: Part) => {
    console.log("Selecting assembly:", assembly);
    console.log("Assembly sub_components:", assembly.sub_components);
    
    setComponentStructure(prev => {
      // Create a copy of the component structure to modify
      const updated = [...prev];
      
      // Find and update the assembly in the structure
      const updateComponent = (items: ComponentItem[]): boolean => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === assemblyId) {
            console.log(`Found assembly to update: ${items[i].category}`);
            
            // Select the assembly
            items[i].selectedPart = assembly;
            
            // Mark component as pre-built
            items[i].isPrebuilt = true;
            
            // If this is an assembly with sub-components, auto-select them too
            if (items[i].subComponents && items[i].subComponents.length > 0) {
              console.log(`Processing ${items[i].subComponents.length} subcomponents`);
              
              // Get the array of subcomponent names from the assembly
              const assemblySubComponents = Array.isArray(assembly.sub_components) 
                ? assembly.sub_components.map(sc => sc.name) 
                : [];
              
              console.log("Assembly subcomponent names:", assemblySubComponents);
              
              // Process each sub-component
              items[i].subComponents.forEach(subComponent => {
                // Check if this subcomponent is included in the assembly
                const isIncludedInAssembly = assemblySubComponents.some(subName => 
                  subName === subComponent.category || 
                  subName === subComponent.subcategory ||
                  subName === subComponent.name
                );
                
                console.log(`Subcomponent ${subComponent.category} is included in assembly: ${isIncludedInAssembly}`);
                
                if (isIncludedInAssembly) {
                  // Create a virtual part to represent that it's included in the assembly
                  subComponent.selectedPart = {
                    ...assembly, // Use assembly as base to get manufacturer, etc.
                    id: -100000 - subComponent.id, // Use negative ID to indicate virtual
                    name: `Included in ${assembly.name}`,
                    price: 0, // Price is already included in the assembly
                    description: `Part of the ${assembly.name} assembly`,
                    category: subComponent.category,
                    subcategory: subComponent.subcategory,
                    is_prebuilt: false,
                    fulfilled_by_assembly: true, // Add a flag to mark it as fulfilled by an assembly
                    parent_assembly_id: assembly.id, // Reference back to the parent assembly
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
                  
                  // Recursively fulfill any deeper sub-components if they exist
                  if (subComponent.subComponents && subComponent.subComponents.length > 0) {
                    fulfillSubComponentsFromAssembly(subComponent.subComponents, assembly);
                  }
                }
              });
            }
            return true;
          }
          
          if (items[i].subComponents && items[i].subComponents.length > 0) {
            const found = updateComponent(items[i].subComponents);
            if (found) return true;
          }
        }
        return false;
      };
      
      updateComponent(updated);
      
      // Update build statistics
      updateBuildSummary(updated);
      
      return updated;
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
    let price = 0;
    let selectedCount = 0;
    let requiredCount = 0;
    
    // Calculate price, count selected parts, and check compatibility
    const processComponent = (item: ComponentItem) => {
      if (item.isRequired) requiredCount++;
      
      if (item.selectedPart) {
        selectedCount++;
        price += item.selectedPart.price;
        
        // If this is an assembly, don't count sub-components separately
        // as they're already included in the assembly price
        if (item.isPrebuilt && item.subComponents) {
          return;
        }
      }
      
      // Process sub-components if this item doesn't have a selection yet
      if (item.subComponents && item.subComponents.length > 0 && (!item.selectedPart || !item.isPrebuilt)) {
        item.subComponents.forEach(processComponent);
      }
    };
    
    components.forEach(processComponent);
    
    // Update local state
    setTotalPrice(price);
    
    // Determine compatibility status
    let status: 'compatible' | 'warning' | 'incompatible' = 'compatible';
    if (selectedCount < requiredCount) {
      status = 'warning'; // Not all required components are selected
    }
    
    setCompatibility(status);
    
    // Notify parent component of the update
    onBuildUpdate(
      selectedCount,
      requiredCount,
      price,
      status,
      flattenComponents(components)
    );
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

  // Open part selection modal
  const handleAddPart = (component: ComponentItem) => {
    // Filter available parts to those matching this component's category
    const compatibleParts = availableParts.filter(part => 
      (part.category === component.category || 
       (component.subcategory && part.category === component.subcategory) ||
       part.subcategory === component.category) && 
      !part.is_prebuilt
    );
    
    if (compatibleParts.length > 0) {
      // In a real implementation, this would open a modal or drawer to select a part
      // For now, just select the first compatible part as a placeholder
      handleSelectPart(component.id, compatibleParts[0]);
    } else {
      console.log(`No compatible parts found for ${component.category}`);
    }
  };

  // Open assembly selection modal
  const handleAddAssembly = (component: ComponentItem) => {
    // Filter available assemblies for this component type
    const compatibleAssemblies = availableParts.filter(part => 
      part.category === component.category && 
      part.is_prebuilt && 
      isAssembly(part)
    );
    
    if (compatibleAssemblies.length > 0) {
      // In a real implementation, this would open a modal or drawer to select an assembly
      // For now, just select the first compatible assembly as a placeholder
      handleSelectAssembly(component.id, compatibleAssemblies[0]);
    } else {
      console.log(`No compatible assemblies found for ${component.category}`);
    }
  };

  // Add a function to check if a component is an assembly
  const isComponentAssembly = (component: ComponentItem): boolean => {
    return component.isPrebuilt && 
      component.subComponents !== undefined && 
      component.subComponents !== null && 
      component.subComponents.length > 0;
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Build Worksheet
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select components to build your custom {firearmModel.name}
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Component</th>
              <th className="px-4 py-3 text-center">Required</th>
              <th className="px-4 py-3 text-left">Selected Part</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-center">Compatibility</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {renderComponentRows(componentStructure)}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Build Progress
            </h4>
            <p className="text-gray-900 dark:text-white text-lg font-semibold">
              {componentStructure.filter(c => c.selectedPart).length} of {componentStructure.filter(c => c.isRequired).length} required components selected
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 text-right">
              Estimated Price
            </h4>
            <p className="text-gray-900 dark:text-white text-lg font-semibold">
              ${totalPrice.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className={`mt-4 p-3 rounded-md ${
          compatibility === 'compatible' 
            ? 'bg-green-50 dark:bg-green-900/10 text-green-800 dark:text-green-400'
            : compatibility === 'warning'
              ? 'bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-400'
              : 'bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-400'
        }`}>
          <div className="flex items-center">
            <svg 
              className="w-5 h-5 mr-2" 
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {compatibility === 'compatible' ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              ) : compatibility === 'warning' ? (
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
              )}
            </svg>
            <span className="font-medium">
              {compatibility === 'compatible' 
                ? 'All components are compatible' 
                : compatibility === 'warning'
                  ? 'Missing required components'
                  : 'Incompatible components detected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 