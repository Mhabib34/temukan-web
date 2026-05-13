"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useAuthStore } from "@/store/authStore";
import { useMatchDetail } from "@/hooks/useMatch";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { MatchDetailSkeleton } from "@/components/skeleton/MatchDetailSkeleton";
import { ScoreRing } from "@/components/fragment/ScoreRing";
import { BreakdownBars } from "@/components/fragment/BreakDownBars";
import { ReportDetailCard } from "@/components/card/ReportDetailCard";

export default function MatchDetailPage() {
  const router = useRouter();
  const params = useParams();
  const matchId = params.id as string;

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const { data, isLoading, isError, error } = useMatchDetail(matchId);

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;
  if (isLoading) return <MatchDetailSkeleton />;

  if (isError) {
    const msg =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ?? "Gagal memuat detail kecocokan";
    return (
      <PageWrapper contained padded>
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-red-600 font-semibold">{msg}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-sm text-stone-500 hover:text-stone-700 underline"
          >
            Kembali
          </button>
        </div>
      </PageWrapper>
    );
  }

  if (!data) return null;

  const match = data.data;
  const timeAgo = formatDistanceToNow(new Date(match.created_at), {
    addSuffix: true,
    locale: localeId,
  });

  return (
    <PageWrapper contained padded>
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-5 transition"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Detail Kecocokan
      </button>

      {/* Hero: Score ring + breakdown */}
      <div className="rounded-2xl border border-stone-100 bg-white shadow-sm p-6 mb-5 text-center">
        <ScoreRing score={match.score} />
        <BreakdownBars score={match.score} />
        <p className="text-xs text-stone-400 mt-3">Dianalisis {timeAgo}</p>
      </div>

      {/* Dua kartu laporan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <ReportDetailCard laporan={match.found_report} role="found" />
        <ReportDetailCard laporan={match.missing_report} role="missing" />
      </div>

      {/* Bottom action bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <button
          onClick={() => router.back()}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-stone-200 py-3 text-sm font-medium text-stone-600 hover:bg-stone-50 transition"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Bukan Dia
        </button>

        {match.found_report.whatsapp_share_url && (
          <a
            href={match.found_report.whatsapp_share_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-stone-800 hover:bg-stone-900 transition py-3 text-sm font-semibold text-white"
          >
            {/* chat icon */}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
            Hubungi Penemu
          </a>
        )}

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "Hasil Kecocokan TemuKan",
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
            }
          }}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-stone-200 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 transition"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>
          Bagikan Hasil
        </button>
      </div>
    </PageWrapper>
  );
}
