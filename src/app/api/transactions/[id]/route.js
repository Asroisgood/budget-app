import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { cookies } from "next/headers";

export async function DELETE(req, { params }) {
  const id = parseInt((await params).id);

  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const userId = decoded.id;

  const transaction = await prisma.transaction.delete({
    where: { id, userId },
  });

  return NextResponse.json({ message: "Transaction deleted" }, { status: 200 });
}
