// ─── Map Types ────────────────────────────────────────────────────────────────

import type { ReportGender, ReportType } from "./report";

/** Data minimal untuk render pin di peta (performa lebih ringan) */
export interface MapPin {
    id: string;
    type: ReportType;
    gender: ReportGender;
    estimated_age: number | null;
    city: string;
    latitude: number;
    longitude: number;
    photo_url: string | null;
    created_at: string;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface MapPinsParams {
    type?: ReportType;
    /** Format: lat_min,lng_min,lat_max,lng_max  contoh: "3.4,98.5,3.7,98.8" */
    bounds?: string;
}

// ─── Response Types ───────────────────────────────────────────────────────────

export interface MapPinsResponse {
    success: boolean;
    data: {
        pins: MapPin[];
        total: number;
    };
}