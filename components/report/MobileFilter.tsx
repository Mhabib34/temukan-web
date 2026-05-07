import type {ReportGender, ReportListParams, ReportStatus} from "@/types";
import {X} from "lucide-react";
import {DebouncedSearchInput} from "@/components/fragment/DebouncedSearchInput";

interface MobileFilterDrawerProps {
    open: boolean;
    onClose: () => void;
    params: ReportListParams;
    setParams: (updates: Partial<ReportListParams>) => void;
    clearAll: () => void;
    activeFilterCount: number;
}

export function MobileFilterDrawer({
                                open,
                                onClose,
                                params,
                                setParams,
                                clearAll,
                                activeFilterCount,
                            }: MobileFilterDrawerProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden mb-10">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Drawer */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 rounded-t-3xl bg-white p-5 pb-8 shadow-xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-stone-800">Filter</h2>
                    <button onClick={onClose} className="rounded-full p-1.5 hover:bg-stone-100">
                        <X size={18} className="text-stone-500" />
                    </button>
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                        Status
                    </label>
                    <div className="flex gap-2">
                        {[
                            { value: "active" as ReportStatus, label: "Aktif" },
                            { value: "resolved" as ReportStatus, label: "Selesai" },
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() =>
                                    setParams({
                                        status:
                                            params.status === opt.value ? undefined : opt.value,
                                    })
                                }
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                                    params.status === opt.value
                                        ? "bg-orange-500 text-white"
                                        : "border border-stone-200 text-stone-600"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                        Jenis Kelamin
                    </label>
                    <div className="flex gap-2">
                        {[
                            { value: "male" as ReportGender, label: "Laki-laki" },
                            { value: "female" as ReportGender, label: "Perempuan" },
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() =>
                                    setParams({
                                        gender:
                                            params.gender === opt.value ? undefined : opt.value,
                                    })
                                }
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                                    params.gender === opt.value
                                        ? "bg-orange-500 text-white"
                                        : "border border-stone-200 text-stone-600"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Kota — debounced */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                        Kota
                    </label>
                    <DebouncedSearchInput
                        initialValue={params.city}
                        onCommit={(v) => setParams({ city: v })}
                        placeholder="Cari kota..."
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        iconSize={14}
                    />
                </div>

                <div className="flex gap-2">
                    {activeFilterCount > 0 && (
                        <button
                            onClick={() => {
                                clearAll();
                                onClose();
                            }}
                            className="flex-1 rounded-xl border border-stone-200 py-3 text-sm font-semibold text-stone-600"
                        >
                            Hapus Filter
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white shadow-md shadow-orange-200"
                    >
                        Terapkan
                    </button>
                </div>
            </div>
        </div>
    );
}