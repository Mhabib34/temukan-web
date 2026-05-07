export function StatCard({ value, label, icon, accent }: {
    value: string; label: string; icon: React.ReactNode; accent: string;
}) {
    return (
        <div className={`bg-white rounded-2xl p-5 flex items-center gap-4 border-l-4 ${accent} shadow-sm`}>
            <div className="text-stone-400">{icon}</div>
            <div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-2xl font-extrabold text-stone-900 leading-none">{value}</p>
            </div>
        </div>
    );
}