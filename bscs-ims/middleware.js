import { NextResponse } from "next/server";

export function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const session = req.cookies.get("session")?.value;
  const publicRoutes = [
    "/login",
    "/api/login",
    "/register",
    "/_next",
    "/favicon.ico",
  ];

  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  if (!isPublic && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
