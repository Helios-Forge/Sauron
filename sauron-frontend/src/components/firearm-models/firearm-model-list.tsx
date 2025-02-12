import { useFirearmModels } from '@/lib/hooks/use-firearm-models';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function FirearmModelList() {
  const { data: models, isLoading, error } = useFirearmModels();

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h3 className="text-xl font-semibold mb-2">Error loading firearm models</h3>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {models?.map((model) => (
        <Card key={model.id} className="w-full">
          <CardHeader>
            <CardTitle>{model.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Category: {model.category} {model.subcategory && `/ ${model.subcategory}`}
              </p>
              {model.variant && (
                <p className="text-sm text-muted-foreground">Variant: {model.variant}</p>
              )}
              {model.required_parts && model.required_parts.length > 0 && (
                <div>
                  <p className="text-sm font-medium">Required Parts:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {model.required_parts.map((part, index) => (
                      <li key={index}>{part}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 