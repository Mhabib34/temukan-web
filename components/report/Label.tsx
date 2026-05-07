export function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="mb-1.5 block text-sm font-medium text-stone-700">
            {children}
            {required && <span className="ml-0.5 text-red-400">*</span>}
        </label>
    );
}