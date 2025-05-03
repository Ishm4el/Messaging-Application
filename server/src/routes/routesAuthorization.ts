import { Router } from "express";
import * as controllerAuthorization from "../controllers/controllerAuthorization";
import passport from "passport";

const routerAuthorization: Router = Router();

routerAuthorization.post("/sign_up", controllerAuthorization.signUp);
routerAuthorization.post(
  "/log_in",
  passport.authenticate("local", {
    failureMessage: true,
    failureRedirect: "/authorization/log_in_failure",
  }),
  controllerAuthorization.loginSuccess
);
routerAuthorization.get(
  "/log_in_failure",
  controllerAuthorization.logInFailure
);
routerAuthorization.post("/logout", controllerAuthorization.logout);
routerAuthorization.get("/protected", controllerAuthorization.protectedRoute);

export default routerAuthorization;
