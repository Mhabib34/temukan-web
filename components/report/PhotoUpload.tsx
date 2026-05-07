import {useRef} from "react";
import {ImagePlus, X} from "lucide-react";
import {toast} from "sonner";
import {Label} from "@/components/report/Label";

export function PhotoUpload({
                                currentUrl,
                                file,
                                onChange,
                            }: {
    currentUrl: string | null;
    file: File | null;
    onChange: (f: File | null) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const preview = file ? URL.createObjectURL(file) : currentUrl;

    return (
        <div className="space-y-2">
            <Label>Foto</Label>
            <div
                onClick={() => inputRef.current?.click()}
                className="relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 transition hover:border-orange-300 hover:bg-orange-50"
                style={{ aspectRatio: "4/3" }}
            >
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview foto"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition hover:opacity-100">
                            <p className="text-xs font-semibold text-white">Ganti Foto</p>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 p-6 text-center">
                        <ImagePlus className="h-8 w-8 text-stone-300" />
                        <p className="text-xs text-stone-400">
                            Klik untuk upload foto
                            <br />
                            <span className="text-stone-300">JPG, PNG, WebP · Maks 5MB</span>
                        </p>
                    </div>
                )}
            </div>

            {file && (
                <button
                    type="button"
                    onClick={() => onChange(null)}
                    className="flex items-center gap-1.5 text-xs text-stone-400 transition hover:text-red-500"
                >
                    <X className="h-3 w-3" />
                    Batalkan perubahan foto
                </button>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    if (f.size > 5 * 1024 * 1024) {
                        toast.error("Ukuran foto maksimal 5MB");
                        return;
                    }
                    onChange(f);
                    e.target.value = "";
                }}
            />
        </div>
    );
}