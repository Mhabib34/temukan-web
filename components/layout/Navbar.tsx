"use client";

import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useUnreadCount } from "@/hooks";
import {DekstopSidebar} from "@/components/fragment/DekstopSidebar";
import {MobileTopbar} from "@/components/fragment/MobileTopbar";



// ─── Navbar ───────────────────────────────────────────────────────────────────
export function Navbar() {
    const pathname = usePathname();
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const isHydrated = useAuthStore((s) => s.isHydrated); // ← cek hydration selesai
    const unreadCount = useUnreadCount();

    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
        return null;
    }

    return (
        <>
            {/* ── Desktop: Sidebar kiri + Topbar ── */}
            <DekstopSidebar isHydrated={isHydrated} isLoggedIn={isLoggedIn} pathname={pathname} unreadCount={unreadCount} />

            {/* ── Mobile topbar ── */}
            <MobileTopbar isLoggedIn={isLoggedIn} isHydrated={isHydrated} unreadCount={unreadCount} />
        </>
    );
}