// ─── Match Types ──────────────────────────────────────────────────────────────

import type { Report } from "./report";
import type { PaginationMeta } from "./report";

export interface Match {
    id: string;
    /**
     * Skor kecocokan 0–100
     * Komposisi: lokasi(40) + gender(30) + usia(20) + fisik(10)
     */
    score: number;
    found_report: Report;
    missing_report: Report;
    notified: boolean;
    created_at: string;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface MatchListParams {
    /** Filter match dengan skor minimal (default: 60) */
    min_score?: number;
    page?: number;
    limit?: number;
}

// ─── Response Types ───────────────────────────────────────────────────────────

export interface MatchListResponse {
    success: boolean;
    data: {
        matches: Match[];
        meta: PaginationMeta;
    };
}

export interface MatchDetailResponse {
    success: boolean;
    data: Match;
}