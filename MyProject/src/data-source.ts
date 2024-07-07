import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Organisation } from "./entity/organizaton";

import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5433"),
  username: process.env.DB_USERNAME,
  password: process.env.DBPASSWORD,
  database: process.env.DATABASE,
  entities: [User, Organisation],
  synchronize: true,
  logging: false,
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
