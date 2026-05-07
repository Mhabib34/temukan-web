import type {Report} from "@/types";
import {useState} from "react";
import {useDeleteLaporan, useUpdateLaporan} from "@/hooks";
import {toast} from "sonner";
import {ReportCard} from "@/components/card/ReportCard";
import Link from "next/link";
import {CheckCircle2, Edit2, Trash2} from "lucide-react";
import {ConfirmDialog} from "@/components/report/ConfirmDialog";

type DialogType = "delete" | "resolve";
export function ReportActionCard({ laporan }: { laporan: Report }) {
    const [dialog, setDialog] = useState<DialogType | null>(null);
    const deleteMutation = useDeleteLaporan();
    const updateMutation = useUpdateLaporan(laporan.id);
    const isResolved = laporan.status === "resolved";

    function handleDelete() {
        deleteMutation.mutate(laporan.id, {
            onSuccess: () => {
                setDialog(null);
                toast.success("Laporan berhasil dihapus");
            },
            onError: (err: unknown) => {
                const msg =
                    (err as { response?: { data?: { message?: string } } })?.response?.data
                        ?.message ?? (err as Error).message;
                toast.error(msg ?? "Gagal menghapus laporan");
                setDialog(null);
            },
        });
    }

    function handleResolve() {
        updateMutation.mutate(
            { status: "resolved" },
            {
                onSuccess: () => {
                    setDialog(null);
                    toast.success("Laporan ditandai selesai");
                },
                onError: (err: unknown) => {
                    const msg =
                        (err as { response?: { data?: { message?: string } } })?.response?.data
                            ?.message ?? (err as Error).message;
                    toast.error(msg ?? "Gagal memperbarui laporan");
                    setDialog(null);
                },
            }
        );
    }

    const isDialogLoading = deleteMutation.isPending || updateMutation.isPending;

    return (
        <>
            <div className="flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition hover:shadow-md">
                {/* Reuse LaporanCard tanpa wrapper card-nya sendiri */}
                <div className="flex-1">
                    <ReportCard laporan={laporan} />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 border-t border-stone-100 px-3 py-2.5">
                    {/* Edit */}
                    <Link
                        href={`/report/${laporan.id}/edit`}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200 py-2 text-xs font-medium text-stone-600 transition hover:border-orange-300 hover:text-orange-600"
                    >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                    </Link>

                    {/* Tandai Selesai — hanya tampil kalau masih active */}
                    {!isResolved && (
                        <button
                            onClick={() => setDialog("resolve")}
                            disabled={isDialogLoading}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-green-100 py-2 text-xs font-medium text-green-600 transition hover:border-green-200 hover:bg-green-50 disabled:opacity-50"
                        >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Selesai</span>
                        </button>
                    )}

                    {/* Hapus */}
                    <button
                        onClick={() => setDialog("delete")}
                        disabled={isDialogLoading}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-100 py-2 text-xs font-medium text-red-500 transition hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Hapus</span>
                    </button>
                </div>
            </div>

            {dialog && (
                <ConfirmDialog
                    type={dialog}
                    onConfirm={dialog === "delete" ? handleDelete : handleResolve}
                    onCancel={() => setDialog(null)}
                    isLoading={isDialogLoading}
                />
            )}
        </>
    );
}
