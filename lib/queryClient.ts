import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

// ─── Query Client ─────────────────────────────────────────────────────────────

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache 5 menit, fresh 1 menit
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,

      // Retry sekali saja, kecuali 401/403/404 — tidak perlu retry
      retry: (failureCount, error) => {
        if (error instanceof AxiosError) {
          const status = error.response?.status;
          if (status === 401 || status === 403 || status === 404) return false;
        }
        return failureCount < 1;
      },

      // Refetch saat window focus (baik untuk data laporan yang sering berubah)
      refetchOnWindowFocus: true,
    },
    mutations: {
      // Jangan retry mutation secara otomatis
      retry: false,
    },
  },
});

// ─── Query Keys ───────────────────────────────────────────────────────────────
// Sentralisasi semua query keys di sini agar mudah di-invalidate.

export const queryKeys = {
  // Auth
  me: ["me"] as const,

  // Laporan
  laporan: {
    all: ["laporan"] as const,
    list: (params?: Record<string, unknown>) =>
      ["laporan", "list", params] as const,
    detail: (id: string) => ["laporan", "detail", id] as const,
    mine: (params?: Record<string, unknown>) =>
      ["laporan", "mine", params] as const,
  },

  // Map
  map: {
    pins: (params?: Record<string, unknown>) =>
      ["map", "pins", params] as const,
  },

  // Match
  match: {
    list: (params?: Record<string, unknown>) =>
      ["match", "list", params] as const,
    detail: (id: string) => ["match", "detail", id] as const,
  },

  // Notifikasi
  notifikasi: {
    list: (params?: Record<string, unknown>) =>
      ["notifikasi", "list", params] as const,
  },

  stats: ["stats"] as const,
} as const;
