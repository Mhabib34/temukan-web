import { Metadata } from "next";
import { PageWrapper } from "@/components/layout/PageWrapper";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan — Titip Jejak",
  description:
    "Baca syarat dan ketentuan penggunaan platform Titip Jejak — komunitas pencarian orang hilang di Indonesia.",
};

const allowed = [
  "Melaporkan orang hilang dengan informasi yang benar dan dapat dipertanggungjawabkan",
  "Membagikan informasi penemuan orang yang mungkin cocok dengan laporan yang ada",
  "Berkontribusi sebagai relawan dalam proses pencarian",
  "Menghubungi pelapor untuk tujuan koordinasi pencarian yang sah",
];

const prohibited = [
  "Membuat laporan palsu atau menyesatkan",
  "Melakukan spam atau mengirim pesan massal yang tidak relevan",
  "Memuat konten berbau SARA, kebencian, atau diskriminasi",
  "Menyalahgunakan data pribadi orang lain yang diperoleh dari platform",
  "Menggunakan platform untuk tujuan komersial atau penipuan",
  "Mengganggu, mengintimidasi, atau melecehkan pengguna lain",
];

export default function TermsPage() {
  return (
    <PageWrapper contained padded>
      <div className="flex flex-col items-center w-full pb-20">
        {/* Header */}
        <div className="mb-12 max-w-6xl">
          <span className="inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-600 mb-4">
            Legal
          </span>
          <h1 className="text-4xl font-extrabold text-stone-900 mb-4">
            Syarat & Ketentuan
          </h1>
          <p className="text-stone-500 text-lg leading-relaxed">
            Dengan menggunakan Titip Jejak, Anda menyetujui syarat dan ketentuan
            berikut. Mohon baca dengan seksama sebelum menggunakan layanan kami.
          </p>
          <p className="mt-3 text-sm text-stone-400">
            Berlaku efektif sejak{" "}
            <strong className="text-stone-500">10 Mei 2026</strong>
          </p>
        </div>

        <div className="space-y-8 max-w-6xl">
          {/* Purpose */}
          <div className="rounded-2xl bg-stone-50 p-6 md:p-8 border border-stone-100">
            <h2 className="text-lg font-extrabold text-stone-900 mb-3">
              Tujuan Platform
            </h2>
            <p className="text-stone-500 leading-relaxed">
              Titip Jejak adalah platform komunitas yang dirancang{" "}
              <strong className="text-stone-700">khusus</strong> untuk membantu
              proses pencarian orang hilang di Indonesia. Platform ini hanya
              boleh digunakan untuk tujuan tersebut. Penggunaan di luar konteks
              pencarian orang hilang yang sah merupakan pelanggaran terhadap
              syarat ini.
            </p>
          </div>

          {/* Allowed */}
          <div className="rounded-2xl bg-stone-50 p-6 md:p-8 border border-stone-100">
            <h2 className="text-lg font-extrabold text-stone-900 mb-4">
              Yang Diperbolehkan
            </h2>
            <ul className="space-y-2">
              {allowed.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-stone-500"
                >
                  <span className="mt-1 text-orange-500 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Prohibited */}
          <div className="rounded-2xl bg-red-50 p-6 md:p-8 border border-red-100">
            <h2 className="text-lg font-extrabold text-stone-900 mb-4">
              Yang Dilarang
            </h2>
            <ul className="space-y-2">
              {prohibited.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-stone-500"
                >
                  <span className="mt-0.5 text-red-400 shrink-0">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Responsibility */}
          <div className="rounded-2xl bg-stone-50 p-6 md:p-8 border border-stone-100">
            <h2 className="text-lg font-extrabold text-stone-900 mb-3">
              Tanggung Jawab Pengguna
            </h2>
            <p className="text-stone-500 leading-relaxed">
              Pengguna sepenuhnya bertanggung jawab atas kebenaran dan
              keakuratan informasi yang dilaporkan. Titip Jejak tidak
              bertanggung jawab atas kerugian yang timbul akibat informasi yang
              tidak benar yang diberikan pengguna.
            </p>
          </div>

          {/* Moderation */}
          <div className="rounded-2xl bg-stone-50 p-6 md:p-8 border border-stone-100">
            <h2 className="text-lg font-extrabold text-stone-900 mb-3">
              Moderasi Konten
            </h2>
            <p className="text-stone-500 leading-relaxed">
              Titip Jejak berhak menghapus laporan, memblokir akun, atau
              mengambil tindakan lain terhadap pengguna yang melanggar syarat
              ini —{" "}
              <strong className="text-stone-700">
                tanpa pemberitahuan sebelumnya
              </strong>
              . Keputusan moderasi bersifat final demi menjaga keamanan dan
              kepercayaan komunitas.
            </p>
          </div>

          {/* Contact */}
          <div className="rounded-2xl bg-orange-50 border border-orange-100 p-6 md:p-8">
            <h2 className="text-lg font-extrabold text-stone-900 mb-2">
              Ada Pertanyaan?
            </h2>
            <p className="text-stone-500 mb-4">
              Jika Anda menemukan pelanggaran atau memiliki pertanyaan terkait
              syarat ini, hubungi kami segera.
            </p>
            <a
              href="mailto:mhabib34official@gmail.com"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
            >
              mhabib34official@gmail.com
            </a>
          </div>
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
