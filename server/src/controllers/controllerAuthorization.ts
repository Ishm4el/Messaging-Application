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

const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: "logout success!" });
  });
};

const loginSuccess: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("done with the auth");
    console.log(req.isAuthenticated());
    console.log(req.user);
    res.json(req.user);
  }
);

declare module "express-session" {
  interface Session {
    messages?: Array<String>;
  }
}
const logInFailure: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("[logInFailure] beginning");
    res.status(401).json({ message: req.session.messages!.pop() });
  }
);

const protectedRoute: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("++++++++++++++++++++++++++++++++++++++++++");
    console.log(req.isAuthenticated());
    console.log("user: " + JSON.stringify(req.user));

    console.log(req.session);
    res.json({ secret: "Cat in the Hat!" });
  }
);

export { signUp, logout, loginSuccess, protectedRoute, logInFailure };
