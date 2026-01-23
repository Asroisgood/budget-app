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
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "this-month"; // Default to this month

    // Calculate date range based on period
    const dateRange = getDateRange(period);

    console.log(
      `Dashboard API - Period: ${period}, Range: ${dateRange.start} to ${dateRange.end}`,
    );

    // Get transactions within the specified period
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
        date: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
      },
      include: {
        category: true,
      },
    });

    // Calculate stats - convert Decimal to Number properly
    const totalIncome = transactions
      .filter((t) => t.category.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.category.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = totalIncome - totalExpense;

    // Get recent transactions (last 5)
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
      take: 5,
    });

    // Format dates for display and convert amounts to Number
    const formattedTransactions = recentTransactions.map((t) => ({
      ...t,
      amount: Number(t.amount), // Convert Decimal to Number
      date: new Date(t.date).toLocaleDateString("id-ID"),
    }));

    const stats = {
      totalIncome,
      totalExpense,
      balance,
      transactionCount: transactions.length,
      recentTransactions: formattedTransactions,
      period: period, // Include period in response
      dateRange: {
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString(),
      },
      monthlyData: [], // TODO: Add monthly breakdown
      categoryBreakdown: [], // TODO: Add category breakdown
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("GET /api/dashboard/stats error:", error);
    return NextResponse.json(
      { message: "Failed to fetch stats", data: null },
      { status: 500 },
    );
  }
}

// Helper function to calculate date range based on period
function getDateRange(period) {
  const now = new Date();
  let start, end;

  switch (period) {
    case "this-month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;

    case "last-month":
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      break;

    case "this-quarter":
      const quarter = Math.floor(now.getMonth() / 3);
      start = new Date(now.getFullYear(), quarter * 3, 1);
      end = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);
      break;

    case "this-year":
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;

    case "all-time":
      start = new Date(2000, 0, 1); // Far past date
      end = new Date(now.getFullYear() + 1, 0, 1); // Far future date
      break;

    default:
      // Default to this-month
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
  }

  return { start, end };
}
