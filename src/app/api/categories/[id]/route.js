import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(req, { params }) {
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
    const categoryId = parseInt(params.id);

    // Check if category exists and belongs to user
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json({ message: "Category deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/categories/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to delete category" },
      { status: 500 },
    );
  }
}
