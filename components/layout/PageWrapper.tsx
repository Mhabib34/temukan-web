import { Navbar } from "@/components/layout/Navbar";
import {BottomNav} from "@/components/layout/BottomNav.";

// ─── PageWrapper ──────────────────────────────────────────────────────────────
// Shell utama untuk semua halaman (kecuali auth).
// - Desktop: Navbar di atas, konten di bawah
// - Mobile: BottomNav di bawah, konten di atas dengan padding-bottom agar
//   tidak tertutup BottomNav

interface PageWrapperProps {
    children: React.ReactNode;
    /** Tambahkan max-width container (default: true) */
    contained?: boolean;
    /** Padding horizontal (default: true) */
    padded?: boolean;
}

export function PageWrapper({
                                children,
                                contained = true,
                                padded = true,
                            }: PageWrapperProps) {
    return (
        <div className="flex min-h-screen flex-col bg-stone-50">
            <Navbar />

            <main
                className={[
                    "flex-1",
                    // Padding bawah untuk BottomNav di mobile
                    "pb-20 md:pb-0",
                    contained ? "mx-auto w-full max-w-6xl" : "w-full",
                    padded ? "px-4 py-5 md:px-6 md:py-8" : "",
                ].join(" ")}
            >
                {children}
            </main>

            <BottomNav />
        </div>
    );
}

// ─── Usage ────────────────────────────────────────────────────────────────────
// Halaman normal:
//   <PageWrapper>...</PageWrapper>
//
// Halaman fullscreen (peta, dsb):
//   <PageWrapper contained={false} padded={false}>...</PageWrapper>