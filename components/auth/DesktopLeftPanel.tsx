import Link from "next/link";
import { useStats } from "@/hooks/useStats";

function StatSkeleton() {
  return <div className="h-8 w-20 bg-white/20 rounded animate-pulse" />;
}

export function DesktopLeftPanel() {
  const { data: stats, isLoading } = useStats();

  const totalResolved = stats?.total_resolved;
  const totalVolunteers = stats?.total_volunteers;

  return (
    <div className="flex flex-col justify-between bg-orange-500 px-12 py-12 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-25 -left-25 w-112.5 h-112.5 rounded-full bg-white opacity-[0.07]" />
        <div className="absolute -bottom-20 -right-20 w-87.5 h-87.5 rounded-full bg-white opacity-[0.07]" />
        <div className="absolute bottom-24 left-0 right-0 opacity-[0.06]">
          <svg
            viewBox="0 0 800 300"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="150" cy="150" rx="140" ry="60" />
            <ellipse cx="380" cy="140" rx="180" ry="70" />
            <ellipse cx="620" cy="155" rx="130" ry="55" />
            <ellipse cx="750" cy="145" rx="60" ry="40" />
          </svg>
        </div>
      </div>

      {/* Logo */}
      <Link href="/" className="relative z-10 flex items-center gap-2.5">
        <span className="font-bold text-xl text-white tracking-tight">
          Titip Jejak
        </span>
      </Link>

      {/* Middle: tagline + testimonials */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
        <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-3">
          Bersama, kita temukan.
        </p>
        <div className="w-10 h-0.5 bg-white/40 mb-10" />

        <div className="space-y-8 max-w-sm">
          <blockquote>
            <p className="text-white text-base italic leading-relaxed">
              &quot;Berkat bantuan komunitas di Titip Jejak, ayah saya berhasil
              ditemukan hanya dalam waktu 24 jam. Rasa syukur kami tak
              terhingga.&quot;
            </p>
            <footer className="mt-3 text-orange-200 text-sm">
              — Sari, Jakarta Selatan
            </footer>
          </blockquote>
          <blockquote>
            <p className="text-white text-base italic leading-relaxed">
              &quot;Sistem pelaporan yang sangat mudah membantu saya memberikan
              informasi akurat tentang anak hilang yang saya lihat di
              pasar.&quot;
            </p>
            <footer className="mt-3 text-orange-200 text-sm">
              — Pak Budi, Relawan
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 flex gap-10">
        <div>
          {isLoading ? (
            <StatSkeleton />
          ) : (
            <p className="text-white font-bold text-2xl">
              {stats?.total_resolved !== undefined
                ? `${totalResolved.toLocaleString("id-ID")}+`
                : "—"}
            </p>
          )}
          <p className="text-orange-200 text-sm mt-0.5">Orang Ditemukan</p>
        </div>
        <div>
          {isLoading ? (
            <StatSkeleton />
          ) : (
            <p className="text-white font-bold text-2xl">
              {stats?.total_volunteers !== undefined
                ? `${(totalVolunteers / 1000).toFixed(0)}k`
                : "—"}
            </p>
          )}
          <p className="text-orange-200 text-sm mt-0.5">Relawan Aktif</p>
        </div>
      </div>
    </div>
  );
}
