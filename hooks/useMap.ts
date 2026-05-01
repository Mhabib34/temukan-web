import { useQuery } from "@tanstack/react-query";
import { getMapPins } from "@/api";
import { queryKeys } from "@/lib/queryClient";
import type { MapPinsParams } from "@/types";

// ─── useMapPins ───────────────────────────────────────────────────────────────
// Dipakai di /peta — ambil semua pin laporan aktif untuk Leaflet.
// staleTime pendek karena data peta cukup dinamis.

export function useMapPins(params?: MapPinsParams) {
    return useQuery({
        queryKey: queryKeys.map.pins(params as Record<string, unknown>),
        queryFn: () => getMapPins(params),
        staleTime: 1000 * 30, // 30 detik
    });
}