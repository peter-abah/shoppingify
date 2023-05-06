import { Category } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

type ResponseData =
  | {
      categories: Category[];
    }
  | { errorMsg: string };

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ errorMsg: "Unauthenicated, please login" });
    return;
  }

  if (req.method == "GET") {
    const categories = await prisma.category.findMany({});
    res.status(200).json({ categories });
  }
}

export default handler;
