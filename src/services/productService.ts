import api from './api';

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ProductResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductService {
  getProducts: (page: number, limit: number) => Promise<ProductResponse>;
}

class ProductServiceImpl implements ProductService {
  async getProducts(page: number, limit: number): Promise<ProductResponse> {
    const response = await api.get<ProductResponse>(`/products?page=${page}&limit=${limit}`);
    return response.data;
  }
}

export const productService = new ProductServiceImpl(); 