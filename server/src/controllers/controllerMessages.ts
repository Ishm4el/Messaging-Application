import { Request, RequestHandler, Response } from "express";
import prisma from "../../prisma/prisma";
import asyncHandler from "express-async-handler";

const getMessagesFrom = asyncHandler(async (req: Request, res: Response) => {
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
    res.status(400).json({ error: "Could not retrieve messages" });
    return;
  }

  res.status(200).json(foundMessages);
});

const postMessage = asyncHandler(async (req: Request, res: Response) => {
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

  res.status(400).json({ error: "Message was not created" });
});

export { getMessagesFrom, postMessage };
