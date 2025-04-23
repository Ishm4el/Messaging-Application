import { Router } from "express";
import * as controllerAuthorization from "../controllers/controllerAuthorization";
import passport from "passport";

const routerAuthorization: Router = Router();

routerAuthorization.post("/sign-up", controllerAuthorization.signUp);
routerAuthorization.post("/log_in", passport.authenticate("local"));

export default routerAuthorization;
