export function StepCard({ step, title, desc, isLast = false }: {
    step: number; title: string; desc: string; isLast?: boolean;
}) {
    return (
        <div className="flex gap-4 relative">
            {/* Connector line */}
            {!isLast && (
                <div className="absolute left-4 top-9 bottom-0 w-px border-l-2 border-dashed border-orange-200" />
            )}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 z-10
                ${step === 1 ? "bg-orange-500 text-white shadow-md shadow-orange-200" : "bg-white border-2 border-orange-300 text-orange-500"}`}>
                {step}
            </div>
            <div className="pb-6">
                <p className="text-sm font-bold text-stone-800 mb-1">{title}</p>
                <p className="text-xs text-stone-500 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}