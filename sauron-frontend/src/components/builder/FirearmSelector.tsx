"use client";

import { useState, useEffect } from 'react';
import { useFirearmModels, FirearmModel } from '@/lib/api';

interface FirearmSelectorProps {
  onModelSelected?: (modelId: string) => void;
}

export default function FirearmSelector({ onModelSelected }: FirearmSelectorProps) {
  const { models: firearmModels, loading, error } = useFirearmModels();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');

  // Debug logging
  useEffect(() => {
    console.log('Firearm Models from API:', firearmModels);
    if (firearmModels.length > 0) {
      console.log('Sample Model:', firearmModels[0]);
      console.log('Categories:', [...new Set(firearmModels.map(model => model.category))]);
    }
  }, [firearmModels]);

  // Get unique categories
  const categories = [...new Set(firearmModels.filter(model => model.category).map(model => model.category))];
  
  // Get subcategories for the selected category
  const subcategories = selectedCategory 
    ? [...new Set(firearmModels
        .filter(model => model.category === selectedCategory && model.subcategory)
        .map(model => model.subcategory))]
    : [];
  
  // Get models for the selected subcategory
  const filteredModels = selectedSubcategory
    ? firearmModels.filter(model => 
        model.category === selectedCategory && 
        model.subcategory === selectedSubcategory)
    : selectedCategory && subcategories.length === 0
      ? firearmModels.filter(model => model.category === selectedCategory)
      : [];

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory('');
    setSelectedModel('');
  };

  // Handle subcategory change
  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubcategory(e.target.value);
    setSelectedModel('');
  };

  // Handle model change
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  // Handle model selection
  const handleSelectModel = () => {
    if (selectedModel && onModelSelected) {
      // Call the provided callback with the selected model ID
      onModelSelected(selectedModel);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading firearm models...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 dark:bg-red-900/10 dark:border-red-800 rounded-lg p-4 my-4">
        <h3 className="text-red-800 dark:text-red-400 font-medium">Error Loading Firearm Models</h3>
        <p className="text-red-700 dark:text-red-300 text-sm mt-2">
          {error.message || "Unable to load firearm models. Please try again later."}
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

  if (firearmModels.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800 rounded-lg p-4 my-4">
        <h3 className="text-yellow-800 dark:text-yellow-400 font-medium">No Firearm Models Found</h3>
        <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-2">
          No firearm models were returned from the API. Please ensure the database is properly seeded.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Select Base Firearm</h2>
      
      <div className="space-y-4">
        {/* Debug Info - Only in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-2 text-xs bg-gray-100 dark:bg-gray-700 rounded mb-4">
            <p>Available categories: {categories.length}</p>
            {selectedCategory && <p>Available subcategories: {subcategories.length}</p>}
            {selectedSubcategory && <p>Available models: {filteredModels.length}</p>}
          </div>
        )}
        
        {/* Category Selection */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Firearm Category
          </label>
          <select
            id="category"
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        {/* Subcategory Selection - only shown if category is selected and subcategories exist */}
        {selectedCategory && subcategories.length > 0 && (
          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Firearm Type
            </label>
            <select
              id="subcategory"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={selectedSubcategory}
              onChange={handleSubcategoryChange}
            >
              <option value="">Select a type</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Model Selection - shown if subcategory is selected or if no subcategories exist for the category */}
        {(selectedSubcategory || (selectedCategory && subcategories.length === 0)) && (
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Model
            </label>
            <select
              id="model"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={selectedModel}
              onChange={handleModelChange}
            >
              <option value="">Select a model</option>
              {filteredModels.map((model) => (
                <option key={model.id} value={model.id.toString()}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Continue Button - only enabled if model is selected */}
        <div className="pt-2">
          <button
            onClick={handleSelectModel}
            disabled={!selectedModel}
            className={`w-full py-2 px-4 rounded-md font-medium ${
              selectedModel
                ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            Continue to Build
          </button>
        </div>
      </div>
    </div>
  );
} 