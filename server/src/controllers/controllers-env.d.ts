import { ValidationChain } from "express-validator";
import { RequestHandler } from "express";

type RequestValidateAndHandler = (ValidationChain | RequestHandler)[];
