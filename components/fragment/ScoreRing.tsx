export function ScoreRing({ score }: { score: number }) {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-36 h-36 flex items-center justify-center mx-auto">
            {/* Track */}
            <svg className="w-36 h-36 -rotate-90 absolute inset-0" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={radius} fill="none" stroke="#fed7aa" strokeWidth="10" />
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                />
            </svg>
            <div className="flex flex-col items-center justify-center z-10">
                <span className="text-4xl font-bold text-stone-800 leading-none">{score}%</span>
                <span className="text-sm text-stone-500 mt-1">Kecocokan</span>
            </div>
        </div>
    );
}