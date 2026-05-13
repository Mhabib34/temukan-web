"use client";

import Link from "next/link";
import { useLaporanList, useStats } from "@/hooks";
import { PageWrapper } from "@/components/layout/PageWrapper";
import Image from "next/image";
import { StatCard } from "@/components/card/StatCard";
import { CtaBottom } from "@/components/fragment/CtaBottom";
import { Footer } from "@/components/fragment/Footer";
import { HowToWorkDesktop } from "@/components/fragment/HowToWorkDesktop";
import { motion } from "framer-motion";
import { CheckCircle, ClipboardList, MapPin, Plus, Users2 } from "lucide-react";
import {
  fadeLeft,
  fadeRight,
  fadeScale,
  fadeUp,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";

export default function HomePage() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data, isLoading } = useLaporanList({ limit: 3, status: "active" });

  const fmt = (val?: number) =>
    statsLoading ? "..." : (val?.toLocaleString("id-ID") ?? "-");

  const laporanTerbaru = data?.data.reports ?? [];

  return (
    <PageWrapper contained={false} padded={false}>
      {/* ══ MOBILE HERO ══ */}
      <div className="md:hidden bg-linear-to-br from-orange-500 to-orange-600 px-5 pt-6 pb-10 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
        <motion.div
          className="relative z-10"
          initial="hidden"
          animate="show"
          variants={staggerContainer}
        >
          <motion.p
            className="text-orange-100 text-xs font-semibold tracking-widest uppercase mb-2"
            variants={staggerItem}
          >
            Platform Komunitas Indonesia
          </motion.p>
          <motion.h1
            className="text-3xl font-extrabold text-white leading-tight mb-3"
            variants={staggerItem}
          >
            Bantu Temukan
            <br />
            <span className="text-orange-100">Orang Tersayang</span>
          </motion.h1>
          <motion.p
            className="text-orange-100 text-sm leading-relaxed mb-6 max-w-xs"
            variants={staggerItem}
          >
            Menghubungkan komunitas untuk mempercepat proses pencarian dengan
            teknologi dan empati.
          </motion.p>
          <motion.div className="flex flex-col gap-2.5" variants={staggerItem}>
            <Link
              href="/report/new"
              className="h-11 rounded-2xl bg-white text-orange-600 font-bold text-sm flex items-center justify-center shadow-md"
            >
              Cari Sekarang
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ══ DESKTOP HERO ══ */}
      <div className="hidden md:block md:px-10 bg-white py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <motion.div initial="hidden" animate="show">
            <motion.p
              className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-4"
              variants={fadeLeft}
              custom={0}
            >
              Platform Komunitas Indonesia
            </motion.p>
            <motion.h1
              className="text-5xl font-extrabold text-stone-900 leading-tight tracking-tight mb-5"
              variants={fadeLeft}
              custom={0.1}
            >
              Bantu Temukan
              <br />
              <span className="text-orange-500">Orang Tersayang.</span>
            </motion.h1>
            <motion.p
              className="text-stone-500 text-base leading-relaxed mb-8 max-w-md"
              variants={fadeLeft}
              custom={0.2}
            >
              Kami menghubungkan teknologi pelacakan real-time dengan kekuatan
              komunitas untuk membantu memulangkan setiap orang yang hilang
              dengan selamat dan cepat.
            </motion.p>
            <motion.div
              className="flex items-center gap-3"
              variants={fadeLeft}
              custom={0.3}
            >
              <Link
                href="/report/new"
                className="h-11 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-orange-200 transition-colors active:scale-95 cursor-pointer"
              >
                Buat Laporan Baru
                <Plus className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: image collage */}
          <div className="relative h-100">
            {/* Main oval — LCP */}
            <motion.div
              className="absolute left-8 top-4 w-56 h-72 rounded-[40%] overflow-hidden shadow-xl shadow-stone-200 border-4 border-white"
              variants={fadeScale}
              initial="hidden"
              animate="show"
              custom={0.15}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full h-full relative"
              >
                <Image
                  src="/images/hero1.avif"
                  alt="Keluarga bersatu kembali"
                  fill
                  priority
                  loading="eager"
                  className="object-cover"
                  sizes="224px"
                />
              </motion.div>
            </motion.div>

            {/* Top right */}
            <motion.div
              className="absolute right-4 top-0 w-40 h-32 rounded-3xl overflow-hidden shadow-lg border-4 border-white"
              variants={fadeRight}
              initial="hidden"
              animate="show"
              custom={0.3}
            >
              <Image
                src="/images/hero2.avif"
                alt="Pulang ke rumah"
                fill
                className="object-cover"
                sizes="160px"
              />
            </motion.div>

            {/* Bottom right */}
            <motion.div
              className="absolute right-2 bottom-10 w-44 h-36 rounded-3xl overflow-hidden shadow-lg border-4 border-white"
              variants={fadeRight}
              initial="hidden"
              animate="show"
              custom={0.45}
            >
              <Image
                src="/images/hero3.avif"
                alt="Relawan komunitas"
                fill
                className="object-cover object-top"
                sizes="176px"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ══ STATS ══ */}
      <div className="px-4 py-6 bg-white">
        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.div variants={staggerItem}>
            <StatCard
              value={fmt(stats?.active_reports)}
              label="Laporan Aktif"
              accent="border-orange-400"
              icon={<ClipboardList className="w-6 h-6 text-orange-400" />}
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <StatCard
              value={fmt(stats?.total_volunteers)}
              label="Relawan"
              accent="border-blue-400"
              icon={<Users2 className="w-6 h-6 text-blue-400" />}
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <StatCard
              value={fmt(stats?.resolved_last_24h)}
              label="Selesai (24 Jam)"
              accent="border-green-400"
              icon={<CheckCircle className="w-6 h-6 text-green-400" />}
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <StatCard
              value={fmt(stats?.unique_cities)}
              label="Wilayah Jangkauan"
              accent="border-purple-400"
              icon={<MapPin className="w-6 h-6 text-purple-400" />}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ══ LAPORAN + CARA KERJA (2 col desktop) ══ */}
      <HowToWorkDesktop isLoading={isLoading} laporanTerbaru={laporanTerbaru} />

      {/* ══ CARA KERJA MOBILE ══ */}
      <div className="md:hidden px-4 pb-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          custom={0}
          viewport={{ once: true, margin: "-40px" }}
        >
          <h2 className="text-lg font-bold text-stone-900 mb-1">
            Bagaimana TemuKan Membantu?
          </h2>
          <p className="text-xs text-stone-500 mb-5">
            3 langkah sederhana untuk memulai pencarian
          </p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
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
            <motion.div
              key={s.title}
              className="flex gap-4 bg-white rounded-2xl p-4 border border-stone-100 shadow-sm"
              variants={staggerItem}
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
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ══ CTA BOTTOM ══ */}
      <CtaBottom />

      {/* ══ FOOTER ══ */}
      <Footer />
    </PageWrapper>
  );
}
