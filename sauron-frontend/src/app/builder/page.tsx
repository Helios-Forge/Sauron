import { MainLayout } from "@/components/layout/MainLayout";
import { Suspense } from "react";
import BuilderWorksheet from "@/components/builder/BuilderWorksheet";
import FirearmSelector from "@/components/builder/FirearmSelector";
import BuildSummary from "@/components/builder/BuildSummary";

export const metadata = {
  title: "Firearm Builder - GunGuru",
  description: "Design and customize your firearm with our interactive builder tool. Check compatibility and legal compliance.",
};

export default function BuilderPage() {
  return (
    <MainLayout>
      <div className="bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Firearm Builder
          </h1>
          
          <div className="mb-8">
            <Suspense fallback={<div className="text-center py-4">Loading firearm models...</div>}>
              <FirearmSelector />
            </Suspense>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main builder worksheet */}
            <div className="lg:col-span-3">
              <Suspense fallback={<div className="text-center py-12">Loading builder worksheet...</div>}>
                <BuilderWorksheet />
              </Suspense>
            </div>
            
            {/* Build summary sidebar */}
            <div className="lg:col-span-1">
              <BuildSummary />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 