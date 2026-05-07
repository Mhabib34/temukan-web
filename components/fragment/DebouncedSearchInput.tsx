import {useEffect, useState} from "react";
import {Search} from "lucide-react";
import {useDebouncedValue} from "@/utils/useDebounce";

interface DebouncedSearchInputProps {
    initialValue: string | undefined;
    onCommit: (value: string | undefined) => void;
    placeholder?: string;
    className?: string;
    iconSize?: number;
}

export function DebouncedSearchInput({
                                  initialValue,
                                  onCommit,
                                  placeholder = "Cari...",
                                  className = "",
                                  iconSize = 14,
                              }: DebouncedSearchInputProps) {
    const [local, setLocal] = useState(initialValue ?? "");
    const debounced = useDebouncedValue(local, 500);

    // Sinkronkan ke URL hanya setelah debounce selesai
    useEffect(() => {
        onCommit(debounced || undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);

    // Sinkronkan lokal jika URL berubah dari luar (mis. clearAll)
    useEffect(() => {
        setLocal(initialValue ?? "");
    }, [initialValue]);

    return (
        <div className="relative">
            <Search
                size={iconSize}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
                type="text"
                placeholder={placeholder}
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                className={className}
            />
        </div>
    );
}
