import api from './api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  reference: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductCreateData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  reference: string;
}

export interface ProductUpdateData {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  reference?: string;
}

const ProductService = {
  getProducts: async (page = 1, limit = 10): Promise<ProductsResponse> => {
    const response = await api.get<ProductsResponse>(`/products?page=${page}&limit=${limit}`);
    return response.data;
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/slug/${slug}`);
    return response.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: ProductCreateData): Promise<Product> => {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: ProductUpdateData): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

export default ProductService; 