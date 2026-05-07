import {ChevronLeft, ChevronRight} from "lucide-react";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPage: (p: number) => void;
}

export function Pagination({ page, totalPages, onPage }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => onPage(page - 1)}
                disabled={page <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm transition-colors hover:bg-stone-50 disabled:opacity-40"
            >
                <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                }, [])
                .map((p, idx) =>
                    p === "..." ? (
                        <span key={`ellipsis-${idx}`} className="px-1 text-sm text-stone-400">
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPage(p as number)}
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                                p === page
                                    ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
                                    : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}

            <button
                onClick={() => onPage(page + 1)}
                disabled={page >= totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm transition-colors hover:bg-stone-50 disabled:opacity-40"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}
