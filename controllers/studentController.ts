import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import { config } from '../config'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import {
  getCourseModel,
  getRegisteredCoursesModel,
  getStudentsModel,
  registerCourseModel,
  getSlotsModel,
  checkIfRegistered,
} from '../models/studentsModels'
import { getFacultyModel } from '../models/facultyModel'
import * as moment from 'moment'
import { extendMoment } from 'moment-range'
const rangeMoment = extendMoment(moment)

export const studentLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  let result: QueryResult
  try {
    result = await getStudentsModel(req.body.id)
    if (result.rowCount == 0) {
      throw new Error('Student not found')
    }

    let password: string = req.body.password
    let hash: string = result.rows[0].password
    let id: string = result.rows[0].id
    let name: string = result.rows[0].name

    let isMatch: boolean = await bcrypt.compare(password, hash)

    if (isMatch) {
      let token: string = jwt.sign({ id, name }, config.studentSecretKey)
      res.status(200).json({
        success: true,
        data: { token },
        message: 'Successful Login',
      })
    } else {
      throw new Error('Passwords do not match')
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      data: {},
      message: error.message,
    })
  }
}

export const getCourse = async (req: Request, res: Response): Promise<void> => {
  let result: QueryResult
  try {
    if (!req.params.id) {
      throw new Error('No course ID provided')
    }
    result = await getCourseModel(req.params.id)
    if (result.rowCount == 0) {
      throw new Error('No matching course')
    }
    res.status(200).json({
      success: true,
      data: result.rows,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
export const getFaculty = async (
  req: Request,
  res: Response
): Promise<void> => {
  let result: QueryResult
  try {
    if (!req.params.id) {
      throw new Error('No faculty ID provided')
    }
    result = await getFacultyModel(req.params.id)
    if (result.rowCount == 0) {
      throw new Error('No matching faculty ID')
    }
    res.status(200).json({
      success: true,
      data: result.rows,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const courseRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let course_id: string = req.body.course_id
    let faculty_id: string = req.body.faculty_id
    let slot_ids: string[] = req.body.slot_ids
    let student_id: string = req['user'].id

    if (!course_id) throw new Error('Please enter a course id')
    if (!faculty_id) throw new Error('Please enter a faculty id')
    if (!slot_ids) throw new Error('Please choose some slots')

    let checkIfCourseExists: QueryResult = await getCourseModel(course_id)
    if (checkIfCourseExists.rowCount == 0) {
      throw new Error('Course does not exist')
    }

    let checkIfFacultyExists: QueryResult = await getFacultyModel(faculty_id)
    if (checkIfFacultyExists.rowCount == 0) {
      throw new Error('Faculty does not exist')
    }

    let checkIfCourseRegistered: QueryResult = await checkIfRegistered(
      course_id,
      student_id
    )
    if (checkIfCourseRegistered.rowCount > 0) {
      throw new Error('Course already registered')
    }

    let checkIfFacultyTeaches: QueryResult = await getCourseModel(course_id)
    if (!checkIfFacultyTeaches.rows[0]['faculty_ids'].includes(faculty_id)) {
      throw new Error(`Chosen faculty doesn't teach course ${course_id}`)
    }

    let availableSlots: Array<string> =
      checkIfFacultyTeaches.rows[0]['slot_ids']

    for (var slot of slot_ids) {
      if (!availableSlots.includes(slot)) {
        throw new Error(`Course isn't available in the chosen slot ${slot}`)
      }
    }

    let registeredSlots: QueryResult = await getRegisteredCoursesModel(
      student_id
    )
    let regSlots: Array<JSON> = registeredSlots.rows
    let allSlots: Array<string> = []
    for (var regSlot of regSlots) {
      allSlots.push(...regSlot['slots_id'])
    }

    let allTimings: Array<JSON> = []

    for (var slot of allSlots) {
      let currentTimings: QueryResult = await getSlotsModel(slot)
      allTimings.push(...currentTimings.rows[0]['timings'])
    }

    let isClash: boolean = await checkClash(allTimings)

    if (isClash) {
      throw new Error('Chosen time slot clashes')
    }

    let result: QueryResult = await registerCourseModel(
      student_id,
      course_id,
      faculty_id,
      slot_ids
    )

    let coursesData = []
    let courseData: QueryResult = await getCourseModel(course_id)
    let faculty_ids: Array<string> = courseData.rows[0]['faculty_ids']

    let faculties: Array<JSON> = []
    let allowed_slots: Array<JSON> = []

    for (var value of faculty_ids) {
      result = await getFacultyModel(value)
      if (result.rowCount == 0) {
        throw new Error("Faculty ID doesn't exist")
      }
      faculties.push(result.rows[0])
    }

    for (var value of availableSlots) {
      result = await getSlotsModel(value)
      if (result.rowCount == 0) {
        throw new Error("Slot ID doesn't exit")
      }
      allowed_slots.push(result.rows[0])
    }

    let slots: Array<JSON> = []

    for (var value of slot_ids) {
      result = await getSlotsModel(value)
      if (result.rowCount == 0) {
        throw new Error("Slot ID doesn't exit")
      }
      slots.push(result.rows[0])
    }

    coursesData.push({
      course: {
        id: course_id,
        name: courseData.rows[0]['name'],
        faculties,
        course_type: courseData.rows[0]['course_type'],
        allowed_slots,
      },
      slots,
    })

    res.status(200).json({
      success: true,
      data: {
        id: student_id,
        name: req['user'].name,
        registered_courses: coursesData,
      },
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: {},
    })
  }
}

export const checkClash = async (allTimings: Array<JSON>): Promise<boolean> => {
  let dayToDate = {
    mon: 2,
    tue: 3,
    wed: 4,
    thu: 5,
    fri: 6,
    sat: 7,
    sun: 8,
  }

  for (let i = 0; i < allTimings.length; i++) {
    let start_i = moment({
      year: 2023,
      month: 1,
      day: dayToDate[allTimings[i]['day']],
      hour: moment(allTimings[i]['start'], 'HH:mm a').hour(),
      minute: moment(allTimings[i]['start'], 'HH:mm a').minute(),
    })

    let end_i = moment({
      year: 2023,
      month: 1,
      day: dayToDate[allTimings[i]['day']],
      hour: moment(allTimings[i]['end'], 'HH:mm a').hour(),
      minute: moment(allTimings[i]['end'], 'HH:mm a').minute(),
    })

    let range_i = rangeMoment.range(start_i, end_i)
    for (let j = i + 1; j < allTimings.length; j++) {
      let start_j = moment({
        year: 2023,
        month: 1,
        day: dayToDate[allTimings[j]['day']],
        hour: moment(allTimings[j]['start'], 'HH:mm a').hour(),
        minute: moment(allTimings[j]['start'], 'HH:mm a').minute(),
      })

      let end_j = moment({
        year: 2023,
        month: 1,
        day: dayToDate[allTimings[j]['day']],
        hour: moment(allTimings[j]['end'], 'HH:mm a').hour(),
        minute: moment(allTimings[j]['end'], 'HH:mm a').minute(),
      })

      let range_j = rangeMoment.range(start_j, end_j)

      if (range_i.overlaps(range_j, { adjacent: true })) return true
    }
  }

  return false
}
