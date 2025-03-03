"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BuildComponent {
  id: string;
  name: string;
  type: string; // 'assembly', 'component', or 'subcomponent'
  required: boolean;
  selected: boolean;
  isAssembly?: boolean; // Flag to indicate if this is an assembly part
  assemblyPartSelected?: boolean; // Flag to indicate if an assembly part is selected that includes this component
  selectedPart?: {
    id: string;
    name: string;
    manufacturer: string;
    price: number;
    compatibility: string[];
    isAssembly?: boolean; // Flag to indicate if this is an assembly part
  };
  subcomponents?: BuildComponent[];
}

interface BuilderWorksheetProps {
  firearmId: string;
  onBuildUpdate?: (
    selectedCount: number, 
    requiredCount: number, 
    price: number, 
    compatibility: 'compatible' | 'warning' | 'incompatible',
    updatedComponents?: BuildComponent[]
  ) => void;
  selectedComponentId?: string | null;
  selectedProductId?: string | null;
  isAssembly?: boolean;
  savedComponents?: BuildComponent[];
}

// This would be replaced with actual API call
function getFirearmComponents(firearmId: string = 'ar15-standard'): BuildComponent[] {
  // In a real implementation, this would be:
  // const response = await fetch(`/api/firearm-models/${firearmId}/components`);
  // return response.json();
  
  console.log(`Fetching components for firearm: ${firearmId}`);
  
  // For now, return placeholder data for AR-15 with more granular breakdown
  // In a real implementation, this would vary based on the firearmId
  return [
    {
      id: 'upper-assembly',
      name: 'Upper Assembly',
      type: 'assembly',
      required: true,
      selected: false,
      isAssembly: true,
      subcomponents: [
        {
          id: 'upper-receiver',
          name: 'Upper Receiver',
          type: 'component',
          required: true,
          selected: false,
          subcomponents: [
            {
              id: 'forward-assist',
              name: 'Forward Assist',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'forward-assist-spring',
              name: 'Forward Assist Spring',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'forward-assist-pin',
              name: 'Forward Assist Pin',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'dust-cover',
              name: 'Dust Cover',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'dust-cover-spring',
              name: 'Dust Cover Spring',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'dust-cover-pin',
              name: 'Dust Cover Pin',
              type: 'subcomponent',
              required: true,
              selected: false
            }
          ]
        },
        {
          id: 'barrel',
          name: 'Barrel',
          type: 'component',
          required: true,
          selected: false,
          subcomponents: [
            {
              id: 'barrel-extension',
              name: 'Barrel Extension',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'barrel-nut',
              name: 'Barrel Nut',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'gas-block',
              name: 'Gas Block',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'gas-tube',
              name: 'Gas Tube',
              type: 'subcomponent',
              required: true,
              selected: false
            }
          ]
        },
        {
          id: 'handguard',
          name: 'Handguard',
          type: 'component',
          required: true,
          selected: false,
          subcomponents: [
            {
              id: 'rail-system',
              name: 'Rail System',
              type: 'subcomponent',
              required: false,
              selected: false
            },
            {
              id: 'heat-shield',
              name: 'Heat Shield',
              type: 'subcomponent',
              required: false,
              selected: false
            }
          ]
        },
        {
          id: 'bolt-carrier-group',
          name: 'Bolt Carrier Group (BCG)',
          type: 'component',
          required: true,
          selected: false,
          isAssembly: true,
          subcomponents: [
            {
              id: 'bolt',
              name: 'Bolt',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'bolt-carrier',
              name: 'Bolt Carrier',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'firing-pin',
              name: 'Firing Pin',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'firing-pin-retaining-pin',
              name: 'Firing Pin Retaining Pin',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'cam-pin',
              name: 'Cam Pin',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'gas-key',
              name: 'Gas Key',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'gas-key-screws',
              name: 'Gas Key Screws',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'extractor',
              name: 'Extractor',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'extractor-spring',
              name: 'Extractor Spring',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'extractor-pin',
              name: 'Extractor Pin',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'ejector',
              name: 'Ejector',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'ejector-spring',
              name: 'Ejector Spring',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'ejector-roll-pin',
              name: 'Ejector Roll Pin',
              type: 'subcomponent',
              required: true,
              selected: false
            }
          ]
        },
        {
          id: 'charging-handle',
          name: 'Charging Handle',
          type: 'component',
          required: true,
          selected: false,
          subcomponents: [
            {
              id: 'charging-handle-latch',
              name: 'Charging Handle Latch',
              type: 'subcomponent',
              required: true,
              selected: false
            }
          ]
        }
      ]
    },
    {
      id: 'lower-assembly',
      name: 'Lower Assembly',
      type: 'assembly',
      required: true,
      selected: false,
      isAssembly: true,
      subcomponents: [
        {
          id: 'lower-receiver',
          name: 'Lower Receiver',
          type: 'component',
          required: true,
          selected: false,
          subcomponents: [
            {
              id: 'receiver-extension',
              name: 'Receiver Extension (Buffer Tube)',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'buffer-tube-castle-nut',
              name: 'Buffer Tube Castle Nut',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'buffer-tube-end-plate',
              name: 'Buffer Tube End Plate',
              type: 'subcomponent',
              required: true,
              selected: false
            }
          ]
        },
        {
          id: 'trigger-assembly',
          name: 'Trigger Assembly',
          type: 'component',
          required: true,
          selected: false,
          isAssembly: true,
          subcomponents: [
            {
              id: 'trigger',
              name: 'Trigger',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'trigger-spring',
              name: 'Trigger Spring',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'trigger-pin',
              name: 'Trigger Pin',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'hammer',
              name: 'Hammer',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'hammer-spring',
              name: 'Hammer Spring',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'hammer-pin',
              name: 'Hammer Pin',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'disconnector',
              name: 'Disconnector',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'disconnector-spring',
              name: 'Disconnector Spring',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'trigger-guard',
              name: 'Trigger Guard',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'trigger-guard-roll-pin',
              name: 'Trigger Guard Roll Pin',
              type: 'subcomponent',
              required: true,
              selected: false
            }
          ]
        },
        {
          id: 'fire-control-group',
          name: 'Fire Control Group (FCG)',
          type: 'component',
          required: true,
          selected: false,
          isAssembly: true,
          subcomponents: [
            {
              id: 'safety-selector',
              name: 'Safety Selector',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'safety-selector-detent',
              name: 'Safety Selector Detent',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'safety-selector-spring',
              name: 'Safety Selector Spring',
              type: 'subcomponent',
              required: true,
              selected: false
            }
          ]
        },
        {
          id: 'buffer-system',
          name: 'Buffer System',
          type: 'component',
          required: true,
          selected: false,
          isAssembly: true,
          subcomponents: [
            {
              id: 'buffer',
              name: 'Buffer',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'buffer-spring',
              name: 'Buffer Spring',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'buffer-retainer',
              name: 'Buffer Retainer',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'buffer-retainer-spring',
              name: 'Buffer Retainer Spring',
              type: 'subcomponent',
              required: true,
              selected: false
            }
          ]
        },
        {
          id: 'stock',
          name: 'Stock',
          type: 'component',
          required: true,
          selected: false
        },
        {
          id: 'grip',
          name: 'Pistol Grip',
          type: 'component',
          required: true,
          selected: false,
          subcomponents: [
            {
              id: 'grip-screw',
              name: 'Grip Screw',
              type: 'subcomponent',
              required: true,
              selected: false
            },
            {
              id: 'grip-washer',
              name: 'Grip Washer',
              type: 'subcomponent',
              required: true,
              selected: false
            }
          ]
        }
      ]
    },
    {
      id: 'accessories',
      name: 'Accessories',
      type: 'assembly',
      required: false,
      selected: false,
      subcomponents: [
        {
          id: 'optics',
          name: 'Sights and Optics',
          type: 'component',
          required: false,
          selected: false,
          subcomponents: [
            {
              id: 'iron-sights',
              name: 'Iron Sights',
              type: 'subcomponent',
              required: false,
              selected: false
            },
            {
              id: 'red-dot',
              name: 'Red Dot Sight',
              type: 'subcomponent',
              required: false,
              selected: false
            },
            {
              id: 'scope',
              name: 'Magnified Scope',
              type: 'subcomponent',
              required: false,
              selected: false
            }
          ]
        },
        {
          id: 'muzzle-device',
          name: 'Muzzle Device',
          type: 'component',
          required: false,
          selected: false,
          subcomponents: [
            {
              id: 'flash-hider',
              name: 'Flash Hider',
              type: 'subcomponent',
              required: false,
              selected: false
            },
            {
              id: 'muzzle-brake',
              name: 'Muzzle Brake',
              type: 'subcomponent',
              required: false,
              selected: false
            },
            {
              id: 'compensator',
              name: 'Compensator',
              type: 'subcomponent',
              required: false,
              selected: false
            },
            {
              id: 'suppressor',
              name: 'Suppressor',
              type: 'subcomponent',
              required: false,
              selected: false
            }
          ]
        },
        {
          id: 'foregrip',
          name: 'Foregrip',
          type: 'component',
          required: false,
          selected: false,
          subcomponents: [
            {
              id: 'vertical-foregrip',
              name: 'Vertical Foregrip',
              type: 'subcomponent',
              required: false,
              selected: false
            },
            {
              id: 'angled-foregrip',
              name: 'Angled Foregrip',
              type: 'subcomponent',
              required: false,
              selected: false
            },
            {
              id: 'hand-stop',
              name: 'Hand Stop',
              type: 'subcomponent',
              required: false,
              selected: false
            }
          ]
        }
      ]
    }
  ];
}

export default function BuilderWorksheet({ 
  firearmId, 
  onBuildUpdate,
  selectedComponentId,
  selectedProductId,
  isAssembly = false,
  savedComponents
}: BuilderWorksheetProps) {
  const [components, setComponents] = useState<BuildComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Calculate build statistics
  const calculateBuildStats = (components: BuildComponent[]) => {
    let selectedCount = 0;
    let requiredCount = 0;
    let totalPrice = 0;
    let hasWarning = false;
    let hasIncompatibility = false;

    // Helper function to recursively process components
    const processComponent = (component: BuildComponent) => {
      if (component.required) {
        requiredCount++;
      }
      
      if (component.selected) {
        selectedCount++;
        
        if (component.selectedPart) {
          totalPrice += component.selectedPart.price;
          
          // Check compatibility (this would be more sophisticated in a real implementation)
          if (component.selectedPart.compatibility.includes('Warning')) {
            hasWarning = true;
          }
          if (component.selectedPart.compatibility.includes('Incompatible')) {
            hasIncompatibility = true;
          }
        }
      }
      
      // Process subcomponents
      if (component.subcomponents) {
        component.subcomponents.forEach(processComponent);
      }
    };
    
    // Process all top-level components
    components.forEach(processComponent);
    
    // Determine overall compatibility status
    let compatibilityStatus: 'compatible' | 'warning' | 'incompatible' = 'compatible';
    if (hasIncompatibility) {
      compatibilityStatus = 'incompatible';
    } else if (hasWarning) {
      compatibilityStatus = 'warning';
    }
    
    return {
      selectedCount,
      requiredCount,
      totalPrice,
      compatibilityStatus
    };
  };

  useEffect(() => {
    // If we have saved components and a matching firearmId, use them
    if (savedComponents && savedComponents.length > 0) {
      setComponents(savedComponents);
      setLoading(false);
    } else {
      // Otherwise fetch components when component mounts or firearmId changes
      const fetchedComponents = getFirearmComponents(firearmId);
      setComponents(fetchedComponents);
      setLoading(false);
    }
  }, [firearmId, savedComponents]);

  // Apply selected component from catalog if available
  useEffect(() => {
    if (selectedComponentId && selectedProductId && !loading) {
      // Find the component in the components array
      if (isAssembly) {
        handleSelectAssemblyPart(selectedComponentId, selectedProductId);
      } else {
        handleSelectPart(selectedComponentId, selectedProductId);
      }
    }
  }, [selectedComponentId, selectedProductId, isAssembly, loading]);

  // Update build stats whenever components change
  useEffect(() => {
    if (!loading && onBuildUpdate) {
      const stats = calculateBuildStats(components);
      onBuildUpdate(
        stats.selectedCount,
        stats.requiredCount,
        stats.totalPrice,
        stats.compatibilityStatus,
        components // Pass the updated components back to the parent
      );
    }
  }, [components, loading, onBuildUpdate]);

  // Function to handle selecting an assembly part
  const handleSelectAssemblyPart = (componentId: string, assemblyId: string) => {
    setComponents(prevComponents => {
      // Create a deep copy of the components array
      const updatedComponents = JSON.parse(JSON.stringify(prevComponents));
      
      // Find the assembly and mark it as selected
      const markAssemblySelected = (components: BuildComponent[], targetId: string, assemblyId: string) => {
        for (let i = 0; i < components.length; i++) {
          const component = components[i];
          
          if (component.id === targetId) {
            // Mark this component as selected with an assembly part
            component.selected = true;
            component.assemblyPartSelected = true;
            component.selectedPart = {
              id: assemblyId,
              name: "Complete Assembly",
              manufacturer: "Various",
              price: 199.99,
              compatibility: ["AR-15"],
              isAssembly: true
            };
            
            // Mark all subcomponents as satisfied by the assembly
            if (component.subcomponents) {
              component.subcomponents.forEach(subcomp => {
                subcomp.assemblyPartSelected = true;
                subcomp.selected = true;
                subcomp.selectedPart = {
                  id: "assembly-part",
                  name: "Included in Assembly",
                  manufacturer: "Various",
                  price: 0,
                  compatibility: ["AR-15"]
                };
                
                // Recursively mark nested subcomponents
                if (subcomp.subcomponents) {
                  markAssemblySelected(subcomp.subcomponents, subcomp.id, assemblyId);
                }
              });
            }
            return true;
          }
          
          // Recursively search in subcomponents
          if (component.subcomponents) {
            if (markAssemblySelected(component.subcomponents, targetId, assemblyId)) {
              return true;
            }
          }
        }
        return false;
      };
      
      markAssemblySelected(updatedComponents, componentId, assemblyId);
      return updatedComponents;
    });
  };

  // Function to handle selecting an individual part
  const handleSelectPart = (componentId: string, productId?: string) => {
    setComponents(prevComponents => {
      // Create a deep copy of the components array
      const updatedComponents = JSON.parse(JSON.stringify(prevComponents));
      
      // Find the component and mark it as selected
      const markComponentSelected = (components: BuildComponent[], targetId: string) => {
        for (let i = 0; i < components.length; i++) {
          const component = components[i];
          
          if (component.id === targetId) {
            // If this component was previously satisfied by an assembly, remove that flag
            component.assemblyPartSelected = false;
            component.selected = true;
            component.selectedPart = {
              id: productId || "individual-part",
              name: "Custom Part",
              manufacturer: "Various",
              price: 49.99,
              compatibility: ["AR-15"]
            };
            return true;
          }
          
          // Recursively search in subcomponents
          if (component.subcomponents) {
            if (markComponentSelected(component.subcomponents, targetId)) {
              return true;
            }
          }
        }
        return false;
      };
      
      markComponentSelected(updatedComponents, componentId);
      return updatedComponents;
    });
  };

  // Handle redirecting to catalog for part selection
  const handleAddPart = (componentId: string) => {
    // Redirect to catalog with component filter
    router.push(`/catalog?component=${componentId}&firearmId=${firearmId}&returnToBuilder=true`);
  };

  // Handle redirecting to catalog for assembly selection
  const handleAddAssembly = (componentId: string) => {
    // Redirect to catalog with component filter and assembly flag
    router.push(`/catalog?component=${componentId}&isAssembly=true&firearmId=${firearmId}&returnToBuilder=true`);
  };

  if (loading) {
    return <div className="text-center py-12">Loading components...</div>;
  }

  if (!firearmId) {
    return <div className="text-center py-12">Please select a firearm model first</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Build Worksheet</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Select components to build your custom firearm
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Component</th>
              <th scope="col" className="px-6 py-3">Required</th>
              <th scope="col" className="px-6 py-3">Selected Part</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Compatibility</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {components.map(component => (
              <ComponentRows 
                key={component.id} 
                component={component} 
                level={0} 
                onSelectAssembly={handleSelectAssemblyPart}
                onSelectPart={handleSelectPart}
                firearmId={firearmId}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ComponentRows({ 
  component, 
  level,
  onSelectAssembly,
  onSelectPart,
  firearmId
}: { 
  component: BuildComponent, 
  level: number,
  onSelectAssembly: (componentId: string, assemblyId: string) => void,
  onSelectPart: (componentId: string, productId?: string) => void,
  firearmId: string
}) {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const router = useRouter();
  
  // Determine if this is a component that can be an assembly
  const canBeAssembly = component.isAssembly || (component.subcomponents && component.subcomponents.length > 0);
  
  // Determine if this component is satisfied by an assembly part
  const isSatisfiedByAssembly = component.assemblyPartSelected;

  // Handle redirecting to catalog for part selection
  const handleAddPart = () => {
    // Redirect to catalog with component filter
    router.push(`/catalog?component=${component.id}&firearmId=${firearmId}&returnToBuilder=true`);
  };

  // Handle redirecting to catalog for assembly selection
  const handleAddAssembly = () => {
    // Redirect to catalog with component filter and assembly flag
    router.push(`/catalog?component=${component.id}&isAssembly=true&firearmId=${firearmId}&returnToBuilder=true`);
  };
  
  return (
    <>
      <tr className={`${level === 0 ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} border-b dark:border-gray-700 ${isSatisfiedByAssembly ? 'opacity-70' : ''}`}>
        <td className="px-6 py-4 font-medium whitespace-nowrap">
          <div className="flex items-center">
            {component.subcomponents && component.subcomponents.length > 0 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="mr-2 text-gray-500 dark:text-gray-400"
              >
                <svg 
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
              </button>
            )}
            <span 
              className={`${level === 0 ? 'text-gray-900 dark:text-white font-semibold' : ''}`} 
              style={{ marginLeft: `${level * 1.5}rem` }}
            >
              {component.name}
              {component.isAssembly && (
                <span className="ml-2 text-xs text-blue-600 dark:text-blue-400 font-normal">
                  (Assembly Available)
                </span>
              )}
            </span>
          </div>
        </td>
        <td className="px-6 py-4">
          {component.required ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              Required
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              Optional
            </span>
          )}
        </td>
        <td className="px-6 py-4">
          {component.selectedPart ? (
            <div>
              <span className="font-medium text-gray-900 dark:text-white">{component.selectedPart.name}</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">{component.selectedPart.manufacturer}</span>
              {component.selectedPart.isAssembly && (
                <span className="block text-xs text-blue-600 dark:text-blue-400">Complete Assembly</span>
              )}
              {isSatisfiedByAssembly && !component.selectedPart.isAssembly && (
                <span className="block text-xs text-green-600 dark:text-green-400">Included in Assembly</span>
              )}
            </div>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">Not selected</span>
          )}
        </td>
        <td className="px-6 py-4">
          {component.selectedPart ? (
            <span className="font-medium">${component.selectedPart.price.toFixed(2)}</span>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">-</span>
          )}
        </td>
        <td className="px-6 py-4">
          {component.selectedPart ? (
            <div className="flex flex-wrap gap-1">
              {component.selectedPart.compatibility.map(item => (
                <span key={item} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">-</span>
          )}
        </td>
        <td className="px-6 py-4">
          <div className="flex space-x-2">
            {!component.selected && (
              <button
                onClick={handleAddPart}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Add Part
              </button>
            )}
            
            {component.selected && !isSatisfiedByAssembly && (
              <button
                onClick={handleAddPart}
                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
              >
                Replace
              </button>
            )}
            
            {canBeAssembly && !component.selected && (
              <button
                onClick={handleAddAssembly}
                className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800"
              >
                Add Assembly
              </button>
            )}
            
            {isSatisfiedByAssembly && (
              <button
                onClick={() => onSelectPart(component.id)}
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Customize
              </button>
            )}
          </div>
        </td>
      </tr>
      
      {isExpanded && component.subcomponents && component.subcomponents.map(subcomponent => (
        <ComponentRows 
          key={subcomponent.id} 
          component={subcomponent} 
          level={level + 1} 
          onSelectAssembly={onSelectAssembly}
          onSelectPart={onSelectPart}
          firearmId={firearmId}
        />
      ))}
    </>
  );
} 