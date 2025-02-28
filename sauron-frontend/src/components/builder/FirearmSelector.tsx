import { useState } from 'react';

interface FirearmModel {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  image: string;
}

// This would be replaced with actual API call
async function getFirearmModels(): Promise<FirearmModel[]> {
  // In a real implementation, this would be:
  // const response = await fetch('/api/firearm-models');
  // return response.json();
  
  // For now, return placeholder data
  return [
    {
      id: 'ar15-standard',
      name: 'AR-15 Standard',
      manufacturer: 'Various',
      type: 'Rifle',
      image: '/placeholder.jpg'
    },
    {
      id: 'ak47-standard',
      name: 'AK-47 Standard',
      manufacturer: 'Various',
      type: 'Rifle',
      image: '/placeholder.jpg'
    },
    {
      id: 'glock-19',
      name: 'Glock 19',
      manufacturer: 'Glock',
      type: 'Pistol',
      image: '/placeholder.jpg'
    },
    {
      id: '1911-standard',
      name: '1911 Standard',
      manufacturer: 'Various',
      type: 'Pistol',
      image: '/placeholder.jpg'
    }
  ];
}

export default async function FirearmSelector() {
  const firearmModels = await getFirearmModels();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Select Base Firearm</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {firearmModels.map(model => (
          <FirearmCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  );
}

function FirearmCard({ model }: { model: FirearmModel }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer">
      <div className="h-32 bg-gray-200 dark:bg-gray-600 relative">
        {/* Placeholder for firearm image */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <span className="text-sm font-medium">{model.name} Image</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{model.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{model.manufacturer}</p>
        <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {model.type}
        </span>
      </div>
    </div>
  );
} 