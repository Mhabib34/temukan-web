"use client";

import { useLogin } from "@/hooks/useAuth";
import { loginSchema, type LoginFormValues } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
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

    // Ambil pesan error dari API response
    const apiError =
        error instanceof Error ? error.message : error ? "Terjadi kesalahan, coba lagi." : null;

    return (
        <div className="w-full max-w-sm">
            {/* Heading */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                    Selamat datang kembali
                </h1>
                <p className="text-stone-500 text-sm mt-1.5">
                    Masuk untuk melanjutkan pencarian atau laporan kamu.
                </p>
            </div>

            {/* API Error */}
            {apiError && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                    {apiError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                {/* Email */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-stone-700 mb-1.5"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="emailkamu@email.com"
                        {...register("email")}
                        className={`w-full h-11 px-3.5 rounded-xl border bg-white text-stone-900 text-sm placeholder:text-stone-400
              outline-none transition-all
              focus:ring-2 focus:ring-orange-400 focus:border-orange-400
              ${errors.email ? "border-red-400 ring-1 ring-red-200" : "border-stone-200"}`}
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-stone-700"
                        >
                            Password
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            {...register("password")}
                            className={`w-full h-11 px-3.5 pr-11 rounded-xl border bg-white text-stone-900 text-sm placeholder:text-stone-400
                outline-none transition-all
                focus:ring-2 focus:ring-orange-400 focus:border-orange-400
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

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-11 mt-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700
            text-white font-semibold text-sm tracking-wide
            transition-all disabled:opacity-60 disabled:cursor-not-allowed
            shadow-sm shadow-orange-200"
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
                        "Masuk"
                    )}
                </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-xs text-stone-400">atau</span>
                <div className="flex-1 h-px bg-stone-200" />
            </div>

            {/* Register CTA */}
            <p className="text-center text-sm text-stone-500">
                Belum punya akun?{" "}
                <Link
                    href="/register"
                    className="text-orange-500 hover:text-orange-600 font-semibold"
                >
                    Daftar sekarang
                </Link>
            </p>
        </div>
    );
}