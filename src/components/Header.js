import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Menu, X, LayoutGrid, Plane, Hotel, Zap } from "lucide-react";
import { useContact, useSiteSettings } from "../context/ContactContext";
import Logo from "./Logo";
import "./Header.css";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { contactSettings } = useContact();
  const { siteSettings } = useSiteSettings();
  const headerColors = siteSettings.colors || {};

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: "Home", path: "/", icon: LayoutGrid },
    { label: "Flights", path: "/flights", icon: Plane },
    { label: "Hotels", path: "/hotels", icon: Hotel },
    { label: "Airlines", path: "/airlines", icon: Zap },
  ];

  return (
    <>
      <header className={`header-modern ${scrolled ? "header-scrolled" : ""}`}>
        <div className="header-modern-container">
          {/* Left Section - Logo */}
          <div className="header-modern-left">
            <Link to="/" className="header-logo-link">
              <Logo />
            </Link>
          </div>

          {/* Center Section - Navigation */}
          <nav className={`header-nav ${mobileMenuOpen ? "header-nav-open" : ""}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="header-nav-link"
                  onClick={closeMobileMenu}
                >
                  <Icon size={18} className="header-nav-icon" />
                  <span className="header-nav-text">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section - Call Button & Hamburger */}
          <div className="header-modern-right">
            <a
              href={`tel:${contactSettings.tfn.replace(/[^0-9+]/g, "")}`}
              className="call-button-animated"
              title="Click to call"
            >
              <span className="call-button-ring"></span>
              <span className="call-button-ring-2"></span>
              <span className="call-button-icon">
                <Phone size={20} />
              </span>
              <span className="call-button-text">{contactSettings.tfn}</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              className={`header-hamburger ${mobileMenuOpen ? "header-hamburger-active" : ""}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div 
            className="header-mobile-overlay" 
            onClick={closeMobileMenu}
          ></div>
        )}
      </header>
    </>
  );
}

export default Header;
