import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

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

  const login = useCallback((data: AuthResponse) => {
    AuthService.saveUserData(data);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
  }, []);

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