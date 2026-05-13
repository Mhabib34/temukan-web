import { useRegister } from "@/hooks/useAuth";
import { registerSchema, type RegisterFormValues } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

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

export function RegisterForm({ idSuffix }: { idSuffix: string }) {
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

  //eslint-disable-next-line
  const selectedRole = watch("role");

  const handleRoleSelect = (role: RegisterFormValues["role"]) => {
    setValue("role", role, { shouldValidate: true });
  };

  const onSubmit = (data: RegisterFormValues) => {
    registerUser(data);
  };

  const apiError =
    error instanceof Error
      ? error.message
      : error
        ? "Terjadi kesalahan, coba lagi."
        : null;

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
          <p className="block text-sm font-medium text-stone-700 mb-2.5">
            Pilih Peran Anda
          </p>
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
                                        ${
                                          isSelected
                                            ? `${colors.ring} ring-2`
                                            : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
                                        }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${isSelected ? colors.emoji : "bg-stone-100"}`}
                  >
                    {role.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold text-sm ${isSelected ? colors.label : "text-stone-800"}`}
                    >
                      {role.label}
                    </p>
                    <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">
                      {role.desc}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all
                                        ${isSelected ? `border-current bg-current ${colors.label}` : "border-stone-300"}`}
                  >
                    {isSelected && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M2 5.5L4 7.5L8 3"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {errors.role && (
            <p className="mt-2 text-xs text-red-500">{errors.role.message}</p>
          )}
        </div>

        {/* ── Nama Lengkap ── */}
        <div>
          <label
            htmlFor={`name-${idSuffix}`}
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
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
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* ── Nomor Telepon ── */}
        <div>
          <label
            htmlFor={`phone-${idSuffix}`}
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
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
          {errors.phone && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* ── Email ── */}
        <div>
          <label
            htmlFor={`email-${idSuffix}`}
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
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
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* ── Kata Sandi ── */}
        <div>
          <label
            htmlFor={`password-${idSuffix}`}
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
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
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
            >
              {showPassword ? <EyeClosed /> : <Eye />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* ── Konfirmasi Kata Sandi ── */}
        <div>
          <label
            htmlFor={`confirm-${idSuffix}`}
            className="block text-sm font-medium text-stone-700 mb-1.5"
          >
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
              aria-label={
                showConfirm ? "Sembunyikan konfirmasi" : "Tampilkan konfirmasi"
              }
            >
              {showConfirm ? <EyeClosed /> : <Eye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
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
            <label
              htmlFor={`terms-${idSuffix}`}
              className="text-xs text-stone-500 leading-relaxed cursor-pointer"
            >
              Saya menyetujui{" "}
              <a
                href="/syarat"
                className="text-orange-500 hover:text-orange-600 underline underline-offset-2"
              >
                Syarat & Ketentuan
              </a>{" "}
              serta{" "}
              <a
                href="/privasi"
                className="text-orange-500 hover:text-orange-600 underline underline-offset-2"
              >
                Kebijakan Privasi
              </a>{" "}
              yang berlaku di Titip Jejak.
            </label>
          </div>
          {errors.terms && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.terms.message}
            </p>
          )}
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
