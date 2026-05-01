import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifikasi, markAllNotifRead, markNotifRead } from "@/api";
import { queryKeys } from "@/lib/queryClient";
import type { NotificationListParams } from "@/types";

// ─── useNotifikasi ────────────────────────────────────────────────────────────
// Polling tiap 30 detik untuk cek notif baru dari matching worker Go.
// refetchIntervalInBackground: false — polling berhenti saat tab tidak aktif.

export function useNotifikasi(params?: NotificationListParams) {
    return useQuery({
        queryKey: queryKeys.notifikasi.list(params as Record<string, unknown>),
        queryFn: () => getNotifikasi(params),
        refetchInterval: 1000 * 30,
        refetchIntervalInBackground: false,
    });
}

// ─── useUnreadCount ───────────────────────────────────────────────────────────
// Helper khusus untuk badge di Navbar — hanya ambil unread_count.
// Pakai query yang sama supaya tidak double fetch.

export function useUnreadCount() {
    const { data } = useNotifikasi();
    return data?.data.unread_count ?? 0;
}

// ─── useMarkNotifRead ─────────────────────────────────────────────────────────

export function useMarkNotifRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => markNotifRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifikasi"] });
        },
    });
}

// ─── useMarkAllNotifRead ──────────────────────────────────────────────────────

export function useMarkAllNotifRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAllNotifRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifikasi"] });
        },
    });
}