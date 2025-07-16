import { Response } from "express";
import ExpressError from "../../errors/ExpressError";

export default (
  row: { [key: string]: any } | null,
  res: Response,
  errorMessage: string
) => {
  console.log(row);

  if (row !== null) res.json(row);
  else throw new ExpressError(errorMessage, "Row is null", 404);
};
