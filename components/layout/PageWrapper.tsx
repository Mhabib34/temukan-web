import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav.";

interface PageWrapperProps {
    children: React.ReactNode;
    contained?: boolean;
    padded?: boolean;
}

export function PageWrapper({
                                children,
                                contained = true,
                                padded = true,
                            }: PageWrapperProps) {
    return (
        <div className="flex min-h-screen flex-col bg-white overflow-x-hidden">
            <Navbar />

            <main
                className={[
                    "flex-1",
                    "max-w-6xl mx-auto",
                    // Desktop: offset sidebar kiri (w-16) dan topbar (h-14)
                    "md:mt-14",
                    // Mobile: offset top bar (h-12) dan BottomNav
                    "mt-12 md:mt-0 pb-20 md:pb-0",
                    contained ? "w-full" : "w-full",
                    padded ? "px-4 py-5 md:px-8 md:py-8" : "",
                ].join(" ")}
            >
                {children}
            </main>

            <BottomNav />
        </div>
    );
}