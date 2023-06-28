import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../prisma/prisma";
import { Category } from "@prisma/client";
import { authenticate } from "../index";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "PUT":
    case "PATCH":
      await updateHandler(req, res);
      break;
    case "DELETE":
      await deleteHandler(req, res);
      break;
    default:
      res.status(405).json({ errorMsg: "Invalid method" });
  }
}

type UpdateResponseData = { category: Category } | { errorMsg: string };
async function updateHandler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateResponseData>
) {
  const session = await authenticate(req, res);
  if (!session) return;

  const { category_id } = req.query as { category_id: string };
  const { name } = req.body;

  // Confirm it is user that owns category
  const categoryInDB = await prisma.category.findFirst({
    where: { id: category_id },
  });
  if (categoryInDB?.ownerId !== session!.user.id) {
    res.status(404).json({
      errorMsg: "Unable to update category. Category not found.",
    });
    return;
  }

  const category = await prisma.category.update({
    where: { id: category_id },
    data: { name },
  });
  res.status(200).json({ category });
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
