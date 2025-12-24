"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Settings, CheckCircle } from "lucide-react";
import Link from "next/link";

type CookiePreference = "accepted" | "rejected" | "custom" | null;

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, can't be disabled
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === "undefined") return;
    
    setIsMounted(true);
    
    // Check if user has already made a choice
    try {
      const cookieConsent = localStorage.getItem("cookieConsent");
      console.log("Cookie consent check:", cookieConsent ? "Found" : "Not found");
      
      if (!cookieConsent) {
        // Show banner after a short delay for better UX
        console.log("No cookie consent found, showing banner in 1 second...");
        const timer = setTimeout(() => {
          console.log("Showing cookie banner now");
          setShowBanner(true);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        // Load saved preferences
        try {
          const savedPrefs = JSON.parse(cookieConsent);
          if (savedPrefs.preferences) {
            setPreferences(savedPrefs.preferences);
          }
          console.log("Cookie consent already set, banner will not show");
        } catch (e) {
          console.error("Error loading cookie preferences:", e);
          // If there's an error parsing, show banner again
          const timer = setTimeout(() => {
            setShowBanner(true);
          }, 1000);
          return () => clearTimeout(timer);
        }
      }
    } catch (e) {
      // If localStorage is not available, show banner anyway
      console.error("Error accessing localStorage:", e);
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    savePreferences("accepted", allAccepted);
    setShowBanner(false);
  };

  const handleRejectNonEssential = () => {
    const onlyEssential = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setPreferences(onlyEssential);
    savePreferences("rejected", onlyEssential);
    setShowBanner(false);
  };

  const handleSaveCustom = () => {
    savePreferences("custom", preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = (choice: CookiePreference, prefs: typeof preferences) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(
          "cookieConsent",
          JSON.stringify({
            choice,
            preferences: prefs,
            timestamp: new Date().toISOString(),
          })
        );
      }
    } catch (e) {
      console.error("Error saving cookie preferences:", e);
    }
  };

  const togglePreference = (key: keyof typeof preferences) => {
    if (key === "essential") return; // Essential cookies can't be disabled
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Don't render until mounted to avoid hydration issues
  if (!isMounted || !showBanner) return null;

  return (
    <AnimatePresence mode="wait">
      {showBanner && (
        <>
          {/* Backdrop - prevents interaction with page until choice is made */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9998]"
          />

          {/* Banner - Centered in hero section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300,
              duration: 0.5
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <div className="max-w-2xl w-full">
              <div className="bg-gradient-to-br from-primary to-secondary rounded-lg shadow-2xl overflow-hidden relative">
                {/* Close Button - Note: Users should make a choice, but X button is available for UX */}
                <button
                  onClick={() => {
                    // Allow closing, but save a default "rejected" preference
                    handleRejectNonEssential();
                  }}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors z-10 p-2 bg-white/10 rounded-full hover:bg-white/20"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Main Banner Content */}
                {!showSettings ? (
                  <div className="p-8 md:p-10">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 uppercase tracking-wide">
                      COOKIES & PRIVACY
                    </h3>
                    
                    <div className="space-y-4 mb-8 text-white">
                      <p className="leading-relaxed">
                        We use our own and third-party cookies for website functionality, to personalize ads, analyze or measure site usage and develop audience insight.
                      </p>
                      <p className="leading-relaxed">
                        By continuing to use the site or closing this banner without changing your preferences, you agree to our use of cookies and to our{" "}
                        <Link href="/cookies" className="underline hover:text-gray-200 transition-colors">
                          Privacy Policy
                        </Link>.
                      </p>
                      <p className="leading-relaxed">
                        You can change your consent setting (except those essential for browsing the website) via customize preferences button below.
                      </p>
                      <p className="font-semibold mt-4">
                        Select cookies for which you want to express consent:
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleAcceptAll}
                        className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition-all duration-200 flex-1 sm:flex-initial uppercase tracking-wide"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => setShowSettings(true)}
                        className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition-all duration-200 flex-1 sm:flex-initial uppercase tracking-wide"
                      >
                        Customize Preferences
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Settings Panel */
                  <div className="p-8 md:p-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-wide flex items-center gap-3">
                        <Settings className="w-8 h-8" />
                        Cookie Preferences
                      </h3>
                      <button
                        onClick={() => setShowSettings(false)}
                        className="text-white hover:text-gray-200 transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20"
                        aria-label="Back to main banner"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <p className="text-white mb-6 leading-relaxed">
                      Manage your cookie preferences. You can enable or disable different types of cookies below. 
                      Essential cookies are always enabled as they are necessary for the website to function.
                    </p>

                    <div className="space-y-4 mb-6">
                      {/* Essential Cookies */}
                      <div className="border-2 border-white/30 rounded-lg p-4 bg-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-white">Essential Cookies</h4>
                              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded">Required</span>
                            </div>
                            <p className="text-sm text-white/90">
                              These cookies are necessary for the website to function and cannot be disabled.
                            </p>
                          </div>
                          <div className="ml-4">
                            <div className="w-12 h-6 bg-white/30 rounded-full flex items-center justify-end px-1 cursor-not-allowed opacity-60">
                              <div className="w-4 h-4 bg-white rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Functional Cookies */}
                      <div className="border-2 border-white/30 rounded-lg p-4 bg-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">Functional Cookies</h4>
                            <p className="text-sm text-white/90">
                              These cookies allow the website to remember your choices and provide enhanced features.
                            </p>
                          </div>
                          <div className="ml-4">
                            <button
                              onClick={() => togglePreference("functional")}
                              className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                                preferences.functional
                                  ? "bg-white justify-end"
                                  : "bg-white/30 justify-start"
                              }`}
                            >
                              <div className="w-4 h-4 bg-primary rounded-full mx-1"></div>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Analytics Cookies */}
                      <div className="border-2 border-white/30 rounded-lg p-4 bg-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">Analytics Cookies</h4>
                            <p className="text-sm text-white/90">
                              These cookies help us understand how visitors interact with our website.
                            </p>
                          </div>
                          <div className="ml-4">
                            <button
                              onClick={() => togglePreference("analytics")}
                              className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                                preferences.analytics
                                  ? "bg-white justify-end"
                                  : "bg-white/30 justify-start"
                              }`}
                            >
                              <div className="w-4 h-4 bg-primary rounded-full mx-1"></div>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Marketing Cookies */}
                      <div className="border-2 border-white/30 rounded-lg p-4 bg-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">Marketing Cookies</h4>
                            <p className="text-sm text-white/90">
                              These cookies are used to deliver relevant advertisements and track campaign performance.
                            </p>
                          </div>
                          <div className="ml-4">
                            <button
                              onClick={() => togglePreference("marketing")}
                              className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                                preferences.marketing
                                  ? "bg-white justify-end"
                                  : "bg-white/30 justify-start"
                              }`}
                            >
                              <div className="w-4 h-4 bg-primary rounded-full mx-1"></div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-white/30">
                      <Link
                        href="/cookies"
                        className="text-white hover:text-gray-200 underline text-sm font-medium transition-colors"
                      >
                        Read our full Cookie Policy
                      </Link>
                      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button
                          onClick={() => setShowSettings(false)}
                          className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition-all duration-200 flex-1 sm:flex-initial uppercase tracking-wide"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleSaveCustom}
                          className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial uppercase tracking-wide"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Save Preferences
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


