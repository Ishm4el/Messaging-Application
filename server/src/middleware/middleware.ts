import { Request, Response, NextFunction, RequestHandler } from "express";
import ExpressError from "../errors/ExpressError";
export const isAuthenticatedMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  throw new ExpressError(
    "User must be signed in to access this route",
    "Unauthorized",
    403
  );
};
