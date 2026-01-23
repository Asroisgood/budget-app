import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized", user: null },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return NextResponse.json(
        { message: "Invalid token", user: null },
        { status: 401 },
      );
    }

    const userId = decoded.id;

    // Get user data
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    console.log(user);

    if (!user) {
      console.error("User not found for ID:", userId);
      return NextResponse.json(
        { message: "User not found", user: null },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "User fetched", user },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json(
      { message: "Failed to fetch user", user: null },
      { status: 500 },
    );
  }
}
