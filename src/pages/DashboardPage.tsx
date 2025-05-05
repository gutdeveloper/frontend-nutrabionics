import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { useAuth } from '../context/auth-context';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-primary mb-8">
          Dashboard
        </h1>
        <div className="text-center">
          <p className="text-xl mb-4">
            Hola, {user?.firstName} {user?.lastName}, bienvenido a Nutrabionics
          </p>
          <p className="text-gray-600">
            Desde aquí podrás gestionar toda tu información y productos.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}; 