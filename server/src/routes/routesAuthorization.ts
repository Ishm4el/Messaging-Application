import { Router } from "express";
import * as controllerAuthorization from "../controllers/controllerAuthorization";
import passport from "passport";

const routerAuthorization: Router = Router();

routerAuthorization.post("/sign_up", controllerAuthorization.signUp);
routerAuthorization.post(
  "/log_in",
    passport.authenticate("local", { failureMessage: true }),
    (req, res) => {
      console.log("done with the auth");
      console.log(req.isAuthenticated());
      console.log(req.user);
      res.json(req.user);
    }

  // controllerAuthorization.login
);
routerAuthorization.post("/logout", controllerAuthorization.logout);
routerAuthorization.get("/protected", controllerAuthorization.protectedRoute);

export default routerAuthorization;
