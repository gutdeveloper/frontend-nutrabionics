import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/atoms/Button';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-4xl font-bold text-center text-[#3c2052] mb-4">
          Bienvenido a Nutrabionics
        </h1>
        <p className="text-xl text-center text-gray-600 max-w-2xl mb-8">
          Productos nutricionales de alta calidad para deportistas y atletas
        </p>
        <div className="flex gap-4">
          <Button 
            onClick={() => navigate('/login')} 
            className="bg-[#3c2052] hover:bg-[#3c2052]/90 text-white"
          >
            Iniciar sesión
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/register')}
            className="border-[#3c2052] text-[#3c2052] hover:bg-[#3c2052]/10"
          >
            Registrarse
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}; 