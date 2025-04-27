import { Router } from "express";
import * as controllerAuthorization from "../controllers/controllerAuthorization";
import passport, { AuthorizeCallback } from "passport";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { Strategy } from "passport-local";

const routerAuthorization: Router = Router();

routerAuthorization.post("/sign_up", controllerAuthorization.signUp);
routerAuthorization.post("/log_in", async (req, res, next) => {
  console.log("in the login");

  const myCallback: passport.AuthorizeCallback = (err, user, info, status) => {
    if (user) {
      req.logIn(user, function (err) {
        if (err) {
          throw Error(err);
        }
      });
      res.locals.currentUser = user.id;
      res.json(user);
      return;
    }
    res.status(401).json(info);
    return;
  };
  passport.authenticate("local", {}, myCallback)(req, res, next);
});
routerAuthorization.get("/logout", controllerAuthorization.logout);

export default routerAuthorization;
