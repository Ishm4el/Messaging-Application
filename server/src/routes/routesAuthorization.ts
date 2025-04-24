import { Router } from "express";
import * as controllerAuthorization from "../controllers/controllerAuthorization";
import passport from "passport";

const routerAuthorization: Router = Router();

routerAuthorization.post("/sign_up", controllerAuthorization.signUp);
routerAuthorization.post("/log_in", passport.authenticate("local"));
routerAuthorization.get("/logout", controllerAuthorization.logout)

export default routerAuthorization;
