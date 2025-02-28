import { useState } from 'react';

export default function BuildSummary() {
  const [isLegalComplianceEnabled, setIsLegalComplianceEnabled] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  
  // This would be replaced with actual data from context or state management
  const buildSummary = {
    totalPrice: 1249.95,
    selectedComponents: 8,
    requiredComponents: 10,
    compatibilityStatus: 'compatible', // 'compatible', 'warning', 'incompatible'
    legalStatus: isLegalComplianceEnabled ? (selectedState ? 'compliant' : 'unknown') : 'disabled', // 'compliant', 'non-compliant', 'unknown', 'disabled'
  };

  const states = [
    { id: 'ca', name: 'California' },
    { id: 'tx', name: 'Texas' },
    { id: 'fl', name: 'Florida' },
    { id: 'ny', name: 'New York' },
    { id: 'pa', name: 'Pennsylvania' },
  ];

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
  };

  const handleLegalComplianceToggle = () => {
    setIsLegalComplianceEnabled(!isLegalComplianceEnabled);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Build Summary</h2>
      
      {/* Price Summary */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 dark:text-gray-400">Total Price:</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">${buildSummary.totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Components:</span>
          <span className="text-gray-900 dark:text-white">
            {buildSummary.selectedComponents} / {buildSummary.requiredComponents} selected
          </span>
        </div>
      </div>
      
      {/* Compatibility Status */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Compatibility</h3>
        <div className={`p-4 rounded-lg ${
          buildSummary.compatibilityStatus === 'compatible' ? 'bg-green-100 dark:bg-green-900' :
          buildSummary.compatibilityStatus === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900' :
          'bg-red-100 dark:bg-red-900'
        }`}>
          <div className="flex items-center">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              buildSummary.compatibilityStatus === 'compatible' ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' :
              buildSummary.compatibilityStatus === 'warning' ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200' :
              'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
            }`}>
              {buildSummary.compatibilityStatus === 'compatible' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              ) : buildSummary.compatibilityStatus === 'warning' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h4 className={`text-sm font-medium ${
                buildSummary.compatibilityStatus === 'compatible' ? 'text-green-800 dark:text-green-200' :
                buildSummary.compatibilityStatus === 'warning' ? 'text-yellow-800 dark:text-yellow-200' :
                'text-red-800 dark:text-red-200'
              }`}>
                {buildSummary.compatibilityStatus === 'compatible' ? 'All components are compatible' :
                 buildSummary.compatibilityStatus === 'warning' ? 'Some compatibility issues detected' :
                 'Incompatible components detected'}
              </h4>
              <p className={`text-xs ${
                buildSummary.compatibilityStatus === 'compatible' ? 'text-green-700 dark:text-green-300' :
                buildSummary.compatibilityStatus === 'warning' ? 'text-yellow-700 dark:text-yellow-300' :
                'text-red-700 dark:text-red-300'
              }`}>
                {buildSummary.compatibilityStatus === 'compatible' ? 'Your build is good to go!' :
                 buildSummary.compatibilityStatus === 'warning' ? 'Check the highlighted components for potential issues.' :
                 'Please resolve the compatibility issues before proceeding.'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Legal Compliance */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Legal Compliance</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isLegalComplianceEnabled}
              onChange={handleLegalComplianceToggle}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        {isLegalComplianceEnabled && (
          <div className="mb-4">
            <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select your state:
            </label>
            <select
              id="state-select"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={selectedState || ''}
              onChange={handleStateChange}
            >
              <option value="">Select a state</option>
              {states.map(state => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
          </div>
        )}
        
        {isLegalComplianceEnabled && (
          <div className={`p-4 rounded-lg ${
            buildSummary.legalStatus === 'compliant' ? 'bg-green-100 dark:bg-green-900' :
            buildSummary.legalStatus === 'non-compliant' ? 'bg-red-100 dark:bg-red-900' :
            'bg-gray-100 dark:bg-gray-700'
          }`}>
            <div className="flex items-center">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                buildSummary.legalStatus === 'compliant' ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' :
                buildSummary.legalStatus === 'non-compliant' ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200' :
                'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
              }`}>
                {buildSummary.legalStatus === 'compliant' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                ) : buildSummary.legalStatus === 'non-compliant' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h4 className={`text-sm font-medium ${
                  buildSummary.legalStatus === 'compliant' ? 'text-green-800 dark:text-green-200' :
                  buildSummary.legalStatus === 'non-compliant' ? 'text-red-800 dark:text-red-200' :
                  'text-gray-800 dark:text-gray-200'
                }`}>
                  {buildSummary.legalStatus === 'compliant' ? 'Compliant with state laws' :
                   buildSummary.legalStatus === 'non-compliant' ? 'Non-compliant with state laws' :
                   'Select a state to check compliance'}
                </h4>
                <p className={`text-xs ${
                  buildSummary.legalStatus === 'compliant' ? 'text-green-700 dark:text-green-300' :
                  buildSummary.legalStatus === 'non-compliant' ? 'text-red-700 dark:text-red-300' :
                  'text-gray-700 dark:text-gray-300'
                }`}>
                  {buildSummary.legalStatus === 'compliant' ? 'Your build complies with selected state laws.' :
                   buildSummary.legalStatus === 'non-compliant' ? 'Your build has components that are restricted in your state.' :
                   'We\'ll check your build against state-specific regulations.'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {!isLegalComplianceEnabled && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enable legal compliance checking to verify your build against state-specific regulations.
          </p>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col space-y-2">
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Save Build
        </button>
        <button
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Share Build
        </button>
      </div>
    </div>
  );
} 