import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ReportGender, ReportStatus, ReportType, UserRole } from "@/types";

// ─── Tailwind Class Merger ────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ─── Date Formatting ──────────────────────────────────────────────────────────

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

const relativeFormatter = new Intl.RelativeTimeFormat("id-ID", {
    numeric: "auto",
});

export function formatDate(isoString: string): string {
    return dateFormatter.format(new Date(isoString));
}

export function formatDateTime(isoString: string): string {
    return dateTimeFormatter.format(new Date(isoString));
}

/** Contoh output: "3 hari yang lalu", "baru saja" */
export function formatRelative(isoString: string): string {
    const diff = (new Date(isoString).getTime() - Date.now()) / 1000; // detik, negatif = masa lalu

    const thresholds: [number, Intl.RelativeTimeFormatUnit][] = [
        [60, "seconds"],
        [3600, "minutes"],
        [86400, "hours"],
        [604800, "days"],
        [2592000, "weeks"],
        [31536000, "months"],
    ];

    for (const [limit, unit] of thresholds) {
        if (Math.abs(diff) < limit) {
            const divisor = limit / (thresholds[thresholds.indexOf([limit, unit]) - 1]?.[0] ?? 1);
            return relativeFormatter.format(Math.round(diff / (limit / divisor)), unit);
        }
    }

    return relativeFormatter.format(Math.round(diff / 2592000), "months");
}

// ─── Label Helpers ────────────────────────────────────────────────────────────

export const REPORT_TYPE_LABEL: Record<ReportType, string> = {
    found: "Ditemukan",
    missing: "Hilang",
};

export const REPORT_GENDER_LABEL: Record<ReportGender, string> = {
    male: "Laki-laki",
    female: "Perempuan",
    unknown: "Tidak diketahui",
};

export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
    active: "Aktif",
    resolved: "Selesai",
};

export const USER_ROLE_LABEL: Record<UserRole, string> = {
    finder: "Penemu",
    seeker: "Pencari",
    volunteer: "Relawan / NGO",
};

// ─── Age Formatting ───────────────────────────────────────────────────────────

export function formatAge(age: number | null): string {
    if (age === null) return "Tidak diketahui";
    return `±${age} tahun`;
}

// ─── Score Color ──────────────────────────────────────────────────────────────
// Dipakai di ScoreBar component untuk warna sesuai tingkat kecocokan.

export function getScoreColor(score: number): string {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-500";
}

export function getScoreBgColor(score: number): string {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
}

export function getScoreLabel(score: number): string {
    if (score >= 80) return "Sangat cocok";
    if (score >= 60) return "Kemungkinan cocok";
    return "Cocok lemah";
}

// ─── URL Helpers ──────────────────────────────────────────────────────────────

/** Buat query string dari object, skip undefined/null */
export function toQueryString(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.set(key, String(value));
        }
    }
    const qs = searchParams.toString();
    return qs ? `?${qs}` : "";
}