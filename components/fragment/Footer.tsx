export function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="border-t border-stone-200 bg-white px-4 py-5">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-stone-400">&copy;{currentYear}{" "} TemuKan Indonesia. Bersama Memulangkan yang Terpisah.</p>
                <div className="flex items-center gap-5">
                    {["Kebijakan Privasi", "Syarat & Ketentuan", "Hubungi Kami"].map(item => (
                        <a key={item} href="#" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">{item}</a>
                    ))}
                </div>
            </div>
        </footer>
    )
}