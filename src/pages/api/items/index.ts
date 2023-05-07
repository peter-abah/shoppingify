import { Item } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../prisma/prisma";
import { authenticate } from "@/lib/api";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      await readHandler(req, res);
      break;
    case "POST":
      await createHandler(req, res);
      break;
    default:
      res.status(405).json({ errorMsg: "Invalid method" });
  }
}

type ReadResponseData = {
  items: Item[];
};
async function readHandler(
  req: NextApiRequest,
  res: NextApiResponse<ReadResponseData>
) {
  const session = await authenticate(req, res);
  if (!session) return;

  const items = await prisma.item.findMany({
    where: { ownerId: session!.user.id },
  });
  res.status(200).json({ items });
}

type CreateResponseData = { item?: Item };
async function createHandler(
  req: NextApiRequest,
  res: NextApiResponse<CreateResponseData>
) {
  const session = await authenticate(req, res);
  if (!session) return;

  const itemData = req.body;
  const item = await prisma.item.create({
    data: { ...itemData, ownerId: session!.user.id },
  });
  res.status(200).json({ item });
}


export default handler;
