import api from './api';

export interface Order {
  id: string;
  createdAt: string;
  total: number;
  quantity_products: number;
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface OrdersResponse {
  data: Order[];
  meta: {
    totalPages: number;
    currentPage: number;
  };
}

class OrderServiceImpl {
  async getOrders(page: number = 1, limit: number = 10, isAdmin: boolean = false): Promise<OrdersResponse> {
    // Usar el endpoint correspondiente según el rol
    const endpoint = isAdmin ? '/orders' : '/orders/my-orders';
    console.log('OrderService - Calling endpoint:', endpoint, { page, limit, isAdmin });
    
    try {
      const response = await api.get(`${endpoint}?page=${page}&limit=${limit}`);
      console.log('OrderService - Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('OrderService - Error:', error);
      throw error;
    }
  }

  async createOrder(products: { productId: string; quantity: number }[]): Promise<Order> {
    const response = await api.post('/orders', { products });
    return response.data;
  }
}

export const orderService = new OrderServiceImpl(); 