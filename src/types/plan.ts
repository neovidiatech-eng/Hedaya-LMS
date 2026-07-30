export type Currency = {
  id: string;
  name_en: string;
  name_ar: string;
  symbol: string;
  code: string;
};

export type PlanType = "individual" | "group";

export type Plan = {
  id: string;
  name_en: string;
  name_ar: string;
  description: string;
  price: string | number;
  duration: number; // in days
  sessionsCount: number;
  sessionTime: number; // in minutes
  features: string[];
  currencyId: string;
  active: boolean;
  bestSeller: boolean;
  isHidden: boolean;
  isGroup?: boolean;
  maxStudents?: number;
  planType?: PlanType;
  currency?: Currency;
  createdAt?: string;
  updatedAt?: string;

  // Snake_case aliases from backend API
  sessions_count?: number;
  session_time?: number;
  best_seller?: boolean;
  is_hidden?: boolean;
  is_group?: boolean;
  max_students?: number;
  plan_type?: PlanType;
};

export type PlansResponse = {
  message: string;
  status: number;
  data: Plan[];
};

export type PlanResponse = {
  message: string;
  status: number;
  data: Plan;
};

export interface PlanBody {
  name_en: string;
  name_ar: string;
  price: number | string;
  duration: number;
  description?: string;
  sessionsCount: number;
  sessionTime: number;
  currencyId: string;
  active: boolean;
  bestSeller: boolean;
  isHidden?: boolean;
  isGroup?: boolean;
  maxStudents?: number;
  planType?: PlanType;
  features?: string[];
}
