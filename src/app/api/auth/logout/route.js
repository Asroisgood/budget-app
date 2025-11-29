import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" }, { status: 200 });

  res.cookies.set({
    name: "token",
    value: "",
    maxAge: 0,
    path: "/",
  });

  return res;
}
