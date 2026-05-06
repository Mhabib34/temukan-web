"use client";

import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, isHydrated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isHydrated) return;
        if (!isLoggedIn) router.replace("/login");
    }, [isHydrated, isLoggedIn, router]);

    if (!isHydrated) return null; // atau <LoadingSpinner />

    if (!isLoggedIn) return null;

    return <>{children}</>;
}