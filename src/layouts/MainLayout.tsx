import React, { ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { Button } from '../components/atoms/Button';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link to="/" className="text-xl font-bold text-[#3c2052]">
                Nutrabionics
              </Link>
            </div>
            
            {/* Botón hamburguesa para móviles */}
            <button 
              className="md:hidden text-gray-700 focus:outline-none"
              onClick={toggleMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
            
            {/* Menú de navegación para escritorio */}
            <nav className="hidden md:flex space-x-4 items-center">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-[#3c2052]">
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link to="/products" className="text-gray-700 hover:text-[#3c2052]">
                      Productos
                    </Link>
                  )}
                  <div className="text-sm text-gray-500">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="border-[#3c2052] text-[#3c2052] hover:bg-[#3c2052]/10"
                  >
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-[#3c2052]">
                    Iniciar sesión
                  </Link>
                  <Link to="/register">
                    <Button 
                      size="sm"
                      className="bg-[#3c2052] hover:bg-[#3c2052]/90 text-white"
                    >
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
          
          {/* Menú móvil desplegable */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-2 border-t">
              <div className="flex flex-col space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="text-gray-700 hover:text-[#3c2052] py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link 
                        to="/products" 
                        className="text-gray-700 hover:text-[#3c2052] py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Productos
                      </Link>
                    )}
                    <div className="text-sm text-gray-500 py-2">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleLogout}
                      className="w-full border-[#3c2052] text-[#3c2052] hover:bg-[#3c2052]/10"
                    >
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="text-gray-700 hover:text-[#3c2052] py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Iniciar sesión
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        size="sm"
                        className="w-full bg-[#3c2052] hover:bg-[#3c2052]/90 text-white"
                      >
                        Registrarse
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Nutrabionics. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}; 