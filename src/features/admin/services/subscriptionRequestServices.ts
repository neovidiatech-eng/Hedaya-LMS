import api from "../../../lib/axios";
import type { SubscriptionRequestsResponse } from "../../../types/subscriptionRequests";

export const getSubscriptionRequests = async () => {
  const response = await api.get<SubscriptionRequestsResponse>("/subscription/requests");
  const data = response.data.data;
  console.log(data);

  return data.subscriptionRequests;
};

// delete
export const deleteSubscriptionRequest = async (id: string) => {
  try {
    const res = await api.delete(`/subscription/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete subscription failed:", error);
    throw error;
  }
};

// change status
export const changeSubscriptionRequestStatus = async (
  id: string,
  status: "approved" | "rejected",
) => {
  try {
    const res = await api.put(`/subscription/requests/change-status/${id}`, {
      status,
    });
    return res.data;
  } catch (error) {
    console.error("Change status failed:", error);
    throw error;
  }
};

// https://github.com/Hedayatech-eng/lms_front
