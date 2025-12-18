import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';

export const useContactSubmissions = (page: number = 1, limit: number = 10, read?: boolean) => {
  return useQuery({
    queryKey: ['contactSubmissions', { page, limit, read }],
    queryFn: () => apiClient.getContactSubmissions(page, limit, read).then((res) => res.data),
  });
};

export const useContactSubmission = (id: string) => {
  return useQuery({
    queryKey: ['contactSubmission', id],
    queryFn: () => apiClient.getContactSubmissionById(id).then((res) => res.data.data),
    enabled: !!id,
  });
};

export const useDeleteContactSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteContactSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactSubmissions'] });
    },
  });
};
