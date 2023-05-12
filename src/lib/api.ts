import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// Authenticates the user for api route and return the session object
// Sends a 401 response is user is not login
export async function authenticate(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ errorMsg: "Unauthenicated, please login" });
    return null;
  }

  return session;
};

export async function fecthActiveList(url: string) {
  return fetch(url, {
    method: 'POST',
  }).then(res => res.json())
}