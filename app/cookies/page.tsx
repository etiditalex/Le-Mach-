"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Cookie, Shield, Settings, Info, AlertCircle, CheckCircle } from "lucide-react";

const cookieCategories = [
  {
    icon: Cookie,
    title: "Essential Cookies",
    description: "These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.",
    examples: [
      "Session management cookies",
      "Security and authentication cookies",
      "Load balancing cookies",
      "User interface customization cookies"
    ],
    required: true
  },
  {
    icon: Settings,
    title: "Functional Cookies",
    description: "These cookies allow the website to remember choices you make and provide enhanced, personalized features.",
    examples: [
      "Language preferences",
      "Region and location settings",
      "User preferences and settings",
      "Remembering login information"
    ],
    required: false
  },
  {
    icon: Info,
    title: "Analytics Cookies",
    description: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
    examples: [
      "Page views and navigation patterns",
      "Time spent on pages",
      "Traffic sources and referrals",
      "Device and browser information"
    ],
    required: false
  },
  {
    icon: AlertCircle,
    title: "Marketing Cookies",
    description: "These cookies are used to deliver advertisements that are relevant to you and your interests. They may also be used to limit the number of times you see an advertisement.",
    examples: [
      "Advertising campaign tracking",
      "Social media integration",
      "Retargeting cookies",
      "Conversion tracking"
    ],
    required: false
  }
];

const cookieDetails = [
  {
    name: "session_id",
    purpose: "Maintains user session and authentication state",
    type: "Essential",
    duration: "Session"
  },
  {
    name: "cart_items",
    purpose: "Stores items in shopping cart for menu orders",
    type: "Essential",
    duration: "Session"
  },
  {
    name: "user_preferences",
    purpose: "Remembers user preferences and settings",
    type: "Functional",
    duration: "1 year"
  },
  {
    name: "language",
    purpose: "Stores selected language preference",
    type: "Functional",
    duration: "1 year"
  },
  {
    name: "_ga",
    purpose: "Google Analytics - Distinguishes unique users",
    type: "Analytics",
    duration: "2 years"
  },
  {
    name: "_gid",
    purpose: "Google Analytics - Distinguishes unique users",
    type: "Analytics",
    duration: "24 hours"
  }
];

export default function CookiesPage() {
  return (
    <main>
      <Header />
      <div className="pt-24 pb-12 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="bg-gradient-to-r from-primary to-secondary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Cookie className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-serif font-bold text-primary mb-4">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-600">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-8 mb-8"
          >
            <h2 className="text-3xl font-serif font-bold text-primary mb-4">
              Introduction
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
              <p>
                At Lemach Hotel & Accommodations ("we," "our," or "us"), we are committed to protecting your privacy and being transparent about how we collect, use, and share information about you. This Cookie Policy explains what cookies are, how we use them on our website, and your choices regarding their use.
              </p>
              <p>
                This policy applies to our website located at lemachhotel.com and any other websites, mobile applications, or online services that link to this policy (collectively, the "Services").
              </p>
            </div>
          </motion.div>

          {/* What Are Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-8 mb-8"
          >
            <h2 className="text-3xl font-serif font-bold text-primary mb-4 flex items-center gap-3">
              <Info className="w-8 h-8" />
              What Are Cookies?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
              <p>
                Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device after you close your browser, while session cookies are deleted when you close your browser.
              </p>
            </div>
          </motion.div>

          {/* How We Use Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-8 mb-8"
          >
            <h2 className="text-3xl font-serif font-bold text-primary mb-6">
              How We Use Cookies
            </h2>
            <div className="space-y-6">
              {cookieCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="border-l-4 border-primary pl-6 py-4"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className="bg-gradient-to-r from-primary to-secondary w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-semibold text-gray-800">
                          {category.title}
                        </h3>
                        {category.required && (
                          <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{category.description}</p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Examples:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {category.examples.map((example, idx) => (
                            <li key={idx}>{example}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Specific Cookies We Use */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-8 mb-8"
          >
            <h2 className="text-3xl font-serif font-bold text-primary mb-6">
              Specific Cookies We Use
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-800">Cookie Name</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-800">Purpose</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-800">Type</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-800">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {cookieDetails.map((cookie, index) => (
                    <motion.tr
                      key={cookie.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="border border-gray-300 px-4 py-3 font-mono text-sm text-gray-700">{cookie.name}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-600">{cookie.purpose}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          cookie.type === 'Essential' ? 'bg-red-100 text-red-800' :
                          cookie.type === 'Functional' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {cookie.type}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-600">{cookie.duration}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Third-Party Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-md p-8 mb-8"
          >
            <h2 className="text-3xl font-serif font-bold text-primary mb-4">
              Third-Party Cookies
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
              <p>
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Services, deliver advertisements on and through the Services, and so on.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-800 mb-2">Third-party services we use:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
                  <li><strong>Social Media Platforms:</strong> For social media integration and sharing features</li>
                  <li><strong>Payment Processors:</strong> For secure payment processing (if applicable)</li>
                </ul>
              </div>
              <p>
                These third parties may use cookies, web beacons, and similar technologies to collect information about your use of our Services and other websites. This information may be used to provide you with targeted advertising and to analyze and track data.
              </p>
            </div>
          </motion.div>

          {/* Your Cookie Choices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-md p-8 mb-8"
          >
            <h2 className="text-3xl font-serif font-bold text-primary mb-4 flex items-center gap-3">
              <Settings className="w-8 h-8" />
              Your Cookie Choices
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
              <p>
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in your browser settings.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
                <p className="font-semibold text-blue-900 mb-2">Browser Settings:</p>
                <p className="text-blue-800 text-sm">
                  Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your experience using our Services.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">How to manage cookies in popular browsers:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li><strong>Google Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                  <li><strong>Mozilla Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                  <li><strong>Microsoft Edge:</strong> Settings → Privacy, search, and services → Cookies and site permissions</li>
                </ul>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mt-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> If you choose to disable cookies, some features of our website may not function properly. Essential cookies cannot be disabled as they are necessary for the website to function.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Updates to This Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-lg shadow-md p-8 mb-8"
          >
            <h2 className="text-3xl font-serif font-bold text-primary mb-4">
              Updates to This Policy
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the "Last Updated" date.
              </p>
              <p>
                We encourage you to review this Cookie Policy periodically to stay informed about our use of cookies.
              </p>
            </div>
          </motion.div>

          {/* Contact Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow-md p-8 text-white"
          >
            <h2 className="text-3xl font-serif font-bold mb-4 flex items-center gap-3">
              <Shield className="w-8 h-8" />
              Contact Us
            </h2>
            <p className="text-lg mb-4 opacity-90">
              If you have any questions about this Cookie Policy or our use of cookies, please contact us:
            </p>
            <div className="space-y-2 text-lg">
              <p><strong>Email:</strong> lemachstudios@gmail.com</p>
              <p><strong>Phone:</strong> +254 721 929446</p>
              <p><strong>Address:</strong> B69, Kilifi County, Kenya</p>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}


