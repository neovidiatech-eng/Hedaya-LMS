import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlans, createPlan, updatePlan, deletePlans } from "../services/PlansServices";
import { Plan, PlanBody } from "../../../types/plan";

export const usePlans = () => {
  return useQuery<Plan[]>({
    queryKey: ['plans'],
    queryFn: getPlans,
  });
};



export const useAddPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PlanBody) => createPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['landing-plans'] });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PlanBody> }) => updatePlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['landing-plans'] });
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePlans(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['landing-plans'] });
    },
  });
};