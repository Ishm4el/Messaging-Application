import { Request, RequestHandler, Response } from "express";
import prisma from "../../prisma/prisma";
import asyncHandler from "express-async-handler";

const nullChecker = (
  row: { [key: string]: any } | null,
  res: Response,
  errorMessage: string
) => {
  console.log(row);

  if (row !== null) res.json(row);
  else res.json({ error: errorMessage });
};

const getPrimaryUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const primaryUserProfile = await prisma.user.findUnique({
      where: { username: req.user?.username },
    });
    nullChecker(primaryUserProfile, res, "Primary user was not found");
  }
);

const getOtherUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const otherUserUsername = req.params.username;
    if (otherUserUsername === req.user?.username) {
      res.redirect("/primary_profile");
      return;
    }

    const otherUserProfile = await prisma.user.findUnique({
      where: { username: otherUserUsername },
    });
    nullChecker(otherUserProfile, res, "Other user was not found");
  }
);

export { getPrimaryUserProfile, getOtherUserProfile };
