export function inputCls(hasError?: boolean) {
    return [
        "w-full rounded-xl border px-4 py-3 text-sm text-stone-800 outline-none transition bg-white",
        "placeholder:text-stone-300",
        hasError
            ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-stone-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100",
    ].join(" ");
}