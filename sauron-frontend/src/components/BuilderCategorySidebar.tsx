import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Category } from '@/app/products/categories';
import { Button } from '@/components/ui/button';

interface BuilderCategorySidebarProps {
  categories: Category[];
  selectedParts: Record<string, string>;
  className?: string;
}

interface CategoryItemProps {
  category: Category;
  selectedParts: Record<string, string>;
  depth?: number;
}

const CategoryItem = ({ 
  category, 
  selectedParts,
  depth = 0 
}: CategoryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const hasPart = selectedParts[category.id];
  
  // Debug logging
  console.log(`[DEBUG] Rendering category item: ${category.name}`);
  console.log(`[DEBUG] Has selected part: ${hasPart ? 'yes' : 'no'}`);
  
  return (
    <div className="w-full">
      <div 
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors',
          'hover:bg-accent/50 cursor-pointer',
          depth > 0 && 'ml-4'
        )}
      >
        <div className="flex-1 flex items-center gap-2">
          {hasChildren && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-4 h-4 flex items-center justify-center"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          <span className={cn(!hasChildren && 'ml-6')}>
            {category.name}
          </span>
        </div>
        
        <Link
          href={`/products?category=${category.id}`}
          className={cn(
            'px-2 py-1 text-xs rounded-md transition-colors',
            hasPart ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          )}
        >
          {hasPart ? 'Change' : 'Add'}
        </Link>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              selectedParts={selectedParts}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function BuilderCategorySidebar({ 
  categories, 
  selectedParts,
  className 
}: BuilderCategorySidebarProps) {
  console.log('[DEBUG] Rendering BuilderCategorySidebar');
  console.log('[DEBUG] Selected parts:', selectedParts);
  
  return (
    <div className={cn('w-full space-y-1 p-4 border rounded-lg', className)}>
      <h2 className="font-semibold mb-4">Categories</h2>
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          selectedParts={selectedParts}
        />
      ))}
    </div>
  );
} 