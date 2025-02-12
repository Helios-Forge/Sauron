import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductListingsApi, SauronBackendInternalModelsProductListing } from '../../api/generated';
import { apiClient } from '../api-config';

const api = new ProductListingsApi(undefined, '', apiClient);

export function useProductListings() {
  return useQuery({
    queryKey: ['productListings'],
    queryFn: async () => {
      const response = await api.listingsGet();
      return response.data;
    },
  });
}

export function useProductListing(id: number) {
  return useQuery({
    queryKey: ['productListing', id],
    queryFn: async () => {
      const response = await api.listingsIdGet(id);
      return response.data;
    },
  });
}

export function useProductListingsByPart(partId: number) {
  return useQuery({
    queryKey: ['productListings', 'part', partId],
    queryFn: async () => {
      const response = await api.listingsPartPartIdGet(partId);
      return response.data;
    },
  });
}

export function useProductListingsByPrebuilt(prebuiltId: number) {
  return useQuery({
    queryKey: ['productListings', 'prebuilt', prebuiltId],
    queryFn: async () => {
      const response = await api.listingsPrebuiltPrebuiltIdGet(prebuiltId);
      return response.data;
    },
  });
}

export function useCreateProductListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listing: SauronBackendInternalModelsProductListing) => {
      const response = await api.listingsPost(listing);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productListings'] });
    },
  });
}

export function useUpdateProductListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, listing }: { id: number; listing: SauronBackendInternalModelsProductListing }) => {
      const response = await api.listingsIdPut(id, listing);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['productListings'] });
      queryClient.invalidateQueries({ queryKey: ['productListing', id] });
    },
  });
}

export function useDeleteProductListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.listingsIdDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productListings'] });
    },
  });
}

export function useUpdateProductListingAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, availability }: { id: number; availability: { status: string; price?: number } }) => {
      const response = await api.listingsIdAvailabilityPatch(id, availability);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['productListings'] });
      queryClient.invalidateQueries({ queryKey: ['productListing', id] });
    },
  });
} 