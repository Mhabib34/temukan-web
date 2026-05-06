"use client";

import { useState, useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useAuthStore } from "@/store";
import { getMe } from "@/api/auth";

// ─── QueryClient Factory ──────────────────────────────────────────────────────
// Dibuat per-render (bukan singleton) agar tidak ada state leak antar request
// saat SSR. Di client, useState menjamin hanya satu instance per session.

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Tidak refetch saat window focus — UX mobile lebih nyaman
                refetchOnWindowFocus: false,
                // Retry sekali saja saat error (hemat bandwidth mobile)
                retry: 1,
                // Data dianggap fresh selama 1 menit
                staleTime: 60 * 1000,
            },
        },
    });
}

// ─── Auth Hydration ───────────────────────────────────────────────────────────
// Saat app pertama load:
// - Zustand persist sudah rehidrasi user dari localStorage
// - Tapi kita perlu verifikasi ke backend apakah cookie masih valid
// - Kalau valid → update store; kalau invalid → clear store
//
// Ini dilakukan sekali saja di mount (bukan setiap render).

// providers.tsx
function AuthHydrator() {
    const { setUser, clearUser, setHydrated } = useAuthStore();
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        // Langsung cek ke backend — jangan lihat flag localStorage
        // Cookie httpOnly yang jadi sumber kebenaran, bukan isLoggedIn
        getMe()
            .then((user) => setUser(user))
            .catch(() => clearUser()) // cookie expired/tidak ada → clear
            .finally(() => setHydrated(true)); // UI boleh render sekarang
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return null;
}
// ─── Providers ────────────────────────────────────────────────────────────────

interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    const [queryClient] = useState(() => makeQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {/* Verifikasi sesi user saat app load */}
            <AuthHydrator />

            {/* Toast notifikasi — posisi bottom-center untuk mobile */}
            <Toaster
                position="top-right"
                toastOptions={{
                    classNames: {
                        toast: "font-sans text-sm",
                    },
                }}
                richColors
            />

            {children}
        </QueryClientProvider>
    );
}