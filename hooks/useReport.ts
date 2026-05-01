import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
    createLaporan,
    deleteLaporan,
    getLaporanDetail,
    getLaporanList,
    getMyLaporan,
    updateLaporan,
    uploadFotoLaporan,
} from "@/api";
import { queryKeys } from "@/lib/queryClient";
import type { CreateReportRequest, ReportListParams, UpdateReportRequest } from "@/types";

// ─── useLaporanList ───────────────────────────────────────────────────────────
// Dipakai di /laporan — list publik dengan filter & pagination.

export function useLaporanList(params?: ReportListParams) {
    return useQuery({
        queryKey: queryKeys.laporan.list(params as Record<string, unknown>),
        queryFn: () => getLaporanList(params),
    });
}

// ─── useMyLaporan ─────────────────────────────────────────────────────────────
// Dipakai di /laporan/saya — laporan milik user yang login.

export function useMyLaporan(params?: Pick<ReportListParams, "page" | "limit">) {
    return useQuery({
        queryKey: queryKeys.laporan.mine(params as Record<string, unknown>),
        queryFn: () => getMyLaporan(params),
    });
}

// ─── useLaporanDetail ─────────────────────────────────────────────────────────
// Dipakai di /laporan/[id].

export function useLaporanDetail(id: string) {
    return useQuery({
        queryKey: queryKeys.laporan.detail(id),
        queryFn: () => getLaporanDetail(id),
        enabled: !!id,
    });
}

// ─── useCreateLaporan ─────────────────────────────────────────────────────────

export function useCreateLaporan() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (data: CreateReportRequest) => createLaporan(data),
        onSuccess: (res) => {
            // Invalidate list & mine supaya langsung muncul di dashboard
            queryClient.invalidateQueries({ queryKey: queryKeys.laporan.all });
            router.push(`/laporan/${res.data.id}`);
        },
    });
}

// ─── useUpdateLaporan ─────────────────────────────────────────────────────────

export function useUpdateLaporan(id: string) {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (data: UpdateReportRequest) => updateLaporan(id, data),
        onSuccess: () => {
            // Invalidate detail & list
            queryClient.invalidateQueries({ queryKey: queryKeys.laporan.detail(id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.laporan.all });
            router.push(`/laporan/${id}`);
        },
    });
}

// ─── useDeleteLaporan ─────────────────────────────────────────────────────────

export function useDeleteLaporan() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (id: string) => deleteLaporan(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.laporan.all });
            router.push("/laporan/saya");
        },
    });
}

// ─── useUploadFoto ────────────────────────────────────────────────────────────

export function useUploadFoto(reportId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) => uploadFotoLaporan(reportId, file),
        onSuccess: () => {
            // Refresh detail laporan supaya photo_url terupdate
            queryClient.invalidateQueries({
                queryKey: queryKeys.laporan.detail(reportId),
            });
        },
    });
}