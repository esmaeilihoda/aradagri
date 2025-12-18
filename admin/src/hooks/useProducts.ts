import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { Product, PaginatedResponse } from '@/types';

export const useProducts = (
  page: number = 1,
  limit: number = 10,
  categoryId?: string,
  search?: string
) => {
  return useQuery({
    queryKey: ['products', { page, limit, categoryId, search }],
    queryFn: () =>
      apiClient.getProducts(page, limit, categoryId, search).then((res) => res.data),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => apiClient.getProductById(id).then((res) => res.data.data),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiClient.createProduct(
        data.title,
        data.description,
        data.price,
        data.categoryId,
        data.stock,
        data.unit,
        data.images,
        data.attributes
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiClient.updateProduct(
        id,
        data.title,
        data.description,
        data.price,
        data.stock,
        data.unit,
        data.images,
        data.attributes
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
