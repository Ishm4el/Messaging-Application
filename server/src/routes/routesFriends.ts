import { Router } from "express";
import * as controllerFriends from "../controllers/controllerFriends";

const routerFriends: Router = Router();

// all of the following routes require a session
routerFriends.get("/{friends}", controllerFriends.getAllFriends);
routerFriends.get("/request{s}", controllerFriends.getAllFriendRequests);
routerFriends.get(
  "/request{s}_count",
  controllerFriends.getAllFriendRequestsCount
);
routerFriends.get("/search/:user", controllerFriends.findUser);
routerFriends.put("/request{s}", controllerFriends.sendFriendRequest);
routerFriends.put(
  "/cancel_friend_request",
  controllerFriends.cancelFriendRequest
);
routerFriends.put(
  "/acceptFriendRequest",
  controllerFriends.acceptFriendRequest
);
routerFriends.put("/remove_friend", controllerFriends.removeFriend);
routerFriends.put(
  "/decline_friend_request",
  controllerFriends.declineFriendRequest
);

export default routerFriends;
