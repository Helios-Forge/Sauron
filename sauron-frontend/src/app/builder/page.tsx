import { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import BuilderContent from '@/components/builder/BuilderContent';
import { getStoredFirearmId } from '@/lib/builderStorage';

export const metadata: Metadata = {
  title: "Firearm Builder - GunGuru",
  description: "Design and customize your firearm with our interactive builder tool. Check compatibility and legal compliance.",
};

export default function BuilderPage() {
  return (
    <MainLayout>
      <BuilderContent />
    </MainLayout>
  );
} 