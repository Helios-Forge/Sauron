import { MainLayout } from "@/components/layout/MainLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Saved Builds - GunGuru",
  description: "View and manage your saved firearm builds.",
};

// Mock data for saved builds
const savedBuilds = [
  {
    id: "build-1",
    name: "AR-15 Custom Build",
    date: "May 15, 2023",
    baseModel: "AR-15 Standard",
    components: 12,
    totalPrice: 1249.99,
    image: "/images/builds/ar15-custom.jpg",
  },
  {
    id: "build-2",
    name: "Glock 19 Tactical",
    date: "June 3, 2023",
    baseModel: "Glock 19",
    components: 8,
    totalPrice: 899.99,
    image: "/images/builds/glock19-tactical.jpg",
  },
  {
    id: "build-3",
    name: "Remington 870 Home Defense",
    date: "July 22, 2023",
    baseModel: "Remington 870",
    components: 6,
    totalPrice: 749.99,
    image: "/images/builds/remington870-defense.jpg",
  },
];

export default function SavedBuildsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Saved Builds</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View and manage your saved firearm configurations
            </p>
          </div>
          <Link href="/builder">
            <Button>Create New Build</Button>
          </Link>
        </div>

        {savedBuilds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedBuilds.map((build) => (
              <Card key={build.id} className="overflow-hidden">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                  {/* Placeholder for build image */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <span className="text-lg font-medium">{build.name}</span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{build.name}</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Created on {build.date}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Base Model:</span>
                      <span className="text-sm font-medium">{build.baseModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Components:</span>
                      <span className="text-sm font-medium">{build.components}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Price:</span>
                      <span className="text-sm font-medium">${build.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href={`/builder?load=${build.id}`}>
                    <Button variant="outline">Edit Build</Button>
                  </Link>
                  <Button>Order Parts</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No saved builds yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start creating your custom firearm build in our interactive builder.
            </p>
            <Link href="/builder">
              <Button>Create Your First Build</Button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 