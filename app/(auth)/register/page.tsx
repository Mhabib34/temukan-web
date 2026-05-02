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

// ─── Steps ────────────────────────────────────────────────────────────────────

type Step = "role" | "detail";

export default function RegisterPage() {
    const { mutate: registerUser, isPending, error } = useRegister();
    const [step, setStep] = useState<Step>("role");
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: undefined },
    });

    const selectedRole = watch("role");

    const handleRoleSelect = (role: RegisterFormValues["role"]) => {
        setValue("role", role, { shouldValidate: true });
    };

    const handleNextStep = async () => {
        const valid = await trigger("role");
        if (valid) setStep("detail");
    };

    const onSubmit = (data: RegisterFormValues) => {
        registerUser(data);
    };

    const apiError =
        error instanceof Error ? error.message : error ? "Terjadi kesalahan, coba lagi." : null;

    return (
        <div className="w-full max-w-sm">
            {/* Progress indicator */}
            <div className="flex items-center gap-2 mb-8">
                <div className={`h-1.5 flex-1 rounded-full transition-colors ${step === "role" || step === "detail" ? "bg-orange-400" : "bg-stone-200"}`} />
                <div className={`h-1.5 flex-1 rounded-full transition-colors ${step === "detail" ? "bg-orange-400" : "bg-stone-200"}`} />
            </div>

            {/* ── Step 1: Pilih Role ── */}
            {step === "role" && (
                <div>
                    <div className="mb-7">
                        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                            Kamu siapa?
                        </h1>
                        <p className="text-stone-500 text-sm mt-1.5">
                            Pilih peranmu agar TemuKan bisa membantumu dengan tepat.
                        </p>
                    </div>

                    <div className="space-y-3">
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
                                        <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">
                                            {role.desc}
                                        </p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all
                    ${isSelected ? "border-current bg-current" : "border-stone-300"} ${isSelected ? colors.label : ""}`}
                                    >
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

                    {errors.role && (
                        <p className="mt-3 text-xs text-red-500 text-center">{errors.role.message}</p>
                    )}

                    <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={!selectedRole}
                        className="w-full h-11 mt-6 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700
              text-white font-semibold text-sm tracking-wide transition-all
              disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-orange-200"
                    >
                        Lanjutkan
                    </button>

                    <p className="text-center text-sm text-stone-500 mt-5">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="text-orange-500 hover:text-orange-600 font-semibold">
                            Masuk
                        </Link>
                    </p>
                </div>
            )}

            {/* ── Step 2: Detail Akun ── */}
            {step === "detail" && (
                <div>
                    <button
                        type="button"
                        onClick={() => setStep("role")}
                        className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-6 transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </button>

                    <div className="mb-7">
                        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                            Buat akun kamu
                        </h1>
                        <p className="text-stone-500 text-sm mt-1.5">
                            Isi data diri untuk melengkapi pendaftaran.
                        </p>
                    </div>

                    {apiError && (
                        <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                        {/* Nama */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1.5">
                                Nama lengkap
                            </label>
                            <input
                                id="name"
                                type="text"
                                autoComplete="name"
                                placeholder="Budi Santoso"
                                {...register("name")}
                                className={`w-full h-11 px-3.5 rounded-xl border bg-white text-stone-900 text-sm placeholder:text-stone-400
                  outline-none transition-all focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                  ${errors.name ? "border-red-400 ring-1 ring-red-200" : "border-stone-200"}`}
                            />
                            {errors.name && (
                                <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="kamu@email.com"
                                {...register("email")}
                                className={`w-full h-11 px-3.5 rounded-xl border bg-white text-stone-900 text-sm placeholder:text-stone-400
                  outline-none transition-all focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                  ${errors.email ? "border-red-400 ring-1 ring-red-200" : "border-stone-200"}`}
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        {/* No. HP (opsional) */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1.5">
                                No. HP{" "}
                                <span className="text-stone-400 font-normal">(opsional)</span>
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                autoComplete="tel"
                                placeholder="08123456789"
                                {...register("phone")}
                                className={`w-full h-11 px-3.5 rounded-xl border bg-white text-stone-900 text-sm placeholder:text-stone-400
                  outline-none transition-all focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                  ${errors.phone ? "border-red-400 ring-1 ring-red-200" : "border-stone-200"}`}
                            />
                            {errors.phone && (
                                <p className="mt-1.5 text-xs text-red-500">{errors.phone.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder="Minimal 8 karakter"
                                    {...register("password")}
                                    className={`w-full h-11 px-3.5 pr-11 rounded-xl border bg-white text-stone-900 text-sm placeholder:text-stone-400
                    outline-none transition-all focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                    ${errors.password ? "border-red-400 ring-1 ring-red-200" : "border-stone-200"}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-11 mt-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700
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
                                "Buat Akun"
                            )}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}