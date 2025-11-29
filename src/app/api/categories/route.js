import { prisma } from "@/lib/db";

export async function GET() {
  const categories = await prisma.category.findMany();

  return new Response(JSON.stringify(categories));
}

export async function POST(req) {
  const body = await req.json();
  const { name, type } = body;

  const category = await prisma.category.create({
    data: { name, type },
  });

  return new Response(JSON.stringify(category));
}
