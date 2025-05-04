import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '../services/api';
import { SaleData } from '../types/interfaces';

export const useUserStats = (token: string | null) => {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: () => ApiService.getUserStats(token!),
    enabled: !!token,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 10000, // 10 segundos
  });
};

export const useActiveSales = (token: string | null, limit: number, offset: number) => {
  return useQuery({
    queryKey: ['activeSales', limit, offset, token],
    queryFn: () => ApiService.getActiveSales(token!, limit, offset),
    enabled: !!token,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });
};

export const useAllSales = (token: string | null, limit: number, offset: number) => {
  return useQuery({
    queryKey: ['allSales', token, limit, offset],
    queryFn: () => ApiService.getAllSales(token!, limit, offset),
    enabled: !!token,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });
};

export const useAllPurchases = (token: string | null, limit: number, offset: number) => {
  return useQuery({
    queryKey: ['allPurchases', token, limit, offset],
    queryFn: () => ApiService.getAllPurchases(token!, limit, offset),
    enabled: !!token,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 10000,
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
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });
};

export const useComments = (saleId: string) => {
  return useQuery({
    queryKey: ['comments', saleId],
    queryFn: () => ApiService.getComments(saleId),
    enabled: !!saleId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 10000,
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

export const useLatestProducts = (limit: number) => {
  return useQuery({
    queryKey: ['latestProducts', limit],
    queryFn: () => ApiService.getLatestProducts(limit),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });
};

export const useMarketplaceProducts = (limit: number, offset: number) => {
  return useQuery({
    queryKey: ['marketplaceProducts', limit, offset],
    queryFn: () => ApiService.getMarketplaceProducts(limit, offset),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });
};

export const useCheckout = (token: string | null) => {
  return useMutation({
    mutationFn: async ({ sale_id, quantity }: { sale_id: string; quantity: number }) => {
      return await ApiService.checkout(token!, sale_id, quantity);
    },
  });
};

export const useSearchSales = (q: string, limit: number, offset: number, enabled: boolean) => {
  return useQuery({
    queryKey: ['searchSales', q, limit, offset],
    queryFn: () => ApiService.getSearchSales(q, limit, offset),
    enabled,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });
};

export const useAddFavorite = (token: string | null, saleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ApiService.addFavorite(token!, saleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['isFavorite', saleId] });
    },
  });
};

export const useRemoveFavorite = (token: string | null, saleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ApiService.removeFavorite(token!, saleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['isFavorite', saleId] });
    },
  });
};

export const useUserFavorites = (token: string | null, limit?: number, offset?: number) => {
  return useQuery({
    queryKey: ['favorites', limit, offset],
    queryFn: () => ApiService.getUserFavorites(token!, limit, offset),
    enabled: !!token,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });
};

export const useCheckFavorite = (token: string | null, saleId: string) => {
  return useQuery({
    queryKey: ['isFavorite', saleId],
    queryFn: () => ApiService.checkFavorite(token!, saleId),
    enabled: !!token && !!saleId,
  });
}; 