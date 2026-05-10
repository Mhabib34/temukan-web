"use client";

import Link from "next/link";
import { useLaporanList, useStats } from "@/hooks";
import { PageWrapper } from "@/components/layout/PageWrapper";
import Image from "next/image";
import { StatCard } from "@/components/card/StatCard";
import { CtaBottom } from "@/components/fragment/CtaBottom";
import { Footer } from "@/components/fragment/Footer";
import { HowToWorkDesktop } from "@/components/fragment/HowToWorkDesktop";

export default function HomePage() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data, isLoading } = useLaporanList({ limit: 3, status: "active" });

  const fmt = (val?: number) =>
    statsLoading ? "..." : (val?.toLocaleString("id-ID") ?? "-");

  const laporanTerbaru = data?.data.reports ?? [];

  return (
    <PageWrapper contained={false} padded={false}>
      {/* ══ MOBILE HERO (orange) ══ */}
      <div className="md:hidden bg-linear-to-br from-orange-500 to-orange-600 px-5 pt-6 pb-10 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative z-10">
          <p className="text-orange-100 text-xs font-semibold tracking-widest uppercase mb-2">
            Platform Komunitas Indonesia
          </p>
          <h1 className="text-3xl font-extrabold text-white leading-tight mb-3">
            Bantu Temukan
            <br />
            <span className="text-orange-100">Orang Tersayang</span>
          </h1>
          <p className="text-orange-100 text-sm leading-relaxed mb-6 max-w-xs">
            Menghubungkan komunitas untuk mempercepat proses pencarian dengan
            teknologi dan empati.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              href="/report/new"
              className="h-11 rounded-2xl bg-white text-orange-600 font-bold text-sm flex items-center justify-center shadow-md"
            >
              Cari Sekarang
            </Link>
            <Link
              href="/report"
              className="h-11 rounded-2xl border-2 border-white/40 text-white font-semibold text-sm flex items-center justify-center"
            >
              Panduan Lapor
            </Link>
          </div>
        </div>
      </div>

      {/* ══ DESKTOP HERO (white) ══ */}
      <div className="hidden md:block md:px=10 bg-white py-16 relative overflow-hidden">
        {/* Subtle bg texture */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="mx-auto grid grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-4">
              Platform Komunitas Indonesia
            </p>
            <h1 className="text-5xl font-extrabold text-stone-900 leading-tight tracking-tight mb-5">
              Bantu Temukan
              <br />
              <span className="text-orange-500">Orang Tersayang.</span>
            </h1>
            <p className="text-stone-500 text-base leading-relaxed mb-8 max-w-md">
              Kami menghubungkan teknologi pelacakan real-time dengan kekuatan
              komunitas untuk membantu memulangkan setiap orang yang hilang
              dengan selamat dan cepat.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/report/new"
                className="h-11 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-orange-200 transition-all active:scale-95"
              >
                Buat Laporan Baru
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
              <Link
                href="/report"
                className="h-11 px-6 rounded-2xl border-2 border-stone-200 text-stone-700 font-semibold text-sm flex items-center hover:border-orange-300 hover:text-orange-600 transition-all"
              >
                Pelajari Sistem Kami
              </Link>
            </div>
          </div>

          {/* Right: image collage */}
          <div className="relative h-100">
            {/* Main oval image */}
            <div className="absolute left-8 top-4 w-56 h-72 rounded-[40%] overflow-hidden shadow-xl shadow-stone-200 border-4 border-white">
              <Image
                src="/images/hero1.avif"
                alt="Keluarga bersatu kembali"
                fill
                className="object-cover"
                sizes="224px"
              />
            </div>
            {/* Top right image */}
            <div className="absolute right-4 top-0 w-40 h-32 rounded-3xl overflow-hidden shadow-lg border-4 border-white">
              <Image
                src="/images/hero2.avif"
                alt="Pulang ke rumah"
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
            {/* Bottom right image */}
            <div className="absolute right-2 bottom-10 w-44 h-36 rounded-3xl overflow-hidden shadow-lg border-4 border-white">
              <Image
                src="/images/hero3.avif"
                alt="Relawan komunitas"
                fill
                className="object-cover object-top"
                sizes="176px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ══ STATS ══ */}
      <div className="px-4 py-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            value={fmt(stats?.active_reports)}
            label="Laporan Aktif"
            accent="border-orange-400"
            icon={
              <svg
                className="w-6 h-6 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                />
              </svg>
            }
          />
          <StatCard
            value={fmt(stats?.total_volunteers)}
            label="Relawan"
            accent="border-blue-400"
            icon={
              <svg
                className="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            }
          />
          <StatCard
            value={fmt(stats?.resolved_last_24h)}
            label="Selesai (24 Jam)"
            accent="border-green-400"
            icon={
              <svg
                className="w-6 h-6 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatCard
            value={fmt(stats?.unique_cities)}
            label="Wilayah Jangkauan"
            accent="border-purple-400"
            icon={
              <svg
                className="w-6 h-6 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
            }
          />
        </div>
      </div>

      {/* ══ LAPORAN + CARA KERJA (2 col desktop) ══ */}
      <HowToWorkDesktop isLoading={isLoading} laporanTerbaru={laporanTerbaru} />

      {/* ══ CARA KERJA MOBILE ══ */}
      <div className="md:hidden px-4 pb-8">
        <h2 className="text-lg font-bold text-stone-900 mb-1">
          Bagaimana TemuKan Membantu?
        </h2>
        <p className="text-xs text-stone-500 mb-5">
          3 langkah sederhana untuk memulai pencarian
        </p>
        <div className="grid grid-cols-1 gap-4">
          {[
            {
              emoji: "📋",
              title: "Buat Laporan",
              desc: "Lengkapi data diri, foto terbaru, dan detail lokasi terakhir terlihat.",
            },
            {
              emoji: "🔗",
              title: "Verifikasi & Sebar",
              desc: "Admin memverifikasi laporan lalu menyebarkannya ke jaringan relawan.",
            },
            {
              emoji: "📱",
              title: "Respon Cepat",
              desc: "Terima notifikasi real-time jika ada orang yang melihat korban.",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="flex gap-4 bg-white rounded-2xl p-4 border border-stone-100 shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl shrink-0">
                {s.emoji}
              </div>
              <div>
                <p className="text-sm font-bold text-stone-800 mb-0.5">
                  {s.title}
                </p>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ CTA BOTTOM ══ */}
      <CtaBottom />

      {/* ══ FOOTER ══ */}
      <Footer />
    </PageWrapper>
  );
}
