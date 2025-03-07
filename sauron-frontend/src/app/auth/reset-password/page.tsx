import { MainLayout } from "@/components/layout/MainLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = {
  title: "Reset Password - GunGuru",
  description: "Create a new password for your GunGuru account.",
};

export default function ResetPasswordPage() {
  return (
    <MainLayout>
      <div className="bg-white dark:bg-gray-900 py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Reset your password
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Create a new password for your account.
              </p>
            </div>
            
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Must be at least 8 characters with 1 uppercase, 1 number, and 1 special character.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                />
              </div>
              
              <Button type="submit" className="w-full">
                Reset password
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