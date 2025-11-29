import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized", data: [] },
      { status: 401 }
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const userId = decoded.id;

  const queryString = req.nextUrl.searchParams;

  const page = Number(queryString.get("page")) || 1;
  const limit = Number(queryString.get("limit")) || 10;
  const offset = (page - 1) * limit;
  const countTransaction = await prisma.transaction.count({
    where: { userId },
  });
  const totalPage = Math.ceil(countTransaction / limit);

  const transactions = await prisma.transaction.findMany({
    orderBy: [
      { date: "desc" },
      {
        createdAt: "desc",
      },
    ],
    include: {
      category: true,
    },
    where: {
      userId: userId,
    },
    take: limit,
    skip: offset,
  });

  const pagination = {
    page: Number(page),
    limit: Number(limit),
    totalData: countTransaction,
    totalPage: totalPage,
    prev: Number(page) > 1 ? Number(page) - 1 : null,
    next: Number(page) < totalPage ? Number(page) + 1 : null,
  };

  return NextResponse.json(
    { message: "Transactions fetched", data: transactions, pagination },
    { status: 200 }
  );
}

export async function POST(req) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const userId = decoded.id;

  const body = await req.json();
  console.log(body);

  const [year, month, day] = body.date.split("-");

  const parsedDate = new Date(year, month - 1, day, 7, 0, 0);

  const dataParam = {
    amount: Number(body.amount),
    description: body.description,
    date: parsedDate,
    categoryId: Number(body.category),
    userId: userId,
  };

  const transaction = await prisma.Transaction.create({
    data: dataParam,
  });

  return NextResponse.json(
    { message: "Transaction created", data: transaction },
    { status: 200 }
  );
}
