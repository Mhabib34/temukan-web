export function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null;
    return <p className="mt-1.5 text-xs text-red-500">{msg}</p>;
}