import express, { Express, NextFunction, Request, Response } from "express";
import dotevn from "dotenv";
import cors from "cors";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "../prisma/prisma";
import passport from "passport";
import { Strategy } from "passport-local";
import routerAuthorization from "./routes/routesAuthorization";
import bcrypt from "bcryptjs";

declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}

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

passport.use(
  new Strategy(async (username, password, done) => {
    console.log("[passport]: in the use method");
    console.log(username, " ", password);
    try {
      const user = await prisma.user.findUnique({
        where: { username: username },
      });

      if (!user) {
        return done(null, false, { message: "username" });
      }

      user.userId = user.id;

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "password" });
      }

      return done(null, user, { message: "successful authorization!" });
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const rows = await prisma.user.findUnique({ where: { id: id } });
    done(null, rows);
  } catch (err) {
    done(err);
  }
});

// use routers
app.use("/authorization", routerAuthorization);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(500).json({ res: err.message });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
