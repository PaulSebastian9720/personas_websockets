import { DataSource } from "typeorm";
import { Person } from "../entities/persons.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "postgres_db",
  port: 5432,
  username: "postgres",
  password: "root",
  database: "db_postgres",
  synchronize: true,
  logging: false,
  entities: [Person],
  migrations: [],
  subscribers: [],
});
