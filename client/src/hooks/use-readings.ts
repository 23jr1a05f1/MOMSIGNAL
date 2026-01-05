import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateReadingInput } from "@shared/routes";
import { z } from "zod";

// Helper to handle API errors safely
async function handleResponse<T>(res: Response, schema: z.ZodSchema<T>): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error: ${res.status} ${text}`);
  }
  const data = await res.json();
  return schema.parse(data);
}

// GET /api/readings/stats - Real-time dashboard data
export function useDashboardStats() {
  return useQuery({
    queryKey: [api.readings.stats.path],
    queryFn: async () => {
      const res = await fetch(api.readings.stats.path);
      return handleResponse(res, api.readings.stats.responses[200]);
    },
    refetchInterval: 3000, // Poll every 3s for live data
  });
}

// GET /api/readings - Historical data
export function useReadingsHistory(limit = 50) {
  return useQuery({
    queryKey: [api.readings.list.path, limit],
    queryFn: async () => {
      const url = `${api.readings.list.path}?limit=${limit}`;
      const res = await fetch(url);
      return handleResponse(res, api.readings.list.responses[200]);
    },
  });
}

// POST /api/readings - Create new reading (simulation)
export function useCreateReading() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateReadingInput) => {
      const validated = api.readings.create.input.parse(data);
      const res = await fetch(api.readings.create.path, {
        method: api.readings.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });
      return handleResponse(res, api.readings.create.responses[201]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.readings.stats.path] });
      queryClient.invalidateQueries({ queryKey: [api.readings.list.path] });
    },
  });
}
