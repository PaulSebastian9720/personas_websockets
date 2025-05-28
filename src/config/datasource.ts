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

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000;

export const startDatabase = async (retries = MAX_RETRIES) => {
  try {
    await AppDataSource.initialize();
    console.log("Base de datos conectada correctamente");
  } catch (error) {
    console.error("Error conectando a la base de datos:");

    if (retries > 0) {
      console.log(
        `Reintentando conexión... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`
      );
      setTimeout(() => startDatabase(retries - 1), RETRY_DELAY_MS);
    } else {
      console.error(
        "No se pudo conectar después de varios intentos. Cerrando app."
      );
      process.exit(1);
    }
  }
};
