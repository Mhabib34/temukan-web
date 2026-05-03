"use client";

import Link from "next/link";
import { useLaporanList } from "@/hooks";
import { useAuthStore } from "@/store/authStore";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {ReportCard, ReportCardSkeleton} from "@/components/report/ReportCard";

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
                      value,
                      label,
                      icon,
                      color,
                  }: {
    value: string;
    label: string;
    icon: React.ReactNode;
    color: string;
}) {
    return (
        <div className="rounded-2xl border border-stone-100 bg-white shadow-sm p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-xl font-bold text-stone-900 leading-none">{value}</p>
                <p className="text-xs text-stone-500 mt-0.5">{label}</p>
            </div>
        </div>
    );
}

// ── Step card ────────────────────────────────────────────────────────────────
function StepCard({
                      step,
                      title,
                      desc,
                  }: {
    step: string;
    title: string;
    desc: string;
}) {
    return (
        <div className="flex gap-4">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                {step}
            </div>
            <div>
                <p className="text-sm font-semibold text-stone-800">{title}</p>
                <p className="text-sm text-stone-500 mt-0.5 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

// ── Role badge ────────────────────────────────────────────────────────────────
function RoleCard({
                      emoji,
                      title,
                      desc,
                      href,
                  }: {
    emoji: string;
    title: string;
    desc: string;
    href: string;
}) {
    return (
        <Link href={href}>
            <div className="rounded-2xl border border-stone-100 bg-white shadow-sm p-5 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer group">
                <div className="text-3xl mb-3">{emoji}</div>
                <p className="text-sm font-bold text-stone-800 group-hover:text-orange-600 transition-colors">
                    {title}
                </p>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">{desc}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-orange-500">
                    Daftar sekarang
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </span>
            </div>
        </Link>
    );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const { data, isLoading } = useLaporanList({ limit: 6, status: "active" });

    const laporanTerbaru = data?.data.reports ?? [];

    return (
        <PageWrapper contained={false} padded={false}>
            {/* ── HERO ── */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
                {/* decorative circles */}
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 py-14 md:py-20 relative">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3.5 py-1.5 mb-5">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            <span className="text-white text-xs font-semibold tracking-wide">
                                Platform Pencarian Orang Hilang Indonesia
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                            Bantu Temukan<br />
                            <span className="text-orange-100">Orang Tersayang</span>
                        </h1>

                        <p className="text-orange-100 text-sm md:text-base mt-4 leading-relaxed max-w-sm">
                            TemuKan menghubungkan penemu, keluarga, dan relawan untuk
                            mempertemukan kembali orang yang terpisah.
                        </p>

                        <div className="flex flex-wrap gap-3 mt-7">
                            <Link
                                href="/report/new"
                                className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-orange-600 shadow-md transition hover:bg-orange-50 active:scale-95"
                            >
                                Buat Laporan
                            </Link>
                            <Link
                                href="/report"
                                className="rounded-2xl border-2 border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-95"
                            >
                                Lihat Semua Laporan
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── STATS ── */}
            <div className="max-w-6xl mx-auto px-4 -mt-5 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatCard
                        value="1.200+"
                        label="Laporan masuk"
                        color="bg-red-50"
                        icon={
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                            </svg>
                        }
                    />
                    <StatCard
                        value="340+"
                        label="Berhasil ditemukan"
                        color="bg-green-50"
                        icon={
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <StatCard
                        value="500+"
                        label="Relawan aktif"
                        color="bg-blue-50"
                        icon={
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                        }
                    />
                    <StatCard
                        value="34"
                        label="Provinsi terjangkau"
                        color="bg-orange-50"
                        icon={
                            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* ── LAPORAN TERBARU ── */}
            <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-stone-900">Laporan Terbaru</h2>
                        <p className="text-sm text-stone-500 mt-0.5">Laporan aktif yang membutuhkan perhatian</p>
                    </div>
                    <Link
                        href="/report"
                        className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition flex items-center gap-1"
                    >
                        Lihat semua
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <ReportCardSkeleton key={i} />
                        ))}
                    </div>
                ) : laporanTerbaru.length === 0 ? (
                    <div className="rounded-2xl border border-stone-100 bg-white p-10 text-center">
                        <p className="text-stone-500">Belum ada laporan aktif.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {laporanTerbaru.map((laporan) => (
                            <ReportCard key={laporan.id} laporan={laporan} />
                        ))}
                    </div>
                )}

                <div className="text-center mt-8">
                    <Link
                        href="/report"
                        className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 hover:border-orange-200"
                    >
                        Lihat Semua Laporan
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* ── CARA KERJA ── */}
            <div className="bg-stone-50 border-y border-stone-100">
                <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold text-stone-900">Cara Kerja TemuKan</h2>
                        <p className="text-sm text-stone-500 mt-1">Sederhana, cepat, dan efektif</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <StepCard
                            step="1"
                            title="Buat Laporan"
                            desc="Isi detail orang yang hilang atau yang kamu temukan — foto, ciri fisik, dan lokasi."
                        />
                        <StepCard
                            step="2"
                            title="Sistem Cocokkan"
                            desc="Algoritma kami otomatis mencocokkan laporan berdasarkan lokasi, gender, usia, dan deskripsi fisik."
                        />
                        <StepCard
                            step="3"
                            title="Terhubung"
                            desc="Jika ada kecocokan, kedua pihak mendapat notifikasi dan bisa saling terhubung via WhatsApp."
                        />
                    </div>
                </div>
            </div>

            {/* ── AJAKAN BERGABUNG ── */}
            {!isLoggedIn && (
                <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold text-stone-900">Bergabung Sebagai</h2>
                        <p className="text-sm text-stone-500 mt-1">
                            Pilih peranmu dan mulai membantu
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <RoleCard
                            emoji="🔍"
                            title="Penemu"
                            desc="Kamu menemukan seseorang yang tersesat atau tidak tahu arah pulang? Laporkan di sini."
                            href="/daftar"
                        />
                        <RoleCard
                            emoji="❤️"
                            title="Pencari"
                            desc="Kehilangan anggota keluarga? Buat laporan dan biarkan komunitas membantu menemukannya."
                            href="/daftar"
                        />
                        <RoleCard
                            emoji="🤝"
                            title="Relawan"
                            desc="Bantu verifikasi laporan, koordinasi pencarian, dan dukung keluarga yang membutuhkan."
                            href="/daftar"
                        />
                    </div>
                </div>
            )}

            {/* ── CTA BOTTOM ── */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600">
                <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 text-center">
                    <h2 className="text-xl md:text-2xl font-extrabold text-white mb-2">
                        Setiap Laporan Bisa Mengubah Segalanya
                    </h2>
                    <p className="text-orange-100 text-sm mb-7 max-w-md mx-auto">
                        Satu laporan yang kamu buat hari ini mungkin mempertemukan kembali
                        sebuah keluarga. Mulai sekarang.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link
                            href="/report/new"
                            className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-orange-600 shadow-md transition hover:bg-orange-50 active:scale-95"
                        >
                            Buat Laporan Sekarang
                        </Link>
                        <Link
                            href="/peta"
                            className="rounded-2xl border-2 border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-95"
                        >
                            Lihat Peta
                        </Link>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}