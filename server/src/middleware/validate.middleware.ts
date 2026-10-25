import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10) || 1) : 1)),
  perPage: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(50, Math.max(1, parseInt(val, 10) || 10)) : 10)),
});

export const animeIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Anime ID must be a positive integer")
    .transform((val) => parseInt(val, 10)),
});

export interface ValidatedRequest<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function validateParams<T>(
  schema: z.ZodSchema<T>,
  params: unknown
): ValidatedRequest<T> {
  const result = schema.safeParse(params);
  if (!result.success) {
    const errorMsg = result.error.issues.map((i) => i.message).join(", ");
    return { success: false, error: errorMsg };
  }
  return { success: true, data: result.data };
}
