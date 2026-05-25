import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : value),
    z
      .url()
      .optional()
      .refine(
        (value) => import.meta.env.DEV || !!value,
        'VITE_API_URL is required in production'
      )
  ),
  VITE_ENABLE_API_MOCK: z.preprocess(
    (value) =>
      typeof value === 'string'
        ? value.trim().toLowerCase() === 'true'
        : Boolean(value),
    z.boolean().default(false)
  ),
  MODE: z.string().optional(),
  DEV: z.boolean().optional(),
  PROD: z.boolean().optional()
});

export type AppEnv = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(import.meta.env);

export const env: AppEnv = parsed.success
  ? parsed.data
  : import.meta.env.DEV
    ? (() => {
        console.warn(parsed.error);
        return {
          VITE_API_URL: undefined,
          VITE_ENABLE_API_MOCK: false,
          MODE: import.meta.env.MODE,
          DEV: import.meta.env.DEV,
          PROD: import.meta.env.PROD
        };
      })()
    : (() => {
        throw parsed.error;
      })();
