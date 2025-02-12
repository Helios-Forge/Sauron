import { useCompatibilityRules } from '@/lib/hooks/use-compatibility-rules';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CompatibilityRuleList() {
  const { data: rules, isLoading, error } = useCompatibilityRules();

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
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
        <h3 className="text-xl font-semibold mb-2">Error loading compatibility rules</h3>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {rules?.map((rule) => (
        <Card key={rule.id} className="w-full">
          <CardHeader>
            <CardTitle>
              {rule.part?.name} → {rule.compatible_with_part?.name}
            </CardTitle>
            <CardDescription>
              Model: {rule.firearm_model?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  rule.constraint_type === 'required'
                    ? 'bg-blue-100 text-blue-800'
                    : rule.constraint_type === 'optional'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {rule.constraint_type}
                </span>
              </div>
              {rule.details && (
                <div className="text-sm text-muted-foreground">
                  {Object.entries(JSON.parse(rule.details)).map(([key, value]) => (
                    <p key={key} className="capitalize">
                      {key.replace(/_/g, ' ')}: {String(value)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 