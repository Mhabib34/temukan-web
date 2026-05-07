import type {Notification} from "@/types";
import {useRouter} from "next/navigation";
import {useMarkNotifRead} from "@/hooks";
import {toast} from "sonner";
import {Bell} from "lucide-react";
import {formatDistanceToNow} from "date-fns";
import {id as localeId} from "date-fns/locale/id";

function timeAgo(iso: string) {
    return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: localeId });
}

export function NotifItem({ notif }: { notif: Notification }) {
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