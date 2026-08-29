import { z } from "zod";

type TFunc = (key: string, options?: any) => string;

export const getPlanSchema = (t: TFunc) => z.object({
  name: z.string().min(1, t("validation.required")),
  nameEn: z.string().min(1, t("validation.required")),
  description: z.string().optional().default(''),
  price: z.coerce.number().min(0, t("validation.required")),
  currencyId: z.string().min(1, t("validation.required")),
  duration: z.coerce.number().min(1, t("validation.min", { count: 1 })),
  sessionsCount: z.coerce.number().min(0),
  sessionTime: z.coerce.number().min(1, t("validation.required")),
  features: z.array(z.string()).optional().default([]),
  isPopular: z.boolean(),
  isHidden: z.boolean().optional().default(false),
  status: z.enum(['active', 'inactive']),
  planType: z.enum(['individual', 'group']).default('individual'),
  maxStudents: z.coerce.number().optional().default(0),
}).refine((data) => {
  if (data.planType === 'group') {
    return data.maxStudents !== undefined && Number(data.maxStudents) >= 0;
  }
  return true;
}, {
  message: t("validation.min", { count: 0 }) || "Must be greater than or equal to 0",
  path: ["maxStudents"]
});

export type PlanFormData = z.infer<ReturnType<typeof getPlanSchema>>;