import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: "Titip Jejak",
    template: "%s | Titip Jejak",
  },
  description:
    "Platform pencarian orang hilang — menghubungkan penemu, keluarga pencari, dan relawan di Indonesia.",
  keywords: [
    "orang hilang",
    "pencarian",
    "titip jejak",
    "relawan",
    "Indonesia",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.png",
    apple: "/icons/icon.png",
  },
  openGraph: {
    title: "Titip Jejak",
    description: "Platform pencarian orang hilang di Indonesia.",
    siteName: "Titip Jejak",
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Cegah zoom tidak sengaja di mobile
  themeColor: "#ffffff",
};

// ─── Root Layout ──────────────────────────────────────────────────────────────

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
