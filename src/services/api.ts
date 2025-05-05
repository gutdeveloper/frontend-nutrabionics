import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3000/api/v1';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir token de autenticación si está disponible
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Extraer el mensaje de error según la estructura del backend
    let errorMessage = 'Ocurrió un error en la solicitud';

    if (error.response) {
      // El servidor respondió con un código de estado de error
      const { data, status } = error.response;
      
      console.error('Error API response:', data);

      // Extraer mensaje de error de la respuesta con prioridad al campo 'error'
      if (data && typeof data === 'object') {
        if (data.error) {
          errorMessage = data.error;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.msg) {
          errorMessage = data.msg;
        }
      } else if (typeof data === 'string') {
        errorMessage = data;
      }

      // Manejar únicamente errores de autenticación (401)
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // No redireccionamos automáticamente para permitir mostrar el error
        errorMessage = errorMessage || 'Sesión expirada o credenciales inválidas';
      }
      
      // Para otros errores (400, 403, 404, 500, etc.) no limpiamos el localStorage
      // ya que podrían ser errores de validación o problemas temporales
    } else if (error.request) {
      // La solicitud se realizó pero no se recibió respuesta
      errorMessage = 'No se pudo conectar con el servidor';
      console.error('No response received:', error.request);
    } else {
      // Error al configurar la solicitud
      console.error('Error setting up request:', error.message);
    }

    // Agregamos el mensaje de error mejorado al objeto de error para usarlo en los componentes
    error.displayMessage = errorMessage;
    return Promise.reject(error);
  }
);

export default api; 