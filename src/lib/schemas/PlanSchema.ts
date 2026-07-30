import { z } from "zod";

type TFunc = (key: string, options?: any) => string;

export const getPlanSchema = (t: TFunc) => z.object({
  name: z.string().min(1, t("validation.required")),
  nameEn: z.string().min(1, t("validation.required")),
  description: z.string().optional().default(''),
  price: z.coerce.number().min(0, t("validation.required")),
  currencyId: z.string().min(1, t("validation.required")),
  duration: z.coerce.number().min(1, t("validation.min", { count: 1 })), // integer in days
  sessionsCount: z.coerce.number().min(0),
  sessionTime: z.coerce.number().min(1, t("validation.required")), // in minutes
  features: z.array(z.string()).optional().default([]),
  isPopular: z.boolean().default(false),
  isHidden: z.boolean().optional().default(false),
  planType: z.enum(['individual', 'group']).default('individual'),
  isGroup: z.boolean().optional().default(false),
  maxStudents: z.coerce.number().min(1).optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

export type PlanFormData = z.infer<ReturnType<typeof getPlanSchema>>;