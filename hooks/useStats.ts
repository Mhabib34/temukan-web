import { useQuery } from "@tanstack/react-query";
import { fetchStats } from "@/api/stats";
import { queryKeys } from "@/lib/queryClient";

export function useStats() {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 5,
  });
}
