import { NextFunction, Request, RequestHandler, Response } from "express";
import prisma from "../../prisma/prisma";
import bcrypt from "bcryptjs";
import {
  validationResult,
  matchedData,
  ValidationChain,
} from "express-validator";
import passport from "passport";
import { gaurdRequestAuthorized } from "./utility/requestChecker";
import ExpressError from "../errors/ExpressError";
import {
  SignUpReqData,
  signUpValidator,
  validateLogin,
} from "./validators/validateAuthorization";

const signUp: (ValidationChain | RequestHandler)[] = [
  ...signUpValidator,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ExpressError(
        "email, password, or username is missing",
        "Icomplete Form",
        400
      );
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
      throw new ExpressError(
        "Failed to create a new user",
        "Create Failure",
        500
      );
    }

    res.status(200).json({ res: "success!" });
  },
];

const login: (ValidationChain | RequestHandler)[] = [
  ...validateLogin,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ExpressError(
        "Sign in form is not filled out",
        "Incomplete Form",
        400
      );
    }
    next();
  },
  passport.authenticate("local", {
    failureMessage: true,
    failureRedirect: "/authorization/log_in_failure",
  }),
  async (req: Request, res: Response) => {
    gaurdRequestAuthorized(req);
    res.json({ username: req.user.username, settings: req.user.settings });
  },
];

const logout: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: "logout success!" });
  });
};
declare module "express-session" {
  interface Session {
    messages?: Array<String>;
  }
}

const logInFailure: RequestHandler = async (req: Request, res: Response) => {
  throw new ExpressError("Login failed", "Failed to authenticate", 401);
};

const protectedRoute: RequestHandler = async (req: Request, res: Response) => {
  console.log("++++++++++++++++++++++++++++++++++++++++++");
  console.log(req.isAuthenticated());
  console.log("user: " + JSON.stringify(req.user));

  console.log(req.session);
  res.json({ secret: "Cat in the Hat!" });
};

export { signUp, logout, login, protectedRoute, logInFailure };
