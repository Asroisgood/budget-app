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
        { message: "Unauthorized", data: [], pagination: null },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return NextResponse.json(
        { message: "Invalid token", data: [], pagination: null },
        { status: 401 },
      );
    }

    const userId = decoded.id;

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build where clause for filters
    const where = {
      userId: userId,
    };

    if (searchParams.get("type") && searchParams.get("type") !== "all") {
      where.category = {
        type: searchParams.get("type"),
      };
    }

    if (searchParams.get("category")) {
      where.categoryId = Number(searchParams.get("category"));
    }

    if (searchParams.get("search")) {
      const searchTerm = searchParams.get("search").trim();
      if (searchTerm) {
        where.OR = [
          {
            description: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            category: {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        ];
      }
    }

    if (searchParams.get("dateFrom") || searchParams.get("dateTo")) {
      where.date = {};
      if (searchParams.get("dateFrom")) {
        where.date.gte = new Date(searchParams.get("dateFrom"));
      }
      if (searchParams.get("dateTo")) {
        where.date.lte = new Date(searchParams.get("dateTo"));
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: offset,
      take: limit,
    });

    const total = await prisma.transaction.count({
      where,
    });

    const totalPage = Math.ceil(total / limit);

    // Only return pagination if there are transactions
    const pagination =
      transactions.length > 0
        ? {
            total,
            totalPage,
            currentPage: page,
            limit,
            prev: page > 1 ? page - 1 : null,
            next: page < totalPage ? page + 1 : null,
          }
        : null;

    return NextResponse.json(
      { message: "Transactions fetched", data: transactions, pagination },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/transactions error:", error);
    return NextResponse.json(
      { message: "Failed to fetch transactions", data: [], pagination: null },
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userId = decoded.id;

    const body = await req.json();

    if (!body?.date || !body?.amount || !body?.category) {
      return NextResponse.json(
        { message: "Invalid transaction payload" },
        { status: 400 },
      );
    }

    const [year, month, day] = body.date.split("-");

    const parsedDate = new Date(year, month - 1, day, 7, 0, 0);

    const dataParam = {
      amount: Number(body.amount),
      description: body.description,
      date: parsedDate,
      categoryId: Number(body.category),
      userId: userId,
    };

    const transaction = await prisma.transaction.create({
      data: dataParam,
    });

    return NextResponse.json(
      { message: "Transaction created", data: transaction },
      { status: 200 },
    );
  } catch (error) {
    const status = error?.name === "JsonWebTokenError" ? 401 : 500;
    const message =
      status === 401 ? "Unauthorized" : "Failed to create transaction";
    console.error("POST /api/transactions error:", error);

    return NextResponse.json({ message }, { status });
  }
}
