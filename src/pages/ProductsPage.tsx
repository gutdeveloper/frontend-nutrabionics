import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/atoms/Button';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '../components/atoms/Table';
import { Pagination } from '../components/molecules/Pagination';
import { FormField } from '../components/molecules/FormField';
import ProductService, { Product, ProductCreateData } from '../services/product.service';
import { useToast } from '../context/toast-context';
import { useAuth } from '../context/auth-context';
import { productSchema, ProductFormValues } from '../schemas/product.schema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '../components/atoms/Dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from '../components/atoms/AlertDialog';

// Componente auxiliar para el mensaje de error que falta
const FormError: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return <div className="text-sm text-red-500 mt-1">{message}</div>;
};

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated, isAdmin, isInitialized } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{id: string, name: string} | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      reference: '',
    },
  });

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

  const fetchProducts = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await ProductService.getProducts(page);
      setProducts(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (err: any) {
      // Solo mostramos el mensaje de error si el usuario sigue autenticado
      if (isAuthenticated) {
        const errorMessage = err.displayMessage || 'Error al cargar los productos. Por favor, inténtelo de nuevo.';
        showToast(errorMessage, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Solo cargar productos si el usuario está autenticado, es admin y la autenticación está inicializada
    if (isInitialized && isAuthenticated && isAdmin) {
      fetchProducts(currentPage);
    }
  }, [currentPage, isAuthenticated, isAdmin, isInitialized]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewProduct = (slug: string) => {
    navigate(`/products/slug/${slug}`);
  };

  const openDeleteDialog = (productId: string, productName: string) => {
    setProductToDelete({ id: productId, name: productName });
    setIsDeleteDialogOpen(true);
  };

  const cancelDelete = () => {
    setProductToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      // Cerrar el diálogo primero
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      
      // Eliminar el producto
      await ProductService.deleteProduct(productToDelete.id);
      showToast('Producto eliminado con éxito', 'success');
      
      // Actualizar la lista de productos
      await fetchProducts(currentPage);
    } catch (err: any) {
      // Solo mostramos el mensaje de error si el usuario sigue autenticado
      if (isAuthenticated) {
        const errorMessage = err.displayMessage || 'Error al eliminar el producto. Por favor, inténtelo de nuevo.';
        showToast(errorMessage, 'error');
      }
    }
  };
  
  const toggleCreateModal = () => {
    setIsCreating(!isCreating);
    if (!isCreating) {
      // Resetear el formulario cuando se abre
      reset({
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        reference: '',
      });
    }
  };
  
  const handleCreateProduct = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      await ProductService.createProduct(data as ProductCreateData);
      showToast('Producto creado con éxito', 'success');
      toggleCreateModal();
      fetchProducts(1); // Volver a la primera página para ver el nuevo producto
      setCurrentPage(1);
    } catch (err: any) {
      if (isAuthenticated) {
        const errorMessage = err.displayMessage || 'Error al crear el producto. Por favor, inténtelo de nuevo.';
        showToast(errorMessage, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <MainLayout>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Gestión de Productos</h1>
          <Button onClick={toggleCreateModal}>Crear Producto</Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Cargando productos...</div>
        ) : (
          <>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Nombre</TableHead>
                    <TableHead className="min-w-[80px]">Precio</TableHead>
                    <TableHead className="min-w-[80px]">Cantidad</TableHead>
                    <TableHead className="min-w-[100px]">Referencia</TableHead>
                    <TableHead className="text-right min-w-[120px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No hay productos disponibles
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium truncate max-w-[150px]">
                          {product.name}
                        </TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell className="truncate max-w-[100px]">{product.reference}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewProduct(product.slug)}
                            >
                              Ver
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openDeleteDialog(product.id, product.name)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
        
        {/* Modal de creación de producto usando Dialog component */}
        <Dialog 
          open={isCreating} 
          onOpenChange={toggleCreateModal}
          className="w-full max-w-3xl"
        >
          <DialogHeader>
            <DialogTitle>Crear Nuevo Producto</DialogTitle>
            <DialogClose onClick={toggleCreateModal} />
          </DialogHeader>
          
          <DialogContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit(handleCreateProduct)} className="space-y-4">
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
                <div className="space-y-1">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Precio <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    className="w-full rounded-md border border-input p-2 text-sm"
                    {...register('price', { valueAsNumber: true })}
                  />
                  {errors.price && (
                    <FormError message={errors.price.message} />
                  )}
                </div>
                
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

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={toggleCreateModal}
                  disabled={isSubmitting}
                  className="flex-grow sm:flex-grow-0"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-grow sm:flex-grow-0"
                >
                  {isSubmitting ? 'Creando...' : 'Crear Producto'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal de confirmación de eliminación */}
        {isDeleteDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
              className="fixed inset-0 bg-black/50" 
              onClick={cancelDelete}
            />
            <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-[500px] w-full mx-4">
              <h2 className="text-lg font-semibold mb-4">
                ¿Está seguro de que desea eliminar este producto?
              </h2>
              {productToDelete && (
                <div className="mb-4">
                  <p className="text-gray-600">
                    Se eliminará el producto: <strong>{productToDelete.name}</strong>
                  </p>
                  <p className="text-sm text-red-500 mt-2">
                    Esta acción no se puede deshacer.
                  </p>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={cancelDelete}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}; 