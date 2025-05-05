import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/atoms/Button';
import { FormField } from '../components/molecules/FormField';
import ProductService, { Product, ProductUpdateData } from '../services/product.service';
import { productUpdateSchema, ProductUpdateFormValues } from '../schemas/product.schema';
import { useToast } from '../context/toast-context';
import { useAuth } from '../context/auth-context';

// Componente auxiliar para el mensaje de error que falta
const FormError: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return <div className="text-sm text-red-500 mt-1">{message}</div>;
};

export const ProductDetailPage: React.FC = () => {
  const { slug: urlSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated, isAdmin, isInitialized } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSlug, setCurrentSlug] = useState<string | undefined>(urlSlug);

  // Actualizar el slug actual cuando cambia el slug de la URL
  useEffect(() => {
    setCurrentSlug(urlSlug);
  }, [urlSlug]);

  // Verificar permisos solo después de que la autenticación se haya inicializado
  useEffect(() => {
    if (!isInitialized) {
      // No hacer nada hasta que se cargue el estado de autenticación
      return;
    }
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
  }, [isInitialized, isAuthenticated, isAdmin, navigate]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductUpdateFormValues>({
    resolver: zodResolver(productUpdateSchema),
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!currentSlug || !isInitialized || !isAuthenticated || !isAdmin) {
        console.log('Missing required data:', { currentSlug, isInitialized, isAuthenticated, isAdmin });
        return;
      }
      
      try {
        console.log('Fetching product with slug:', currentSlug);
        setIsLoading(true);
        const data = await ProductService.getProductBySlug(currentSlug);
        console.log('Product data received:', data);
        setProduct(data);
        
        // Prepara los datos para el formulario
        reset({
          name: data.name,
          description: data.description,
          price: data.price,
          quantity: data.quantity,
          reference: data.reference,
        });
      } catch (err: any) {
        console.error('Error fetching product:', err);
        // Solo mostrar mensaje de error si el usuario sigue autenticado
        if (isAuthenticated) {
          const errorMessage = err.displayMessage || 'Error al cargar el producto. Por favor, inténtelo de nuevo.';
          showToast(errorMessage, 'error');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [currentSlug, reset, showToast, isInitialized, isAuthenticated, isAdmin]);

  const handleUpdate = async (data: ProductUpdateFormValues) => {
    if (!product || !isAuthenticated || !isAdmin) return;
    
    try {
      setIsSaving(true);
      
      // Filtra solo los campos que han cambiado
      const updateData: ProductUpdateData = {};
      if (data.name !== product.name) updateData.name = data.name;
      if (data.description !== product.description) updateData.description = data.description;
      if (data.price !== product.price) updateData.price = data.price;
      if (data.quantity !== product.quantity) updateData.quantity = data.quantity;
      if (data.reference !== product.reference) updateData.reference = data.reference;
      
      // Solo actualiza si hay cambios
      if (Object.keys(updateData).length > 0) {
        const updatedProduct = await ProductService.updateProduct(product.id, updateData);
        setProduct(updatedProduct);
        showToast('Producto actualizado con éxito', 'success');
        
        // Si el nombre cambió, actualizar el slug y redirigir
        if (data.name !== product.name) {
          setCurrentSlug(updatedProduct.slug);
          navigate(`/products/slug/${updatedProduct.slug}`, { replace: true });
        }
      } else {
        showToast('No se realizaron cambios', 'default');
      }
      
      setIsEditing(false);
    } catch (err: any) {
      // Solo mostrar mensaje de error si el usuario sigue autenticado
      if (isAuthenticated) {
        const errorMessage = err.displayMessage || 'Error al actualizar el producto. Por favor, inténtelo de nuevo.';
        showToast(errorMessage, 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product || !isAuthenticated || !isAdmin) return;
    
    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      try {
        await ProductService.deleteProduct(product.id);
        showToast('Producto eliminado con éxito', 'success');
        navigate('/products');
      } catch (err: any) {
        // Solo mostrar mensaje de error si el usuario sigue autenticado
        if (isAuthenticated) {
          const errorMessage = err.displayMessage || 'Error al eliminar el producto. Por favor, inténtelo de nuevo.';
          showToast(errorMessage, 'error');
        }
      }
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Mostrar un indicador de carga mientras se inicializa la autenticación
  if (!isInitialized) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Si no está autenticado o no es admin, no renderizar nada (ya se habrá redirigido)
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="text-center py-8">Cargando producto...</div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="text-center py-8">Producto no encontrado</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Detalles del Producto</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={toggleEdit}
              disabled={isSaving}
            >
              {isEditing ? 'Cancelar' : 'Editar'}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSaving}
            >
              Eliminar
            </Button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <FormField
              id="name"
              label="Nombre"
              register={register('name')}
              error={errors.name}
              required
            />

            <div className="space-y-1">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Descripción <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full rounded-md border border-input p-2 text-sm"
                {...register('description')}
              />
              {errors.description && (
                <FormError message={errors.description.message} />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="price"
                label="Precio"
                type="number"
                step="0.01"
                register={register('price', { valueAsNumber: true })}
                error={errors.price}
                required
              />
              <FormField
                id="quantity"
                label="Cantidad"
                type="number"
                register={register('quantity', { valueAsNumber: true })}
                error={errors.quantity}
                required
              />
            </div>

            <FormField
              id="reference"
              label="Referencia"
              register={register('reference')}
              error={errors.reference}
              required
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={toggleEdit}
                disabled={isSaving}
                className="flex-grow sm:flex-grow-0"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving}
                className="flex-grow sm:flex-grow-0"
              >
                {isSaving ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary/10 p-4 border-b">
              <h2 className="text-xl font-medium text-primary break-words">{product?.name}</h2>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                <span className="px-2 py-1 bg-primary/20 rounded-full text-primary">ID: {product?.id.substring(0, 8)}</span>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Información del producto</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex flex-wrap justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-600">Precio</span>
                      <span className="font-medium">${product?.price.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-wrap justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-600">Cantidad</span>
                      <span>{product?.quantity}</span>
                    </div>
                    <div className="flex flex-wrap justify-between items-center py-2">
                      <span className="font-medium text-gray-600">Referencia</span>
                      <span>{product?.reference}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Datos de registro</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex flex-wrap justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-600">Creado</span>
                      <span>{new Date(product?.createdAt || '').toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap justify-between items-center py-2">
                      <span className="font-medium text-gray-600">Actualizado</span>
                      <span>{new Date(product?.updatedAt || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Descripción</h3>
                <div className="bg-gray-50 p-4 rounded-md h-full">
                  <p className="whitespace-pre-line text-gray-700">{product?.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}; 