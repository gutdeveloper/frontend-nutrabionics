import { useState, useCallback } from 'react';
import { orderService } from '../services/orderService';
import ProductService, { Product } from '../services/product.service';
import { useToast } from '../context/toast-context';

interface OrderItem {
  product: Product;
  quantity: number;
}

export const useCreateOrder = (onOrderCreated: () => void) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ProductService.getProducts(1, 100);
      setProducts(response.data);
    } catch (err: any) {
      console.error('Error loading products:', err);
      showToast(
        err.displayMessage || 'Error al cargar los productos. Por favor, inténtelo de nuevo.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const addItem = useCallback(() => {
    if (!selectedProduct) {
      showToast('Por favor, seleccione un producto', 'error');
      return;
    }

    const existingItem = orderItems.find(item => item.product.id === selectedProduct.id);
    if (existingItem) {
      showToast('Este producto ya está en la orden', 'error');
      return;
    }

    setOrderItems(prev => [...prev, { product: selectedProduct, quantity }]);
    setSelectedProduct(null);
    setQuantity(1);
  }, [selectedProduct, quantity, orderItems, showToast]);

  const removeItem = useCallback((productId: string) => {
    setOrderItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      showToast('Por favor, agregue al menos un producto a la orden', 'error');
      return;
    }

    try {
      setLoading(true);
      await orderService.createOrder(orderItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })));
      showToast('Orden creada exitosamente', 'success');
      onOrderCreated();
      setOrderItems([]);
      setSelectedProduct(null);
      setQuantity(1);
      onOrderCreated();
    } catch (err: any) {
      console.error('Error creating order:', err);
      showToast(
        err.displayMessage || 'Error al crear la orden. Por favor, inténtelo de nuevo.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [orderItems, onOrderCreated, showToast]);

  const total = useCallback(() => {
    return orderItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [orderItems]);

  return {
    loading,
    products,
    selectedProduct,
    quantity,
    orderItems,
    total: total(),
    setSelectedProduct,
    setQuantity,
    addItem,
    removeItem,
    loadProducts,
    handleSubmit,
  };
}; 