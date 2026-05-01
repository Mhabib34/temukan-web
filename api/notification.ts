import { api } from "@/lib/axios";
import type { ApiSuccessResponse, NotificationListParams, NotificationListResponse } from "@/types";

// ─── Notification API ─────────────────────────────────────────────────────────

export async function getNotifikasi(
    params?: NotificationListParams
): Promise<NotificationListResponse> {
    const res = await api.get<NotificationListResponse>("/notifications", { params });
    return res.data;
}

export async function markNotifRead(id: string): Promise<void> {
    await api.patch<ApiSuccessResponse>(`/notifications/${id}/read`);
}

export async function markAllNotifRead(): Promise<void> {
    await api.patch<ApiSuccessResponse>("/notifications/read-all");
}