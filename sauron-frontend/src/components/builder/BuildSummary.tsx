"use client";

import { useState, useEffect } from 'react';
import { Part } from '@/lib/api';

interface BuildSummaryProps {
  selectedCount: number;
  requiredCount: number;
  totalPrice: number;
  compatibilityStatus: 'compatible' | 'warning' | 'incompatible';
  onClearBuild: () => void;
  onSaveBuild: () => void;
  components?: {
    category: string;
    part: Part | null;
    required: boolean;
  }[];
  showDetailedSummary: boolean;
}

export default function BuildSummary({
  selectedCount,
  requiredCount,
  totalPrice,
  compatibilityStatus,
  onClearBuild,
  onSaveBuild,
  components = [],
  showDetailedSummary
}: BuildSummaryProps) {
  const [isLegalComplianceEnabled, setIsLegalComplianceEnabled] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [firearmName, setFirearmName] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Build summary object
  const buildSummary = {
    totalPrice,
    selectedComponents: selectedCount,
    requiredComponents: requiredCount,
    compatibilityStatus,
    legalStatus: isLegalComplianceEnabled ? (selectedState ? 'compliant' : 'unknown') : 'disabled', // 'compliant', 'non-compliant', 'unknown', 'disabled'
  };

  // Reset save success message after 3 seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  // Handle save build
  const handleSaveBuild = () => {
    if (onSaveBuild) {
      onSaveBuild();
      setSaveSuccess(true);
    }
  };

  // Determine if build is complete
  const isBuildComplete = selectedCount >= requiredCount && compatibilityStatus !== 'incompatible';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Build Summary</h2>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completion</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {selectedCount}/{requiredCount} components
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className={`h-2.5 rounded-full ${
              compatibilityStatus === 'compatible' 
                ? 'bg-green-600 dark:bg-green-500' 
                : compatibilityStatus === 'warning' 
                  ? 'bg-yellow-400 dark:bg-yellow-500' 
                  : 'bg-red-600 dark:bg-red-500'
            }`} 
            style={{ width: `${Math.min(100, (selectedCount / Math.max(1, requiredCount)) * 100)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Price Summary */}
      <div className="mb-6">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          ${totalPrice.toFixed(2)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Estimated total price
        </div>
      </div>
      
      {/* Compatibility Status */}
      <div className={`p-3 mb-4 rounded-md ${
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
      
      {/* Detailed Component List */}
      {showDetailedSummary && components && components.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Selected Components
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {components.map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                <div className="flex justify-between">
                  <span className="text-gray-800 dark:text-gray-200 font-medium">{item.category}</span>
                  {item.required && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                      Required
                    </span>
                  )}
                </div>
                {item.part ? (
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {item.part.name} - ${item.part.price.toFixed(2)}
                  </div>
                ) : (
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-500 italic">
                    Not selected
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Legal Compliance Toggle - optional feature */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <input
            id="legal-toggle"
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            checked={isLegalComplianceEnabled}
            onChange={(e) => setIsLegalComplianceEnabled(e.target.checked)}
          />
          <label htmlFor="legal-toggle" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Check Legal Compliance
          </label>
        </div>
        
        {isLegalComplianceEnabled && (
          <div className="mt-2">
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={selectedState || ''}
              onChange={(e) => setSelectedState(e.target.value || null)}
            >
              <option value="">Select your state</option>
              <option value="CA">California</option>
              <option value="TX">Texas</option>
              <option value="FL">Florida</option>
              <option value="NY">New York</option>
              {/* Add more states as needed */}
            </select>
            
            {selectedState && (
              <div className={`mt-2 p-2 text-sm rounded ${
                buildSummary.legalStatus === 'compliant'
                  ? 'bg-green-50 text-green-800 dark:bg-green-900/10 dark:text-green-400'
                  : 'bg-red-50 text-red-800 dark:bg-red-900/10 dark:text-red-400'
              }`}>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    {buildSummary.legalStatus === 'compliant' ? (
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    ) : (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                    )}
                  </svg>
                  <span>
                    {buildSummary.legalStatus === 'compliant'
                      ? 'Legal in selected state'
                      : 'Not legal in selected state'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Build Name Field - for saving builds */}
      <div className="mb-6">
        <label htmlFor="build-name" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300">
          Build Name
        </label>
        <input
          type="text"
          id="build-name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="My Custom Build"
          value={firearmName}
          onChange={(e) => setFirearmName(e.target.value)}
        />
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col space-y-3">
        <button
          onClick={handleSaveBuild}
          disabled={!isBuildComplete}
          className={`w-full py-2.5 px-5 text-sm font-medium rounded-lg ${
            isBuildComplete
              ? 'text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700'
              : 'text-gray-500 bg-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
          }`}
        >
          Save Build
        </button>
        
        <button
          onClick={onClearBuild}
          className="w-full py-2.5 px-5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          Clear Build
        </button>
      </div>
      
      {/* Save Success Message */}
      {saveSuccess && (
        <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md dark:bg-green-900/10 dark:text-green-400">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span>Build saved successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
} 