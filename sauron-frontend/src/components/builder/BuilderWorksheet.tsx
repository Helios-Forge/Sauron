import { useState } from 'react';
import Link from 'next/link';

interface BuildComponent {
  id: string;
  name: string;
  type: string;
  required: boolean;
  selected: boolean;
  selectedPart?: {
    id: string;
    name: string;
    manufacturer: string;
    price: number;
    compatibility: string[];
  };
  subcomponents?: BuildComponent[];
}

// This would be replaced with actual API call
async function getFirearmComponents(firearmId: string = 'ar15-standard'): Promise<BuildComponent[]> {
  // In a real implementation, this would be:
  // const response = await fetch(`/api/firearm-models/${firearmId}/components`);
  // return response.json();
  
  // For now, return placeholder data for AR-15
  return [
    {
      id: 'upper-assembly',
      name: 'Upper Assembly',
      type: 'assembly',
      required: true,
      selected: false,
      subcomponents: [
        {
          id: 'upper-receiver',
          name: 'Upper Receiver',
          type: 'component',
          required: true,
          selected: false
        },
        {
          id: 'barrel',
          name: 'Barrel',
          type: 'component',
          required: true,
          selected: false
        },
        {
          id: 'handguard',
          name: 'Handguard',
          type: 'component',
          required: true,
          selected: false
        },
        {
          id: 'bolt-carrier-group',
          name: 'Bolt Carrier Group',
          type: 'component',
          required: true,
          selected: false
        },
        {
          id: 'charging-handle',
          name: 'Charging Handle',
          type: 'component',
          required: true,
          selected: false
        }
      ]
    },
    {
      id: 'lower-assembly',
      name: 'Lower Assembly',
      type: 'assembly',
      required: true,
      selected: false,
      subcomponents: [
        {
          id: 'lower-receiver',
          name: 'Lower Receiver',
          type: 'component',
          required: true,
          selected: false
        },
        {
          id: 'trigger-group',
          name: 'Trigger Group',
          type: 'component',
          required: true,
          selected: false
        },
        {
          id: 'buffer-tube-assembly',
          name: 'Buffer Tube Assembly',
          type: 'component',
          required: true,
          selected: false
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
          name: 'Grip',
          type: 'component',
          required: true,
          selected: false
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
          name: 'Optics',
          type: 'component',
          required: false,
          selected: false
        },
        {
          id: 'muzzle-device',
          name: 'Muzzle Device',
          type: 'component',
          required: false,
          selected: false
        },
        {
          id: 'foregrip',
          name: 'Foregrip',
          type: 'component',
          required: false,
          selected: false
        }
      ]
    }
  ];
}

export default async function BuilderWorksheet() {
  const components = await getFirearmComponents();

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
              <ComponentRows key={component.id} component={component} level={0} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ComponentRows({ component, level }: { component: BuildComponent, level: number }) {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  
  return (
    <>
      <tr className={`${level === 0 ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} border-b dark:border-gray-700`}>
        <td className="px-6 py-4 font-medium whitespace-nowrap">
          <div className="flex items-center">
            {component.subcomponents && (
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
            <span className={`${level === 0 ? 'text-gray-900 dark:text-white font-semibold' : ''}`} style={{ marginLeft: `${level * 1.5}rem` }}>
              {component.name}
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
              {component.selectedPart.compatibility.map((item, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">-</span>
          )}
        </td>
        <td className="px-6 py-4">
          {component.type === 'component' && (
            <Link 
              href={`/catalog?component=${component.id}`}
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              {component.selectedPart ? 'Change' : 'Add Part'}
            </Link>
          )}
        </td>
      </tr>
      
      {isExpanded && component.subcomponents && component.subcomponents.map(subcomponent => (
        <ComponentRows key={subcomponent.id} component={subcomponent} level={level + 1} />
      ))}
    </>
  );
} 