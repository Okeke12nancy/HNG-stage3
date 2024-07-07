import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Organisation } from "./entity/organizaton";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "127.0.0.1",
  port: 5433,
  username: "postgres",
  password: "postgres",
  database: "stage-3",
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
