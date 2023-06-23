import { QueryResult } from 'pg'
import { sqlToDB } from '../utils/dbUtils'

export const getStudentsModel = async (id: string): Promise<QueryResult> => {
  const sql = `SELECT * FROM STUDENT WHERE id='${id}';`
  try {
    return await sqlToDB(sql)
  } catch (error) {
    throw new Error(error.message)
  }
}

export const getCourseModel = async (id: string): Promise<QueryResult> => {
  const sql = `SELECT * FROM COURSE WHERE id='${id}';`
  try {
    return await sqlToDB(sql)
  } catch (error) {
    throw new Error(error.message)
  }
}

export const registerCourseModel = async (
  student_id: string,
  course_id: string,
  faculty_id: string,
  slots_id: string[]
) => {
  const sql = `INSERT INTO registered_courses VALUES('${student_id}', '${course_id}', '${faculty_id}',  '{${slots_id}}')`
  try {
    return await sqlToDB(sql)
  } catch (error) {
    throw new Error(error.message)
  }
}

export const getRegisteredCoursesModel = async (
  student_id: string
): Promise<QueryResult> => {
  const sql = `SELECT * FROM registered_courses WHERE student_id='${student_id}'`
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

export const checkIfRegistered = async (
  course_id: string,
  student_id: string
): Promise<QueryResult> => {
  const sql = `SELECT * FROM registered_courses WHERE course_id='${course_id}' AND student_id='${student_id}'`
  try {
    return await sqlToDB(sql)
  } catch (error) {
    throw new Error(error.message)
  }
}
