import { api } from "@/lib/axios";
import type {
    CreateReportRequest,
    PhotoUploadResponse,
    ReportDetailResponse,
    ReportListParams,
    ReportListResponse,
    UpdateReportRequest,
} from "@/types";

// ─── Report API ───────────────────────────────────────────────────────────────

export async function getLaporanList(params?: ReportListParams): Promise<ReportListResponse> {
    const res = await api.get<ReportListResponse>("/reports", { params });
    return res.data;
}

export async function getMyLaporan(params?: Pick<ReportListParams, "page" | "limit">): Promise<ReportListResponse> {
    const res = await api.get<ReportListResponse>("/reports/my", { params });
    return res.data;
}

export async function getLaporanDetail(id: string): Promise<ReportDetailResponse> {
    const res = await api.get<ReportDetailResponse>(`/reports/${id}`);
    return res.data;
}

export async function createLaporan(data: CreateReportRequest): Promise<ReportDetailResponse> {
    const res = await api.post<ReportDetailResponse>("/reports", data);
    return res.data;
}

export async function updateLaporan(
    id: string,
    data: UpdateReportRequest
): Promise<ReportDetailResponse> {
    const res = await api.put<ReportDetailResponse>(`/reports/${id}`, data);
    return res.data;
}

export async function deleteLaporan(id: string): Promise<void> {
    await api.delete(`/reports/${id}`);
}

export async function uploadFotoLaporan(
    id: string,
    file: File
): Promise<PhotoUploadResponse> {
    const formData = new FormData();
    formData.append("photo", file);

    const res = await api.post<PhotoUploadResponse>(`/reports/${id}/photo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}