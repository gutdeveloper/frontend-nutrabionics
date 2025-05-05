import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AuthService, { User, AuthResponse } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInitialized: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Intervalo en milisegundos para verificar la autenticación
const AUTH_CHECK_INTERVAL = 5000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  // Estado para forzar una actualización
  const [, setAuthCheckCount] = useState(0);

  // Efecto para la inicialización de la autenticación
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verificar si hay un token en localStorage
        const token = localStorage.getItem('token');
        if (token) {
          // Intentar obtener datos del usuario del localStorage
          const storedUser = AuthService.getCurrentUser();
          if (storedUser) {
            setUser(storedUser);
            console.log('Usuario restaurado desde localStorage:', storedUser);
          }
        }
      } catch (error) {
        console.error('Error al inicializar la autenticación:', error);
        // En caso de error, limpiar localStorage por seguridad
        AuthService.logout();
      } finally {
        // Marcar como inicializado después de la verificación
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Efecto para verificar periódicamente la autenticación
  useEffect(() => {
    // Solo empezar a verificar después de la inicialización
    if (!isInitialized) return;

    const checkInterval = setInterval(() => {
      // Verificar si el token y el usuario todavía existen en localStorage
      const isStillAuthenticated = AuthService.isAuthenticated();
      
      // Si el usuario estaba autenticado pero ya no lo está, cerrar sesión
      if (!isStillAuthenticated && user) {
        console.log('Sesión expirada o eliminada, cerrando sesión');
        logout();
      }
      
      // Forzar una re-renderización para actualizar isAuthenticated
      setAuthCheckCount(count => count + 1);
    }, AUTH_CHECK_INTERVAL);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(checkInterval);
  }, [isInitialized, user]);

  const login = (data: AuthResponse) => {
    AuthService.saveUserData(data);
    setUser(data.user);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  // Verificar si está autenticado directamente desde el servicio
  const isAuthenticated = AuthService.isAuthenticated();
  // Determinar si es admin basado en el usuario actual
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isInitialized,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 