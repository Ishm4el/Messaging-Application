import { Request, RequestHandler, Response } from "express";
import prisma from "../../prisma/prisma";
import {
  body,
  matchedData,
  oneOf,
  param,
  ValidationChain,
  validationResult,
} from "express-validator";
import nullChecker from "./utility/rowChecker";
import ExpressError from "../errors/ExpressError";
import { gaurdRequestAuthorized } from "./utility/requestChecker";
import { RequestValidateAndHandler } from "./controllers-env";

const BACKGROUND_COLORS = ["", "dark"];

const getPrimaryUserProfile: RequestHandler = async (
  req: Request,
  res: Response
) => {
  gaurdRequestAuthorized(req);
  const primaryUserProfile = await prisma.user.findUnique({
    where: { username: req.user.username },
  });
  nullChecker(primaryUserProfile, res, "Primary user was not found");
};

const getOtherUserProfile: RequestValidateAndHandler = [
  param("username").trim().escape().notEmpty().isString(),
  async (req: Request, res: Response) => {
    gaurdRequestAuthorized(req);

    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw new ExpressError(errors.array.toString(), "Validation Error", 500);

    const data = matchedData<{ username: string }>(req);

    const otherUserUsername = data.username;
    if (otherUserUsername === req.user.username) {
      res.redirect("/primary_profile");
      return;
    }

    const otherUserProfile = await prisma.user.findUnique({
      where: { username: otherUserUsername },
      include: {
        friends: {
          where: { username: { equals: req.user.username } },
          select: { username: true },
        },
        requests: {
          where: { username: { equals: req.user.username } },
          select: { username: true },
        },
        requestsRelation: {
          where: { username: { equals: req.user.username } },
          select: { username: true },
        },
      },
    });
    nullChecker(otherUserProfile, res, "Other user was not found");
  },
];

const createBackgroundColorSettingChain = () =>
  body("backgroundColorSettings")
    .escape()
    .custom(async (value) => {
      if (!BACKGROUND_COLORS.includes(value)) {
        throw new Error("Recieved background color is not an option");
      }
      return true;
    })
    .isEmpty();

const postSettingsValidation = () => {
  oneOf([createBackgroundColorSettingChain()]);
};

const postSettings = [
  postSettingsValidation,
  async (req: Request, res: Response) => {
    // there should be a validator to make sure users
    // post their own settings that are not part of the application.
    gaurdRequestAuthorized(req);
    const currentProfileSettings = await prisma.user.findUnique({
      where: { username: req.user.username },
      select: { settings: true },
    });

    if (currentProfileSettings === null) {
      throw new ExpressError(
        "Settings could not be applied",
        "Internal Error",
        500
      );
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

    const data = matchedData(req);

    const newProfileSettings = {
      ...jsonData,
      ...data,
    };

    const postedProfileSettings = await prisma.user.update({
      where: { username: req.user.username },
      data: { settings: newProfileSettings },
      select: { settings: true },
    });

    res.json(postedProfileSettings.settings);
    return;
  },
];

export { getPrimaryUserProfile, getOtherUserProfile, postSettings };
