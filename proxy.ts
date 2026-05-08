import { NextRequest, NextResponse } from "next/server";

// ─── Protected Routes ─────────────────────────────────────────────────────────
// Semua route yang butuh user login.
// Middleware cek cookie `access_token` (httpOnly, di-set backend saat login web).

const PROTECTED_ROUTES = [
  "/report/new",
  "/report/me",
  "/notification",
  "/match",
  "/profile",
];

// Route dengan pattern dinamis yang protected
const PROTECTED_DYNAMIC_PATTERNS = [
  /^\/report\/[^/]+\/edit$/, // /laporan/[id]/edit
];

// Route yang hanya boleh diakses saat BELUM login (redirect jika sudah login)
const AUTH_ROUTES = ["/login", "/register"];

// ─── Helper ───────────────────────────────────────────────────────────────────

function isProtectedRoute(pathname: string): boolean {
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    return true;
  }
  return PROTECTED_DYNAMIC_PATTERNS.some((pattern) => pattern.test(pathname));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cek keberadaan cookie access_token sebagai sinyal "sudah login"
  // Token itu sendiri divalidasi di backend — middleware hanya cek eksistensinya.
  const accessToken = request.cookies.get("access_token")?.value;
  const isLoggedIn = Boolean(accessToken);

  // 1. User belum login → akses protected route → redirect ke /login
  if (!isLoggedIn && isProtectedRoute(pathname)) {
    const loginUrl = new URL("/login", request.url);
    // Simpan tujuan asal agar setelah login bisa redirect balik
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. User sudah login → akses halaman auth (/login, /daftar) → redirect ke /
  // if (isLoggedIn && isAuthRoute(pathname)) {
  //     return NextResponse.redirect(new URL("/", request.url));
  // }

  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────
// Jalankan middleware hanya di route yang relevan.
// Skip: static files, _next internals, favicon, api routes.

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|api).*)"],
};
