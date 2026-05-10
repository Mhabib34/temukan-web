"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DollarSign, Heart, X } from "lucide-react";

interface DonasiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DonasiModal({ isOpen, onClose }: DonasiModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* overlay */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="bg-white w-full max-w-md rounded-3xl px-6 pt-4 pb-8 flex flex-col gap-4">
              {/* handle */}
              <div className="w-9 h-1 rounded-full bg-stone-200 mx-auto" />

              {/* header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900">
                      Dukung TemuKan
                    </p>
                    <p className="text-xs text-stone-500">
                      Bantu kami terus beroperasi
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors group cursor-pointer"
                  aria-label="Tutup"
                >
                  <X className="w-4 h-4 group-hover:text-orange-500 group-hover:scale-150 transition-all duration-200" />
                </button>
              </div>

              {/* deskripsi */}
              <p className="text-sm text-stone-500 leading-relaxed">
                TemuKan adalah platform komunitas nirlaba. Setiap donasi
                membantu kami menjaga server tetap berjalan, mengembangkan fitur
                baru, dan membantu lebih banyak keluarga menemukan orang
                tersayang.
              </p>

              {/* perks */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { emoji: "🖥️", label: "Biaya server" },
                  { emoji: "⚙️", label: "Pengembangan fitur" },
                  { emoji: "📱", label: "Aplikasi mobile" },
                  { emoji: "👥", label: "Operasional tim" },
                ].map((p) => (
                  <div
                    key={p.label}
                    className="flex items-center gap-2 bg-stone-50 rounded-xl px-3 py-2.5"
                  >
                    <span className="text-sm">{p.emoji}</span>
                    <span className="text-xs text-stone-600">{p.label}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-100" />

              {/* 2 tombol */}
              <div className="flex flex-col gap-2">
                <a
                  href="https://trakteer.id/hbibdev/tip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Heart className="w-4 h-4" />
                  Trakteer — Mie Ayam Rp 20.000
                </a>

                <a
                  href="https://saweria.co/hbibdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 rounded-xl bg-white border-2 border-orange-200 hover:border-orange-400 text-orange-500 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <DollarSign className="w-4 h-4" />
                  Saweria — Nominal Bebas
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
