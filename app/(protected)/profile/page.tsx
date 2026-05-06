"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/queryClient";
import { PageWrapper } from "@/components/layout/PageWrapper";
import type { UserProfile } from "@/types";

// ── fetch profil terbaru dari server ─────────────────────────────────────────
async function fetchMe(): Promise<UserProfile> {
    const res = await api.get<{ success: boolean; data: UserProfile }>("/auth/me");
    return res.data.data;
}

// ── Role label ────────────────────────────────────────────────────────────────
const ROLE_MAP: Record<UserProfile["role"], { label: string; emoji: string; desc: string }> = {
    finder: {
        label: "Penemu",
        emoji: "🔍",
        desc: "Melaporkan orang yang ditemukan",
    },
    seeker: {
        label: "Pencari",
        emoji: "❤️",
        desc: "Mencari anggota keluarga yang hilang",
    },
    volunteer: {
        label: "Relawan",
        emoji: "🤝",
        desc: "Membantu koordinasi dan verifikasi laporan",
    },
};

// ── Info row ──────────────────────────────────────────────────────────────────
function InfoRow({
                     label,
                     value,
                     mono,
                 }: {
    label: string;
    value: string | null | undefined;
    mono?: boolean;
}) {
    return (
        <div className="flex items-start justify-between gap-4 py-3.5 border-b border-stone-50 last:border-0">
            <span className="text-sm text-stone-500 flex-shrink-0 w-28">{label}</span>
            <span
                className={`text-sm text-stone-800 font-medium text-right ${
                    mono ? "font-mono" : ""
                }`}
            >
                {value ?? (
                    <span className="text-stone-300 font-normal">Belum diisi</span>
                )}
            </span>
        </div>
    );
}

// ── Avatar initials ───────────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");

    return (
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md flex-shrink-0">
            <span className="text-2xl font-extrabold text-white tracking-wide">
                {initials}
            </span>
        </div>
    );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function ProfilSkeleton() {
    return (
        <PageWrapper contained padded>
            <div className="animate-pulse space-y-5 max-w-lg mx-auto">
                <div className="rounded-2xl border border-stone-100 bg-white shadow-sm p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-stone-100" />
                        <div className="space-y-2 flex-1">
                            <div className="h-5 w-40 bg-stone-100 rounded-lg" />
                            <div className="h-4 w-28 bg-stone-100 rounded-lg" />
                        </div>
                    </div>
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="flex justify-between py-3.5 border-b border-stone-50"
                        >
                            <div className="h-4 w-24 bg-stone-100 rounded" />
                            <div className="h-4 w-32 bg-stone-100 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
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

    const roleInfo = ROLE_MAP[user.role];
    const joinedAt = format(new Date(user.created_at), "d MMMM yyyy", {
        locale: localeId,
    });

    async function handleLogout() {
        try {
            await logout.mutateAsync();
            router.replace("/");
        } catch {
            toast.error("Gagal logout, coba lagi.");
        }
    }

    return (
        <PageWrapper contained padded>
            <div className="max-w-lg mx-auto space-y-4">
                {/* ── Header card ── */}
                <div className="rounded-2xl border border-stone-100 bg-white shadow-sm p-6">
                    <div className="flex items-center gap-4 mb-5">
                        <Avatar name={user.name} />
                        <div className="min-w-0">
                            <h1 className="text-lg font-bold text-stone-900 truncate">
                                {user.name}
                            </h1>
                            <p className="text-sm text-stone-500 truncate">{user.email}</p>
                            <div className="mt-2 inline-flex items-center gap-1.5 bg-orange-50 rounded-full px-3 py-1">
                                <span className="text-base leading-none">{roleInfo.emoji}</span>
                                <span className="text-xs font-semibold text-orange-700">
                                    {roleInfo.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Role description */}
                    <div className="rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-500 leading-relaxed">
                        {roleInfo.desc}
                    </div>
                </div>

                {/* ── Info card ── */}
                <div className="rounded-2xl border border-stone-100 bg-white shadow-sm px-5 py-2">
                    <InfoRow label="Nama lengkap" value={user.name} />
                    <InfoRow label="Email" value={user.email} mono />
                    <InfoRow
                        label="Nomor HP"
                        value={user.phone ? user.phone : null}
                        mono
                    />
                    <InfoRow label="Bergabung" value={joinedAt} />
                    <InfoRow label="ID Akun" value={user.id} mono />
                </div>

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
                    onClick={handleLogout}
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