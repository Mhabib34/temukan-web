import type {ReportGender, ReportListParams, ReportStatus, ReportType} from "@/types";
import {X} from "lucide-react";
import React from "react";
import {DebouncedSearchInput} from "@/components/fragment/DebouncedSearchInput";

interface SidebarFilterProps {
    params: ReportListParams;
    setParams: (updates: Partial<ReportListParams>) => void;
    clearAll: () => void;
    activeFilterCount: number;
}

export function SidebarFilter({ params, setParams, clearAll, activeFilterCount }: SidebarFilterProps) {
    return (
        <aside className="hidden lg:flex w-72 shrink-0 flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm self-start sticky top-6">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-stone-800">Filter Pencarian</h2>
                {activeFilterCount > 0 && (
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-1 text-xs text-stone-400 hover:text-red-500 transition-colors"
                    >
                        <X size={12} />
                        Hapus semua
                    </button>
                )}
            </div>

            {/* Nama / Deskripsi — debounced (q) */}
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    Nama atau Deskripsi
                </label>
                <DebouncedSearchInput
                    initialValue={params.q}
                    onCommit={(v) => setParams({ q: v })}
                    placeholder="Cari nama, ciri-ciri..."
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-9 pr-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    iconSize={14}
                />
            </div>

            {/* Kota — debounced (city) */}
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    Kota
                </label>
                <DebouncedSearchInput
                    initialValue={params.city}
                    onCommit={(v) => setParams({ city: v })}
                    placeholder="Contoh: Medan, Surabaya..."
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-9 pr-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    iconSize={14}
                />
            </div>

            {/* Tipe Laporan */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    Tipe Laporan
                </label>
                <div className="space-y-2">
                    {[
                        { value: "missing", label: "Orang Hilang", icon: "🔍" },
                        { value: "found", label: "Temuan Identitas", icon: "👆" },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() =>
                                setParams({
                                    type:
                                        params.type === opt.value
                                            ? undefined
                                            : (opt.value as ReportType),
                                })
                            }
                            className={`w-full flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                                params.type === opt.value
                                    ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                                    : "border border-stone-200 text-stone-600 hover:border-orange-200 hover:bg-orange-50"
                            }`}
                        >
                            <span>{opt.icon}</span>
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    Status
                </label>
                <div className="flex gap-2 flex-wrap">
                    {[
                        { value: "active", label: "Aktif" },
                        { value: "resolved", label: "Selesai" },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() =>
                                setParams({
                                    status:
                                        params.status === opt.value
                                            ? undefined
                                            : (opt.value as ReportStatus),
                                })
                            }
                            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                                params.status === opt.value
                                    ? "bg-orange-500 text-white"
                                    : "border border-stone-200 text-stone-600 hover:border-orange-300"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Jenis Kelamin */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    Jenis Kelamin
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { value: "male", label: "Pria", icon: "♂" },
                        { value: "female", label: "Wanita", icon: "♀" },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() =>
                                setParams({
                                    gender:
                                        params.gender === opt.value
                                            ? undefined
                                            : (opt.value as ReportGender),
                                })
                            }
                            className={`flex flex-col items-center gap-1 rounded-xl border py-3 text-sm font-medium transition-all ${
                                params.gender === opt.value
                                    ? "border-orange-400 bg-orange-50 text-orange-600"
                                    : "border-stone-200 text-stone-500 hover:border-orange-200"
                            }`}
                        >
                            <span className="text-lg">{opt.icon}</span>
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeFilterCount > 0 && (
                <button
                    onClick={clearAll}
                    className="w-full rounded-xl bg-stone-900 py-3 text-sm font-bold text-white transition hover:bg-stone-700"
                >
                    Hapus Filter
                </button>
            )}
        </aside>
    );
}