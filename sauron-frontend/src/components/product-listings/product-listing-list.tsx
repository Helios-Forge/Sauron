import { useProductListings } from '@/lib/hooks/use-product-listings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductListingList() {
  const { data: listings, isLoading, error } = useProductListings();

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
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
        <h3 className="text-xl font-semibold mb-2">Error loading product listings</h3>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {listings?.map((listing) => (
        <Card key={listing.id} className="w-full">
          <CardHeader>
            <CardTitle>{listing.part?.name || listing.prebuilt_firearm?.name}</CardTitle>
            <CardDescription>SKU: {listing.sku}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">
                  {listing.price} {listing.currency}
                </span>
                <span className={`text-sm ${
                  listing.availability === 'in_stock' 
                    ? 'text-green-600' 
                    : listing.availability === 'out_of_stock' 
                    ? 'text-red-600' 
                    : 'text-yellow-600'
                }`}>
                  {listing.availability}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Seller: {listing.seller?.name}
              </p>
              {listing.shipping_info && (
                <p className="text-sm text-muted-foreground">
                  Shipping: {JSON.parse(listing.shipping_info).free_shipping ? 'Free' : 'Calculated at checkout'}
                </p>
              )}
              {listing.additional_info && (
                <div className="text-sm text-muted-foreground">
                  {Object.entries(JSON.parse(listing.additional_info)).map(([key, value]) => (
                    <p key={key}>{key}: {String(value)}</p>
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