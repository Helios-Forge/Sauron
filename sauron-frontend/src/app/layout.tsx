import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteNavigation } from "@/components/SiteNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GunGuru - Customize Firearms with Confidence",
  description: "GunGuru is a comprehensive platform for firearm enthusiasts to design, build and explore firearms with confidence through compatibility checks, legal compliance, and community insights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4">
            <SiteNavigation />
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold">GunGuru</h3>
                <p className="text-gray-400">Your Firearm Customization Platform</p>
              </div>
              <div className="flex gap-8">
                <div>
                  <h4 className="font-medium mb-2">Resources</h4>
                  <ul className="space-y-1 text-gray-400">
                    <li>Legal Information</li>
                    <li>Privacy Policy</li>
                    <li>Terms of Service</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Connect</h4>
                  <ul className="space-y-1 text-gray-400">
                    <li>Contact Us</li>
                    <li>About</li>
                    <li>Support</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
              <p>© {new Date().getFullYear()} GunGuru. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
