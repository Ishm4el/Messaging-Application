import { Router } from "express";
import * as controllerAuthorization from "../controllers/controllerAuthorization";

const routerAuthorization: Router = Router();

routerAuthorization.post("/sign_up", controllerAuthorization.signUp);
routerAuthorization.post("/log_in", controllerAuthorization.login);
routerAuthorization.get("/logout", controllerAuthorization.logout);

export default routerAuthorization;
