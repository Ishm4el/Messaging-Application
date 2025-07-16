import { Request, RequestHandler, Response } from "express";
import prisma from "../../prisma/prisma";

const getAllFriends: RequestHandler = async (req: Request, res: Response) => {
  const userFriends = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { friends: true },
  });

  console.log(userFriends);

  res.status(200).json({ friends: userFriends });
};
const findUser: RequestHandler = async (req: Request, res: Response) => {
  if (!req.params.user) {
    res.status(400).json({ err: "No Search was provided" });
    return;
  }

  const search: string = req.params.user;
  const foundUsers = await prisma.user.findMany({
    where: {
      username: { startsWith: search },
      NOT: [
        // exclude the current user from the search
        { id: req.user!.id },
        // exclude users who are already friended
        // { friends: { some: { id: { equals: req.user!.id } } } },
      ],
    },
    select: {
      username: true,
      requests: {
        where: { id: { equals: req.user!.id } },
        select: { username: true },
        take: 1,
      },
      friends: {
        where: { id: { equals: req.user!.id } },
        select: { username: true },
        take: 1,
      },
      requestsRelation: {
        where: { id: { equals: req.user!.id } },
        take: 1,
      },
    },
  });

  res.status(200).json(foundUsers);
};
const getAllFriendRequests: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const userIncomingFriendRequests = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { requests: true },
  });

  res.status(200).json(userIncomingFriendRequests);
};
const getAllFriendRequestsCount: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const allFriendRequestsCount = await prisma.user.findUnique({
    where: { username: req.user!.username },
    select: { _count: { select: { requests: true } } },
  });
  if (allFriendRequestsCount === null) {
    res.end();
    return;
  }
  res.json(allFriendRequestsCount._count.requests);
  return;
};
const sendFriendRequest: RequestHandler = async (
  req: Request,
  res: Response
) => {
  // create friend relationship
  const addingRequestResult = await prisma.user.update({
    where: { username: req.body.username },
    data: { requests: { connect: { username: req.user!.username } } },
  });

  console.log(addingRequestResult);

  res.status(200).json(addingRequestResult);
};
const acceptFriendRequest: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const confirmFriendRequest = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      requests: {
        where: { username: { equals: req.body.username } },
        take: 1,
      },
    },
  });

  if (confirmFriendRequest?.requests[0].username !== req.body.username) {
    console.log("stopped new friend making");
    res.status(403).json({
      error: "Friend could not be found in requests of the primary user",
    });
    return;
  }

  // remove user from the requestee
  const settleUsers = await prisma.user.update({
    where: { id: req.user!.id },
    data: { requests: { disconnect: [{ username: req.body.username }] } },
  });

  console.log("[settleUsers]: ");
  console.log(settleUsers);

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
};
const rejectFriendRequest: RequestHandler = async (req, res) => {
  const rejectFriendRequestResult = await prisma.user.update({
    where: { username: req.user?.username },
    data: { requestsRelation: { disconnect: { username: req.body.username } } },
  });

  res.status(200).json({ message: "Friend Request has been rejected" });
};

const cancelFriendRequest: RequestHandler = async (req, res) => {
  await prisma.user.update({
    where: { username: req.body.username },
    data: { requests: { disconnect: { username: req.user!.username } } },
  });

  res
    .status(200)
    .json({ res: `Friend request has been canceld for: ${req.body.username}` });
};

const declineFriendRequest: RequestHandler = async (req, res) => {
  await prisma.user.update({
    where: { username: req.user!.username },
    data: { requests: { disconnect: { username: req.body.username } } },
  });
  res.status(200).json({ message: "Friend Request Declined" });
};

const removeFriend: RequestHandler = async (req, res) => {
  console.log("remove Friend");

  // remove friend on the other user
  await prisma.user.update({
    where: { username: req.body.username },
    data: { friends: { disconnect: { username: req.user!.username } } },
  });

  // remove friend on current user
  await prisma.user.update({
    where: { username: req.user!.username },
    data: { friends: { disconnect: { username: req.body.username } } },
  });

  const currentUser = await prisma.user.findUnique({
    where: { username: req.body.username },
    include: { friends: true },
  });

  console.log("friend was removed");
  console.log(currentUser);

  res.status(200).json({ message: "Friend Removed" });
};

export {
  getAllFriends,
  findUser,
  getAllFriendRequests,
  getAllFriendRequestsCount,
  sendFriendRequest,
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  removeFriend,
};
