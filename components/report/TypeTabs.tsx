import type {ReportType} from "@/types";

interface TypeTabsProps {
    value: ReportType | undefined;
    onChange: (v: ReportType | undefined) => void;
}

export function TypeTabs({ value, onChange }: TypeTabsProps) {
    const tabs = [
        { value: undefined, label: "Semua" },
        { value: "missing" as ReportType, label: "Hilang" },
        { value: "found" as ReportType, label: "Ditemukan" },
    ];

    return (
        <div className="flex gap-2 lg:hidden">
            {tabs.map((tab) => (
                <button
                    key={tab.label}
                    onClick={() => onChange(tab.value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                        value === tab.value
                            ? "bg-orange-500 text-white shadow-sm"
                            : "border border-stone-200 bg-white text-stone-600"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
