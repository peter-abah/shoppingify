import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../prisma/prisma";
import { authenticate } from "@/lib/api";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "DELETE":
      await deleteHandler(req, res);
      break;
    default:
      res.status(405).json({ errorMsg: "Invalid method" });
  }
}

type DeleteResponseData = { message: string };
async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse<DeleteResponseData>
) {
  const session = await authenticate(req, res);
  if (!session) return;

  const { category_id } = req.query as { category_id: string };

  // Confirm it is user that owns category
  const category = await prisma.category.findFirst({
    where: { id: category_id },
  });
  if (category?.ownerId === session!.user.id) {
    await prisma.category.delete({ where: { id: category_id } });
    res.status(200).json({ message: "Category deleted" });
  } else {
    res
      .status(404)
      .json({ message: "Unable to delete category. Category not found." });
  }
}

export default handler;
