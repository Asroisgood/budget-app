import { prisma } from "@/lib/db";

export async function DELETE(req, { params }) {
  const id = parseInt((await params).id);

  const category = await prisma.category.delete({ where: { id } });

  return new Response(JSON.stringify(category));
}
