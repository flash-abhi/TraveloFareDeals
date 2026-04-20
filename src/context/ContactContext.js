import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_URL } from '../config/api';

const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState({
    siteName: "TraveloFare",
    tagline: "Lock Your Fare. Unlock Your Journey.",
    logoUrl: "/logo.svg",
    faviconUrl: "/favicon.ico",
    tfn: "+1-888-859-0441",
    email: "support@flyairlinebooking.com",
    workingHours: "Mon-Sun 24/7",
    billingAddress: {
      company: "TraveloFare, Inc.",
      street: "1309 Coffeen Ave STE 1200",
      city: "Sheridan",
      state: "WY",
      zip: "82801",
      country: "USA",
    },
    copyrightText: `© 2006-${new Date().getFullYear()} TraveloFare, Inc. All rights reserved.`,
    socialLinks: { facebook: "", twitter: "", instagram: "", linkedin: "" },
    colors: {
      headerBg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      headerText: "#ffffff",
      footerBg: "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)",
      footerText: "#e2e8f0",
    },
    siteUrl: "https://travelofareinfo.com",
    address: "1309 Coffeen Ave STE 1200, Sheridan, WY 82801, USA",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/public/site-settings`);
      const data = await response.json();
      if (data.success && data.settings) {
        setSiteSettings(prev => ({ ...prev, ...data.settings }));
      }
    } catch (error) {
      // Fallback: try old contact-settings endpoint
      try {
        const fallback = await fetch(`${API_URL}/api/admin/public/contact-settings`);
        const fbData = await fallback.json();
        if (fbData.success && fbData.settings) {
          setSiteSettings(prev => ({
            ...prev,
            tfn: fbData.settings.tfn || prev.tfn,
            email: fbData.settings.email || prev.email,
            address: fbData.settings.address || prev.address,
            workingHours: fbData.settings.workingHours || prev.workingHours
          }));
        }
      } catch (e) {
        console.error('Error fetching settings:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  // Backward-compatible contactSettings shape
  const contactSettings = {
    tfn: siteSettings.tfn,
    email: siteSettings.email,
    address: siteSettings.address,
    workingHours: siteSettings.workingHours
  };

  return (
    <ContactContext.Provider value={{
      contactSettings,
      siteSettings,
      loading,
      refreshSettings: fetchSettings
    }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContact must be used within ContactProvider');
  }
  return context;
};

// New hook for full site settings
export const useSiteSettings = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within ContactProvider');
  }
  return {
    siteSettings: context.siteSettings,
    loading: context.loading,
    refreshSettings: context.refreshSettings
  };
};

export default ContactContext;
