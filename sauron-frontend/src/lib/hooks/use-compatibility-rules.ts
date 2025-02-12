import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CompatibilityRulesApi, SauronBackendInternalModelsCompatibilityRule } from '../../api/generated';
import { apiClient } from '../api-config';

const api = new CompatibilityRulesApi(undefined, '', apiClient);

export function useCompatibilityRules() {
  return useQuery({
    queryKey: ['compatibilityRules'],
    queryFn: async () => {
      const response = await api.compatibilityRulesGet();
      return response.data;
    },
  });
}

export function useCompatibilityRule(id: number) {
  return useQuery({
    queryKey: ['compatibilityRule', id],
    queryFn: async () => {
      const response = await api.compatibilityRulesIdGet(id);
      return response.data;
    },
  });
}

export function useCompatibilityRulesByFirearmAndPart(firearmId: number, partId: number) {
  return useQuery({
    queryKey: ['compatibilityRules', 'firearm', firearmId, 'part', partId],
    queryFn: async () => {
      const response = await api.compatibilityRulesFirearmFirearmIdPartPartIdGet(firearmId, partId);
      return response.data;
    },
  });
}

export function useCompatibilityRulesByPart(partId: number) {
  return useQuery({
    queryKey: ['compatibilityRules', 'part', partId],
    queryFn: async () => {
      const response = await api.compatibilityRulesPartPartIdGet(partId);
      return response.data;
    },
  });
}

export function useCheckCompatibility(firearmId: number, part1Id: number, part2Id: number) {
  return useQuery({
    queryKey: ['compatibilityCheck', firearmId, part1Id, part2Id],
    queryFn: async () => {
      const response = await api.compatibilityCheckGet(firearmId, part1Id, part2Id);
      return response.data;
    },
  });
}

export function useCreateCompatibilityRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rule: SauronBackendInternalModelsCompatibilityRule) => {
      const response = await api.compatibilityRulesPost(rule);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compatibilityRules'] });
    },
  });
}

export function useUpdateCompatibilityRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, rule }: { id: number; rule: SauronBackendInternalModelsCompatibilityRule }) => {
      const response = await api.compatibilityRulesIdPut(id, rule);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['compatibilityRules'] });
      queryClient.invalidateQueries({ queryKey: ['compatibilityRule', id] });
    },
  });
}

export function useDeleteCompatibilityRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.compatibilityRulesIdDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compatibilityRules'] });
    },
  });
} 