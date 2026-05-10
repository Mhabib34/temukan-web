"use client";

import Link from "next/link";
import { useState } from "react";
import { DonasiModal } from "@/components/fragment/DonasiModal";

export function CtaBottom() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="px-4 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-orange-500 rounded-3xl px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 leading-tight">
                Jadilah Bagian dari
                <br />
                Solusi Kemanusiaan Kami.
              </h2>
              <p className="text-orange-100 text-sm md:text-base mb-7 max-w-md mx-auto leading-relaxed">
                Bergabunglah sebagai relawan dan bantu awasi lingkungan sekitar
                Anda. Keberadaan Anda bisa menyelamatkan nyawa seseorang hari
                ini.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  href="/register"
                  className="h-11 px-8 rounded-2xl bg-white text-orange-600 font-bold text-sm flex items-center justify-center shadow-md hover:bg-orange-50 transition-all active:scale-95"
                >
                  Daftar Relawan
                </Link>
                {/* tombol donasi — buka modal */}
                <button
                  onClick={() => setModalOpen(true)}
                  className="h-11 cursor-pointer px-8 rounded-2xl bg-orange-600 text-white font-semibold text-sm flex items-center justify-center border-2 border-orange-400 hover:bg-orange-700 transition-all active:scale-95"
                >
                  Donasi Dukungan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DonasiModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
