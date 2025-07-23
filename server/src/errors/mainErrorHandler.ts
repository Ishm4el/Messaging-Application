import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import ExpressError from "./ExpressError";

const mainErrorHandler: ErrorRequestHandler = (
  err: ExpressError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ExpressError) {
    console.error(err);
    res
      .status(err.statusCode || 500)
      .json({ status: err.statusCode, message: err.message, name: err.name });
    return;
  } else if (err instanceof Error) {
    console.error(err);
    res.status(500).json({ status: 500, message: JSON.stringify(err) });
  } else {
    res.status(500).json({ status: 500, message: "ERROR" });
  }
};

export default mainErrorHandler;
