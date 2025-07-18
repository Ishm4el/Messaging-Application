import { Request, RequestHandler, Response } from "express";
import prisma from "../../prisma/prisma";
import { gaurdRequestAuthorized } from "./utility/requestChecker";
import ExpressError from "../errors/ExpressError";
import {
  matchedData,
  param,
  Result,
  ValidationError,
  validationResult,
} from "express-validator";
import { RequestValidateAndHandler } from "./controllers-env";
import rowChecker from "./utility/rowChecker";

const createUserSearchChain = (name: "user" | "username") =>
  param(name).trim().escape().notEmpty().isString();

const checkIfUserIsEmpty = (errors: Result<ValidationError>) => {
  console.log(errors);

  if (!errors.isEmpty()) {
    throw new ExpressError("No username was provided", "Bad Request", 400);
  }
};

const validateResultOnlyBodyUser = (req: Request) => {
  const errors = validationResult(req);
  checkIfUserIsEmpty(errors);
};

const getAllFriends: RequestHandler = async (req: Request, res: Response) => {
  gaurdRequestAuthorized(req);

  console.log(req.session.id);
  console.log(req.user.id);

  const userFriends = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { friends: true },
  });

  console.log(userFriends);

  res.status(200).json({ friends: userFriends });
};

const findUser: RequestValidateAndHandler = [
  createUserSearchChain("user"),
  async (req: Request, res: Response) => {
    gaurdRequestAuthorized(req);

    validateResultOnlyBodyUser(req)

    const data = matchedData<{ user: string }>(req);

    const foundUsers = await prisma.user.findMany({
      where: {
        username: { startsWith: data.user },
        NOT: [
          // exclude the current user from the search
          { id: req.user.id },
          // exclude users who are already friended
          // { friends: { some: { id: { equals: req.user.id } } } },
        ],
      },
      select: {
        username: true,
        requests: {
          where: { id: { equals: req.user.id } },
          select: { username: true },
          take: 1,
        },
        friends: {
          where: { id: { equals: req.user.id } },
          select: { username: true },
          take: 1,
        },
        requestsRelation: {
          where: { id: { equals: req.user.id } },
          take: 1,
        },
      },
    });

    rowChecker(foundUsers, res, "No users were found");
  },
];

const getAllFriendRequests: RequestHandler = async (
  req: Request,
  res: Response
) => {
  gaurdRequestAuthorized(req);
  const userIncomingFriendRequests = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { requests: true },
  });

  res.status(200).json(userIncomingFriendRequests);
};

const getAllFriendRequestsCount: RequestHandler = async (
  req: Request,
  res: Response
) => {
  gaurdRequestAuthorized(req);
  const allFriendRequestsCount = await prisma.user.findUnique({
    where: { username: req.user.username },
    select: { _count: { select: { requests: true } } },
  });
  if (allFriendRequestsCount === null) {
    res.end();
    return;
  }
  res.json(allFriendRequestsCount._count.requests);
  return;
};

const sendFriendRequest: RequestValidateAndHandler = [
  createUserSearchChain("username"),
  async (req: Request, res: Response) => {
    gaurdRequestAuthorized(req);

    validateResultOnlyBodyUser(req)

    const data = matchedData<{ username: string }>(req);

    // create friend relationship
    const addingRequestResult = await prisma.user.update({
      where: { username: data.username },
      data: { requests: { connect: { username: req.user.username } } },
    });

    console.log(addingRequestResult);

    rowChecker(addingRequestResult, res, "addingRequestResult is empty");
  },
];

const acceptFriendRequest: RequestValidateAndHandler = [
  createUserSearchChain("username"),
  async (req: Request, res: Response) => {
    gaurdRequestAuthorized(req);

    validateResultOnlyBodyUser(req)

    const data = matchedData<{ username: string }>(req);

    const confirmFriendRequest = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        requests: {
          where: { username: { equals: data.username } },
          take: 1,
        },
      },
    });

    if (!confirmFriendRequest)
      throw new ExpressError(
        "ConfirmFriendRequest is null",
        "Data not found",
        404
      );

    if (confirmFriendRequest.requests[0].username !== data.username) {
      console.log("stopped new friend making");
      res.status(403).json({
        error: "Friend could not be found in requests of the primary user",
      });
      return;
    }

    // remove user from the requestee
    const settleUsers = await prisma.user.update({
      where: { id: req.user.id },
      data: { requests: { disconnect: [{ username: data.username }] } },
    });

    console.log("[settleUsers]: ");
    console.log(settleUsers);

    // add friend to the current user
    await prisma.user.update({
      where: { id: req.user.id },
      data: { friends: { connect: { username: data.username } } },
    });

    // add user to the other user
    await prisma.user.update({
      where: { username: data.username },
      data: { friends: { connect: { id: req.user.id } } },
    });

    res.status(200).json({ res: "done" });
  },
];

const cancelFriendRequest: RequestValidateAndHandler = [
  createUserSearchChain("username"),
  async (req: Request, res: Response) => {
    gaurdRequestAuthorized(req);

    validateResultOnlyBodyUser(req)

    const data = matchedData<{ username: string }>(req);

    await prisma.user.update({
      where: { username: data.username },
      data: { requests: { disconnect: { username: req.user.username } } },
    });

    res.status(200).json({
      res: `Friend request has been canceld for: ${data.username}`,
    });
  },
];

const declineFriendRequest: RequestValidateAndHandler = [
  async (req: Request, res: Response) => {
    gaurdRequestAuthorized(req);

    validateResultOnlyBodyUser(req)

    const data = matchedData<{ username: string }>(req);

    await prisma.user.update({
      where: { username: req.user.username },
      data: { requests: { disconnect: { username: data.username } } },
    });
    res.status(200).json({ message: "Friend Request Declined" });
  },
];

const removeFriend: RequestValidateAndHandler = [
  createUserSearchChain("username"),
  async (req: Request, res: Response) => {
    gaurdRequestAuthorized(req);
    console.log("remove Friend");

    validateResultOnlyBodyUser(req)

    const data = matchedData<{ username: string }>(req);

    // remove friend on the other user
    await prisma.user.update({
      where: { username: data.username },
      data: { friends: { disconnect: { username: req.user.username } } },
    });

    // remove friend on current user
    await prisma.user.update({
      where: { username: req.user.username },
      data: { friends: { disconnect: { username: data.username } } },
    });

    const currentUser = await prisma.user.findUnique({
      where: { username: data.username },
      include: { friends: true },
    });

    console.log("friend was removed");
    console.log(currentUser);

    res.status(200).json({ message: "Friend Removed" });
  },
];

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
