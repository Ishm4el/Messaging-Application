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
      include: {
        friends: {
          where: { username: { equals: req.user?.username } },
          select: { username: true },
        },
        requests: {
          where: { username: { equals: req.user?.username } },
          select: { username: true },
        },
        requestsRelation: {
          where: { username: { equals: req.user?.username } },
          select: { username: true },
        },
      },
    });
    nullChecker(otherUserProfile, res, "Other user was not found");
  }
);

const postSettings = asyncHandler(async (req: Request, res: Response) => {
  // there should be a validator to make sure users
  // post their own settings that are not part of the application.
  const currentProfileSettings = await prisma.user.findUnique({
    where: { username: req.user?.username },
    select: { settings: true },
  });

  if (currentProfileSettings === null) {
    // throw new Error("currentProfileSettings is null!");
    res.json({ error: "Settings could not be applied" });
    return;
  }

  const currentProfileSettingsString = JSON.stringify(
    currentProfileSettings.settings
  );
  console.log("currentProfileSettingsString: ");
  console.log(currentProfileSettingsString);

  const jsonData = JSON.parse(
    currentProfileSettingsString === undefined
      ? "{}"
      : currentProfileSettingsString
  );

  const newProfileSettings = {
    ...jsonData,
    ...req.body,
  };

  const postedProfileSettings = await prisma.user.update({
    where: { username: req.user?.username },
    data: { settings: newProfileSettings },
    select: { settings: true },
  });

  res.json(postedProfileSettings.settings);
  return;
});

export { getPrimaryUserProfile, getOtherUserProfile, postSettings };
