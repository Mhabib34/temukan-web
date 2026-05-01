import { z } from "zod";

// ─── Step 1: Tipe Laporan ─────────────────────────────────────────────────────

export const laporanStep1Schema = z.object({
    type: z.enum(["found", "missing"], {
        error: "Pilih jenis laporan",
    }),
});

export type LaporanStep1Values = z.infer<typeof laporanStep1Schema>;

// ─── Step 2: Detail Orang ─────────────────────────────────────────────────────

export const laporanStep2Schema = z.object({
    name: z
        .string()
        .max(255, "Nama maksimal 255 karakter")
        .optional()
        .or(z.literal("")),

    gender: z.enum(["male", "female", "unknown"], {
        error: "Pilih jenis kelamin",
    }),

    estimated_age: z
        .number({
            error: "Usia wajib diisi dan harus berupa angka",
        })
        .int("Usia harus bilangan bulat")
        .min(0, "Usia minimal 0")
        .max(120, "Usia maksimal 120"),

    description: z
        .string()
        .min(10, "Deskripsi minimal 10 karakter")
        .max(2000, "Deskripsi maksimal 2000 karakter"),
});

export type LaporanStep2Values = z.infer<typeof laporanStep2Schema>;

// ─── Step 3: Lokasi ───────────────────────────────────────────────────────────

export const laporanStep3Schema = z.object({
    last_seen_location: z
        .string()
        .min(5, "Lokasi minimal 5 karakter")
        .max(500, "Lokasi maksimal 500 karakter"),

    city: z
        .string()
        .min(2, "Kota wajib diisi"),

    province: z
        .string()
        .min(2, "Provinsi wajib diisi"),

    latitude: z
        .number()
        .min(-90)
        .max(90)
        .nullable()
        .optional(),

    longitude: z
        .number()
        .min(-180)
        .max(180)
        .nullable()
        .optional(),
});

export type LaporanStep3Values = z.infer<typeof laporanStep3Schema>;

// ─── Full Schema (gabungan semua step) ───────────────────────────────────────
// Dipakai saat submit final di step 3.

export const createLaporanSchema = laporanStep1Schema
    .merge(laporanStep2Schema)
    .merge(laporanStep3Schema);

export type CreateLaporanValues = z.infer<typeof createLaporanSchema>;

// ─── Update Schema ────────────────────────────────────────────────────────────
// Semua field opsional untuk partial update.

export const updateLaporanSchema = z.object({
    name: z
        .string()
        .max(255, "Nama maksimal 255 karakter")
        .optional()
        .or(z.literal("")),

    gender: z.enum(["male", "female", "unknown"]).optional(),

    estimated_age: z
        .number()
        .int("Usia harus bilangan bulat")
        .min(0)
        .max(120)
        .optional(),

    description: z
        .string()
        .min(10, "Deskripsi minimal 10 karakter")
        .max(2000)
        .optional(),

    last_seen_location: z
        .string()
        .min(5)
        .max(500)
        .optional(),

    city: z.string().min(2).optional(),

    province: z.string().min(2).optional(),

    latitude: z.number().min(-90).max(90).nullable().optional(),

    longitude: z.number().min(-180).max(180).nullable().optional(),

    status: z.enum(["active", "resolved"]).optional(),
});

export type UpdateLaporanValues = z.infer<typeof updateLaporanSchema>;

// ─── Filter Schema ────────────────────────────────────────────────────────────
// Untuk form filter di halaman /laporan.

export const laporanFilterSchema = z.object({
    type: z.enum(["found", "missing"]).optional(),
    status: z.enum(["active", "resolved"]).optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    gender: z.enum(["male", "female", "unknown"]).optional(),
    age_min: z.number().min(0).max(120).optional(),
    age_max: z.number().min(0).max(120).optional(),
    q: z.string().optional(),
}).refine(
    (data) => {
        if (data.age_min !== undefined && data.age_max !== undefined) {
            return data.age_min <= data.age_max;
        }
        return true;
    },
    { message: "Usia minimum tidak boleh lebih besar dari usia maksimum", path: ["age_min"] }
);

export type LaporanFilterValues = z.infer<typeof laporanFilterSchema>;