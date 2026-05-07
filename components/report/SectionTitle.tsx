export function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <div className="w-0.5 h-4 bg-orange-500 rounded-full" />
            <p className="text-sm font-semibold text-stone-700">{children}</p>
        </div>
    );
}