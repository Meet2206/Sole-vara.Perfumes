import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { totalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl md:text-3xl font-serif font-bold text-amber-900"
          >
            Solévara
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm uppercase tracking-wide ${
                location.pathname === '/' 
                  ? 'text-emerald-800 font-medium' 
                  : 'text-gray-700 hover:text-emerald-700'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`text-sm uppercase tracking-wide ${
                location.pathname.includes('/products') 
                  ? 'text-emerald-800 font-medium' 
                  : 'text-gray-700 hover:text-emerald-700'
              }`}
            >
              Shop
            </Link>
            <Link 
              to="/about" 
              className={`text-sm uppercase tracking-wide ${
                location.pathname === '/about' 
                  ? 'text-emerald-800 font-medium' 
                  : 'text-gray-700 hover:text-emerald-700'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm uppercase tracking-wide ${
                location.pathname === '/contact' 
                  ? 'text-emerald-800 font-medium' 
                  : 'text-gray-700 hover:text-emerald-700'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Cart Icon & Mobile Menu Button */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="relative mr-2">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center p-2 text-gray-700 hover:text-emerald-700"
                >
                  <User size={20} />
                  <span className="ml-1 text-sm hidden md:block">{user?.name}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center p-2 text-gray-700 hover:text-emerald-700 mr-2"
              >
                <User size={20} />
                <span className="ml-1 text-sm hidden md:block">Login</span>
              </Link>
            )}
            
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-700 hover:text-emerald-700"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-amber-500 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            
            <button 
              className="ml-4 md:hidden focus:outline-none"
              onClick={toggleMenu}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen 
              ? 'max-h-64 opacity-100 mt-4' 
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col py-2 space-y-4">
            <Link 
              to="/" 
              className={`text-sm uppercase tracking-wide ${
                location.pathname === '/' 
                  ? 'text-emerald-800 font-medium' 
                  : 'text-gray-700'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`text-sm uppercase tracking-wide ${
                location.pathname.includes('/products') 
                  ? 'text-emerald-800 font-medium' 
                  : 'text-gray-700'
              }`}
            >
              Shop
            </Link>
            <Link 
              to="/about" 
              className={`text-sm uppercase tracking-wide ${
                location.pathname === '/about' 
                  ? 'text-emerald-800 font-medium' 
                  : 'text-gray-700'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm uppercase tracking-wide ${
                location.pathname === '/contact' 
                  ? 'text-emerald-800 font-medium' 
                  : 'text-gray-700'
              }`}
            >
              Contact
            </Link>
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className={`text-sm uppercase tracking-wide ${
                  location.pathname === '/dashboard' 
                    ? 'text-emerald-800 font-medium' 
                    : 'text-gray-700'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;