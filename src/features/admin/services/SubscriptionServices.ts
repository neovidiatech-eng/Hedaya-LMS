import api from "../../../lib/axios";
import { PaginatedSubscriptionsData } from "../../../types/subscription";

export interface GetSubscriptionParams {
    search?: string;
    page?: string;
    limit?: string;
    sessions_filter?: string;    
}
export const getSubscription = async (params?: GetSubscriptionParams): Promise<PaginatedSubscriptionsData> => {
  const searchParams = params?.search? `search=${params.search}`: "";
  const pageParams = params?.page? `page=${params.page}`: "";
  const limitParams = params?.limit? `limit=${params.limit}`: "";
  const sessions_filterParams = params?.sessions_filter? `sessions_filter=${params.sessions_filter}`: "";
    const response = await api.get(`/subscription/?${searchParams}&${pageParams}&${limitParams}&${sessions_filterParams}`);
    return response.data.data;
};

export const renewSubscription = async ( studentId: string, plan_id: string) => {
  const response = await api.post( `/subscription/renew/${studentId}`,{plan_id});
  return response.data;
};
