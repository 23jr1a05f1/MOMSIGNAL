
import { z } from 'zod';
import { insertReadingSchema, readings, alerts } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  readings: {
    list: {
      method: 'GET' as const,
      path: '/api/readings',
      input: z.object({
        limit: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof readings.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/readings',
      input: insertReadingSchema,
      responses: {
        201: z.custom<typeof readings.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    stats: {
      method: 'GET' as const,
      path: '/api/readings/stats',
      responses: {
        200: z.object({
          latestReading: z.custom<typeof readings.$inferSelect>().nullable(),
          activeAlerts: z.array(z.custom<typeof alerts.$inferSelect>()),
          dailyAverages: z.object({
            heartRate: z.number(),
            spo2: z.number(),
          }),
        }),
      },
    }
  },
  alerts: {
    list: {
      method: 'GET' as const,
      path: '/api/alerts',
      responses: {
        200: z.array(z.custom<typeof alerts.$inferSelect>()),
      },
    },
    resolve: {
      method: 'PATCH' as const,
      path: '/api/alerts/:id/resolve',
      responses: {
        200: z.custom<typeof alerts.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  }
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type CreateReadingInput = z.infer<typeof api.readings.create.input>;
