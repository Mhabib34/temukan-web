import { api } from "@/lib/axios";
import type {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    UserProfile,
} from "@/types";

// ─── Auth API ─────────────────────────────────────────────────────────────────

export async function register(data: RegisterRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/register", data);
    return res.data;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/login", data);
    return res.data;
}

export async function logout(): Promise<void> {
    await api.post("/auth/logout");
}

export async function refreshToken(): Promise<void> {
    // Untuk web: body kosong, server baca refresh_token dari cookie
    await api.post("/auth/refresh");
}

export async function getMe(): Promise<UserProfile> {
    const res = await api.get<{ success: boolean; data: UserProfile }>("/auth/me");
    return res.data.data;
}