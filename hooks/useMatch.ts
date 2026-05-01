import { useQuery } from "@tanstack/react-query";
import { getMatchDetail, getMatchList } from "@/api";
import { queryKeys } from "@/lib/queryClient";
import type { MatchListParams } from "@/types";

// ─── useMatchList ─────────────────────────────────────────────────────────────
// Dipakai di /match — list hasil matching milik user, diurutkan skor tertinggi.

export function useMatchList(params?: MatchListParams) {
    return useQuery({
        queryKey: queryKeys.match.list(params as Record<string, unknown>),
        queryFn: () => getMatchList(params),
    });
}

// ─── useMatchDetail ───────────────────────────────────────────────────────────
// Dipakai di /match/[id] jika ada halaman detail match.

export function useMatchDetail(id: string) {
    return useQuery({
        queryKey: queryKeys.match.detail(id),
        queryFn: () => getMatchDetail(id),
        enabled: !!id,
    });
}