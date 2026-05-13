import { Metadata } from "next";
import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const metadata: Metadata = {
  title: "Tentang Kami — Titip Jejak",
  description:
    "Titip Jejak hadir dari keprihatinan terhadap kasus orang hilang di Indonesia. Kenali misi, visi, dan orang di balik platform komunitas ini.",
};

const values = [
  {
    icon: "🤝",
    title: "Komunitas",
    desc: "Kekuatan terbesar ada pada kepedulian bersama. Setiap laporan, setiap informasi, setiap mata yang peduli — semuanya berarti.",
  },
  {
    icon: "⚡",
    title: "Kecepatan",
    desc: "Jam-jam pertama adalah yang paling kritis. Teknologi kami dirancang untuk mempercepat penyebaran informasi.",
  },
  {
    icon: "🔒",
    title: "Kepercayaan",
    desc: "Data pribadi dijaga dengan serius. Kepercayaan komunitas adalah fondasi dari segala yang kami bangun.",
  },
  {
    icon: "💛",
    title: "Nirlaba",
    desc: "Tidak ada motif komersial. Titip Jejak ada semata-mata untuk membantu, bukan untuk mencari keuntungan.",
  },
];

export default function AboutPage() {
  return (
    <PageWrapper contained padded>
      <div className="flex flex-col items-center w-full pb-20">
        {/* Hero */}
        <div className="mb-16 max-w-6xl">
          <span className="inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-600 mb-4">
            Tentang Kami
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-6 leading-tight">
            Kami percaya setiap orang{" "}
            <span className="text-orange-500">berhak ditemukan.</span>
          </h1>
          <p className="text-stone-500 text-lg leading-relaxed">
            Titip Jejak lahir dari keprihatinan mendalam terhadap kasus orang
            hilang di Indonesia yang kerap tidak tertangani dengan cepat, karena
            keterbatasan informasi, jangkauan, dan koordinasi.
          </p>
        </div>

        {/* Story */}
        <div className="mb-16 max-w-6xl">
          <div className="rounded-3xl bg-stone-50 p-8 md:p-10 border border-stone-100">
            <h2 className="text-2xl font-extrabold text-stone-900 mb-5">
              Kisah di Balik Titip Jejak
            </h2>
            <div className="space-y-4 text-stone-500 leading-relaxed">
              <p>
                Di Indonesia, ribuan laporan orang hilang masuk setiap tahunnya.
                Namun banyak di antaranya tidak mendapat respons cepat, bukan
                karena tidak ada yang peduli, melainkan karena informasinya
                tersebar dan tidak terkoordinasi.
              </p>
              <p>
                Titip Jejak hadir sebagai jembatan: menghubungkan{" "}
                <strong className="text-stone-700">
                  penemu, pencari, dan relawan
                </strong>{" "}
                dalam satu ekosistem yang mudah diakses dan digunakan siapa
                saja. Dengan teknologi pencocokan laporan dan peta berbasis
                lokasi, kami berharap waktu pencarian dapat diperpendek secara
                signifikan.
              </p>
              <p>
                Platform ini bukan produk korporasi. Ini adalah proyek dari
                seorang developer yang percaya bahwa teknologi seharusnya
                berpihak pada kemanusiaan.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-stone-900 mb-8">
            Nilai yang Kami Pegang
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl bg-white border border-stone-100 p-6 hover:border-orange-200 hover:shadow-sm transition-all"
              >
                <span className="text-3xl mb-3 block">{v.icon}</span>
                <h3 className="font-extrabold text-stone-900 mb-1">
                  {v.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Builder */}
        <div className="mb-16 max-w-6xl">
          <div className="rounded-3xl bg-orange-50 border border-orange-100 p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white text-2xl font-extrabold">
              H
            </div>
            <div>
              <p className="text-sm font-semibold text-orange-500 mb-1">
                Dibuat & dikelola oleh
              </p>
              <h3 className="text-xl font-extrabold text-stone-900 mb-2">
                Muhammad Habib
              </h3>
              <p className="text-stone-500 leading-relaxed text-sm">
                Developer independen yang membangun Titip Jejak sebagai
                kontribusi nyata untuk masyarakat Indonesia. Platform ini
                bersifat nirlaba dan berbasis komunitas — tidak ada investor,
                tidak ada iklan.
              </p>
              <a
                href="mailto:mhabib34official@gmail.com"
                className="mt-4 inline-block text-sm text-orange-500 font-semibold hover:underline"
              >
                mhabib34official@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* CTA Donasi */}
        <div className="max-w-6xl">
          <div className="rounded-3xl bg-stone-900 p-8 md:p-10 text-center">
            <h2 className="text-2xl font-extrabold text-white mb-3">
              Dukung Titip Jejak Tetap Gratis untuk Semua
            </h2>
            <p className="text-stone-400 mb-6 leading-relaxed">
              Titip Jejak berjalan tanpa iklan dan investor. Jika Anda ingin
              membantu platform ini terus beroperasi dan berkembang, donasi
              kecil Anda sangat berarti.
            </p>
            <Link
              href="/#footer"
              className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-3.5 font-bold text-white hover:bg-orange-600 transition-colors"
            >
              💛 Dukung via Donasi
            </Link>
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
