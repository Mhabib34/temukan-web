import {formatDistanceToNow} from "date-fns";
import {id as localeId} from "date-fns/locale/id";
import Link from "next/link";
import {User} from "lucide-react";
import {Report} from "@/types";

export function RelatedReportCard({ laporan }: { laporan: Report }) {
    const isMissing = laporan.type === "missing";
    const waktuLabel = formatDistanceToNow(new Date(laporan.created_at), {
        addSuffix: true,
        locale: localeId,
    });

    return (
        <Link
            href={`/report/${laporan.id}`}
            className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-stone-50"
        >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                {laporan.photo_url ? (
                    <img
                        src={laporan.photo_url}
                        alt={laporan.name ?? "Foto"}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <User className="h-6 w-6 text-stone-300" />
                    </div>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                    {laporan.city}
                </p>
                <p className="truncate text-sm font-semibold text-stone-800">
                    {laporan.name ?? "Nama tidak diketahui"}
                </p>
                <p className="text-xs text-stone-400">
                    {isMissing ? "Hilang" : "Ditemukan"} {waktuLabel}
                </p>
            </div>
        </Link>
    );
}