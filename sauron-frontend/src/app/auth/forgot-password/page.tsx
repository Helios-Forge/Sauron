import { MainLayout } from "@/components/layout/MainLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = {
  title: "Forgot Password - GunGuru",
  description: "Reset your GunGuru account password.",
};

export default function ForgotPasswordPage() {
  return (
    <MainLayout>
      <div className="bg-white dark:bg-gray-900 py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Forgot your password?
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
            
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="john.doe@example.com"
                />
              </div>
              
              <Button type="submit" className="w-full">
                Send reset link
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Remember your password?{' '}
                <Link href="/auth/login" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  Back to login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 