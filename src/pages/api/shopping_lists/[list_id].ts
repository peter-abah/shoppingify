import { ShoppingList, ShoppingListState } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../prisma/prisma";
import { authenticate } from "@/lib/api";

type ResponseData =
  | {
      shoppingList: ShoppingList;
    }
  | { errorMsg: string };

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  switch (req.method) {
    case "PUT":
      await updateHandler(req, res);
      break;
    default:
      res.status(405).json({ errorMsg: "Invalid method" });
  }
}

async function updateHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const session = await authenticate(req, res);
  if (!session) return;

  const { list_id } = req.query as { list_id: string };
  const { shoppingList } = req.body;

  // Confirm it is user that owns list
  const shoppingListInDB = await prisma.shoppingList.findFirst({
    where: { id: list_id },
  });
  if (shoppingListInDB?.ownerId !== session!.user.id) {
    res.status(404).json({
      errorMsg: "Unable to update shopping list. Shopping list not found.",
    });
    return;
  }

  const { updatedAt, ...rest } = shoppingList;
  const result = await prisma.shoppingList.update({
    where: { id: list_id },
    data: { ...rest },
  });
  res.status(200).json({ shoppingList: result });
}

export default handler;
