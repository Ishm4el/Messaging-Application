import { Request, RequestHandler, Response } from "express";
import prisma from "../../prisma/prisma";
import ExpressError from "../errors/ExpressError";
import { gaurdRequestAuthorized } from "./utility/requestChecker";
import { body, matchedData, param, validationResult } from "express-validator";
import { RequestValidateAndHandler } from "./controllers-env";

interface RequestUpdate extends Request {
  user: { username: string; id: string };
}

const createUserSearchParamChain = () =>
  param("username").trim().escape().notEmpty().isString();

const createUsernameSearchBodyChain = () =>
  body("username").trim().escape().notEmpty().isString();

const createTextBodyChain = () =>
  body("text").trim().escape().notEmpty().isString();

const getMessagesFrom: RequestValidateAndHandler = [
  createUserSearchParamChain(),
  async (req: Request, res: Response) => {
    gaurdRequestAuthorized(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ExpressError(
        errors.array().toString(),
        "validation error",
        500
      );
    }

    const data = matchedData<{ username: string }>(req);

    const otherUsername: string = data.username;
    const foundMessages = await prisma.message.findMany({
      where: {
        author: {
          OR: [
            {
              username: otherUsername,
              friends: { some: { username: { equals: req.user.username } } },
            },
            {
              username: req.user.username,
              friends: { some: { username: { equals: otherUsername } } },
            },
          ],
        },
        recipient: {
          every: {
            OR: [{ username: otherUsername }, { username: req.user.username }],
          },
        },
        groupMessage: false,
      },
      include: {
        author: { select: { username: true } },
      },
      omit: { groupMessage: true, authorId: true },
      orderBy: { createdAt: "desc" },
    });

    if (!foundMessages) {
      throw new ExpressError("Could not retrieve messages", "Not Found", 404);
    }

    res.status(200).json(foundMessages);
  },
];

const postMessage: RequestValidateAndHandler = [
  createTextBodyChain(),
  createUserSearchParamChain(),
  async (req: Request, res: Response) => {
    gaurdRequestAuthorized(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ExpressError(
        errors.array().toString(),
        "Validation Error",
        500
      );
    }

    const data = matchedData<{ username: string; text: string }>(req);

    const otherUsername: string = data.username;
    const text: string = data.text;
    const authorId = req.user.id!;
    console.log(authorId);
    const postMessage = await prisma.message.create({
      data: {
        authorId: req.user.id!,
        recipient: { connect: { username: otherUsername } },
        text,
        groupMessage: false,
      },
      include: { author: { select: { username: true } } },
      omit: { groupMessage: true, authorId: true },
    });

    if (postMessage) {
      res.status(201).json(postMessage);
      return;
    }

    throw new ExpressError("Message was not created", "Internal Error", 500);
  },
];

export { getMessagesFrom, postMessage };
