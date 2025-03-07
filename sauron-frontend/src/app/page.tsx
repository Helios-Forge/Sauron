import { MainLayout } from "@/components/layout/MainLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench, ShieldCheck, Zap } from "lucide-react";

export const metadata = {
  title: "GunGuru - Custom Firearm Builder",
  description: "Design, customize, and build your perfect firearm with GunGuru's interactive builder tool.",
};

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Build Your Perfect Firearm with Confidence
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                GunGuru's interactive builder helps you design, customize, and build firearms with expert guidance on compatibility and legal compliance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/builder">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Building <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/catalog">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Browse Catalog
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block bg-gray-700 rounded-lg p-8 h-96">
              {/* Placeholder for hero image */}
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-medium">
                Interactive Builder Preview
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose GunGuru?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our platform offers everything you need to build your perfect firearm with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wrench className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Interactive Builder
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our drag-and-drop builder makes it easy to customize your firearm with real-time compatibility checks.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Legal Compliance
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Stay informed about legal requirements in your state with our built-in compliance checker.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Expert Recommendations
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get personalized recommendations based on your preferences and intended use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Building your custom firearm is simple with our step-by-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Choose Base Model",
                description: "Select from our wide range of base firearm models to start your build."
              },
              {
                step: "2",
                title: "Customize Components",
                description: "Add and customize components with real-time compatibility checks."
              },
              {
                step: "3",
                title: "Review & Save",
                description: "Review your build, check legal compliance, and save your configuration."
              },
              {
                step: "4",
                title: "Order Parts",
                description: "Order all the parts you need directly through our platform or trusted partners."
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  {item.description}
                </p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-blue-200 dark:bg-blue-700"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Build Your Perfect Firearm?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of firearm enthusiasts who trust GunGuru for their custom builds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/builder">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Start Building Now
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Hear from firearm enthusiasts who have built their perfect firearms with GunGuru.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "GunGuru made building my first AR-15 a breeze. The compatibility checker saved me from making costly mistakes.",
                author: "Michael T.",
                role: "First-time Builder"
              },
              {
                quote: "As a gunsmith, I recommend GunGuru to all my clients. It helps them visualize their build before committing.",
                author: "Sarah J.",
                role: "Professional Gunsmith"
              },
              {
                quote: "The legal compliance feature is a game-changer. I can confidently build knowing my configuration is legal in my state.",
                author: "Robert K.",
                role: "Firearm Enthusiast"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{testimonial.author}</p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
