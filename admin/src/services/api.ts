import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse, PaginatedResponse } from '@/types';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string = '/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage
    this.token = localStorage.getItem('token');

    // Add request interceptor
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Add response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle token refresh or logout
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Auth
  async register(email: string, name: string, password: string) {
    return this.client.post<ApiResponse<any>>('/auth/register', {
      email,
      name,
      password,
    });
  }

  async login(email: string, password: string) {
    return this.client.post<ApiResponse<any>>('/auth/login', {
      email,
      password,
    });
  }

  async logout() {
    return this.client.post<ApiResponse<void>>('/auth/logout');
  }

  async refreshToken(refreshToken: string) {
    return this.client.post<ApiResponse<any>>('/auth/refresh', {
      refreshToken,
    });
  }

  async updateProfile(name: string, email?: string) {
    return this.client.put<ApiResponse<any>>('/auth/profile', {
      name,
      email,
    });
  }

  async changePassword(oldPassword: string, newPassword: string) {
    return this.client.post<ApiResponse<void>>('/auth/change-password', {
      oldPassword,
      newPassword,
    });
  }

  // Categories
  async getCategories(parentId?: string) {
    return this.client.get<ApiResponse<any[]>>('/categories', {
      params: { parentId },
    });
  }

  async getCategoryTree() {
    return this.client.get<ApiResponse<any[]>>('/categories/tree');
  }

  async getCategoryById(id: string) {
    return this.client.get<ApiResponse<any>>(`/categories/${id}`);
  }

  async createCategory(name: string, parentId?: string, description?: string, image?: string) {
    return this.client.post<ApiResponse<any>>('/categories', {
      name,
      parentId,
      description,
      image,
    });
  }

  async updateCategory(
    id: string,
    name?: string,
    description?: string,
    image?: string,
    parentId?: string
  ) {
    return this.client.put<ApiResponse<any>>(`/categories/${id}`, {
      name,
      description,
      image,
      parentId,
    });
  }

  async deleteCategory(id: string) {
    return this.client.delete<ApiResponse<void>>(`/categories/${id}`);
  }

  // Products
  async getProducts(
    page: number = 1,
    limit: number = 10,
    categoryId?: string,
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    return this.client.get<PaginatedResponse<any>>('/products', {
      params: {
        page,
        limit,
        categoryId,
        search,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
      },
    });
  }

  async getProductById(id: string) {
    return this.client.get<ApiResponse<any>>(`/products/${id}`);
  }

  async createProduct(
    title: string,
    description: string,
    price: number,
    categoryId: string,
    stock?: number,
    unit?: string,
    images?: string[],
    attributes?: any
  ) {
    return this.client.post<ApiResponse<any>>('/products', {
      title,
      description,
      price,
      categoryId,
      stock,
      unit,
      images,
      attributes,
    });
  }

  async updateProduct(
    id: string,
    title?: string,
    description?: string,
    price?: number,
    stock?: number,
    unit?: string,
    images?: string[],
    attributes?: any
  ) {
    return this.client.put<ApiResponse<any>>(`/products/${id}`, {
      title,
      description,
      price,
      stock,
      unit,
      images,
      attributes,
    });
  }

  async deleteProduct(id: string) {
    return this.client.delete<ApiResponse<void>>(`/products/${id}`);
  }

  async addProductImage(id: string, imageUrl: string) {
    return this.client.post<ApiResponse<any>>(`/products/${id}/images`, {
      imageUrl,
    });
  }

  async removeProductImage(id: string, imageUrl: string) {
    return this.client.delete<ApiResponse<any>>(`/products/${id}/images`, {
      data: { imageUrl },
    });
  }

  // Orders
  async getOrders(page: number = 1, limit: number = 10) {
    return this.client.get<PaginatedResponse<any>>('/orders/my', {
      params: { page, limit },
    });
  }

  async getAllOrders(page: number = 1, limit: number = 10, status?: string) {
    return this.client.get<PaginatedResponse<any>>('/orders/admin/all', {
      params: { page, limit, status },
    });
  }

  async getOrderById(id: string) {
    return this.client.get<ApiResponse<any>>(`/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: string) {
    return this.client.put<ApiResponse<any>>(`/orders/${id}`, { status });
  }

  async cancelOrder(id: string) {
    return this.client.delete<ApiResponse<any>>(`/orders/${id}`);
  }

  // Contact Submissions
  async getContactSubmissions(page: number = 1, limit: number = 10, read?: boolean) {
    return this.client.get<PaginatedResponse<any>>('/contact', {
      params: { page, limit, read },
    });
  }

  async getContactSubmissionById(id: string) {
    return this.client.get<ApiResponse<any>>(`/contact/${id}`);
  }

  async deleteContactSubmission(id: string) {
    return this.client.delete<ApiResponse<void>>(`/contact/${id}`);
  }

  // Services
  async getServices(type?: string) {
    return this.client.get<ApiResponse<any[]>>('/services', {
      params: { type },
    });
  }

  async getServiceById(id: string) {
    return this.client.get<ApiResponse<any>>(`/services/${id}`);
  }

  async createService(title: string, type: string, description: string, image?: string) {
    return this.client.post<ApiResponse<any>>('/services', {
      title,
      type,
      description,
      image,
    });
  }

  async updateService(
    id: string,
    title?: string,
    type?: string,
    description?: string,
    image?: string
  ) {
    return this.client.put<ApiResponse<any>>(`/services/${id}`, {
      title,
      type,
      description,
      image,
    });
  }

  async deleteService(id: string) {
    return this.client.delete<ApiResponse<void>>(`/services/${id}`);
  }

  // Media
  async getMediaFiles(page: number = 1, limit: number = 20) {
    return this.client.get<PaginatedResponse<any>>('/media', {
      params: { page, limit },
    });
  }

  async getMediaById(id: string) {
    return this.client.get<ApiResponse<any>>(`/media/${id}`);
  }

  async uploadMedia(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.client.post<ApiResponse<any>>('/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async deleteMedia(id: string) {
    return this.client.delete<ApiResponse<void>>(`/media/${id}`);
  }
}

export const apiClient = new ApiClient();
