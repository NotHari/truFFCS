// config
export interface Config {
  port: number;
  adminSecretKey: string;
  studentSecretKey: string;
  db: PgConfig;
}

// dbUtils
export interface PgConfig {
  user: string;
  database: string;
  password: string;
  host: string;
  port: number;
  max: number;
  idleTimeoutMillis: number;
}
