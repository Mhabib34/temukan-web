"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/queryClient";
import { PageWrapper } from "@/components/layout/PageWrapper";
import type { UserProfile } from "@/types";
import {ProfilSkeleton} from "@/components/skeleton/ProfileSkeleton";
import {ProfileHeaderCard} from "@/components/card/ProfileHeaderCard";
import {ProfileInfoCard} from "@/components/card/ProfileInfoCard";
import {showConfirm} from "@/lib/sonner";

// ── fetch profil terbaru dari server ─────────────────────────────────────────
async function fetchMe(): Promise<UserProfile> {
    const res = await api.get<{ success: boolean; data: UserProfile }>("/auth/me");
    return res.data.data;
}

export default function ProfilePage() {
    const router = useRouter();
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const logout = useLogout();

    const { data: user, isLoading, isError } = useQuery({
        queryKey: queryKeys.me,
        queryFn: fetchMe,
        enabled: isLoggedIn,
    });

    useEffect(() => {
        if (!isLoggedIn) router.replace("/login");
    }, [isLoggedIn, router]);

    if (!isLoggedIn) return null;
    if (isLoading) return <ProfilSkeleton />;

    if (isError || !user) {
        return (
            <PageWrapper contained padded>
                <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center max-w-lg mx-auto">
                    <p className="text-red-600 font-semibold text-sm">
                        Gagal memuat profil. Coba muat ulang halaman.
                    </p>
                </div>
            </PageWrapper>
        );
    }
    

    async function handleLogout() {
        try {
            await logout.mutateAsync();
        } catch {
            toast.error("Gagal logout, coba lagi.");
        }
    }

    return (
        <PageWrapper contained padded>
            <div className="max-w-lg mx-auto space-y-4">
                {/* ── Header card ── */}
                <ProfileHeaderCard user={user} />

                {/* ── Info card ── */}
                <ProfileInfoCard user={user} />

                {/* ── Shortcut links ── */}
                <div className="rounded-2xl border border-stone-100 bg-white shadow-sm divide-y divide-stone-50">
                    {[
                        {
                            label: "Laporan Saya",
                            icon: (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                                </svg>
                            ),
                            href: "/report/me",
                        },
                        {
                            label: "Hasil Kecocokan",
                            icon: (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            ),
                            href: "/match",
                        },
                        {
                            label: "Notifikasi",
                            icon: (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                </svg>
                            ),
                            href: "/notification",
                        },
                    ].map((item) => (
                        <button
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            className="w-full flex items-center justify-between px-5 py-4 hover:bg-stone-50 transition text-left"
                        >
                            <div className="flex items-center gap-3 text-stone-700">
                                <span className="text-stone-400">{item.icon}</span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                            <svg
                                className="w-4 h-4 text-stone-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    ))}
                </div>

                {/* ── Logout ── */}
                <button
                    onClick={() => {
                        showConfirm(
                            "Anda yakin ingin keluar?",
                            "",
                            handleLogout,
                            "Keluar"
                        );
                    }}
                    disabled={logout.isPending}
                    className="w-full rounded-2xl border border-red-100 bg-white py-3.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 active:scale-95 disabled:opacity-50 shadow-sm"
                >
                    {logout.isPending ? "Keluar..." : "Keluar dari Akun"}
                </button>

                <p className="text-center text-xs text-stone-300 pb-4">
                    TemuKan v1.0 · Platform Pencarian Orang Hilang Indonesia
                </p>
            </div>
        </PageWrapper>
    );
}