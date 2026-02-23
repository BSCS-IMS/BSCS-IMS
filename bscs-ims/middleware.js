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

  // Allow static files (images, fonts, etc.)
  if (
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  
  if (!isPublic && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};