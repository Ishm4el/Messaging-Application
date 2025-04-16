import express, { Express, Request, Response } from "express";
import dotevn from "dotenv";
import cors from "cors";

// import routers

dotevn.config({ path: "../.env" });
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use routers

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
