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
        { message: "Unauthorized", data: null },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return NextResponse.json(
        { message: "Invalid token", data: null },
        { status: 401 },
      );
    }

    const userId = decoded.id;

    // Get all transactions for the user
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
      },
      include: {
        category: true,
      },
    });

    // Calculate stats
    const totalIncome = transactions
      .filter((t) => t.category.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.category.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    const stats = {
      totalIncome,
      totalExpense,
      balance,
      transactionCount: transactions.length,
    };

    return NextResponse.json(
      { message: "Stats fetched", data: stats },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/dashboard/stats error:", error);
    return NextResponse.json(
      { message: "Failed to fetch stats", data: null },
      { status: 500 },
    );
  }
}
