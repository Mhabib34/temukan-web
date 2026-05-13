import { Metadata } from "next";
import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const metadata: Metadata = {
  title: "Kontak — Titip Jejak",
  description:
    "Hubungi tim Titip Jejak untuk laporan bug, pertanyaan, kerja sama, atau permintaan penghapusan data.",
};

const topics = [
  {
    icon: "🐛",
    title: "Laporan Bug",
    desc: "Temukan masalah teknis di platform? Ceritakan kepada kami agar segera diperbaiki.",
  },
  {
    icon: "❓",
    title: "Pertanyaan Umum",
    desc: "Ada yang ingin Anda tanyakan seputar cara kerja atau fitur Titip Jejak?",
  },
  {
    icon: "🤝",
    title: "Kerja Sama",
    desc: "Ingin berkolaborasi — sebagai relawan, institusi, atau mitra teknologi?",
  },
  {
    icon: "🗑️",
    title: "Hapus Data",
    desc: 'Minta penghapusan data pribadi Anda dari sistem kami dengan subjek "Permintaan Hapus Data".',
  },
];

export default function ContactPage() {
  return (
    <PageWrapper contained padded>
      <div className="flex flex-col items-center w-full pb-20">
        {/* Header */}
        <div className="mb-12 max-w-6xl">
          <span className="inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-600 mb-4">
            Kontak
          </span>
          <h1 className="text-4xl font-extrabold text-stone-900 mb-4">
            Kami siap mendengar
          </h1>
          <p className="text-stone-500 text-lg leading-relaxed">
            Punya pertanyaan, masukan, atau perlu bantuan? Jangan ragu untuk
            menghubungi kami, kami akan merespons secepat mungkin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mb-12">
          {topics.map((t) => (
            <div
              key={t.title}
              className="rounded-2xl bg-stone-50 border border-stone-100 p-6 hover:border-orange-200 hover:shadow-sm transition-all"
            >
              <span className="text-2xl mb-3 block">{t.icon}</span>
              <h3 className="font-extrabold text-stone-900 mb-1">{t.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact Card */}
        <div className="max-w-6xl space-y-4">
          {/* Email */}
          <div className="rounded-2xl bg-orange-50 border border-orange-100 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-stone-400 uppercase tracking-wide mb-1">
                  Email
                </p>
                <p className="text-stone-900 font-extrabold text-lg">
                  mhabib34official@gmail.com
                </p>
                <p className="text-sm text-stone-500 mt-1">
                  Pengelola: Muhammad Habib · Respons dalam 1-3 hari kerja
                </p>
              </div>
              <a
                href="mailto:mhabib34official@gmail.com"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600 transition-colors text-sm"
              >
                Kirim Email
              </a>
            </div>
          </div>

          {/* Instagram */}
          {/* <div className="rounded-2xl bg-stone-50 border border-stone-100 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-stone-400 uppercase tracking-wide mb-1">
                  Instagram
                </p>
                <p className="text-stone-900 font-extrabold text-lg">
                  @temukanid
                </p>
                <p className="text-sm text-stone-500 mt-1">
                  Update terbaru, kampanye pencarian, dan info komunitas
                </p>
              </div>
              <a
                href="#"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-stone-900 px-6 py-3 font-bold text-white hover:bg-stone-700 transition-colors text-sm"
              >
                📸 Ikuti Kami
              </a>
            </div>
          </div> */}

          {/* Note */}
          <p className="text-sm text-stone-400 px-1">
            Titip Jejak adalah platform nirlaba yang dikelola secara mandiri.
            Kami menjawab pesan sesuai kemampuan dan ketersediaan. Terima kasih
            atas kesabaran Anda.
          </p>
        </div>

        {/* Back link */}
        <div className="mt-12">
          <Link
            href="/"
            className="text-sm text-orange-500 font-semibold hover:underline"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
