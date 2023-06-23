import { Pool, PoolClient, QueryResult } from 'pg'
import { config } from './../config'
import { PgConfig } from '../types'

const pgconfig: PgConfig = {
  user: config.db.user,
  database: config.db.database,
  password: config.db.password,
  host: config.db.host,
  port: config.db.port,
  max: config.db.max,
  idleTimeoutMillis: config.db.idleTimeoutMillis,
}

const pool = new Pool(pgconfig)

pool.on('error', function (err: Error) {
  console.error(`idle client error, ${err.message} | ${err.stack}`)
})

export const sqlToDB = async (sql: string): Promise<QueryResult> => {
  let result: QueryResult
  try {
    result = await pool.query(sql)
    return result
  } catch (error) {
    throw new Error(error.message)
  }
}
