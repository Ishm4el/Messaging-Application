import { Request, RequestHandler, Response } from "express";
import prisma from "../../prisma/prisma";
import asyncHandler from "express-async-handler";

const getAllFriends: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userFriends = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { friends: true },
    });

    console.log(userFriends);

    res.status(200).json({ friends: userFriends });
  }
);

const findUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.params.user) {
      res.status(400).json({ err: "No Search was provided" });
      return;
    }

    const search: string = req.params.user;
    const foundUsers = await prisma.user.findMany({
      where: {
        username: { startsWith: search },
        NOT: [
          { id: req.user!.id },
          // { requests: { some: { id: { equals: req.user.id } } } },
        ],
      },
      select: {
        username: true,
        requests: { where: { id: { equals: req.user!.id } } },
        // requests: { where: { NOT: { id: req.user.id } } },
      },
    });

    // console.log(foundUsers);

    res.status(200).json(foundUsers);
  }
);

const getAllFriendRequests: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userIncomingFriendRequests = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { requests: true },
    });

    console.log(userIncomingFriendRequests);

    res.status(200).json(userIncomingFriendRequests);
  }
);

const sendFriendRequest: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // create friend relationship
    const addingRequestResult = await prisma.user.update({
      where: { username: req.body.username },
      data: { requests: { connect: { username: req.user!.username } } },
    });

    res.status(200).json(addingRequestResult);
  }
);

const acceptFriendRequest: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // remove user from the requestee
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { requests: { disconnect: [{ username: req.body.username }] } },
    });

    // add friend to the current user
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { friends: { connect: { username: req.body.username } } },
    });

    // add user to the other user
    await prisma.user.update({
      where: { username: req.body.username },
      data: { friends: { connect: { id: req.user!.id } } },
    });

    res.status(200).json({ res: "done" });
  }
);

export {
  getAllFriends,
  findUser,
  getAllFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
};
