"use client";

import { DesktopLeftPanel } from "@/components/auth/DesktopLeftPanel";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// ─── Role cards config ────────────────────────────────────────────────────────
// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  return (
    <>
      {/* ── Mobile layout ── */}
      <div className="lg:hidden">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-stone-800">Daftar Akun Baru</h2>
          <p className="text-stone-500 text-sm mt-1">
            Lengkapi data untuk mulai berkontribusi.
          </p>
        </div>

        {/* Instance RegisterForm tersendiri untuk mobile */}
        <RegisterForm idSuffix="m" />

        <p className="text-center text-sm text-stone-500 mt-5">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-orange-500 hover:text-orange-600 font-semibold"
          >
            Masuk di sini
          </Link>
        </p>
      </div>

      {/* ── Desktop: split screen ── */}
      <div className="hidden lg:grid lg:grid-cols-[3fr_2fr] min-h-screen">
        <DesktopLeftPanel />
        <div className="flex flex-col justify-center px-10 py-10 bg-white overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/login"
                className="flex hover:text-orange-600 items-center gap-1.5 text-sm text-stone-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Login
              </Link>
              <span className="text-sm text-stone-400">Langkah 1 dari 2</span>
            </div>

            <div className="mb-7">
              <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                Buat Akun Baru
              </h1>
              <p className="text-stone-500 text-sm mt-1.5">
                Lengkapi data diri Anda untuk mulai berkontribusi.
              </p>
            </div>

            {/* Instance RegisterForm tersendiri untuk desktop */}
            <RegisterForm idSuffix="d" />

            <p className="text-center text-sm text-stone-500 mt-5">
              Sudah memiliki akun?{" "}
              <Link
                href="/login"
                className="text-orange-500 hover:text-orange-600 font-semibold"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
