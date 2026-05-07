import Link from "next/link";
import {ReportCard, ReportCardSkeleton} from "@/components/card/ReportCard";
import {StepCard} from "@/components/card/StepCard";
import {Report} from "@/types";

type Props = {
    isLoading: boolean;
    laporanTerbaru: Report[]
}

export function HowToWorkDesktop({isLoading, laporanTerbaru}: Props) {
    return (
        <div className="px-4 py-8">
            <div className="max-w-6xl mx-auto md:grid md:grid-cols-[1fr_300px] md:gap-8">

                {/* Laporan Terbaru */}
                <div>
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-bold text-stone-900">Laporan Terbaru</h2>
                            <p className="text-xs text-stone-500 mt-0.5">Membantu proses pencarian di sekitar Anda</p>
                        </div>
                        <Link href="/report"
                              className="flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors mt-1">
                            Lihat Semua
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </div>

                    {/* Mobile: horizontal list cards */}
                    <div className="md:hidden space-y-3">
                        {isLoading ? (
                            [1, 2, 3].map(i => <ReportCardSkeleton key={i} />)
                        ) : laporanTerbaru.length === 0 ? (
                            <div className="rounded-2xl border border-stone-100 bg-white p-8 text-center">
                                <p className="text-stone-400 text-sm">Belum ada laporan aktif.</p>
                            </div>
                        ) : (
                            laporanTerbaru.map(l => <ReportCard key={l.id} laporan={l} />)
                        )}
                    </div>

                    {/* Desktop: grid */}
                    <div className="hidden md:grid md:grid-cols-3 gap-4">
                        {isLoading ? (
                            [1, 2, 3].map(i => <ReportCardSkeleton key={i} />)
                        ) : laporanTerbaru.length === 0 ? (
                            <div className="col-span-3 rounded-2xl border border-stone-100 bg-white p-10 text-center">
                                <p className="text-stone-400 text-sm">Belum ada laporan aktif.</p>
                            </div>
                        ) : (
                            laporanTerbaru.map(l => <ReportCard key={l.id} laporan={l} />)
                        )}
                    </div>
                </div>

                {/* Cara Kerja — desktop only sidebar */}
                <div className="hidden md:block">
                    <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6">
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-5">Cara Kerja Kami</p>
                        <div className="space-y-0">
                            <StepCard step={1} title="Laporkan Kehilangan"
                                      desc="Isi formulir detail dengan foto terbaru dan lokasi terakhir orang yang dicari." />
                            <StepCard step={2} title="Verifikasi Kilat"
                                      desc="Tim admin kami memverifikasi laporan untuk memastikan data akurat sebelum disebarkan." />
                            <StepCard step={3} title="Penyebaran Luas"
                                      desc="Notifikasi dikirim ke ribuan relawan di radius area kehilangan secara real-time." />
                            <StepCard step={4} title="Update & Reuni" isLast
                                      desc="Terima info dari saksi mata langsung di peta untuk mempermudah penemuan." />
                        </div>
                        {/* Security note */}
                        <div className="mt-4 p-3 bg-stone-50 rounded-xl flex gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                </svg>
                            </div>
                            <p className="text-xs text-stone-500 leading-relaxed">
                                Sistem kami terenkripsi end-to-end dan bekerja sama dengan pihak berwajib setempat
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}