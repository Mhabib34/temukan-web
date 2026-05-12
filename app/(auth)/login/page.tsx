"use client";

import { DesktopLeftPanel } from "@/components/auth/DesktopLeftPanel";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* ── Mobile layout ── */}
      <div className="lg:hidden">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-stone-800">Masuk ke Akun</h2>
          <p className="text-stone-500 text-sm mt-1">
            Gunakan akun Anda untuk akses penuh fitur TemuKan.
          </p>
        </div>

        {/* Instance LoginForm tersendiri untuk mobile */}
        <LoginForm />

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-stone-200" />
          <span className="text-xs text-stone-400">atau</span>
          <div className="flex-1 h-px bg-stone-200" />
        </div>

        <p className="text-center text-sm text-stone-500">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-orange-500 hover:text-orange-600 font-semibold"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>

      {/* ── Desktop: split screen ── */}
      <div className="hidden lg:grid lg:grid-cols-[3fr_2fr] min-h-screen">
        <DesktopLeftPanel />
        <div className="flex flex-col justify-center px-12 py-12 bg-white">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                Masuk ke Akun
              </h1>
              <p className="text-stone-500 text-sm mt-1.5">
                Akses panel kontrol dan lapor keberadaan.
              </p>
            </div>

            {/* Instance LoginForm tersendiri untuk desktop */}
            <LoginForm />

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-xs text-stone-400">atau</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            <p className="text-center text-sm text-stone-500">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="text-orange-500 hover:text-orange-600 font-semibold"
              >
                Daftar Gratis
              </Link>
            </p>
          </div>

          <p className="mt-8 text-center text-xs text-stone-400">
            &copy;{currentYear} TemuKan Indonesia. Bersama dalam kemanusiaan.
          </p>
        </div>
      </div>
    </>
  );
}
