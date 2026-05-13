import { PageWrapper } from "@/components/layout/PageWrapper";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — Titip Jejak",
  description:
    "Pelajari bagaimana Titip Jejak mengumpulkan, menggunakan, dan melindungi data pribadi Anda dalam platform pencarian orang hilang berbasis komunitas.",
};

const sections = [
  {
    title: "Data yang Kami Kumpulkan",
    content: (
      <ul className="space-y-2 text-stone-500">
        {[
          "Nama lengkap",
          "Alamat email",
          "Nomor telepon / HP",
          "Foto profil atau foto terkait laporan",
          "Koordinat GPS dan/atau informasi lokasi",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-400" />
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    title: "Tujuan Penggunaan Data",
    content: (
      <ul className="space-y-2 text-stone-500">
        {[
          "Autentikasi dan keamanan akun pengguna",
          "Menampilkan laporan orang hilang kepada komunitas",
          "Pencocokan (matching) antar laporan untuk mempercepat pencarian",
          "Komunikasi terkait status laporan yang Anda buat atau ikuti",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-400" />
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    title: "Perlindungan Data",
    content: (
      <p className="text-stone-500 leading-relaxed">
        Data Anda{" "}
        <strong className="text-stone-700">
          tidak dijual, disewakan, atau dibagikan
        </strong>{" "}
        kepada pihak ketiga untuk tujuan komersial. Kami hanya membagikan
        informasi yang diperlukan kepada sesama pengguna platform dalam konteks
        pencarian orang hilang yang sah.
      </p>
    ),
  },
  {
    title: "Hak Penghapusan Data",
    content: (
      <p className="text-stone-500 leading-relaxed">
        Anda berhak meminta penghapusan data pribadi Anda dari sistem kami kapan
        saja. Kirimkan permintaan melalui email ke{" "}
        <a
          href="mailto:mhabib34official@gmail.com"
          className="text-orange-500 font-semibold hover:underline"
        >
          mhabib34official@gmail.com
        </a>{" "}
        dengan subjek <em>&quot;Permintaan Hapus Data&quot;</em>. Kami akan
        memproses permintaan dalam waktu maksimal 14 hari kerja.
      </p>
    ),
  },
  {
    title: "Perubahan Kebijakan",
    content: (
      <p className="text-stone-500 leading-relaxed">
        Kebijakan ini dapat diperbarui sewaktu-waktu. Perubahan signifikan akan
        diberitahukan melalui email atau notifikasi di platform. Penggunaan
        layanan Titip Jejak setelah perubahan diterbitkan berarti Anda
        menyetujui kebijakan yang diperbarui.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <PageWrapper contained padded>
      <div className="flex flex-col items-center w-full pb-20">
        {/* Header */}
        <div className="mb-12 max-w-6xl">
          <span className="inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-600 mb-4">
            Legal
          </span>
          <h1 className="text-4xl font-extrabold text-stone-900 mb-4">
            Kebijakan Privasi
          </h1>
          <p className="text-stone-500 text-lg leading-relaxed">
            Kami berkomitmen menjaga privasi dan keamanan data Anda. Halaman ini
            menjelaskan informasi apa yang kami kumpulkan dan bagaimana kami
            menggunakannya.
          </p>
          <p className="mt-3 text-sm text-stone-400">
            Berlaku efektif sejak{" "}
            <strong className="text-stone-500">10 Mei 2026</strong>
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8 max-w-6xl">
          {sections.map((section, i) => (
            <div
              key={section.title}
              className="rounded-2xl bg-stone-50 p-6 md:p-8 border border-stone-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <h2 className="text-lg font-extrabold text-stone-900">
                  {section.title}
                </h2>
              </div>
              {section.content}
            </div>
          ))}

          {/* Contact */}
          <div className="rounded-2xl bg-orange-50 border border-orange-100 p-6 md:p-8">
            <h2 className="text-lg font-extrabold text-stone-900 mb-2">
              Hubungi Kami
            </h2>
            <p className="text-stone-500 mb-4">
              Jika Anda memiliki pertanyaan terkait kebijakan privasi ini,
              jangan ragu untuk menghubungi pengelola platform.
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
