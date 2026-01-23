import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

export async function POST(req) {
  try {
    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.password !== password) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 },
      );
    }

    const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      { message: "Login successful", data: jwtToken },
      { status: 200 },
    );

    response.cookies.set({
      name: "token",
      value: jwtToken,
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 hari
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
