import { Users2 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Mobile layout: orange header + white rounded card */}
      <div className="min-h-screen lg:hidden flex flex-col bg-orange-500">
        {/* Orange header area */}
        <div className="pt-10 pb-20 flex flex-col items-center relative overflow-hidden px-5">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white" />
            <div className="absolute bottom-0 -left-7.5 w-36 h-36 rounded-full bg-white" />
          </div>
          {/* People icon */}
          <div className="relative z-10">
            <Users2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="relative z-10 text-white font-bold text-3xl tracking-tight">
            TemuKan
          </h1>
          <p className="relative z-10 text-orange-100 text-sm mt-1.5">
            Bersama, kita temukan
          </p>
        </div>

        {/* White card */}
        <div className="flex-1 bg-white rounded-t-3xl -mt-8 relative z-10 px-5 pt-8 pb-6 flex flex-col shadow-2xl">
          {children}
          <footer className="mt-auto pt-8 text-center text-xs text-stone-400">
            Dengan melanjutkan, kamu menyetujui{" "}
            <a
              href="/syarat"
              className="underline underline-offset-2 hover:text-stone-600"
            >
              Syarat Penggunaan
            </a>{" "}
            dan{" "}
            <a
              href="/privasi"
              className="underline underline-offset-2 hover:text-stone-600"
            >
              Kebijakan Privasi
            </a>
          </footer>
        </div>
      </div>

      {/* Desktop layout: full width, each page renders its own split-screen */}
      <div className="hidden lg:block min-h-screen">{children}</div>
    </>
  );
}
