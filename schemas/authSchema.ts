import { z } from "zod";

// ─── Register Schema ──────────────────────────────────────────────────────────

export const registerSchema = z.object({
    name: z
        .string()
        .min(2, "Nama minimal 2 karakter")
        .max(255, "Nama maksimal 255 karakter"),

    email: z
        .string()
        .min(1, "Email wajib diisi")
        .email("Format email tidak valid"),

    password: z
        .string()
        .min(8, "Password minimal 8 karakter"),

    role: z.enum(["finder", "seeker", "volunteer"], {
        error: "Pilih peran kamu",
    }),

    phone: z
        .string()
        .regex(/^08[0-9]{8,11}$/, "Format nomor HP tidak valid (contoh: 08123456789)")
        .optional()
        .or(z.literal("")),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

// ─── Login Schema ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email wajib diisi")
        .email("Format email tidak valid"),

    password: z
        .string()
        .min(1, "Password wajib diisi"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;