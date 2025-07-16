import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import ExpressError from "./ExpressError";

const mainErrorHandler: ErrorRequestHandler = (
  err: ExpressError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  res
    .status(err.statusCode || 500)
    .json({ status: err.statusCode, message: err.message });
  return;
};

export default mainErrorHandler;
