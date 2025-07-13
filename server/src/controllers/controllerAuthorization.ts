import { NextFunction, Request, RequestHandler, Response } from "express";
import prisma from "../../prisma/prisma";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { body, validationResult, matchedData } from "express-validator";
import passport from "passport";

type username = { username: string };
type password = { password: string };
type email = { email: string };

type SignUpReqData = username & password & email;

const createUsernameChain = () =>
  body("username").trim().escape().isAlphanumeric();
const createEmailChain = () => body("email").trim().escape().isEmail();

const createPasswordChain = () =>
  body("password").trim().escape().isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  });

const signUpValidator = [
  createUsernameChain(),
  createEmailChain(),
  createPasswordChain(),
];

const signUp = [
  ...signUpValidator,
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({ error: "email, password, or username is missing" });
      return;
    }

    const data = matchedData<SignUpReqData>(req);

    const hashedPassword: string = await bcrypt.hash(data.password, 10);

    const row = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        username: data.username,
      },
    });

    if (!row) {
      res.status(409).json({ error: "Failed to create user in the databse" });
      return;
    }

    res.status(200).json({ res: "success!" });
  }),
];

const validateLogin = [createPasswordChain(), createUsernameChain()];

const login = [
  ...validateLogin,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: "login failed" });
      return;
    }
    next();
  }),
  passport.authenticate("local", {
    failureMessage: true,
    failureRedirect: "/authorization/log_in_failure",
  }),
  asyncHandler(async (req: Request, res: Response) => {
    res.json({ username: req.user?.username, settings: req.user?.settings });
  }),
];

const logout = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.json({ message: "logout success!" });
    });
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

export { signUp, logout, login, protectedRoute, logInFailure };
