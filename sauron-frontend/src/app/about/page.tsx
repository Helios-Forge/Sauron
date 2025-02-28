import { MainLayout } from "@/components/layout/MainLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About GunGuru - Our Mission and Team",
  description: "Learn about GunGuru's mission to empower firearm enthusiasts with the best tools for customization and building.",
};

export default function AboutPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About GunGuru
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            We're on a mission to empower firearm enthusiasts with the knowledge and tools to build with confidence.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  GunGuru was founded in 2023 by a team of firearm enthusiasts, engineers, and software developers who recognized a gap in the market for comprehensive, user-friendly tools for firearm customization.
                </p>
                <p>
                  After experiencing the frustration of incompatible parts, confusing legal requirements, and scattered information across multiple platforms, our founders set out to create a solution that would make the process of building and customizing firearms accessible to everyone.
                </p>
                <p>
                  What started as a passion project has grown into a comprehensive platform trusted by thousands of firearm enthusiasts, from beginners to experienced gunsmiths.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 h-96">
              {/* Placeholder for company image */}
              <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl font-medium">
                Company Image
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We're dedicated to making firearm customization accessible, educational, and enjoyable for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Empower Enthusiasts
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We provide the tools and knowledge needed for firearm enthusiasts to confidently build and customize their firearms, regardless of experience level.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Promote Safety & Compliance
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We're committed to promoting safe practices and legal compliance in the firearm community through education and built-in compliance tools.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Foster Community
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We're building a supportive community where firearm enthusiasts can share knowledge, showcase builds, and learn from each other.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our diverse team brings together expertise in firearms, engineering, and software development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "John Smith",
                role: "Founder & CEO",
                bio: "Firearm enthusiast with 15+ years of experience in software development."
              },
              {
                name: "Sarah Johnson",
                role: "Chief Technology Officer",
                bio: "Former military armorer with a passion for making technology accessible."
              },
              {
                name: "Michael Chen",
                role: "Lead Engineer",
                bio: "Mechanical engineer specializing in firearm design and customization."
              },
              {
                name: "Emily Rodriguez",
                role: "Community Manager",
                bio: "Competition shooter and advocate for firearm education and safety."
              }
            ].map((member, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                  {/* Placeholder for team member image */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <span className="text-lg font-medium">{member.name.split(' ')[0][0]}{member.name.split(' ')[1][0]}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 text-sm mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              These core principles guide everything we do at GunGuru.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Quality & Accuracy
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We're committed to providing accurate information and high-quality tools that our users can rely on for their builds.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Education & Transparency
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We believe in educating our users and being transparent about the capabilities and limitations of our platform.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Innovation & Improvement
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We're constantly innovating and improving our platform based on user feedback and technological advancements.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Community & Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We value our community and are dedicated to providing excellent support and fostering a positive environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the GunGuru Community</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Be part of a growing community of firearm enthusiasts building with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Create an Account
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 