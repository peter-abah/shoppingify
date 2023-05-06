import { Item } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

// Authenticates the user and return the session object
// Sends a 401 response is user is not login
async function authenticate(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ errorMsg: "Unauthenicated, please login" });
    return false;
  }

  return true;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!authenticate(req, res)) return;

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
  const session = await getServerSession(req, res, authOptions);

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
  const session = await getServerSession(req, res, authOptions);

  const itemData = req.body;
  console.log({itemData});
  const item = await prisma.item.create({
    data: { ...itemData, ownerId: session!.user.id },
  });
  res.status(200).json({ item });
}

export default handler;
