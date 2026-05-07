import Link from "next/link";
import {Bell, BookOpen} from "lucide-react";
import {AvatarDropdown} from "@/components/fragment/AvatarDropdown";

type Props = {
    isLoggedIn: boolean;
    isHydrated: boolean;
    unreadCount: number;
}

export function MobileTopbar({isHydrated,isLoggedIn,unreadCount}: Props) {
    return (
        <div className="md:hidden">
            <header className="fixed top-0 left-0 right-0 h-12 bg-white/90 backdrop-blur-md border-b border-stone-100 flex items-center justify-between px-4 z-50">
                <Link href="/" className="font-bold text-base tracking-tight text-stone-900">
                    Temu<span className="text-orange-500">Kan</span>
                </Link>
                <div className="flex items-center gap-2">
                    {!isHydrated ? (
                        // Skeleton bulat kecil untuk mobile
                        <div className="w-8 h-8 rounded-full bg-stone-100 animate-pulse" />
                    ) : isLoggedIn ? (
                        <>
                            <Link href="/map" className="relative w-8 h-8 rounded-full flex items-center justify-center text-stone-500">
                                <BookOpen size={18}/>
                            </Link>
                            <Link href="/notification" className="relative w-8 h-8 rounded-full flex items-center justify-center text-stone-500">
                                <Bell size={18} />
                                {unreadCount > 0 && <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />}
                            </Link>
                            <AvatarDropdown />
                        </>
                    ) : (
                        <Link href="/login" className="h-7 px-3 rounded-full bg-orange-500 text-white text-xs font-semibold flex items-center">
                            Masuk
                        </Link>
                    )}
                </div>
            </header>
        </div>
    )
}