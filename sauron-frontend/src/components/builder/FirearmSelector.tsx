"use client";

import { useState, useEffect } from 'react';

interface FirearmModel {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  category: string;
  subcategory: string;
}

interface FirearmSelectorProps {
  onModelSelected?: (modelId: string) => void;
}

// This would be replaced with actual API call
function getFirearmModels(): FirearmModel[] {
  // In a real implementation, this would be:
  // const response = await fetch('/api/firearm-models');
  // return response.json();
  
  // For now, return data based on base-models.md
  return [
    // Rifles - Bolt-Action
    {
      id: 'remington-700',
      name: 'Remington 700',
      manufacturer: 'Remington',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Bolt-Action Rifles'
    },
    {
      id: 'winchester-model-70',
      name: 'Winchester Model 70',
      manufacturer: 'Winchester',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Bolt-Action Rifles'
    },
    {
      id: 'ruger-american-rifle',
      name: 'Ruger American Rifle',
      manufacturer: 'Ruger',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Bolt-Action Rifles'
    },
    {
      id: 'savage-110',
      name: 'Savage 110',
      manufacturer: 'Savage',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Bolt-Action Rifles'
    },
    {
      id: 'tikka-t3x',
      name: 'Tikka T3x',
      manufacturer: 'Tikka',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Bolt-Action Rifles'
    },
    {
      id: 'mauser-m98',
      name: 'Mauser M98',
      manufacturer: 'Mauser',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Bolt-Action Rifles'
    },
    {
      id: 'mosin-nagant-m9130',
      name: 'Mosin-Nagant M91/30',
      manufacturer: 'Various',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Bolt-Action Rifles'
    },
    
    // Rifles - Assault Rifles
    {
      id: 'ak-47',
      name: 'AK-47',
      manufacturer: 'Various',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Assault Rifles'
    },
    {
      id: 'ak-74',
      name: 'AK-74',
      manufacturer: 'Various',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Assault Rifles'
    },
    {
      id: 'akm',
      name: 'AKM',
      manufacturer: 'Various',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Assault Rifles'
    },
    {
      id: 'ar-15',
      name: 'AR-15',
      manufacturer: 'Various',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Assault Rifles'
    },
    {
      id: 'm16',
      name: 'M16',
      manufacturer: 'Colt',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Assault Rifles'
    },
    {
      id: 'm4-carbine',
      name: 'M4 Carbine',
      manufacturer: 'Colt',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Assault Rifles'
    },
    {
      id: 'fn-scar-l',
      name: 'FN SCAR-L',
      manufacturer: 'FN Herstal',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Assault Rifles'
    },
    {
      id: 'fn-scar-h',
      name: 'FN SCAR-H',
      manufacturer: 'FN Herstal',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Assault Rifles'
    },
    {
      id: 'steyr-aug',
      name: 'Steyr AUG',
      manufacturer: 'Steyr',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Assault Rifles'
    },
    {
      id: 'hk-g36',
      name: 'HK G36',
      manufacturer: 'Heckler & Koch',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Assault Rifles'
    },
    {
      id: 'hk416',
      name: 'HK416',
      manufacturer: 'Heckler & Koch',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Assault Rifles'
    },
    {
      id: 'sig-sauer-mcx',
      name: 'SIG Sauer MCX',
      manufacturer: 'SIG Sauer',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Assault Rifles'
    },
    {
      id: 'tavor-tar-21',
      name: 'Tavor TAR-21',
      manufacturer: 'IWI',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Assault Rifles'
    },
    {
      id: 'galil-ace',
      name: 'Galil ACE',
      manufacturer: 'IWI',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Assault Rifles'
    },
    
    // Rifles - Semi-Auto Rifles
    {
      id: 'ar-10',
      name: 'AR-10',
      manufacturer: 'Various',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Semi-Auto Rifles'
    },
    {
      id: 'ruger-mini-14',
      name: 'Ruger Mini-14',
      manufacturer: 'Ruger',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Semi-Auto Rifles'
    },
    {
      id: 'sks',
      name: 'SKS',
      manufacturer: 'Various',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Semi-Auto Rifles'
    },
    {
      id: 'fn-fal',
      name: 'FN FAL',
      manufacturer: 'FN Herstal',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Semi-Auto Rifles'
    },
    {
      id: 'hk-g3',
      name: 'HK G3',
      manufacturer: 'Heckler & Koch',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Semi-Auto Rifles'
    },
    {
      id: 'browning-bar',
      name: 'Browning BAR',
      manufacturer: 'Browning',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Semi-Auto Rifles'
    },
    
    // Rifles - Lever-Action Rifles
    {
      id: 'winchester-1894',
      name: 'Winchester 1894',
      manufacturer: 'Winchester',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Lever-Action Rifles'
    },
    {
      id: 'marlin-336',
      name: 'Marlin 336',
      manufacturer: 'Marlin',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Lever-Action Rifles'
    },
    {
      id: 'henry-golden-boy',
      name: 'Henry Golden Boy',
      manufacturer: 'Henry',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Lever-Action Rifles'
    },
    {
      id: 'winchester-1873',
      name: 'Winchester 1873',
      manufacturer: 'Winchester',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Lever-Action Rifles'
    },
    {
      id: 'marlin-1895',
      name: 'Marlin 1895',
      manufacturer: 'Marlin',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Lever-Action Rifles'
    },
    
    // Rifles - Marksman Rifles
    {
      id: 'm14',
      name: 'M14',
      manufacturer: 'Springfield Armory',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Marksman Rifles'
    },
    {
      id: 'svd-dragunov',
      name: 'SVD Dragunov',
      manufacturer: 'Kalashnikov',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Marksman Rifles'
    },
    {
      id: 'psl',
      name: 'PSL',
      manufacturer: 'Various',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Marksman Rifles'
    },
    {
      id: 'hk-psg1',
      name: 'HK PSG1',
      manufacturer: 'Heckler & Koch',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Marksman Rifles'
    },
    {
      id: 'barrett-m82',
      name: 'Barrett M82',
      manufacturer: 'Barrett',
      type: 'Rifle',
      category: 'Rifles',
      subcategory: 'Marksman Rifles'
    },
    
    // Pistols - Semi-Auto Pistols
    {
      id: 'glock-17',
      name: 'Glock 17',
      manufacturer: 'Glock',
      type: 'Pistol',
      category: 'Pistols',
      subcategory: 'Semi-Auto Pistols'
    },
    {
      id: 'glock-19',
      name: 'Glock 19',
      manufacturer: 'Glock',
      type: 'Pistol',
      category: 'Pistols',
      subcategory: 'Semi-Auto Pistols'
    },
    {
      id: 'colt-m1911',
      name: 'Colt M1911',
      manufacturer: 'Colt',
      type: 'Pistol',
      category: 'Pistols',
      subcategory: 'Semi-Auto Pistols'
    },
    {
      id: 'sig-sauer-p226',
      name: 'SIG Sauer P226',
      manufacturer: 'SIG Sauer',
      type: 'Pistol',
      category: 'Pistols',
      subcategory: 'Semi-Auto Pistols'
    },
    {
      id: 'sig-sauer-p320',
      name: 'SIG Sauer P320',
      manufacturer: 'SIG Sauer',
      type: 'Pistol',
      category: 'Pistols',
      subcategory: 'Semi-Auto Pistols'
    },
    {
      id: 'beretta-92fs',
      name: 'Beretta 92FS',
      manufacturer: 'Beretta',
      type: 'Pistol',
      category: 'Pistols',
      subcategory: 'Semi-Auto Pistols'
    },
    {
      id: 'hk-vp9',
      name: 'HK VP9',
      manufacturer: 'Heckler & Koch',
      type: 'Pistol',
      category: 'Pistols',
      subcategory: 'Semi-Auto Pistols'
    },
    {
      id: 'cz-75',
      name: 'CZ 75',
      manufacturer: 'CZ',
      type: 'Pistol',
      category: 'Pistols',
      subcategory: 'Semi-Auto Pistols'
    },
    {
      id: 'smith-wesson-mp',
      name: 'Smith & Wesson M&P',
      manufacturer: 'Smith & Wesson',
      type: 'Pistol',
      category: 'Pistols',
      subcategory: 'Semi-Auto Pistols'
    },
    {
      id: 'walther-ppq',
      name: 'Walther PPQ',
      manufacturer: 'Walther',
      type: 'Pistol',
      category: 'Pistols',
      subcategory: 'Semi-Auto Pistols'
    },
    
    // Pistols - Revolvers
    {
      id: 'colt-single-action-army',
      name: 'Colt Single Action Army',
      manufacturer: 'Colt',
      type: 'Pistol',
      category: 'Pistols',
      subcategory: 'Revolvers'
    },
    {
      id: 'colt-python',
      name: 'Colt Python',
      manufacturer: 'Colt',
      type: 'Pistol',
      category: 'Pistols',
      subcategory: 'Revolvers'
    },
    {
      id: 'smith-wesson-model-29',
      name: 'Smith & Wesson Model 29',
      manufacturer: 'Smith & Wesson',
      type: 'Pistol',
      category: 'Pistols',
      subcategory: 'Revolvers'
    },
    {
      id: 'smith-wesson-model-686',
      name: 'Smith & Wesson Model 686',
      manufacturer: 'Smith & Wesson',
      type: 'Pistol',
      category: 'Pistols',
      subcategory: 'Revolvers'
    },
    {
      id: 'ruger-gp100',
      name: 'Ruger GP100',
      manufacturer: 'Ruger',
      type: 'Pistol',
      category: 'Pistols',
      subcategory: 'Revolvers'
    },
    {
      id: 'taurus-judge',
      name: 'Taurus Judge',
      manufacturer: 'Taurus',
      type: 'Pistol',
      category: 'Pistols',
      subcategory: 'Revolvers'
    },
    
    // Submachine Guns
    {
      id: 'hk-mp5',
      name: 'HK MP5',
      manufacturer: 'Heckler & Koch',
      type: 'Submachine Gun',
      category: 'Submachine Guns',
      subcategory: 'Submachine Guns'
    },
    {
      id: 'uzi',
      name: 'Uzi',
      manufacturer: 'IMI',
      type: 'Submachine Gun',
      category: 'Submachine Guns',
      subcategory: 'Submachine Guns'
    },
    {
      id: 'thompson-m1928',
      name: 'Thompson M1928',
      manufacturer: 'Auto-Ordnance',
      type: 'Submachine Gun',
      category: 'Submachine Guns',
      subcategory: 'Submachine Guns'
    },
    {
      id: 'cz-scorpion-evo-3',
      name: 'CZ Scorpion EVO 3',
      manufacturer: 'CZ',
      type: 'Submachine Gun',
      category: 'Submachine Guns',
      subcategory: 'Submachine Guns'
    },
    {
      id: 'sig-sauer-mpx',
      name: 'SIG Sauer MPX',
      manufacturer: 'SIG Sauer',
      type: 'Submachine Gun',
      category: 'Submachine Guns',
      subcategory: 'Submachine Guns'
    },
    {
      id: 'fn-p90',
      name: 'FN P90',
      manufacturer: 'FN Herstal',
      type: 'Submachine Gun',
      category: 'Submachine Guns',
      subcategory: 'Submachine Guns'
    },
    {
      id: 'kriss-vector',
      name: 'Kriss Vector',
      manufacturer: 'Kriss USA',
      type: 'Submachine Gun',
      category: 'Submachine Guns',
      subcategory: 'Submachine Guns'
    },
    
    // Shotguns - Pump-Action
    {
      id: 'remington-870',
      name: 'Remington 870',
      manufacturer: 'Remington',
      type: 'Shotgun',
      category: 'Shotguns',
      subcategory: 'Pump-Action'
    },
    {
      id: 'mossberg-500',
      name: 'Mossberg 500',
      manufacturer: 'Mossberg',
      type: 'Shotgun',
      category: 'Shotguns',
      subcategory: 'Pump-Action'
    },
    {
      id: 'mossberg-590',
      name: 'Mossberg 590',
      manufacturer: 'Mossberg',
      type: 'Shotgun',
      category: 'Shotguns',
      subcategory: 'Pump-Action'
    },
    {
      id: 'winchester-sxp',
      name: 'Winchester SXP',
      manufacturer: 'Winchester',
      type: 'Shotgun',
      category: 'Shotguns',
      subcategory: 'Pump-Action'
    },
    {
      id: 'ithaca-37',
      name: 'Ithaca 37',
      manufacturer: 'Ithaca',
      type: 'Shotgun',
      category: 'Shotguns',
      subcategory: 'Pump-Action'
    },
    
    // Shotguns - Semi-Auto
    {
      id: 'benelli-m2',
      name: 'Benelli M2',
      manufacturer: 'Benelli',
      type: 'Shotgun',
      category: 'Shotguns',
      subcategory: 'Semi-Auto'
    },
    {
      id: 'benelli-m4',
      name: 'Benelli M4',
      manufacturer: 'Benelli',
      type: 'Shotgun',
      category: 'Shotguns',
      subcategory: 'Semi-Auto'
    },
    {
      id: 'beretta-1301',
      name: 'Beretta 1301',
      manufacturer: 'Beretta',
      type: 'Shotgun',
      category: 'Shotguns',
      subcategory: 'Semi-Auto'
    },
    {
      id: 'franchi-spas-12',
      name: 'Franchi SPAS-12',
      manufacturer: 'Franchi',
      type: 'Shotgun',
      category: 'Shotguns',
      subcategory: 'Semi-Auto'
    },
    {
      id: 'saiga-12',
      name: 'Saiga-12',
      manufacturer: 'Kalashnikov',
      type: 'Shotgun',
      category: 'Shotguns',
      subcategory: 'Semi-Auto'
    },
    
    // Shotguns - Break-Action
    {
      id: 'browning-citori',
      name: 'Browning Citori',
      manufacturer: 'Browning',
      type: 'Shotgun',
      category: 'Shotguns',
      subcategory: 'Break-Action'
    },
    {
      id: 'beretta-686',
      name: 'Beretta 686',
      manufacturer: 'Beretta',
      type: 'Shotgun',
      category: 'Shotguns',
      subcategory: 'Break-Action'
    },
    {
      id: 'cz-bobwhite-g2',
      name: 'CZ Bobwhite G2',
      manufacturer: 'CZ',
      type: 'Shotgun',
      category: 'Shotguns',
      subcategory: 'Break-Action'
    }
  ];
}

export default function FirearmSelector({ onModelSelected }: FirearmSelectorProps) {
  const [firearmModels, setFirearmModels] = useState<FirearmModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');

  useEffect(() => {
    // Fetch firearm models when component mounts
    const models = getFirearmModels();
    setFirearmModels(models);
    setLoading(false);
  }, []);

  // Get unique categories
  const categories = [...new Set(firearmModels.map(model => model.category))];
  
  // Get subcategories for the selected category
  const subcategories = selectedCategory 
    ? [...new Set(firearmModels
        .filter(model => model.category === selectedCategory)
        .map(model => model.subcategory))]
    : [];
  
  // Get models for the selected subcategory
  const filteredModels = selectedSubcategory
    ? firearmModels.filter(model => 
        model.category === selectedCategory && 
        model.subcategory === selectedSubcategory)
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Select Base Firearm</h2>
      
      <div className="space-y-4">
        {/* Category Selection */}
        <div>
          <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Firearm Category
          </label>
          <select
            id="category-select"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        {/* Subcategory Selection */}
        {selectedCategory && (
          <div>
            <label htmlFor="subcategory-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Firearm Subcategory
            </label>
            <select
              id="subcategory-select"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={selectedSubcategory}
              onChange={handleSubcategoryChange}
            >
              <option value="">Select a subcategory</option>
              {subcategories.map(subcategory => (
                <option key={subcategory} value={subcategory}>{subcategory}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* Model Selection */}
        {selectedSubcategory && (
          <div>
            <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Firearm Model
            </label>
            <select
              id="model-select"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={selectedModel}
              onChange={handleModelChange}
            >
              <option value="">Select a model</option>
              {filteredModels.map(model => (
                <option key={model.id} value={model.id}>{model.name} - {model.manufacturer}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* Selected Model Details */}
        {selectedModel && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Selected Firearm
            </h3>
            {(() => {
              const model = firearmModels.find(m => m.id === selectedModel);
              return model ? (
                <div>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Model:</span> {model.name}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Manufacturer:</span> {model.manufacturer}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Type:</span> {model.type}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Category:</span> {model.category}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Subcategory:</span> {model.subcategory}</p>
                </div>
              ) : null;
            })()}
          </div>
        )}
        
        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={handleSelectModel}
            disabled={!selectedModel}
            className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
              selectedModel 
                ? 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Build with Selected Firearm
          </button>
        </div>
      </div>
    </div>
  );
} 