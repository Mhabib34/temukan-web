// ─── Report Types ─────────────────────────────────────────────────────────────

import type { UserProfile } from "./auth";

export type ReportType = "found" | "missing";
export type ReportGender = "male" | "female" | "unknown";
export type ReportStatus = "active" | "resolved";

export interface Report {
    id: string;
    reporter_id: string;
    reporter: UserProfile;
    type: ReportType;
    name: string | null;
    gender: ReportGender;
    estimated_age: number | null;
    photo_url: string | null;
    description: string;
    last_seen_location: string;
    city: string;
    province: string;
    latitude: number | null;
    longitude: number | null;
    status: ReportStatus;
    /** URL siap pakai untuk share ke WhatsApp */
    whatsapp_share_url: string;
    created_at: string;
    updated_at: string;
}

// ─── Request Types ────────────────────────────────────────────────────────────

export interface CreateReportRequest {
    type: ReportType;
    name?: string | null;
    gender: ReportGender;
    estimated_age: number;
    description: string;
    last_seen_location: string;
    city: string;
    province: string;
    latitude?: number | null;
    longitude?: number | null;
}

export interface UpdateReportRequest {
    name?: string | null;
    gender?: ReportGender;
    estimated_age?: number;
    description?: string;
    last_seen_location?: string;
    city?: string;
    province?: string;
    latitude?: number | null;
    longitude?: number | null;
    status?: ReportStatus;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface ReportListParams {
    type?: ReportType;
    status?: ReportStatus;
    city?: string;
    province?: string;
    gender?: ReportGender;
    age_min?: number;
    age_max?: number;
    /** Full-text search di deskripsi & nama */
    q?: string;
    page?: number;
    limit?: number;
}

// ─── Response Types ───────────────────────────────────────────────────────────

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface ReportListResponse {
    success: boolean;
    data: {
        reports: Report[];
        meta: PaginationMeta;
    };
}

export interface ReportDetailResponse {
    success: boolean;
    data: Report;
}

export interface PhotoUploadResponse {
    success: boolean;
    message: string;
    data: {
        photo_url: string;
    };
}