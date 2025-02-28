import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us - GunGuru",
  description: "Get in touch with the GunGuru team for support, feedback, or partnership inquiries.",
};

export default function ContactPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Get in Touch
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Have a question about our platform, need help with your build, or want to explore partnership opportunities? Reach out to us using the form or contact information below.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Email
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      support@gunguru.com
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                      We aim to respond within 24 hours
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Phone
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      (555) 123-4567
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                      Monday-Friday, 9am-5pm EST
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Office
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      123 Firearm Way<br />
                      Austin, TX 78701
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Hours
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Monday-Friday: 9am-5pm EST<br />
                      Saturday: 10am-2pm EST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Send Us a Message
                </h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First name</Label>
                      <Input id="first-name" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input id="last-name" placeholder="Doe" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input id="phone" placeholder="(555) 123-4567" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help you?" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Please provide as much detail as possible..." 
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full sm:w-auto">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Find quick answers to common questions about GunGuru.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "How does the compatibility checker work?",
                answer: "Our compatibility checker uses a comprehensive database of firearm components and their specifications to determine if parts will work together. It considers factors like dimensions, caliber, and manufacturer specifications."
              },
              {
                question: "Is GunGuru available internationally?",
                answer: "Currently, GunGuru is only available in the United States. We're working on expanding to other countries in the future, taking into account different legal requirements and regulations."
              },
              {
                question: "How accurate is the legal compliance feature?",
                answer: "Our legal compliance feature is regularly updated with the latest federal and state regulations. However, it should be used as a guide only and not as legal advice. Always consult local laws and regulations."
              },
              {
                question: "Can I save multiple builds?",
                answer: "Yes! With a free account, you can save up to 3 builds. Premium members can save unlimited builds and access additional features like build sharing and detailed comparison tools."
              },
              {
                question: "Do you sell firearm parts?",
                answer: "GunGuru doesn't sell parts directly. We partner with reputable retailers to help you find the best prices for components in your build. You can purchase parts through our platform from our partner network."
              },
              {
                question: "How do I report a bug or suggest a feature?",
                answer: "We welcome your feedback! Use the contact form on this page or email us at support@gunguru.com with details about the bug you encountered or feature you'd like to see."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Visit Our Office
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We're located in the heart of Austin, Texas.
            </p>
          </div>
          
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 overflow-hidden">
            {/* Placeholder for map */}
            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl font-medium">
              Interactive Map Placeholder
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 