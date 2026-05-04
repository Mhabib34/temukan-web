"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Search, BookOpen, Users, Clock, Settings, Bell, LogOut, User, FileText } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUnreadCount } from "@/hooks";
import { useLogout } from "@/hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import {showConfirm} from "@/lib/sonner";

const SIDEBAR_LINKS = [
    { icon: Home, href: "/", label: "Beranda" },
    { icon: Search, href: "/report", label: "Cari Laporan" },
    { icon: BookOpen, href: "/map", label: "Peta" },
    { icon: Users, href: "/match", label: "Match", protected: true },
    { icon: Clock, href: "/report/me", label: "Riwayat", protected: true },
];

// ─── Avatar Dropdown ──────────────────────────────────────────────────────────
function AvatarDropdown() {
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
                            )}}
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

// ─── Navbar ───────────────────────────────────────────────────────────────────
export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const unreadCount = useUnreadCount();

    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
        return null;
    }

    return (
        <>
            {/* ── Desktop: Sidebar kiri + Topbar ── */}
            <div className="hidden md:block">
                {/* Sidebar */}
                <aside className="fixed left-0 top-0 h-full w-16 bg-white border-r border-stone-100 flex flex-col items-center py-5 z-50 shadow-sm">
                    {/* Logo */}
                    <Link href="/" className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center mb-8 shadow-md shadow-orange-200 flex-shrink-0">
                        <span className="text-white font-extrabold text-lg leading-none">T</span>
                    </Link>

                    {/* Nav icons */}
                    <nav className="flex flex-col items-center gap-1 flex-1">
                        {SIDEBAR_LINKS.filter(l => !l.protected || isLoggedIn).map((link) => {
                            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                            const Icon = link.icon;
                            return (
                                <Link key={link.href} href={link.href} title={link.label}
                                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative
                                        ${isActive ? "bg-orange-50 text-orange-500" : "text-stone-400 hover:bg-stone-50 hover:text-stone-700"}`}>
                                    {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-1 h-5 bg-orange-500 rounded-r-full" />}
                                    <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                                    <span className="absolute left-14 bg-stone-800 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                                        {link.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Settings bottom */}
                    {isLoggedIn && (
                        <Link href="/profile" title="Pengaturan"
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-400 hover:bg-stone-50 hover:text-stone-700 transition-all">
                            <Settings size={18} strokeWidth={1.8} />
                        </Link>
                    )}
                </aside>

                {/* Topbar */}
                <header className="fixed top-0 left-16 right-0 h-14 bg-white/90 backdrop-blur-md border-b border-stone-100 flex items-center justify-between px-6 z-40">
                    <Link href="/" className="font-bold text-base tracking-tight text-stone-900">
                        Temu<span className="text-orange-500">Kan</span>
                    </Link>

                    {/* Search */}
                    <div className="flex-1 max-w-xs mx-6">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                            <input type="text" placeholder="Cari laporan..."
                                   className="w-full h-8 pl-8 pr-3 rounded-full bg-stone-100 text-sm text-stone-700 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-orange-300 transition-all" />
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2">
                        {isLoggedIn ? (
                            <>
                                <Link href="/notification"
                                      className="relative w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors">
                                    <Bell size={18} strokeWidth={1.8} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                                            {unreadCount > 9 ? "9+" : unreadCount}
                                        </span>
                                    )}
                                </Link>
                                <button onClick={() => router.push("/report/new")}
                                        className="flex items-center gap-1.5 h-8 px-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-all shadow-sm shadow-orange-200">
                                    Buat Laporan
                                </button>
                                {/* Avatar dengan dropdown */}
                                <AvatarDropdown />
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login"
                                      className="h-8 px-4 rounded-full text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors flex items-center">
                                    Masuk
                                </Link>
                                <Link href="/register"
                                      className="h-8 px-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-all shadow-sm shadow-orange-200 flex items-center">
                                    Daftar
                                </Link>
                            </div>
                        )}
                    </div>
                </header>
            </div>

            {/* ── Mobile topbar ── */}
            <div className="md:hidden">
                <header className="fixed top-0 left-0 right-0 h-12 bg-white/90 backdrop-blur-md border-b border-stone-100 flex items-center justify-between px-4 z-50">
                    <Link href="/" className="font-bold text-base tracking-tight text-stone-900">
                        Temu<span className="text-orange-500">Kan</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        {isLoggedIn ? (
                            <>
                                <Link href="/notification" className="relative w-8 h-8 rounded-full flex items-center justify-center text-stone-500">
                                    <Bell size={18} />
                                    {unreadCount > 0 && <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />}
                                </Link>
                                <AvatarDropdown />
                            </>
                        ) : (
                            <Link href="/login" className="h-7 px-3 rounded-full bg-orange-500 text-white text-xs font-semibold flex items-center">
                                Masuk
                            </Link>
                        )}
                    </div>
                </header>
            </div>
        </>
    );
}