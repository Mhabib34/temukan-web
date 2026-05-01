import { api } from "@/lib/axios";
import type { MatchDetailResponse, MatchListParams, MatchListResponse } from "@/types";

// ─── Match API ────────────────────────────────────────────────────────────────

export async function getMatchList(params?: MatchListParams): Promise<MatchListResponse> {
    const res = await api.get<MatchListResponse>("/matches", { params });
    return res.data;
}

export async function getMatchDetail(id: string): Promise<MatchDetailResponse> {
    const res = await api.get<MatchDetailResponse>(`/matches/${id}`);
    return res.data;
}