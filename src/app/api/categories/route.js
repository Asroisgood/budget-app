import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized", data: [] },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return NextResponse.json(
        { message: "Invalid token", data: [] },
        { status: 401 },
      );
    }

    const userId = decoded.id;

    const categories = await prisma.category.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { message: "Failed to fetch categories", data: [] },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id;

    const body = await req.json();
    const name = body?.name?.trim();
    const type = body?.type;

    if (!name || !type) {
      return NextResponse.json(
        { message: "Invalid category payload" },
        { status: 400 },
      );
    }

    const category = await prisma.category.create({
      data: { name, type, userId },
    });

    return NextResponse.json(
      { message: "Category created", data: category },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json(
      { message: "Failed to create category" },
      { status: 500 },
    );
  }
}
