"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getFirearmModelById, getPartsByCategory, getParts, Part, FirearmModel } from '@/lib/api';
import ComponentSelector from '@/components/builder/ComponentSelector';

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
  onBuildUpdate: (
    selectedCount: number, 
    requiredCount: number, 
    price: number, 
    compatibility: 'compatible' | 'warning' | 'incompatible',
    components?: any[]
  ) => void;
}

export default function BuilderWorksheet({ firearmId, onBuildUpdate }: BuilderWorksheetProps) {
  const [firearmModel, setFirearmModel] = useState<FirearmModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [availableParts, setAvailableParts] = useState<Part[]>([]);
  const [selectedParts, setSelectedParts] = useState<{[key: string]: Part | null}>({});
  const [requiredPartCategories, setRequiredPartCategories] = useState<string[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [compatibilityStatus, setCompatibilityStatus] = useState<'compatible' | 'warning' | 'incompatible'>('compatible');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Fetch firearm model and parts when component mounts
  useEffect(() => {
    async function loadFirearmModel() {
      if (!firearmId) return;
      
      try {
        setLoading(true);
        const model = await getFirearmModelById(parseInt(firearmId, 10));
        if (model) {
          setFirearmModel(model);
          
          // Extract required part categories from the model
          const requiredParts = model.required_parts ? Object.keys(model.required_parts).filter(key => model.required_parts[key]) : [];
          setRequiredPartCategories(requiredParts);
          
          // Initialize selected parts object with null values for each required part
          const initialSelectedParts: {[key: string]: Part | null} = {};
          requiredParts.forEach(category => {
            initialSelectedParts[category] = null;
          });
          setSelectedParts(initialSelectedParts);
          
          // Load all available parts
          const allParts = await getParts();
          setAvailableParts(allParts);
          
          // Set first category as expanded by default if there are any
          if (requiredParts.length > 0) {
            setExpandedCategory(requiredParts[0]);
          }
        }
      } catch (err) {
        console.error('Error loading firearm model:', err);
        setError(err instanceof Error ? err : new Error('Failed to load firearm model'));
      } finally {
        setLoading(false);
      }
    }
    
    loadFirearmModel();
  }, [firearmId]);

  // Update the build when selected parts change
  useEffect(() => {
    if (!requiredPartCategories.length) return;
    
    // Calculate how many required parts are selected
    const selectedCount = Object.values(selectedParts).filter(part => part !== null).length;
    
    // Calculate total price
    const price = Object.values(selectedParts)
      .filter((part): part is Part => part !== null)
      .reduce((sum, part) => sum + part.price, 0);
    
    // Determine compatibility status
    let status: 'compatible' | 'warning' | 'incompatible' = 'compatible';
    
    // Example simple compatibility check logic - you'd want to make this more sophisticated
    // based on the actual compatibility rules in your system
    if (selectedCount < requiredPartCategories.length) {
      status = 'warning'; // Not all required components are selected
    }
    
    setCurrentPrice(price);
    setCompatibilityStatus(status);
    
    // Notify parent component of the build update
    onBuildUpdate(
      selectedCount, 
      requiredPartCategories.length,
      price,
      status,
      Object.entries(selectedParts).map(([category, part]) => ({
        category,
        part,
        required: requiredPartCategories.includes(category)
      }))
    );
  }, [selectedParts, requiredPartCategories, onBuildUpdate]);

  // Handle part selection
  const handlePartSelected = (category: string, part: Part | null) => {
    setSelectedParts(prev => ({
      ...prev,
      [category]: part
    }));
  };

  // Get parts for a specific category
  const getPartsForCategory = (category: string) => {
    return availableParts.filter(part => 
      // Filter for parts in this category
      part.category === category && 
      // If we have a firearm model, check compatible models too
      (!firearmModel?.name || 
       !part.compatible_models || 
       part.compatible_models.includes(firearmModel.name))
    );
  };
  
  // Toggle accordion section
  const toggleCategory = (category: string) => {
    setExpandedCategory(prev => prev === category ? null : category);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading firearm model...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 dark:bg-red-900/10 dark:border-red-800 rounded-lg p-6 my-4">
        <h3 className="text-red-800 dark:text-red-400 font-medium">Error Loading Firearm Model</h3>
        <p className="text-red-700 dark:text-red-300 text-sm mt-2">
          {error.message || "Unable to load the firearm model. Please try again later."}
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

  if (!firearmModel) {
    return <div className="p-6 text-center">No firearm model found with ID {firearmId}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Firearm Model Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {firearmModel.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          {firearmModel.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-200">
            {firearmModel.category}
          </span>
          <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-200">
            {firearmModel.subcategory}
          </span>
          {firearmModel.variant && (
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-200">
              {firearmModel.variant}
            </span>
          )}
        </div>
      </div>
      
      {/* Required Components Accordion */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Required Components
        </h3>
        
        <div className="space-y-6">
          {requiredPartCategories.map(category => (
            <div key={category}>
              <ComponentSelector 
                category={category}
                partOptions={getPartsForCategory(category)}
                selectedPart={selectedParts[category]}
                isRequired={true}
                onPartSelected={(part) => handlePartSelected(category, part)}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Selected Parts Summary */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Build Summary
        </h3>
        
        <div className="space-y-3">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-500 dark:text-gray-400">Total Price:</div>
              <div className="text-right font-bold text-gray-900 dark:text-white">${currentPrice.toFixed(2)}</div>
              
              <div className="text-gray-500 dark:text-gray-400">Selected Parts:</div>
              <div className="text-right text-gray-900 dark:text-white">
                {Object.values(selectedParts).filter(Boolean).length} / {requiredPartCategories.length}
              </div>
            </div>
          </div>
          
          {/* Compatibility Status */}
          <div className={`p-4 rounded-lg ${
            compatibilityStatus === 'compatible' 
              ? 'bg-green-50 dark:bg-green-900/10 text-green-800 dark:text-green-400'
              : compatibilityStatus === 'warning'
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
                {compatibilityStatus === 'compatible' ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                ) : compatibilityStatus === 'warning' ? (
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                )}
              </svg>
              <span className="font-medium">
                {compatibilityStatus === 'compatible' 
                  ? 'All components are compatible' 
                  : compatibilityStatus === 'warning'
                    ? 'Missing required components'
                    : 'Incompatible components detected'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 