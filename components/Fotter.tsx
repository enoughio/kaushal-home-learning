import Link from "next/link";

const Fotter = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-300 ">
      {/* Main Footer Content */}
      <div className="w-full py-8 px-6 md:px-16 mx-auto">
        <div className="max-w-7xl mx-auto">
          
          {/* Mobile: Stacked Layout, Desktop: Grid Layout */}
          <div className="flex flex-col md:grid md:grid-cols-4 gap-6 md:gap-12">
            
            {/* Navigation Links - Column 1 */}
            <div className="space-y-3">
              <Link
                href="/"
                className="block text-gray-800 hover:text-blue-500 transition-colors text-sm md:text-base"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block text-gray-800 hover:text-blue-500 transition-colors text-sm md:text-base"
              >
                About us
              </Link>
              <Link
                href="/contact"
                className="block text-gray-800 hover:text-blue-500 transition-colors text-sm md:text-base"
              >
                Contact
              </Link>
            </div>

            {/* Legal Links - Column 2 */}
            <div className="space-y-3">
              <Link
                href="/terms"
                className="block text-gray-800 hover:text-blue-500 transition-colors text-sm md:text-base"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="block text-gray-800 hover:text-blue-500 transition-colors text-sm md:text-base"
              >
                Privacy Policy
              </Link>
              
              {/* Social Media Icons - Mobile only in this section */}
              <div className="flex items-center gap-3 pt-2 md:hidden">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border-2 border-black rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border-2 border-black rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="GitHub"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Contact Info - Column 3 */}
            <div className="space-y-3">
              <a
                href="mailto:contact@kaushaly.in"
                className="block text-gray-800 hover:text-blue-500 transition-colors text-sm md:text-base"
              >
                contact@kaushaly.in
              </a>
              <a
                href="tel:+12345678989"
                className="block text-gray-800 hover:text-blue-500 transition-colors text-sm md:text-base"
              >
                +12 345 67 89
              </a>
            </div>

            {/* Social Media Icons - Desktop only - Column 4 */}
            <div className="hidden md:flex items-start gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 border-2 border-black rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 border-2 border-black rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="w-full bg-black py-3 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white text-xs md:text-sm">
            Copyright 2025. kaushalya
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Fotter;