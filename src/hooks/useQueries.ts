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
    queryKey: ['activeSales', limit, offset],
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
    queryKey: ['allPurchases'],
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