import { Router } from "express";
import * as controllerAuthorization from "../controllers/controllerAuthorization";

const routerAuthorization: Router = Router();

routerAuthorization.post("/sign_up", controllerAuthorization.signUp);
routerAuthorization.post("/log_in", controllerAuthorization.login);
routerAuthorization.get(
  "/log_in_failure",
  controllerAuthorization.logInFailure
);
routerAuthorization.post("/logout", controllerAuthorization.logout);
routerAuthorization.get("/protected", controllerAuthorization.protectedRoute);

export default routerAuthorization;
