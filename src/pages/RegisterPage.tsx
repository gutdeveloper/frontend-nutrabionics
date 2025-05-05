import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { FormField } from '../components/molecules/FormField';
import { Button } from '../components/atoms/Button';
import { registerSchema, type RegisterFormValues } from '../schemas/auth.schema';
import AuthService from '../services/auth.service';
import { useAuth } from '../context/auth-context';
import { useToast } from '../context/toast-context';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      const { confirmPassword, ...registerData } = data;
      const response = await AuthService.register(registerData);
      login(response);
      showToast('Registro exitoso', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.displayMessage || 'Error al registrarse. Por favor, inténtelo de nuevo.';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Registro</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="firstName"
              label="Nombre"
              placeholder="Ingrese su nombre"
              register={register('firstName')}
              error={errors.firstName}
              required
            />
            <FormField
              id="lastName"
              label="Apellido"
              placeholder="Ingrese su apellido"
              register={register('lastName')}
              error={errors.lastName}
              required
            />
          </div>

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

          <FormField
            id="confirmPassword"
            label="Confirmar contraseña"
            type="password"
            placeholder="********"
            register={register('confirmPassword')}
            error={errors.confirmPassword}
            required
          />

          <Button 
            type="submit" 
            className="w-full bg-[#3c2052] hover:bg-[#3c2052]/90 text-white" 
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </form>

        <div className="text-center mt-4">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}; 