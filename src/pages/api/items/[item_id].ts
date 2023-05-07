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

  const { item_id } = req.query as { item_id: string };

  // Confirm it is user that created item
  const item = await prisma.item.findFirst({ where: { id: item_id } });
  if (item?.ownerId === session!.user.id) {
    await prisma.item.delete({ where: { id: item_id } });
    res.status(200).json({ message: "Item deleted" });
  } else {
    res.status(404).json({ message: "Unable to delete item. Item not found." });
  }
}

export default handler;
