import { PageWrapper } from "@/components/layout/PageWrapper";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — Titip Jejak",
  description:
    "Pertanyaan yang sering ditanyakan seputar platform Titip Jejak — cara melapor, keamanan data, cara kerja pencarian, dan lainnya.",
};

const faqs = [
  {
    category: "Umum",
    items: [
      {
        q: "Apa itu Titip Jejak?",
        a: "Titip Jejak adalah platform komunitas berbasis teknologi yang membantu proses pencarian orang hilang di Indonesia. Kami menghubungkan penemu, pencari, dan relawan dalam satu ekosistem agar informasi bisa menyebar lebih cepat dan terkoordinasi.",
      },
      {
        q: "Apakah Titip Jejak gratis digunakan?",
        a: "Ya, sepenuhnya gratis. Titip Jejak adalah platform nirlaba yang tidak memungut biaya apapun dari pengguna. Operasional platform bergantung pada donasi sukarela dari komunitas.",
      },
      {
        q: "Siapa yang mengelola Titip Jejak?",
        a: "Titip Jejak dibuat dan dikelola oleh Muhammad Habib, developer independen. Platform ini bukan milik perusahaan komersial dan tidak memiliki investor.",
      },
    ],
  },
  {
    category: "Melapor & Mencari",
    items: [
      {
        q: "Bagaimana cara melaporkan orang hilang?",
        a: 'Daftar atau masuk ke akun Anda, lalu pilih "Buat Laporan". Isi informasi seperti nama, foto, lokasi terakhir terlihat, dan kontak yang bisa dihubungi. Laporan akan langsung tampil di peta komunitas setelah diverifikasi.',
      },
      {
        q: "Informasi apa yang sebaiknya disertakan dalam laporan?",
        a: "Semakin lengkap semakin baik. Idealnya: foto terbaru yang jelas, nama lengkap, usia, ciri fisik, lokasi dan waktu terakhir terlihat, serta nomor kontak pelapor. Informasi tambahan seperti pakaian yang dikenakan atau kondisi kesehatan juga sangat membantu.",
      },
      {
        q: "Bagaimana jika saya menemukan seseorang yang cocok dengan laporan?",
        a: 'Gunakan fitur "Saya Menemukan" dan cocokkan dengan laporan yang ada. Anda bisa langsung menghubungi pelapor melalui kontak yang tertera, atau kirim informasi melalui platform. Jangan memindahkan atau menahan orang tersebut — segera hubungi pihak berwenang jika diperlukan.',
      },
      {
        q: "Apakah laporan saya otomatis dicocokkan dengan laporan lain?",
        a: "Ya. Sistem kami secara otomatis mencoba mencocokkan laporan baru dengan laporan yang sudah ada berdasarkan lokasi, ciri fisik, dan waktu kejadian. Anda akan mendapat notifikasi jika ada potensi kecocokan.",
      },
    ],
  },
  {
    category: "Privasi & Keamanan",
    items: [
      {
        q: "Apakah data saya aman di Titip Jejak?",
        a: "Kami menjaga data Anda dengan serius. Data tidak dijual atau dibagikan ke pihak ketiga untuk tujuan komersial. Informasi hanya digunakan dalam konteks pencarian orang hilang di dalam platform.",
      },
      {
        q: "Bisakah saya menghapus data saya?",
        a: 'Bisa. Kirim permintaan ke mhabib34official@gmail.com dengan subjek "Permintaan Hapus Data". Kami akan memproses dalam maksimal 14 hari kerja.',
      },
      {
        q: "Apakah foto orang hilang yang saya unggah bisa dilihat publik?",
        a: "Ya, foto dan informasi dalam laporan memang dirancang untuk terlihat oleh komunitas agar pencarian lebih efektif. Pastikan Anda memiliki hak untuk mempublikasikan foto tersebut dan bahwa informasinya akurat.",
      },
    ],
  },
  {
    category: "Akun & Teknis",
    items: [
      {
        q: "Apakah saya harus punya akun untuk melihat laporan?",
        a: "Laporan publik dapat dilihat tanpa akun. Namun untuk membuat laporan, menghubungi pelapor, atau menggunakan fitur pencocokan, Anda perlu mendaftar.",
      },
      {
        q: "Saya menemukan bug atau masalah teknis, ke mana melapor?",
        a: 'Kirim detail masalah ke mhabib34official@gmail.com dengan subjek "Laporan Bug". Sertakan tangkapan layar jika memungkinkan. Kami sangat menghargai setiap laporan untuk memperbaiki platform.',
      },
      {
        q: "Apakah Titip Jejak tersedia sebagai aplikasi mobile?",
        a: "Saat ini Titip Jejak dapat diakses melalui browser di perangkat apapun dan sudah dioptimalkan untuk mobile. Aplikasi native sedang dalam pertimbangan pengembangan ke depan.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <PageWrapper contained padded>
      <div className="flex flex-col items-center w-full pb-20">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <span className="inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-600 mb-4">
            FAQ
          </span>
          <h1 className="text-4xl font-extrabold text-stone-900 mb-4">
            Pertanyaan yang Sering Diajukan
          </h1>
          <p className="text-stone-500 text-lg leading-relaxed">
            Tidak menemukan jawaban yang Anda cari?{" "}
            <Link
              href="/contact"
              className="text-orange-500 font-semibold hover:underline"
            >
              Hubungi kami langsung.
            </Link>
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="max-w-3xl space-y-10">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-4">
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-2xl border border-stone-100 bg-stone-50 open:bg-white open:border-orange-200 open:shadow-sm transition-all"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 font-extrabold text-stone-900 list-none select-none">
                      <span>{item.q}</span>
                      <span className="shrink-0 text-stone-300 group-open:text-orange-500 transition-colors text-xl leading-none">
                        +
                      </span>
                    </summary>
                    <p className="px-6 pb-5 text-stone-500 leading-relaxed text-sm border-t border-stone-100 pt-4">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 max-w-3xl rounded-2xl bg-orange-50 border border-orange-100 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-extrabold text-stone-900 mb-1">
              Masih ada pertanyaan?
            </p>
            <p className="text-sm text-stone-500">
              Kami siap membantu melalui email.
            </p>
          </div>
          <a
            href="mailto:mhabib34official@gmail.com"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            Kirim Pertanyaan
          </a>
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
