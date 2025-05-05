import { useState, useCallback } from 'react';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { useToast } from '../context/toast-context';
import { Product } from '../types/product';

export const useCreateOrder = (onOrderCreated: () => void) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts(1, 100);
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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      showToast('Por favor, seleccione un producto', 'error');
      return;
    }

    try {
      setLoading(true);
      await orderService.createOrder([{
        productId: selectedProduct.id,
        quantity,
      }]);
      showToast('Orden creada exitosamente', 'success');
      onOrderCreated();
      setSelectedProduct(null);
      setQuantity(1);
    } catch (err: any) {
      console.error('Error creating order:', err);
      showToast(
        err.displayMessage || 'Error al crear la orden. Por favor, inténtelo de nuevo.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [selectedProduct, quantity, onOrderCreated, showToast]);

  const total = useCallback(() => {
    if (!selectedProduct) return 0;
    return selectedProduct.price * quantity;
  }, [selectedProduct, quantity]);

  return {
    loading,
    products,
    selectedProduct,
    quantity,
    total: total(),
    setSelectedProduct,
    setQuantity,
    loadProducts,
    handleSubmit,
  };
}; 