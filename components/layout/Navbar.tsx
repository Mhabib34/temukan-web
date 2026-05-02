"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, User, FileText, MapPin } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUnreadCount } from "@/hooks";
import { useLogout } from "@/hooks/useAuth";
import { useState, useRef, useEffect } from "react";

// ─── Nav Links ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
    { label: "Beranda", href: "/" },
    { label: "Laporan", href: "/report" },
    { label: "Peta", href: "/peta" },
    { label: "Match", href: "/match", protected: true },
];

// ─── User Dropdown ────────────────────────────────────────────────────────────

function UserDropdown() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const { mutate: logout, isPending } = useLogout();

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const initial = user?.name?.charAt(0).toUpperCase() ?? "U";

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 transition-colors hover:bg-stone-100"
            >
                {/* Avatar */}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
                    {initial}
                </span>
                <span className="max-w-[120px] truncate text-sm font-medium text-stone-700">
                    {user?.name}
                </span>
                <ChevronDown
                    size={14}
                    className={`text-stone-400 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {/* Dropdown menu */}
            {open && (
                <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg shadow-stone-100">
                    {/* User info */}
                    <div className="border-b border-stone-100 px-4 py-3">
                        <p className="truncate text-sm font-semibold text-stone-800">
                            {user?.name}
                        </p>
                        <p className="truncate text-xs text-stone-400">{user?.email}</p>
                    </div>

                    <div className="p-1.5">
                        <Link
                            href="/profil"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-50"
                        >
                            <User size={15} />
                            Profil Saya
                        </Link>
                        <Link
                            href="/report/me"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-50"
                        >
                            <FileText size={15} />
                            Laporan Saya
                        </Link>
                    </div>

                    <div className="border-t border-stone-100 p-1.5">
                        <button
                            onClick={() => {
                                setOpen(false);
                                logout();
                            }}
                            disabled={isPending}
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
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

    // Sembunyikan di halaman auth
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 hidden md:block">
            <div className="absolute inset-0 bg-white/90 backdrop-blur-md border-b border-stone-200" />

            <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-lg font-bold tracking-tight text-stone-900">
                        Temu<span className="text-orange-500">Kan</span>
                    </span>
                </Link>

                {/* Nav links */}
                <nav className="flex items-center gap-1">
                    {NAV_LINKS.filter(
                        (l) => !l.protected || isLoggedIn
                    ).map((link) => {
                        const isActive =
                            link.href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                                    isActive
                                        ? "text-orange-500"
                                        : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
                                }`}
                            >
                                {link.label}
                                {isActive && (
                                    <span className="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-orange-500" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {isLoggedIn ? (
                        <>
                            {/* Notif bell */}
                            <Link
                                href="/notification"
                                className="relative flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
                                aria-label="Notifikasi"
                            >
                                <Bell size={20} strokeWidth={1.8} />
                                {unreadCount > 0 && (
                                    <span className="absolute right-1.5 top-1.5 flex h-3.5 min-w-[0.875rem] items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold leading-none text-white">
                                        {unreadCount > 99 ? "99+" : unreadCount}
                                    </span>
                                )}
                            </Link>

                            {/* Buat laporan CTA */}
                            <button
                                onClick={() => router.push("/report/new")}
                                className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition-all hover:bg-orange-600 active:scale-95"
                            >
                                + Buat Laporan
                            </button>

                            {/* User dropdown */}
                            <UserDropdown />
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="rounded-full px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition-all hover:bg-orange-600"
                            >
                                Daftar
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}