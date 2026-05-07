import {useEffect, useRef, useState} from "react";
import {useAuthStore} from "@/store";
import {useLogout} from "@/hooks";
import Link from "next/link";
import {FileText, LogOut, User} from "lucide-react";
import {showConfirm} from "@/lib/sonner";

export function AvatarDropdown() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const user = useAuthStore((s) => s.user);
    const { mutate: logout, isPending } = useLogout();

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const initial = user?.name?.charAt(0).toUpperCase() ?? "T";

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600 hover:bg-orange-200 transition-colors"
            >
                {initial}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-stone-200 bg-white shadow-xl shadow-stone-100 overflow-hidden z-50">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-stone-100">
                        <p className="text-sm font-semibold text-stone-800 truncate">{user?.name}</p>
                        <p className="text-xs text-stone-400 truncate">{user?.email}</p>
                    </div>

                    <div className="p-1.5">
                        <Link href="/profile" onClick={() => setOpen(false)}
                              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 transition-colors">
                            <User size={15} /> Profil Saya
                        </Link>
                        <Link href="/report/me" onClick={() => setOpen(false)}
                              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 transition-colors">
                            <FileText size={15} /> Laporan Saya
                        </Link>
                    </div>

                    <div className="border-t border-stone-100 p-1.5">
                        <button
                            onClick={() => {
                                setOpen(false);
                                showConfirm(
                                    "Anda yakin ingin keluar?",
                                    "",
                                    logout,
                                    "Keluar"
                                );
                            }}
                            disabled={isPending}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                            <LogOut size={15} />
                            {isPending ? "Keluar..." : "Keluar"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}