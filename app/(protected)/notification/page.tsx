"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, BellOff, CheckCheck, Loader2, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { toast } from "sonner";
import {
    useNotifikasi,
    useMarkNotifRead,
    useMarkAllNotifRead,
} from "@/hooks";
import { useAuthStore } from "@/store/authStore";
import { PageWrapper } from "@/components/layout/PageWrapper";
import type { Notification } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
    return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: localeId });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function NotifSkeleton() {
    return (
        <div className="animate-pulse divide-y divide-stone-100">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex gap-3 px-4 py-4">
                    <div className="mt-0.5 h-9 w-9 shrink-0 rounded-full bg-stone-200" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3.5 w-3/4 rounded bg-stone-200" />
                        <div className="h-3 w-1/3 rounded bg-stone-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Notif Item ───────────────────────────────────────────────────────────────

function NotifItem({ notif }: { notif: Notification }) {
    const router = useRouter();
    const markRead = useMarkNotifRead();

    function handleClick() {
        if (!notif.is_read) {
            markRead.mutate(notif.id, {
                onError: () => toast.error("Gagal menandai notifikasi"),
            });
        }

        if (notif.match_id) {
            router.push(`/match/${notif.match_id}`);
        } else if (notif.report_id) {
            router.push(`/report/${notif.report_id}`);
        }
    }

    const isClickable = !!(notif.match_id || notif.report_id);

    return (
        <div
            onClick={isClickable ? handleClick : undefined}
            className={[
                "flex gap-3 px-4 py-4 transition",
                !notif.is_read ? "bg-orange-50" : "bg-white",
                isClickable ? "cursor-pointer hover:bg-stone-50" : "",
                !notif.is_read && isClickable ? "hover:bg-orange-100/60" : "",
            ].join(" ")}
        >
            {/* Icon / unread dot */}
            <div className="relative mt-0.5 shrink-0">
                <div
                    className={[
                        "flex h-9 w-9 items-center justify-center rounded-full",
                        !notif.is_read ? "bg-orange-100" : "bg-stone-100",
                    ].join(" ")}
                >
                    <Bell
                        className={[
                            "h-4 w-4",
                            !notif.is_read ? "text-orange-500" : "text-stone-400",
                        ].join(" ")}
                    />
                </div>
                {!notif.is_read && (
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-orange-500" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p
                    className={[
                        "text-sm leading-snug",
                        !notif.is_read ? "font-medium text-stone-900" : "text-stone-600",
                    ].join(" ")}
                >
                    {notif.message}
                </p>
                <p className="mt-1 text-xs text-stone-400">{timeAgo(notif.created_at)}</p>
            </div>

            {/* Unread indicator kanan */}
            {!notif.is_read && (
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-400" />
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotifikasiPage() {
    const router = useRouter();
    const { isLoggedIn } = useAuthStore();

    useEffect(() => {
        if (!isLoggedIn) router.replace("/login");
    }, [isLoggedIn, router]);

    const { data, isLoading, isError, error } = useNotifikasi();
    const markAll = useMarkAllNotifRead();

    if (!isLoggedIn) return null;

    const notifications = data?.data.notifications ?? [];
    const unreadCount = data?.data.unread_count ?? 0;

    function handleMarkAll() {
        markAll.mutate(undefined, {
            onSuccess: () => toast.success("Semua notifikasi ditandai dibaca"),
            onError: () => toast.error("Gagal menandai semua notifikasi"),
        });
    }

    return (
        <PageWrapper padded={false}>
            {/* ── Header ── */}
            <div className="sticky top-0 z-10 border-b border-stone-100 bg-white/90 backdrop-blur-sm">
                <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-4">
                    <div>
                        <h1 className="text-lg font-bold text-stone-900">Notifikasi</h1>
                        {unreadCount > 0 && (
                            <p className="text-xs text-stone-400">
                                {unreadCount} belum dibaca
                            </p>
                        )}
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAll}
                            disabled={markAll.isPending}
                            className="flex items-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2 text-xs font-medium text-stone-600 transition hover:border-orange-300 hover:text-orange-600 disabled:opacity-50"
                        >
                            {markAll.isPending ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <CheckCheck className="h-3.5 w-3.5" />
                            )}
                            Tandai semua dibaca
                        </button>
                    )}
                </div>
            </div>

            {/* ── Content ── */}
            <div className="mx-auto w-full max-w-2xl">
                {/* Loading */}
                {isLoading && <NotifSkeleton />}

                {/* Error */}
                {isError && !isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
                            <AlertCircle className="h-8 w-8 text-stone-400" />
                        </div>
                        <h2 className="mb-2 text-lg font-semibold text-stone-800">
                            Gagal Memuat Notifikasi
                        </h2>
                        <p className="mb-6 text-sm text-stone-500">
                            {(error as { response?: { data?: { message?: string } } })?.response
                                ?.data?.message ?? "Terjadi kesalahan. Silakan coba lagi."}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
                        >
                            Coba Lagi
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && !isError && notifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
                            <BellOff className="h-8 w-8 text-stone-300" />
                        </div>
                        <h2 className="mb-2 text-lg font-semibold text-stone-800">
                            Belum Ada Notifikasi
                        </h2>
                        <p className="mb-6 max-w-xs text-sm text-stone-500">
                            Kamu akan mendapat notifikasi saat ada kecocokan laporan atau
                            pembaruan terkait laporan milikmu.
                        </p>
                        <Link
                            href="/report"
                            className="rounded-2xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                        >
                            Lihat Laporan
                        </Link>
                    </div>
                )}

                {/* List */}
                {!isLoading && !isError && notifications.length > 0 && (
                    <div className="divide-y divide-stone-100">
                        {notifications.map((notif) => (
                            <NotifItem key={notif.id} notif={notif} />
                        ))}
                    </div>
                )}
            </div>
        </PageWrapper>
    );
}