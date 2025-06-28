import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PredictButton from './PredictButton';

const Navbar = () => {
  const [role, setRole] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setRole(user.role);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200/30' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
          >
            MediXpert
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className="relative text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300 group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <Link 
              to="/about" 
              className="relative text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300 group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <Link 
              to="/services" 
              className="relative text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300 group"
            >
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <Link 
              to="/contact" 
              className="relative text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300 group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Role-based Dashboard Links */}
            {role === "admin" && (
              <Link 
                to="/admin" 
                className="relative text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300 group"
              >
                Admin Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
            {role === "doctor" && (
              <Link 
                to="/doctor" 
                className="relative text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300 group"
              >
                Doctor Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
            {role === "user" && (
              <Link 
                to="/patient" 
                className="relative text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300 group"
              >
                Patient Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Predict Button */}
            <div className="hidden lg:block">
              <PredictButton />
            </div>

            {/* Auth Button */}
            {role ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-full hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-medium rounded-full hover:from-emerald-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100/80 transition-colors duration-300"
            >
              <svg 
                className={`w-6 h-6 text-gray-700 transform transition-transform duration-300 ${
                  isMobileMenuOpen ? 'rotate-90' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="mt-4 pb-4 border-t border-gray-200/30">
            <div className="flex flex-col space-y-4 pt-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300 hover:bg-gray-50/80 px-3 py-2 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300 hover:bg-gray-50/80 px-3 py-2 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/services" 
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300 hover:bg-gray-50/80 px-3 py-2 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300 hover:bg-gray-50/80 px-3 py-2 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Role-based Dashboard Links for Mobile */}
              {role === "admin" && (
                <Link 
                  to="/admin" 
                  className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300 hover:bg-gray-50/80 px-3 py-2 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              {role === "doctor" && (
                <Link 
                  to="/doctor" 
                  className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300 hover:bg-gray-50/80 px-3 py-2 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Doctor Dashboard
                </Link>
              )}
              {role === "user" && (
                <Link 
                  to="/patient" 
                  className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-300 hover:bg-gray-50/80 px-3 py-2 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Patient Dashboard
                </Link>
              )}
              
              <div className="pt-2">
                <PredictButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;