import { NextResponse } from "next/server";

export function proxy(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
