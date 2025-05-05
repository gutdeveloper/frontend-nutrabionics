import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { FormField } from '../components/molecules/FormField';
import { Button } from '../components/atoms/Button';
import { loginSchema, type LoginFormValues } from '../schemas/auth.schema';
import AuthService from '../services/auth.service';
import { useAuth } from '../context/auth-context';
import { useToast } from '../context/toast-context';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const response = await AuthService.login(data);
      login(response);
      showToast('Inicio de sesión exitoso', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      // Obtenemos el mensaje de error mejorado que agregamos en el interceptor
      const errorMessage = err.displayMessage || 'Credenciales inválidas. Por favor, inténtelo de nuevo.';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            id="email"
            label="Correo electrónico"
            type="email"
            placeholder="ejemplo@correo.com"
            register={register('email')}
            error={errors.email}
            required
          />

          <FormField
            id="password"
            label="Contraseña"
            type="password"
            placeholder="********"
            register={register('password')}
            error={errors.password}
            required
          />

          <Button 
            type="submit" 
            className="w-full bg-[#3c2052] hover:bg-[#3c2052]/90 text-white" 
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>

        <div className="text-center mt-4">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Registrarse
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}; 