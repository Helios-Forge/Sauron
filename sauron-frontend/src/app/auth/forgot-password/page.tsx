import { MainLayout } from "@/components/layout/MainLayout";
import Link from "next/link";

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
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="john.doe@example.com"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Send reset link
                </button>
              </div>
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