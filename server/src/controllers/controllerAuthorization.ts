import { NextFunction, Request, RequestHandler, Response } from "express";
import prisma from "../../prisma/prisma";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import passport, { AuthorizeCallback } from "passport";

const signUp: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user: { email: string; password: string; username: string } =
      req.body;
    if (!user.email || !user.password || !user.username) {
      res
        .status(400)
        .json({ error: "email, password, or username is missing" });
      return;
    }

    const hashedPassword: string = await bcrypt.hash(user.password, 10);

    const row = await prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        username: user.username,
      },
    });

    if (!row) {
      res.status(409).json({ error: "Failed to create user in the databse" });
      return;
    }

    res.status(200).json({ res: "success!" });
  }
);

const login: RequestHandler = async (req, res, next) => {
  console.log("in the login");

  const myCallback: AuthorizeCallback = (err, user, info) => {
    if (err) {
      console.error(err);
      res.status(409).json({ error: err });
      return;
    }
    if (user) {
      req.logIn(user, function (err) {
        if (err) {
          throw Error(err);
        }
      });
      res.locals.currentUser = user.id;
      res.json(user);
      return;
    }
    res.status(401).json(info);
    return;
  };
  passport.authenticate("local", {}, myCallback)(req, res, next);
};

const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: "logout success!" });
  });
};

export { signUp, login, logout };
