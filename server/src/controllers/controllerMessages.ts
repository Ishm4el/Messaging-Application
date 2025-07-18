import { Request, RequestHandler, Response } from "express";
import prisma from "../../prisma/prisma";
import ExpressError from "../errors/ExpressError";

interface RequestUpdate extends Request {
  user: { username: string; id: string };
}

const getMessagesFrom = async (req: Request, res: Response) => {
  const otherUsername: string = req.params.username;
  const foundMessages = await prisma.message.findMany({
    where: {
      author: {
        OR: [
          {
            username: otherUsername,
            friends: { some: { username: { equals: req.user?.username } } },
          },
          {
            username: req.user?.username,
            friends: { some: { username: { equals: otherUsername } } },
          },
        ],
      },
      recipient: {
        every: {
          OR: [{ username: otherUsername }, { username: req.user?.username }],
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
};

const postMessage = async (req: Request, res: Response) => {
  const otherUsername = req.params.username;
  const text: string = req.body.text;
  const authorId = req.user?.id!;
  console.log(authorId);
  const postMessage = await prisma.message.create({
    data: {
      authorId: req.user?.id!,
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
};

export { getMessagesFrom, postMessage };
