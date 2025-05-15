import { Router } from "express";
import * as controllerFriends from "../controllers/controllerFriends";

const routerFriends: Router = Router();

// all of the following routes require a session
routerFriends.use(async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ err: "Currently not signed in" });
    return;
  }
  next();
});

routerFriends.get("/(friends)?", controllerFriends.getAllFriends);
routerFriends.get("/request(s)?", controllerFriends.getAllFriendRequests);
routerFriends.get("/search/:user", controllerFriends.findUser);
routerFriends.put("/request(s)?", controllerFriends.sendFriendRequest);
routerFriends.put(
  "/acceptFriendRequest",
  controllerFriends.acceptFriendRequest
);

export default routerFriends;
