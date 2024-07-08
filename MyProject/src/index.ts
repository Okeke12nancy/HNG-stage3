import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import orgRoutes from "./routes/organization";

import dotenv from "dotenv";

dotenv.config();

AppDataSource.initialize()
  .then(() => {
    const app = express();

    app.use(express.json());
    app.use("/auth", authRoutes);
    app.use("/api", userRoutes);
    app.use("/api", orgRoutes);

    app.get("/ping", (req, res) => {
      res.sendStatus(200);
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
