import Link from 'next/link';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Category } from '@/app/products/categories';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BuilderPartsGridProps {
  categories: Category[];
  selectedParts: Record<string, string>;
  className?: string;
}

interface PartCardProps {
  category: Category;
  selectedPartId?: string;
}

const PartCard = ({ category, selectedPartId }: PartCardProps) => {
  // Debug logging
  console.log(`[DEBUG] Rendering part card for category: ${category.name}`);
  console.log(`[DEBUG] Selected part ID: ${selectedPartId || 'none'}`);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{category.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedPartId ? (
          <div className="space-y-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Part Selected
            </Badge>
            {/* We'll add part details here once we have the data structure */}
          </div>
        ) : (
          <div className="h-24 flex items-center justify-center border-2 border-dashed rounded-lg">
            <span className="text-muted-foreground">No part selected</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link 
          href={`/products?category=${category.id}`} 
          className="w-full"
        >
          <Button variant="outline" className="w-full">
            {selectedPartId ? (
              'Change Part'
            ) : (
              <div className="flex items-center gap-2">
                <Plus size={16} />
                <span>Add Part</span>
              </div>
            )}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export function BuilderPartsGrid({ 
  categories, 
  selectedParts,
  className 
}: BuilderPartsGridProps) {
  // Debug logging
  console.log('[DEBUG] Rendering BuilderPartsGrid');
  console.log('[DEBUG] Selected parts:', selectedParts);
  
  // Flatten categories to get all leaf categories
  const flattenCategories = (cats: Category[]): Category[] => {
    const result: Category[] = [];
    
    const traverse = (category: Category) => {
      if (!category.children || category.children.length === 0) {
        result.push(category);
      } else {
        category.children.forEach(traverse);
      }
    };
    
    cats.forEach(traverse);
    return result;
  };
  
  const leafCategories = flattenCategories(categories);
  
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {leafCategories.map((category) => (
        <PartCard
          key={category.id}
          category={category}
          selectedPartId={selectedParts[category.id]}
        />
      ))}
    </div>
  );
} 