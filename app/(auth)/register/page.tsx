"use client";

import { useRegister } from "@/hooks/useAuth";
import { registerSchema, type RegisterFormValues } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

// ─── Role cards config ────────────────────────────────────────────────────────
const ROLES = [
    {
        value: "seeker" as const,
        label: "Saya Mencari",
        emoji: "🔍",
        desc: "Saya mencari anggota keluarga atau orang yang hilang",
        color: "orange",
    },
    {
        value: "finder" as const,
        label: "Saya Menemukan",
        emoji: "🤝",
        desc: "Saya menemukan seseorang yang terlantar dan butuh bantuan",
        color: "blue",
    },
    {
        value: "volunteer" as const,
        label: "Relawan / NGO",
        emoji: "🌟",
        desc: "Saya relawan atau dari organisasi yang ingin membantu",
        color: "green",
    },
] as const;

const roleColorMap = {
    orange: {
        ring: "ring-orange-400 border-orange-400 bg-orange-50",
        emoji: "bg-orange-100",
        label: "text-orange-700",
    },
    blue: {
        ring: "ring-blue-400 border-blue-400 bg-blue-50",
        emoji: "bg-blue-100",
        label: "text-blue-700",
    },
    green: {
        ring: "ring-green-400 border-green-400 bg-green-50",
        emoji: "bg-green-100",
        label: "text-green-700",
    },
};

// ─── Shared SVG Icons ─────────────────────────────────────────────────────────
function EyeOffIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

// ─── Register Form Component ──────────────────────────────────────────────────
// idSuffix: "m" untuk mobile, "d" untuk desktop
// Masing-masing punya useForm instance sendiri — tidak ada konflik
function RegisterForm({ idSuffix }: { idSuffix: string }) {
    const { mutate: registerUser, isPending, error } = useRegister();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: undefined },
    });

    const selectedRole = watch("role");

    const handleRoleSelect = (role: RegisterFormValues["role"]) => {
        setValue("role", role, { shouldValidate: true });
    };

    const onSubmit = (data: RegisterFormValues) => {
        registerUser(data);
    };

    const apiError =
        error instanceof Error ? error.message : error ? "Terjadi kesalahan, coba lagi." : null;

    const inputBase =
        "w-full h-11 px-3.5 rounded-xl border bg-white text-stone-900 text-sm placeholder:text-stone-400 outline-none transition-all focus:ring-2 focus:ring-orange-400 focus:border-orange-400";

    return (
        <>
            {apiError && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                    {apiError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                {/* ── Pilih Peran ── */}
                <div>
                    <p className="block text-sm font-medium text-stone-700 mb-2.5">Pilih Peran Anda</p>
                    <div className="space-y-2.5">
                        {ROLES.map((role) => {
                            const isSelected = selectedRole === role.value;
                            const colors = roleColorMap[role.color];
                            return (
                                <button
                                    key={role.value}
                                    type="button"
                                    onClick={() => handleRoleSelect(role.value)}
                                    className={`w-full flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition-all
                                        ${isSelected
                                        ? `${colors.ring} ring-2`
                                        : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${isSelected ? colors.emoji : "bg-stone-100"}`}>
                                        {role.emoji}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-semibold text-sm ${isSelected ? colors.label : "text-stone-800"}`}>
                                            {role.label}
                                        </p>
                                        <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">{role.desc}</p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all
                                        ${isSelected ? `border-current bg-current ${colors.label}` : "border-stone-300"}`}>
                                        {isSelected && (
                                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                <path d="M2 5.5L4 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    {errors.role && <p className="mt-2 text-xs text-red-500">{errors.role.message}</p>}
                </div>

                {/* ── Nama Lengkap ── */}
                <div>
                    <label htmlFor={`name-${idSuffix}`} className="block text-sm font-medium text-stone-700 mb-1.5">
                        Nama Lengkap
                    </label>
                    <input
                        id={`name-${idSuffix}`}
                        type="text"
                        autoComplete="name"
                        placeholder="Masukkan nama lengkap"
                        {...register("name")}
                        className={`${inputBase} ${errors.name ? "border-red-400 ring-1 ring-red-200" : "border-stone-200"}`}
                    />
                    {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>}
                </div>

                {/* ── Nomor Telepon ── */}
                <div>
                    <label htmlFor={`phone-${idSuffix}`} className="block text-sm font-medium text-stone-700 mb-1.5">
                        Nomor Telepon{" "}
                        <span className="text-stone-400 font-normal">(opsional)</span>
                    </label>
                    <input
                        id={`phone-${idSuffix}`}
                        type="tel"
                        autoComplete="tel"
                        placeholder="0812..."
                        {...register("phone")}
                        className={`${inputBase} ${errors.phone ? "border-red-400 ring-1 ring-red-200" : "border-stone-200"}`}
                    />
                    {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone.message}</p>}
                </div>

                {/* ── Email ── */}
                <div>
                    <label htmlFor={`email-${idSuffix}`} className="block text-sm font-medium text-stone-700 mb-1.5">
                        Alamat Email
                    </label>
                    <input
                        id={`email-${idSuffix}`}
                        type="email"
                        autoComplete="email"
                        placeholder="contoh@mail.com"
                        {...register("email")}
                        className={`${inputBase} ${errors.email ? "border-red-400 ring-1 ring-red-200" : "border-stone-200"}`}
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
                </div>

                {/* ── Kata Sandi ── */}
                <div>
                    <label htmlFor={`password-${idSuffix}`} className="block text-sm font-medium text-stone-700 mb-1.5">
                        Kata Sandi
                    </label>
                    <div className="relative">
                        <input
                            id={`password-${idSuffix}`}
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Min. 8 karakter"
                            {...register("password")}
                            className={`${inputBase} pr-11 ${errors.password ? "border-red-400 ring-1 ring-red-200" : "border-stone-200"}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                        >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
                </div>

                {/* ── Konfirmasi Kata Sandi ── */}
                <div>
                    <label htmlFor={`confirm-${idSuffix}`} className="block text-sm font-medium text-stone-700 mb-1.5">
                        Konfirmasi Kata Sandi
                    </label>
                    <div className="relative">
                        <input
                            id={`confirm-${idSuffix}`}
                            type={showConfirm ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Ulangi kata sandi"
                            {...register("confirmPassword")}
                            className={`${inputBase} pr-11 ${errors.confirmPassword ? "border-red-400 ring-1 ring-red-200" : "border-stone-200"}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                            aria-label={showConfirm ? "Sembunyikan konfirmasi" : "Tampilkan konfirmasi"}
                        >
                            {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                {/* ── Terms & Conditions ── */}
                <div>
                    <div className="flex items-start gap-2.5">
                        <input
                            type="checkbox"
                            id={`terms-${idSuffix}`}
                            {...register("terms")}
                            className="mt-0.5 w-4 h-4 accent-orange-500 cursor-pointer"
                        />
                        <label htmlFor={`terms-${idSuffix}`} className="text-xs text-stone-500 leading-relaxed cursor-pointer">
                            Saya menyetujui{" "}
                            <a href="/syarat" className="text-orange-500 hover:text-orange-600 underline underline-offset-2">
                                Syarat & Ketentuan
                            </a>{" "}
                            serta{" "}
                            <a href="/privasi" className="text-orange-500 hover:text-orange-600 underline underline-offset-2">
                                Kebijakan Privasi
                            </a>{" "}
                            yang berlaku di TemuKan.
                        </label>
                    </div>
                    {errors.terms && <p className="mt-1.5 text-xs text-red-500">{errors.terms.message}</p>}
                </div>

                {/* ── Submit ── */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-12 mt-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700
                        text-white font-semibold text-sm tracking-wide transition-all
                        disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-orange-200"
                >
                    {isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Mendaftar...
                        </span>
                    ) : (
                        "Daftar Sekarang"
                    )}
                </button>
            </form>
        </>
    );
}

// ─── Desktop Left Panel ───────────────────────────────────────────────────────
function DesktopLeftPanel() {
    return (
        <div className="flex flex-col justify-between bg-orange-500 px-12 py-12 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-100px] left-[-100px] w-[450px] h-[450px] rounded-full bg-white opacity-[0.07]" />
                <div className="absolute bottom-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full bg-white opacity-[0.07]" />
            </div>

            <Link href="/" className="relative z-10 flex items-center gap-2.5">
                <span className="font-bold text-xl text-white tracking-tight">TemuKan</span>
            </Link>

            <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
                <h2 className="text-white font-bold text-4xl leading-tight mb-5">
                    Membawa Harapan<br />Kembali ke Rumah.
                </h2>
                <p className="text-orange-100 text-base leading-relaxed max-w-xs">
                    Bergabunglah dengan ribuan relawan dan keluarga dalam upaya kolektif menemukan mereka yang kita sayangi. Kepastian dimulai dari sini.
                </p>
            </div>

            <div className="relative z-10 flex gap-4">
                <div className="bg-white/10 rounded-2xl px-5 py-4">
                    <p className="text-white font-bold text-2xl">1,240+</p>
                    <p className="text-orange-200 text-sm mt-0.5">Orang Ditemukan</p>
                </div>
                <div className="bg-white/10 rounded-2xl px-5 py-4">
                    <p className="text-white font-bold text-2xl">50k+</p>
                    <p className="text-orange-200 text-sm mt-0.5">Relawan Aktif</p>
                </div>
            </div>

            <div className="relative z-10 flex items-center gap-2 mt-6">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </div>
                <span className="text-white/60 text-xs font-medium tracking-widest uppercase">Solidaritas Kemanusiaan</span>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RegisterPage() {
    return (
        <>
            {/* ── Mobile layout ── */}
            <div className="lg:hidden">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-stone-800">Daftar Akun Baru</h2>
                    <p className="text-stone-500 text-sm mt-1">Lengkapi data untuk mulai berkontribusi.</p>
                </div>

                {/* Instance RegisterForm tersendiri untuk mobile */}
                <RegisterForm idSuffix="m" />

                <p className="text-center text-sm text-stone-500 mt-5">
                    Sudah punya akun?{" "}
                    <Link href="/login" className="text-orange-500 hover:text-orange-600 font-semibold">
                        Masuk di sini
                    </Link>
                </p>
            </div>

            {/* ── Desktop: split screen ── */}
            <div className="hidden lg:grid lg:grid-cols-[3fr_2fr] min-h-screen">
                <DesktopLeftPanel />
                <div className="flex flex-col justify-center px-10 py-10 bg-white overflow-y-auto">
                    <div className="w-full max-w-md mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <Link href="/login" className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                Kembali ke Login
                            </Link>
                            <span className="text-sm text-stone-400">Langkah 1 dari 2</span>
                        </div>

                        <div className="mb-7">
                            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Buat Akun Baru</h1>
                            <p className="text-stone-500 text-sm mt-1.5">Lengkapi data diri Anda untuk mulai berkontribusi.</p>
                        </div>

                        {/* Instance RegisterForm tersendiri untuk desktop */}
                        <RegisterForm idSuffix="d" />

                        <p className="text-center text-sm text-stone-500 mt-5">
                            Sudah memiliki akun?{" "}
                            <Link href="/login" className="text-orange-500 hover:text-orange-600 font-semibold">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}