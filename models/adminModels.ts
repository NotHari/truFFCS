import { QueryResult } from 'pg'
import { sqlToDB } from '../utils/dbUtils'

export const getAdminModel = async (username: string): Promise<QueryResult> => {
  const sql = `SELECT * FROM ADMIN WHERE username='${username}';`
  try {
    return await sqlToDB(sql)
  } catch (error) {
    throw new Error(error.message)
  }
}

export const createStudentModel = async (
  id: string,
  username: string,
  password: string
): Promise<QueryResult> => {
  const sql = `INSERT INTO STUDENT VALUES ('${id}', '${username}' , '${password}' );`

  try {
    return await sqlToDB(sql)
  } catch (error) {
    throw new Error(error.message)
  }
}

export const getSlotsModel = async (id: string): Promise<QueryResult> => {
  const sql = `SELECT * FROM slots WHERE id= '${id}';`
  try {
    return await sqlToDB(sql)
  } catch (error) {
    throw new Error(error.message)
  }
}
