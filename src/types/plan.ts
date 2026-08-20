export type Currency = {
  id: string;
  name_en: string;
  name_ar: string;
  symbol: string;
  code: string;
};

export type Plan = {
  id: string;
  name_en: string;
  name_ar: string;
  description: string;
  price: string | number;
  duration: number;
  sessionsCount: number;
  sessionTime: number;
  features: string[];
  currencyId: string;
  active: boolean;
  bestSeller: boolean;
  isHidden: boolean;
  currency?: Currency;
  planType?: "single" | "group" | string;
  maxStudents: number | string;
  createdAt: string;
  updatedAt: string;
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
  price: number;
  duration: number;
  description: string;
  sessionsCount: number;
  active: boolean;
  bestSeller: boolean;
  isHidden: boolean;
  features: string[];
  currencyId: string;
  sessionTime: number;
  planType?: "single" | "group";
  studentsNum?: number;
}


