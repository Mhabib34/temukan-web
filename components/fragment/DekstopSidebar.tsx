import Link from "next/link";
import {Bell, BookOpen, Clock, Home, Search, Settings, Users} from "lucide-react";
import {AvatarDropdown} from "@/components/fragment/AvatarDropdown";
import {useRouter} from "next/navigation";
import {boolean, string} from "zod";

const SIDEBAR_LINKS = [
    { icon: Home, href: "/", label: "Beranda" },
    { icon: Search, href: "/report", label: "Cari Laporan" },
    { icon: BookOpen, href: "/map", label: "Peta" },
    { icon: Users, href: "/match", label: "Match", protected: true },
    { icon: Clock, href: "/report/me", label: "Riwayat", protected: true },
];

type Props = {
    pathname: string;
    isLoggedIn: boolean;
    isHydrated: boolean;
    unreadCount: number;
}

export function DekstopSidebar({pathname, isLoggedIn, isHydrated, unreadCount}: Props){
    const router = useRouter();
    return (
        <div className="hidden md:block">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-16 bg-white border-r border-stone-100 flex flex-col items-center py-5 z-50 shadow-sm">
                {/* Logo */}
                <Link href="/" className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center mb-8 shadow-md shadow-orange-200 flex-shrink-0">
                    <span className="text-white font-extrabold text-lg leading-none">T</span>
                </Link>

                {/* Nav icons — tunggu hydrated sebelum filter protected */}
                <nav className="flex flex-col items-center gap-1 flex-1">
                    {SIDEBAR_LINKS.filter(l => !l.protected || (isHydrated && isLoggedIn)).map((link) => {
                        const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                        const Icon = link.icon;
                        return (
                            <Link key={link.href} href={link.href} title={link.label}
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative
                                        ${isActive ? "bg-orange-50 text-orange-500" : "text-stone-400 hover:bg-stone-50 hover:text-stone-700"}`}>
                                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-1 h-5 bg-orange-500 rounded-r-full" />}
                                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                                <span className="absolute left-14 bg-stone-800 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                                        {link.label}
                                    </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Settings bottom — hanya tampil kalau sudah hydrated & login */}
                {isHydrated && isLoggedIn && (
                    <Link href="/profile" title="Pengaturan"
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-400 hover:bg-stone-50 hover:text-stone-700 transition-all">
                        <Settings size={18} strokeWidth={1.8} />
                    </Link>
                )}
            </aside>

            {/* Topbar */}
            <header className="fixed top-0 left-16 right-0 h-14 bg-white/90 backdrop-blur-md border-b border-stone-100 flex items-center justify-between px-6 z-40">
                <Link href="/" className="font-bold text-base tracking-tight text-stone-900">
                    Temu<span className="text-orange-500">Kan</span>
                </Link>

                {/* Right — skeleton saat belum hydrated, cegah flash */}
                <div className="flex items-center gap-2">
                    {!isHydrated ? (
                        // Placeholder animasi — ukuran sama agar layout tidak loncat
                        <div className="w-24 h-8 rounded-full bg-stone-100 animate-pulse" />
                    ) : isLoggedIn ? (
                        <>
                            <Link href="/notification"
                                  className="relative w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors">
                                <Bell size={18} strokeWidth={1.8} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                                            {unreadCount > 9 ? "9+" : unreadCount}
                                        </span>
                                )}
                            </Link>
                            <button onClick={() => router.push("/report/new")}
                                    className="flex items-center gap-1.5 h-8 px-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-all shadow-sm shadow-orange-200">
                                Buat Laporan
                            </button>
                            <AvatarDropdown />
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login"
                                  className="h-8 px-4 rounded-full text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors flex items-center">
                                Masuk
                            </Link>
                            <Link href="/register"
                                  className="h-8 px-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-all shadow-sm shadow-orange-200 flex items-center">
                                Daftar
                            </Link>
                        </div>
                    )}
                </div>
            </header>
        </div>
    )
}