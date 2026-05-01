// ─── Auth Types ───────────────────────────────────────────────────────────────

export type UserRole = "finder" | "seeker" | "volunteer";

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone: string | null;
    created_at: string;
}

export interface TokenPair {
    access_token: string;
    refresh_token: string;
    /** Detik sampai access_token expired */
    expires_in: number;
}

// ─── Request Types ────────────────────────────────────────────────────────────

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RefreshRequest {
    refresh_token: string;
}

// ─── Response Types ───────────────────────────────────────────────────────────

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: UserProfile;
        /** Hanya ada jika X-Client-Type = mobile */
        tokens?: TokenPair;
    };
}