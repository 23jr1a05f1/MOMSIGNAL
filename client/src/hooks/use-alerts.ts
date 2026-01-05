import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

async function handleResponse<T>(res: Response, schema: z.ZodSchema<T>): Promise<T> {
  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }
  const data = await res.json();
  return schema.parse(data);
}

// GET /api/alerts - Active alerts list
export function useAlerts() {
  return useQuery({
    queryKey: [api.alerts.list.path],
    queryFn: async () => {
      const res = await fetch(api.alerts.list.path);
      return handleResponse(res, api.alerts.list.responses[200]);
    },
    refetchInterval: 5000,
  });
}

// PATCH /api/alerts/:id/resolve - Resolve an alert
export function useResolveAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.alerts.resolve.path, { id });
      const res = await fetch(url, { method: api.alerts.resolve.method });
      return handleResponse(res, api.alerts.resolve.responses[200]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.alerts.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.readings.stats.path] });
    },
  });
}
