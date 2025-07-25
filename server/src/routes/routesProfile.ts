import { Router } from "express";
import * as controllerProfile from "../controllers/controllerProfile";

const routerProfile: Router = Router();

routerProfile.get("/primary_profile", controllerProfile.getPrimaryUserProfile);
routerProfile.get(
  "/other_profile/:username",
  controllerProfile.getOtherUserProfile
);
routerProfile.post("/setting{s}", controllerProfile.postSettings);

export default routerProfile;
