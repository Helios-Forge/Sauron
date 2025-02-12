import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FirearmModelsApi, SauronBackendInternalModelsFirearmModel } from '../../api/generated';
import { apiClient } from '../api-config';

const api = new FirearmModelsApi(undefined, '', apiClient);

export function useFirearmModels() {
  return useQuery({
    queryKey: ['firearmModels'],
    queryFn: async () => {
      const response = await api.firearmModelsGet();
      return response.data;
    },
  });
}

export function useFirearmModel(id: number) {
  return useQuery({
    queryKey: ['firearmModel', id],
    queryFn: async () => {
      const response = await api.firearmModelsIdGet(id);
      return response.data;
    },
  });
}

export function useCreateFirearmModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (model: SauronBackendInternalModelsFirearmModel) => {
      const response = await api.firearmModelsPost(model);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['firearmModels'] });
    },
  });
}

export function useUpdateFirearmModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, model }: { id: number; model: SauronBackendInternalModelsFirearmModel }) => {
      const response = await api.firearmModelsIdPut(id, model);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['firearmModels'] });
      queryClient.invalidateQueries({ queryKey: ['firearmModel', id] });
    },
  });
}

export function useDeleteFirearmModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.firearmModelsIdDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['firearmModels'] });
    },
  });
} 