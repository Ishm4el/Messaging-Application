import { NextFunction, Request, RequestHandler, Response } from "express";
import prisma from "../../prisma/prisma";
import bcrypt from "bcryptjs";
import { body, validationResult, matchedData } from "express-validator";
import passport from "passport";
import ExpressError from "../errors/ExpressError";

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
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ExpressError(
        "email, password, or username is missing",
        "Icomplete Form",
        400
      );
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
      throw new ExpressError(
        "Failed to create a new user",
        "Create Failure",
        500
      );
    }

    res.status(200).json({ res: "success!" });
  },
];

const validateLogin = [createPasswordChain(), createUsernameChain()];

const login = [
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
    res.json({ username: req.user?.username, settings: req.user?.settings });
  },
];

const logout = (req: Request, res: Response, next: NextFunction) => {
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
