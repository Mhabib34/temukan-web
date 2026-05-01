// ─── Notification Types ───────────────────────────────────────────────────────

import type { PaginationMeta } from "./report";

export interface Notification {
    id: string;
    message: string;
    is_read: boolean;
    /** UUID laporan terkait (nullable) */
    report_id: string | null;
    /** UUID match terkait (nullable) */
    match_id: string | null;
    created_at: string;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface NotificationListParams {
    /** Filter sudah/belum dibaca */
    is_read?: boolean;
    page?: number;
    limit?: number;
}

// ─── Response Types ───────────────────────────────────────────────────────────

export interface NotificationListResponse {
    success: boolean;
    data: {
        notifications: Notification[];
        /** Jumlah notifikasi belum dibaca — dipakai untuk badge di navbar */
        unread_count: number;
        meta: PaginationMeta;
    };
}