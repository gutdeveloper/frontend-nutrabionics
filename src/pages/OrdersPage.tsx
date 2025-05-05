import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/atoms/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/atoms/Table';
import { OrderDetailsTable } from '../components/molecules/OrderDetailsTable';
import { CreateOrderForm } from '../components/molecules/CreateOrderForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/atoms/Dialog';
import { useToast } from '../context/toast-context';
import { useAuth } from '../context/auth-context';
import { orderService, Order } from '../services/orderService';
import { useOrders } from '../hooks/useOrders';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated, isAdmin, isInitialized, user } = useAuth();
  const {
    orders,
    loading,
    currentPage,
    totalPages,
    fetchOrders,
    handleOrderCreated,
  } = useOrders();

  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = React.useState(false);

  // Verificar permisos solo después de que la autenticación se haya inicializado
  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Cargar órdenes cuando el componente se monte
    fetchOrders(currentPage);
  }, [isInitialized, isAuthenticated, navigate, fetchOrders, currentPage]);

  const handleViewOrder = React.useCallback((order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }, []);

  const tableContent = useMemo(() => {
    if (orders.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={isAdmin ? 5 : 4} className="text-center py-4">
            No hay órdenes disponibles
          </TableCell>
        </TableRow>
      );
    }

    return orders.map((order) => (
      <TableRow key={order.id}>
        {isAdmin && (
          <TableCell>
            {order.customer 
              ? `${order.customer.firstName} ${order.customer.lastName}`
              : order.user 
                ? `${order.user.firstName} ${order.user.lastName}`
                : 'Cliente no registrado'}
          </TableCell>
        )}
        <TableCell>
          {new Date(order.createdAt).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </TableCell>
        <TableCell>${order.total.toFixed(2)}</TableCell>
        <TableCell>{order.quantity_products}</TableCell>
        <TableCell className="text-right">
          <Button
            variant="outline"
            onClick={() => handleViewOrder(order)}
          >
            Ver
          </Button>
        </TableCell>
      </TableRow>
    ));
  }, [orders, isAdmin, handleViewOrder]);

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

  // Si no está autenticado, no renderizar nada (ya se habrá redirigido)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">
            {isAdmin ? 'Gestión de Órdenes' : 'Mis Órdenes'}
          </h1>
          {!isAdmin && (
            <Button onClick={() => setIsCreateFormOpen(true)}>Crear Orden</Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">Cargando órdenes...</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {isAdmin && <TableHead>Cliente</TableHead>}
                  <TableHead>Fecha</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Cantidad de Productos</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableContent}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles de la Orden</DialogTitle>
            </DialogHeader>
            {selectedOrder && <OrderDetailsTable order={selectedOrder} />}
          </DialogContent>
        </Dialog>

        {!isAdmin && (
          <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Orden</DialogTitle>
              </DialogHeader>
              <CreateOrderForm 
                onOrderCreated={() => {
                  handleOrderCreated();
                  setIsCreateFormOpen(false);
                }} 
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
}; 