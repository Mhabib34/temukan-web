"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, FileText, Plus, Bell, User, LogIn } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {useUnreadCount} from "@/hooks";


// ─── Tab Definition ───────────────────────────────────────────────────────────

type Tab = {
    label: string;
    href: string;
    icon: React.ReactNode;
    protected?: boolean;
};

const TABS: Tab[] = [
    {
        label: "Beranda",
        href: "/",
        icon: <Home size={22} strokeWidth={1.8} />,
    },
    {
        label: "Laporan",
        href: "/laporan",
        icon: <FileText size={22} strokeWidth={1.8} />,
    },
    {
        // FAB center — ditangani khusus
        label: "Buat",
        href: "/laporan/baru",
        icon: <Plus size={26} strokeWidth={2.2} />,
        protected: true,
    },
    {
        label: "Notifikasi",
        href: "/notifikasi",
        icon: <Bell size={22} strokeWidth={1.8} />,
        protected: true,
    },
    {
        label: "Profil",
        href: "/profil",
        icon: <User size={22} strokeWidth={1.8} />,
        protected: true,
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const unreadCount = useUnreadCount();

    // Sembunyikan BottomNav di halaman auth
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
        return null;
    }

    const handleProtectedClick = (href: string) => {
        if (!isLoggedIn) {
            router.push("/login");
        } else {
            router.push(href);
        }
    };

    // Tab yang ditampilkan:
    // - Tab public: selalu tampil
    // - Tab protected: tampil hanya jika login, kecuali FAB (selalu tampil tapi redirect ke /login)
    // - Jika belum login → ganti tab Notif & Profil dengan satu tombol "Masuk"

    const visibleTabs = isLoggedIn
        ? TABS
        : TABS.filter((t) => !t.protected || t.label === "Buat");

    // Jika belum login, tambahkan tab "Masuk" di akhir (menggantikan Notif & Profil)
    const finalTabs = isLoggedIn
        ? TABS
        : [
            ...visibleTabs,
            {
                label: "Masuk",
                href: "/login",
                icon: <LogIn size={22} strokeWidth={1.8} />,
                protected: false,
            },
        ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            {/* Blur backdrop */}
            <div className="absolute inset-0 bg-white/90 backdrop-blur-md border-t border-stone-200" />

            <div className="relative flex items-end justify-around px-2 pb-safe pt-1">
                {finalTabs.map((tab) => {
                    const isActive =
                        tab.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(tab.href);
                    const isFAB = tab.label === "Buat";

                    // ── FAB (Buat Laporan) ──
                    if (isFAB) {
                        return (
                            <button
                                key={tab.href}
                                onClick={() => handleProtectedClick(tab.href)}
                                aria-label="Buat laporan baru"
                                className="relative -mt-5 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-200 transition-transform duration-150 active:scale-95 hover:bg-orange-600"
                            >
                                {tab.icon}
                            </button>
                        );
                    }

                    // ── Regular Tab ──
                    const content = (
                        <span
                            className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors duration-150 ${
                                isActive
                                    ? "text-orange-500"
                                    : "text-stone-400 hover:text-stone-600"
                            }`}
                        >
                            {/* Notif badge */}
                            {tab.label === "Notifikasi" && unreadCount > 0 && (
                                <span className="absolute -top-0.5 right-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                            )}
                            {tab.icon}
                            <span
                                className={`text-[10px] font-medium leading-none ${
                                    isActive ? "text-orange-500" : "text-stone-400"
                                }`}
                            >
                                {tab.label}
                            </span>
                            {/* Active indicator dot */}
                            {isActive && (
                                <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-orange-500" />
                            )}
                        </span>
                    );

                    if (tab.protected) {
                        return (
                            <button
                                key={tab.href}
                                onClick={() => handleProtectedClick(tab.href)}
                                className="focus:outline-none"
                                aria-label={tab.label}
                            >
                                {content}
                            </button>
                        );
                    }

                    return (
                        <Link key={tab.href} href={tab.href} aria-label={tab.label}>
                            {content}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}