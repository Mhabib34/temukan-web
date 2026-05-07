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
import {NotifSkeleton} from "@/components/skeleton/NotifSkeleton";
import {NotifItem} from "@/components/notification/NotifItem";


export default function NotificationPage() {
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