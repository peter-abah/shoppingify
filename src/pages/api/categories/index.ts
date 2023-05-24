import { Category } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../prisma/prisma";
import { authenticate } from "@/lib/api";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      await createHandler(req, res);
      break;
    default:
      res.status(405).json({ errorMsg: "Invalid method" });
  }
}

type CreateResponseData = { category?: Category };
async function createHandler(
  req: NextApiRequest,
  res: NextApiResponse<CreateResponseData>
) {
  const session = await authenticate(req, res);
  if (!session) return;

  const { name } = req.body;
  console.log({name})
  const category = await prisma.category.create({
    data: { name, ownerId: session!.user.id },
  });
  return res.status(200).json({ category });
}

export default handler;
