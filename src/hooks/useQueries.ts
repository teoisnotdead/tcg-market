import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '../services/api';
import { SaleData } from '../types/interfaces';

export const useUserStats = (token: string | null) => {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: () => ApiService.getUserStats(token!),
    enabled: !!token,
  });
};

export const useActiveSales = (token: string | null, limit: number, offset: number) => {
  return useQuery({
    queryKey: ['activeSales', limit, offset, token],
    queryFn: () => ApiService.getActiveSales(token!, limit, offset),
    enabled: !!token,
  });
};

export const useAllSales = (token: string | null) => {
  return useQuery({
    queryKey: ['allSales'],
    queryFn: () => ApiService.getAllSales(token!),
    enabled: !!token,
  });
};

export const useAllPurchases = (token: string | null) => {
  return useQuery({
    queryKey: ['allPurchases', token],
    queryFn: () => ApiService.getAllPurchases(token!),
    enabled: !!token,
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, saleData }: { token: string; saleData: SaleData }) =>
      ApiService.createSale(token, saleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.invalidateQueries({ queryKey: ['activeSales'] });
      queryClient.invalidateQueries({ queryKey: ['allSales'] });
    },
  });
};

export const useSaleDetail = (id: string) => {
  return useQuery({
    queryKey: ['saleDetail', id],
    queryFn: () => ApiService.getSaleDetail(id),
    enabled: !!id,
  });
};

export const useComments = (saleId: string) => {
  return useQuery({
    queryKey: ['comments', saleId],
    queryFn: () => ApiService.getComments(saleId),
    enabled: !!saleId,
  });
};

export const useAddComment = (token: string | null, saleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => ApiService.addComment(token!, saleId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', saleId] });
    },
  });
};

export const useEditSale = (token: string | null, saleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedData: SaleData) => ApiService.editSale(token!, saleId, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saleDetail', saleId] });
    },
  });
};

export const useDeleteSale = (token: string | null, saleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ApiService.deleteSale(token!, saleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saleDetail', saleId] });
    },
  });
}; 