"use client";

import { useLogin } from "@/hooks/useAuth";
import { loginSchema, type LoginFormValues } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

// ─── Login Form Component (instance terpisah untuk mobile & desktop) ──────────
function LoginForm() {
    const { mutate: login, isPending, error } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormValues) => {
        login(data);
    };

    const apiError =
        error instanceof Error ? error.message : error ? "Terjadi kesalahan, coba lagi." : null;

    return (
        <>
            {apiError && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                    {apiError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
                        Alamat Email
                    </label>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                        </span>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="nama@email.com"
                            {...register("email")}
                            className={[
                                "w-full h-11 pl-10 pr-3.5 rounded-xl border bg-white text-stone-900 text-sm placeholder:text-stone-400",
                                "outline-none transition-all focus:ring-2 focus:ring-orange-400 focus:border-orange-400",
                                errors.email ? "border-red-400 ring-1 ring-red-200" : "border-stone-200",
                            ].join(" ")}
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" className="block text-sm font-medium text-stone-700">
                            Kata Sandi
                        </label>
                        <a href="/lupa-password" className="text-xs text-orange-500 hover:text-orange-600 font-medium">
                            Lupa sandi?
                        </a>
                    </div>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </span>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            {...register("password")}
                            className={[
                                "w-full h-11 pl-10 pr-11 rounded-xl border bg-white text-stone-900 text-sm placeholder:text-stone-400",
                                "outline-none transition-all focus:ring-2 focus:ring-orange-400 focus:border-orange-400",
                                errors.password ? "border-red-400 ring-1 ring-red-200" : "border-stone-200",
                            ].join(" ")}
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

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-11 mt-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-orange-200"
                >
                    {isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Memproses...
                        </span>
                    ) : (
                        "Masuk Sekarang"
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
            {/* Decorative circles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-100px] left-[-100px] w-[450px] h-[450px] rounded-full bg-white opacity-[0.07]" />
                <div className="absolute bottom-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full bg-white opacity-[0.07]" />
                <div className="absolute bottom-24 left-0 right-0 opacity-[0.06]">
                    <svg viewBox="0 0 800 300" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="150" cy="150" rx="140" ry="60" />
                        <ellipse cx="380" cy="140" rx="180" ry="70" />
                        <ellipse cx="620" cy="155" rx="130" ry="55" />
                        <ellipse cx="750" cy="145" rx="60" ry="40" />
                    </svg>
                </div>
            </div>

            {/* Logo */}
            <Link href="/" className="relative z-10 flex items-center gap-2.5">
                <span className="font-bold text-xl text-white tracking-tight">TemuKan</span>
            </Link>

            {/* Middle: tagline + testimonials */}
            <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
                <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-3">Bersama, kita temukan.</p>
                <div className="w-10 h-0.5 bg-white/40 mb-10" />

                <div className="space-y-8 max-w-sm">
                    <blockquote>
                        <p className="text-white text-base italic leading-relaxed">
                            &quot;Berkat bantuan komunitas di TemuKan, ayah saya berhasil ditemukan hanya dalam waktu 24 jam. Rasa syukur kami tak terhingga.&quot;
                        </p>
                        <footer className="mt-3 text-orange-200 text-sm">— Sari, Jakarta Selatan</footer>
                    </blockquote>
                    <blockquote>
                        <p className="text-white text-base italic leading-relaxed">
                            &quot;Sistem pelaporan yang sangat mudah membantu saya memberikan informasi akurat tentang anak hilang yang saya lihat di pasar.&quot;
                        </p>
                        <footer className="mt-3 text-orange-200 text-sm">— Pak Budi, Relawan</footer>
                    </blockquote>
                </div>
            </div>

            {/* Stats */}
            <div className="relative z-10 flex gap-10">
                <div>
                    <p className="text-white font-bold text-2xl">450+</p>
                    <p className="text-orange-200 text-sm mt-0.5">Orang Ditemukan</p>
                </div>
                <div>
                    <p className="text-white font-bold text-2xl">12k</p>
                    <p className="text-orange-200 text-sm mt-0.5">Relawan Aktif</p>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LoginPage() {
    const currentYear = new Date().getFullYear();

    return (
        <>
            {/* ── Mobile layout ── */}
            <div className="lg:hidden">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-stone-800">Masuk ke Akun</h2>
                    <p className="text-stone-500 text-sm mt-1">
                        Gunakan akun Anda untuk akses penuh fitur TemuKan.
                    </p>
                </div>

                {/* Instance LoginForm tersendiri untuk mobile */}
                <LoginForm />

                <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-stone-200" />
                    <span className="text-xs text-stone-400">atau</span>
                    <div className="flex-1 h-px bg-stone-200" />
                </div>

                <p className="text-center text-sm text-stone-500">
                    Belum punya akun?{" "}
                    <Link href="/register" className="text-orange-500 hover:text-orange-600 font-semibold">
                        Daftar sekarang
                    </Link>
                </p>
            </div>

            {/* ── Desktop: split screen ── */}
            <div className="hidden lg:grid lg:grid-cols-[3fr_2fr] min-h-screen">
                <DesktopLeftPanel />
                <div className="flex flex-col justify-center px-12 py-12 bg-white">
                    <div className="w-full max-w-sm mx-auto">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                                Masuk ke Akun
                            </h1>
                            <p className="text-stone-500 text-sm mt-1.5">
                                Akses panel kontrol dan lapor keberadaan.
                            </p>
                        </div>

                        {/* Instance LoginForm tersendiri untuk desktop */}
                        <LoginForm />

                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-stone-200" />
                            <span className="text-xs text-stone-400">atau</span>
                            <div className="flex-1 h-px bg-stone-200" />
                        </div>

                        <p className="text-center text-sm text-stone-500">
                            Belum punya akun?{" "}
                            <Link href="/register" className="text-orange-500 hover:text-orange-600 font-semibold">
                                Daftar Gratis
                            </Link>
                        </p>
                    </div>

                    <p className="mt-8 text-center text-xs text-stone-400">
                        &copy;{currentYear} TemuKan Indonesia. Bersama dalam kemanusiaan.
                    </p>
                </div>
            </div>
        </>
    );
}