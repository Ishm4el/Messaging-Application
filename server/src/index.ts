import express, { Express, NextFunction, Request, Response } from "express";
import dotevn from "dotenv";
import cors from "cors";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "../prisma/prisma";
import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcryptjs";
import routerAuthorization from "./routes/routesAuthorization";
import routerFriends from "./routes/routesFriends";
import routerProfile from "./routes/routesProfile";
import routerMessages from "./routes/routesMessages";
import { JsonValue } from "@prisma/client/runtime/library";

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      settings?: JsonValue;
    }
  }
}

dotevn.config({ path: "../.env" });
const app: Express = express();
const port = process.env.PORT || 3000;
const secret = process.env.SECRET_KEY || "secret";

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:4173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    exposedHeaders: ["Content-Type", "Authorization"],
  })
);
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
    try {
      const user = await prisma.user.findUnique({
        where: { username: username },
        select: {
          password: true,
          email: true,
          id: true,
          username: true,
          settings: true,
        },
      });

      if (!user) {
        return done(null, false, { message: "username" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "password" });
      }

      return done(null, user, { message: "successful authorization!" });
    } catch (err) {
      console.log("in the err of strategy");
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  console.log("serializeUser");

  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  console.log("deserializeUser");
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: { id: true, username: true },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// use routers
app.use("/authorization", routerAuthorization);
app.use(async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ err: "Currently not signed in" });
    return;
  }
  next();
});
app.use("/friends", routerFriends);
app.use("/profile", routerProfile);
app.use("/messages", routerMessages);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ res: err.message });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
