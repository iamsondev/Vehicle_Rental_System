import express, { Request, Response } from "express";
import { userRoute } from "./modules/users/users.route";
import initDB from "./config/db";
import config from "./config";

const app = express();
const port = config.port;

app.use(express.json());

initDB();

app.get("/", (req: Request, res: Response) => {
  res.status(201).json({
    message: "This is the root",
    path: req.path,
  });
});

app.use("/api/v1/users", userRoute);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
