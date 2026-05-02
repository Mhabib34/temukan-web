import Link from "next/link";

export default function AuthLayout({children,}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            <header className="px-6 pt-8 pb-2">
                <Link href="/" className="inline-flex items-center gap-2 group">
                    <span className="font-bold text-lg text-stone-800 tracking-tight">
            Temu<span className="text-orange-500">Kan</span>
          </span>
                </Link>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center px-5 py-8">
                {children}
            </main>
            <footer className="text-center text-xs text-stone-400 pb-6 px-4">
                Dengan melanjutkan, kamu menyetujui{" "}
                <a href="/syarat" className="underline underline-offset-2 hover:text-stone-600">Syarat Penggunaan</a>
                {" "}dan{" "}
                <a href="/privasi" className="underline underline-offset-2 hover:text-stone-600">Kebijakan Privasi</a>
            </footer>
        </div>
    );
}