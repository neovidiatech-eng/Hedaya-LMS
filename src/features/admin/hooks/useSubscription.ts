import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getSubscription, GetSubscriptionParams, renewSubscription } from "../services/SubscriptionServices";

export const useSubscription = (params?: GetSubscriptionParams) => {
    return useQuery({
        queryKey: ["subscription", params],
        queryFn: () => getSubscription(params),
    });
}


export const useRenewSubscription = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ studentId, plan_id }: { studentId: string; plan_id: string }) => renewSubscription(studentId, plan_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscription"] });
        }
    })
}