import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { changeSubscriptionRequestStatus, deleteSubscriptionRequest, getSubscriptionRequests } from "../services/subscriptionRequestServices";


export const useSubscribtionRequest = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["subscribtion-requests"],
        queryFn: () => getSubscriptionRequests(),
    });
    return { data, isLoading };
}

export const useDeleteSubscriptionRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteSubscriptionRequest(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscribtion-requests"] });
        }
    })
}

export const useChangeSubscriptionRequestStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) => changeSubscriptionRequestStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscribtion-requests"] })
        }
    })
}