import express, { Express, Request, Response } from "express";
import dotevn from "dotenv";
import cors from "cors";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "../prisma/prisma";
import passport from "passport";
import { Strategy } from "passport-local";
import routerAuthorization from "./routes/routesAuthorization";

// import routers

dotevn.config({ path: "../.env" });
const app: Express = express();
const port = process.env.PORT || 3000;
const secret = process.env.SECRET_KEY || "secret";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.session());

// use routers
app.use("/authorization", routerAuthorization);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
