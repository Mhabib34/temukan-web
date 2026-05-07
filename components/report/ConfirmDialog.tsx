import {CheckCheck, Trash2} from "lucide-react";

type DialogType = "delete" | "resolve";
export function ConfirmDialog({
                                  type,
                                  onConfirm,
                                  onCancel,
                                  isLoading,
                              }: {
    type: DialogType;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
}) {
    const isDelete = type === "delete";
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <div
                    className={[
                        "mb-4 flex h-12 w-12 items-center justify-center rounded-full",
                        isDelete ? "bg-red-100" : "bg-green-100",
                    ].join(" ")}
                >
                    {isDelete ? (
                        <Trash2 className="h-5 w-5 text-red-600" />
                    ) : (
                        <CheckCheck className="h-5 w-5 text-green-600" />
                    )}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-stone-900">
                    {isDelete ? "Hapus Laporan?" : "Tandai Selesai?"}
                </h3>
                <p className="mb-6 text-sm text-stone-500">
                    {isDelete
                        ? "Tindakan ini tidak dapat dibatalkan. Laporan beserta foto akan dihapus permanen."
                        : "Laporan akan ditandai sebagai sudah ditemukan dan tidak akan muncul di pencarian aktif."}
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 rounded-xl border border-stone-200 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={[
                            "flex-1 rounded-xl py-2.5 text-sm font-medium text-white transition disabled:opacity-60",
                            isDelete
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700",
                        ].join(" ")}
                    >
                        {isLoading
                            ? isDelete
                                ? "Menghapus..."
                                : "Menyimpan..."
                            : isDelete
                                ? "Ya, Hapus"
                                : "Ya, Tandai Selesai"}
                    </button>
                </div>
            </div>
        </div>
    );
}