import Image from "next/image";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="bg-white w-full  px-6 md:px-12 lg:px-16 sticky top-0 z-50 shadow-sm ">
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
            className="text-blue-500 font-medium hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-700 font-medium hover:text-blue-500 transition-colors"
          >
            About Us
          </Link>

          <Link
            href="/contact"
            className="text-gray-700 font-medium hover:text-blue-500 transition-colors"
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
            href="/free-call"
            className="px-6 py-2.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Free Call
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-controls="mobile-menu"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
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
        </button>
      </div>

      {/* Mobile Menu (hidden by default) */}
      <div className="lg:hidden hidden" id="mobile-menu">
        <div className="pt-4 pb-3 space-y-3">
          <Link
            href="/"
            className="block px-4 py-2 text-blue-500 font-medium"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block px-4 py-2 text-gray-700 font-medium hover:bg-gray-50"
          >
            About Us
          </Link>
          <Link
            href="/services"
            className="block px-4 py-2 text-gray-700 font-medium hover:bg-gray-50"
          >
            Contact
          </Link>
          <Link
            href="/tutors"
            className="block px-4 py-2 text-gray-700 font-medium hover:bg-gray-50"
          >
            Tutors
          </Link>
        
          <div className="px-4 pt-3 space-y-2">
            <Link
              href="/auth/login"
              className="block w-full text-center text-black px-6 py-2.5 border-2 border-black rounded-full font-medium hover:bg-gray-50"
            >
              Login
            </Link>
            <Link
              href="/free-call"
              className="block w-full text-center px-6 py-2.5 bg-black text-white rounded-full font-medium hover:bg-gray-800"
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
