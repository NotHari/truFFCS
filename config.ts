import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
import { Config } from "./types";

export const config: Config = {
  port: Number(process.env.PORT) || 3000,
  adminSecretKey: process.env.ADMIN_SECRET_KEY || "",
  studentSecretKey: process.env.STUDENT_SECRET_KEY || "",
  db: {
    user: process.env.DB_USER || "",
    database: process.env.DB || "",
    password: process.env.DB_PASS || "",
    host: process.env.DB_HOST || "",
    port: Number(process.env.DB_PORT) || 5432,
    max: Number(process.env.DB_MAX_CLIENTS) || 20,
    idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS) || 30000,
  },
};
