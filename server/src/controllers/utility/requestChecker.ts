import { Request } from "express";
import ExpressError from "../../errors/ExpressError";
import { JsonValue } from "@prisma/client/runtime/library";

interface RequestAuthorized extends Request {
  user: { username: string; id: string; settings?: JsonValue };
}

function confirmAuthorized(req: Request) {
  if (!req.isAuthenticated())
    throw new ExpressError("User is not authorized", "Forbidden", 403);
}

function isUserInRequest(
  req: Request | RequestAuthorized
): asserts req is RequestAuthorized {
  if (!req.user?.id) throw new ExpressError("User not found", "Forbidden", 403);
}

function gaurdRequestAuthorized(
  req: Request | RequestAuthorized
): asserts req is RequestAuthorized {
  confirmAuthorized(req);
  return isUserInRequest(req);
}

export { gaurdRequestAuthorized, RequestAuthorized };
