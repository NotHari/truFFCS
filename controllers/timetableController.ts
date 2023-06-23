import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import { getFacultyModel } from '../models/facultyModel'
import { getSlotsModel } from '../models/studentsModels'
import {
  getCourseModel,
  getRegisteredCoursesModel,
} from '../models/studentsModels'

export const getTimetable = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let student_id: string = req['user'].id
    let student_name: string = req['user'].name

    let registeredCourses: QueryResult = await getRegisteredCoursesModel(
      student_id
    )

    let coursesData = []

    for (var course of registeredCourses.rows) {
      let courseData: QueryResult = await getCourseModel(course['course_id'])
      let faculty_ids: Array<string> = courseData.rows[0]['faculty_ids']
      let slot_ids: Array<string> = courseData.rows[0]['slot_ids']
      let result: QueryResult

      let faculties: Array<JSON> = []
      let allowed_slots: Array<JSON> = []

      for (var value of faculty_ids) {
        result = await getFacultyModel(value)
        if (result.rowCount == 0) {
          throw new Error("Faculty ID doesn't exist")
        }
        faculties.push(result.rows[0])
      }

      for (var value of slot_ids) {
        result = await getSlotsModel(value)
        if (result.rowCount == 0) {
          throw new Error("Slot ID doesn't exit")
        }
        allowed_slots.push(result.rows[0])
      }

      let slots: Array<JSON> = []
      let regSlots: Array<string> = course['slots_id']

      for (var value of regSlots) {
        result = await getSlotsModel(value)
        if (result.rowCount == 0) {
          throw new Error("Slot ID doesn't exit")
        }
        slots.push(result.rows[0])
      }

      coursesData.push({
        course: {
          id: course['course_id'],
          name: courseData.rows[0]['name'],
          faculties,
          course_type: courseData.rows[0]['course_type'],
          allowed_slots,
        },
        slots,
      })
    }
    res.status(200).json({
      success: true,
      data: {
        id: student_id,
        name: student_name,
        registered_courses: coursesData,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      data: {},
      message: error.message,
    })
  }
}
