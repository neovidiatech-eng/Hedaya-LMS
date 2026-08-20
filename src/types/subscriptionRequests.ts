export interface SubscriptionRequestsResponse {
  message: string;
  status: number;
  lang: "rtl" | "ltr";
  data: {
    subscriptionRequests: SubscriptionRequest[];
    pagination: Pagination;
  };
}

export interface SubscriptionRequest {
  id: string;
  planId: string;
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
  user_id: string;
  user: User;
  plan: Plan;
}

export interface User {
  id: string;
  email: string;
  nationality: string | null;
  country: string | null;
  password: string;
  name: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  confirmAt: string | null;
  roleId: string;
  code_country: string;
  status: UserStatus;
  googleId: string | null;
  provider: "local" | "google";
  timezone: string;
  fcmToken: string;
  notes: string;
}

export interface Plan {
  id: string;
  name_en: string;
  name_ar: string;
  description: string;
  price: string;
  duration: number;
  features: string[];
  currencyId: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  isHidden: boolean;
  bestSeller: boolean;
  sessionsCount: number;
  sessionTime: number;
  planType?: "single" | "group" | string;
  studentsNum?: number | string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
}

export type SubscriptionStatus =
  | "pending"
  | "approved"
  | "rejected"
  |"all"
  ;


export type UserStatus =
  | "pending"
  | "active"
  | "rejected";