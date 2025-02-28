import { useState } from 'react';

// These would come from API in a real implementation
const categories = [
  { id: 'parts', name: 'Parts' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'prebuilt', name: 'Pre-Built Firearms' },
];

const subcategories = {
  parts: [
    { id: 'lower-receivers', name: 'Lower Receivers' },
    { id: 'upper-receivers', name: 'Upper Receivers' },
    { id: 'barrels', name: 'Barrels' },
    { id: 'handguards', name: 'Handguards' },
    { id: 'triggers', name: 'Triggers' },
    { id: 'bolt-carrier-groups', name: 'Bolt Carrier Groups' },
  ],
  accessories: [
    { id: 'optics', name: 'Optics' },
    { id: 'lights', name: 'Lights' },
    { id: 'grips', name: 'Grips' },
    { id: 'stocks', name: 'Stocks' },
  ],
  prebuilt: [
    { id: 'ar-15', name: 'AR-15' },
    { id: 'ak-47', name: 'AK-47' },
    { id: 'pistols', name: 'Pistols' },
    { id: 'shotguns', name: 'Shotguns' },
  ],
};

const manufacturers = [
  { id: 'aero-precision', name: 'Aero Precision' },
  { id: 'bravo-company', name: 'Bravo Company' },
  { id: 'daniel-defense', name: 'Daniel Defense' },
  { id: 'geissele', name: 'Geissele Automatics' },
  { id: 'magpul', name: 'Magpul' },
];

const compatibilities = [
  { id: 'ar-15', name: 'AR-15' },
  { id: 'ak-47', name: 'AK-47' },
  { id: 'glock', name: 'Glock' },
  { id: 'm1911', name: '1911' },
];

export default function ProductFilters() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [selectedCompatibilities, setSelectedCompatibilities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setSelectedSubcategories([]);
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategories(prev => 
      prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const handleManufacturerChange = (manufacturerId: string) => {
    setSelectedManufacturers(prev => 
      prev.includes(manufacturerId)
        ? prev.filter(id => id !== manufacturerId)
        : [...prev, manufacturerId]
    );
  };

  const handleCompatibilityChange = (compatibilityId: string) => {
    setSelectedCompatibilities(prev => 
      prev.includes(compatibilityId)
        ? prev.filter(id => id !== compatibilityId)
        : [...prev, compatibilityId]
    );
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = value;
      return newRange;
    });
  };

  const handleApplyFilters = () => {
    // In a real implementation, this would update URL params or trigger a fetch
    console.log({
      category: selectedCategory,
      subcategories: selectedSubcategories,
      manufacturers: selectedManufacturers,
      compatibilities: selectedCompatibilities,
      priceRange,
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategories([]);
    setSelectedManufacturers([]);
    setSelectedCompatibilities([]);
    setPriceRange([0, 1000]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Filters</h2>
      
      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Category</h3>
        <ul className="space-y-2">
          {categories.map(category => (
            <li key={category.id}>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={selectedCategory === category.id}
                  onChange={() => handleCategoryChange(category.id)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-2 text-gray-900 dark:text-gray-300">{category.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Subcategory Filter */}
      {selectedCategory && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Subcategory</h3>
          <ul className="space-y-2">
            {subcategories[selectedCategory as keyof typeof subcategories]?.map(subcategory => (
              <li key={subcategory.id}>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    value={subcategory.id}
                    checked={selectedSubcategories.includes(subcategory.id)}
                    onChange={() => handleSubcategoryChange(subcategory.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-gray-900 dark:text-gray-300">{subcategory.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Manufacturer Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Manufacturer</h3>
        <ul className="space-y-2">
          {manufacturers.map(manufacturer => (
            <li key={manufacturer.id}>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value={manufacturer.id}
                  checked={selectedManufacturers.includes(manufacturer.id)}
                  onChange={() => handleManufacturerChange(manufacturer.id)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-2 text-gray-900 dark:text-gray-300">{manufacturer.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Compatibility Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Compatibility</h3>
        <ul className="space-y-2">
          {compatibilities.map(compatibility => (
            <li key={compatibility.id}>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value={compatibility.id}
                  checked={selectedCompatibilities.includes(compatibility.id)}
                  onChange={() => handleCompatibilityChange(compatibility.id)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-2 text-gray-900 dark:text-gray-300">{compatibility.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Price Range</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-900 dark:text-gray-300">${priceRange[0]}</span>
          <span className="text-gray-900 dark:text-gray-300">${priceRange[1]}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="min-price" className="block text-sm text-gray-900 dark:text-gray-300 mb-1">Min</label>
            <input
              type="number"
              id="min-price"
              min="0"
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(e, 0)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="max-price" className="block text-sm text-gray-900 dark:text-gray-300 mb-1">Max</label>
            <input
              type="number"
              id="max-price"
              min={priceRange[0]}
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(e, 1)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col space-y-2">
        <button
          onClick={handleApplyFilters}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Apply Filters
        </button>
        <button
          onClick={handleResetFilters}
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
} 