"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, FileText, Plus, Bell, User, LogIn } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUnreadCount } from "@/hooks";

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
        href: "/report",
        icon: <FileText size={22} strokeWidth={1.8} />,
    },
    {
        label: "Buat",
        href: "/report/new",
        icon: <Plus size={26} strokeWidth={2.2} />,
        protected: true,
    },
    {
        label: "Notifikasi",
        href: "/notification",
        icon: <Bell size={22} strokeWidth={1.8} />,
        protected: true,
    },
    {
        label: "Profil",
        href: "/profile",
        icon: <User size={22} strokeWidth={1.8} />,
        protected: true,
    },
];

export function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const unreadCount = useUnreadCount();

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

    const finalTabs = isLoggedIn
        ? TABS
        : [
            ...TABS.filter((t) => !t.protected || t.label === "Buat"),
            {
                label: "Masuk",
                href: "/login",
                icon: <LogIn size={22} strokeWidth={1.8} />,
                protected: false,
            },
        ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            {/* Background navbar — top-7 agar setengah FAB mencuat bebas di atas */}
            <div className="absolute inset-0 bottom-0 top-2 bg-white/90 backdrop-blur-md border-t border-stone-200" />

            <div className="relative flex items-end justify-around px-2 pb-safe pt-1 overflow-visible">
                {finalTabs.map((tab) => {
                    const isActive =
                        tab.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(tab.href);
                    const isFAB = tab.label === "Buat";

                    // ── FAB ──
                    if (isFAB) {
                        return (
                            <div
                                key={tab.href}
                                className="relative flex flex-col items-center min-w-[56px]"
                            >
                                <button
                                    onClick={() => handleProtectedClick(tab.href)}
                                    aria-label="Buat laporan baru"
                                    style={{ bottom: "20px" }}
                                    className="relative flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-200 transition-transform duration-150 active:scale-95 hover:bg-orange-600"
                                >
                                    {tab.icon}
                                </button>
                            </div>
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