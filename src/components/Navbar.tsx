import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bike, Settings } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
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

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/motorcycles', label: 'Motos' },
    { path: '/parts', label: 'Pièces Détachées' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-3" 
            onClick={closeMenu}
          >
            <Bike size={32} className="text-red-600" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">AGDE MOTO</span>
              <span className="text-sm italic text-red-600">Gattuso</span>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm uppercase tracking-wide font-medium transition-colors hover:text-red-500 ${
                  location.pathname === link.path ? 'text-red-500' : 'text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              className={`text-sm uppercase tracking-wide font-medium transition-colors hover:text-red-500 flex items-center ${
                location.pathname === '/admin' ? 'text-red-500' : 'text-white'
              }`}
            >
              <Settings size={16} className="mr-1" />
              Admin
            </Link>
          </nav>

          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="md:hidden bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm uppercase tracking-wide font-medium transition-colors hover:text-red-500 ${
                    location.pathname === link.path ? 'text-red-500' : 'text-white'
                  }`}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/admin"
                className={`text-sm uppercase tracking-wide font-medium transition-colors hover:text-red-500 flex items-center ${
                  location.pathname === '/admin' ? 'text-red-500' : 'text-white'
                }`}
                onClick={closeMenu}
              >
                <Settings size={16} className="mr-1" />
                Admin
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;