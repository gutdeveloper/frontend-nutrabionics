import { useState, useCallback } from 'react';
import { orderService, Order } from '../services/orderService';
import { useToast } from '../context/toast-context';
import { useAuth } from '../context/auth-context';

export const useOrders = () => {
  const { showToast } = useToast();
  const { isAuthenticated, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const response = await orderService.getOrders(page, 10, isAdmin);
      setOrders(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      if (isAuthenticated) {
        const errorMessage = err.displayMessage || 'Error al cargar las órdenes. Por favor, inténtelo de nuevo.';
        showToast(errorMessage, 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isAuthenticated, showToast]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchOrders(page);
  }, [fetchOrders]);

  const handleOrderCreated = useCallback(() => {
    setCurrentPage(1);
    fetchOrders(1);
  }, [fetchOrders]);

  return {
    orders,
    loading,
    currentPage,
    totalPages,
    fetchOrders,
    handlePageChange,
    handleOrderCreated,
  };
}; 