import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getMe, login, logout, register } from "@/api";
import { queryKeys } from "@/lib/queryClient";
import { useAuthStore } from "@/store";
import type { LoginRequest, RegisterRequest } from "@/types";

// ─── useMe ────────────────────────────────────────────────────────────────────
// Ambil profil user yang sedang login.
// Dipakai di Navbar untuk cek status login & tampilkan nama user.

export function useMe() {
    const { setUser, clearUser } = useAuthStore();

    return useQuery({
        queryKey: queryKeys.me,
        queryFn: async () => {
            const user = await getMe();
            setUser(user); // sync ke Zustand
            return user;
        },
        // Jangan refetch agresif — data user jarang berubah
        staleTime: 1000 * 60 * 5,
        retry: false,
        // Kalau 401, kosongkan store
        throwOnError: false,
    });
}

// ─── useLogin ─────────────────────────────────────────────────────────────────

export function useLogin() {
    const { setUser } = useAuthStore();
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (data: LoginRequest) => login(data),
        onSuccess: (res) => {
            setUser(res.data.user);
            queryClient.setQueryData(queryKeys.me, res.data.user);
            router.push("/laporan/saya");
        },
    });
}

// ─── useRegister ──────────────────────────────────────────────────────────────

export function useRegister() {
    const { setUser } = useAuthStore();
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (data: RegisterRequest) => register(data),
        onSuccess: (res) => {
            setUser(res.data.user);
            queryClient.setQueryData(queryKeys.me, res.data.user);
            router.push("/laporan/saya");
        },
    });
}

// ─── useLogout ────────────────────────────────────────────────────────────────

export function useLogout() {
    const { clearUser } = useAuthStore();
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            clearUser();
            queryClient.clear(); // hapus semua cache
            router.push("/masuk");
        },
        // Tetap clear state lokal meski API gagal
        onError: () => {
            clearUser();
            queryClient.clear();
            router.push("/masuk");
        },
    });
}