"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide navbar on dashboard routes
  const isDashboardRoute = pathname?.startsWith("/admin") || 
                           pathname?.startsWith("/student") || 
                           pathname?.startsWith("/teachers");

  if (isDashboardRoute) {
    return null;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white w-full px-6 md:px-12 lg:px-16 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo.svg"
            alt="Kaushalay Home Learning Logo"
            width={80}
            height={80}
            className="h-16 w-auto"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-start space-x-8">
          <Link
            href="/"
            className={`font-medium hover:text-blue-600 transition-colors ${
              pathname === "/" ? "text-blue-500 font-semibold" : "text-gray-700"
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`font-medium hover:text-blue-500 transition-colors ${
              pathname === "/about" ? "text-blue-500 font-semibold" : "text-gray-700"
            }`}
          >
            About Us
          </Link>

          <Link
            href="/contact"
            className={`font-medium hover:text-blue-500 transition-colors ${
              pathname === "/contact" ? "text-blue-500 font-semibold" : "text-gray-700"
            }`}
          >
            Contact
          </Link>
         
        </div>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link
            href="/auth/login"
            className="px-6 py-2.5 border-2 text-black border-black rounded-full font-medium hover:bg-gray-50 transition-colors"
          >
           Login
          </Link>
          <Link
            href="/contact"
            className="px-6 py-2.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Free Call
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-controls="mobile-menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          {isMobileMenuOpen ? (
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`} 
        id="mobile-menu"
      >
        <div className="pt-4 pb-3 space-y-3">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-4 py-2 font-medium hover:bg-gray-50 rounded-md transition-colors ${
              pathname === "/" ? "text-blue-500 bg-blue-50 font-semibold" : "text-gray-700"
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-4 py-2 font-medium hover:bg-gray-50 rounded-md transition-colors ${
              pathname === "/about" ? "text-blue-500 bg-blue-50 font-semibold" : "text-gray-700"
            }`}
          >
            About Us
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-4 py-2 font-medium hover:bg-gray-50 rounded-md transition-colors ${
              pathname === "/contact" ? "text-blue-500 bg-blue-50 font-semibold" : "text-gray-700"
            }`}
          >
            Contact
          </Link>
        
          <div className="px-4 pt-3 space-y-2">
            <Link
              href="/auth/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center text-black px-6 py-2.5 border-2 border-black rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center px-6 py-2.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Free Call
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
