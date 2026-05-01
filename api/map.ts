import { api } from "@/lib/axios";
import type { MapPinsParams, MapPinsResponse } from "@/types";

// ─── Map API ──────────────────────────────────────────────────────────────────

export async function getMapPins(params?: MapPinsParams): Promise<MapPinsResponse> {
    const res = await api.get<MapPinsResponse>("/map/pins", { params });
    return res.data;
}