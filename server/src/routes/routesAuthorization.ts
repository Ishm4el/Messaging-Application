import { Router } from "express";
import * as controllerAuthorization from "../controllers/controllerAuthorization";

const routerAuthorization: Router = Router();

routerAuthorization.post("sign-up", controllerAuthorization.signUp);

export default routerAuthorization;
