import { QueryResult } from 'pg'
import { sqlToDB } from '../utils/dbUtils'

export const createCourseModel = async (
  id: string,
  name: string,
  slot_ids: string,
  faculty_ids: string,
  course_type: string
): Promise<QueryResult> => {
  const sql = `INSERT INTO COURSE VALUES ('${id}', '${name}' , '${slot_ids}', '${faculty_ids}', '${course_type}');`
  try {
    return await sqlToDB(sql)
  } catch (error) {
    throw new Error(error.message)
  }
}

export const createSlotModel = async (
  id: string,
  timings: string
): Promise<QueryResult> => {
  const sql = `INSERT INTO "slots" VALUES('${id}', '${timings}') `
  try {
    return await sqlToDB(sql)
  } catch (error) {
    throw new Error(error.message)
  }
}

export const createFacultyModelbyName = async (
  name: string
): Promise<QueryResult> => {
  const sql = `INSERT INTO FACULTY (name) VALUES ('${name}');`

  try {
    return await sqlToDB(sql)
  } catch (error) {
    throw new Error(error.message)
  }
}

export const createFacultyModel = async (
  id: string,
  name: string
): Promise<QueryResult> => {
  const sql = `INSERT INTO FACULTY VALUES ('${id}', '${name}');`

  try {
    return await sqlToDB(sql)
  } catch (error) {
    throw new Error(error.message)
  }
}

export const getFacultyModel = async (id: string): Promise<QueryResult> => {
  const sql = `SELECT * FROM FACULTY WHERE id=${id};`
  try {
    return await sqlToDB(sql)
  } catch (error) {
    throw new Error(error.message)
  }
}
