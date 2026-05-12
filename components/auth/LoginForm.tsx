import { useLogin } from "@/hooks";
import { LoginFormValues, loginSchema } from "@/schemas";
import { Eye, EyeClosed, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function LoginForm() {
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
    error instanceof Error
      ? error.message
      : error
        ? "Terjadi kesalahan, coba lagi."
        : null;

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
          <label
            htmlFor="email"
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
            Alamat Email
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
              <Mail className="w-4 h-4" />
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
                errors.email
                  ? "border-red-400 ring-1 ring-red-200"
                  : "border-stone-200",
              ].join(" ")}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-stone-700"
            >
              Kata Sandi
            </label>
            <a
              href="/lupa-password"
              className="text-xs text-orange-500 hover:text-orange-600 font-medium"
            >
              Lupa sandi?
            </a>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
              <Lock className="w-4 h-4" />
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
                errors.password
                  ? "border-red-400 ring-1 ring-red-200"
                  : "border-stone-200",
              ].join(" ")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
            >
              {showPassword ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeClosed className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.password.message}
            </p>
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
              <svg
                className="animate-spin w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
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
