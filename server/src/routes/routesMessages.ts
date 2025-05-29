import * as controllerMessages from "../controllers/controllerMessages";
import { Router } from "express";

const routerMessages: Router = Router();

routerMessages.get(
  "/direct_messages/:username",
  controllerMessages.getMessagesFrom
);
routerMessages.post(
  "/send_direct_message/:username",
  controllerMessages.postMessage
);

export default routerMessages;
