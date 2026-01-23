import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import * as jwt from "jsonwebtoken";
import "dotenv/config";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const message =
        parsed.error.errors?.[0]?.message || "Payload registrasi tidak valid";
      return NextResponse.json({ message }, { status: 400 });
    }

    const email = parsed.data.email.trim();
    const name = parsed.data.name?.trim();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 409 },
      );
    }

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: parsed.data.password,
      },
    });

    const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      { message: "Registrasi berhasil", data: jwtToken },
      { status: 201 },
    );

    response.cookies.set({
      name: "token",
      value: jwtToken,
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
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
