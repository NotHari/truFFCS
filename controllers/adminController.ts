import { Request, Response } from 'express'
import { QueryResult, ResultBuilder } from 'pg'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { config } from '../config'
import {
  getAdminModel,
  createStudentModel,
  getSlotsModel,
} from '../models/adminModels'
import {
  createFacultyModel,
  createFacultyModelbyName,
  createSlotModel,
  createCourseModel,
  getFacultyModel,
} from '../models/facultyModel'

export const adminLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  let result: QueryResult
  try {
    result = await getAdminModel(req.body.username)
    if (result.rowCount == 0) {
      throw new Error('User not found')
    }

    let password: string = req.body.password
    let hash: string = result.rows[0].password
    let username: string = result.rows[0].username
    let userid: string = result.rows[0].id

    let isMatch: boolean = await bcrypt.compare(password, hash)

    if (isMatch) {
      let token: string = jwt.sign({ userid, username }, config.adminSecretKey)
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
export const createSlot = async (req: Request, res: Response): Promise<any> => {
  let id: string = req.body.id
  let timings: string = JSON.stringify(req.body.timings)

  let result: QueryResult
  try {
    result = await createSlotModel(id, timings)

    res.status(200).json({
      success: true,
      data: {
        id: id,
        timings: JSON.parse(timings),
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

export const createCourse = async (
  req: Request,
  res: Response
): Promise<any> => {
  let id: string = req.body.id
  let name: string = req.body.name
  let slot_ids: string = JSON.stringify(req.body.slot_ids)
  let faculty_ids: string = JSON.stringify(req.body.faculty_ids)
  let course_type: string = req.body.course_type

  let result: QueryResult

  try {
    if (!id || !name || !slot_ids || !faculty_ids || !course_type) {
      throw new Error('Some Fields Missing')
    } else {
      let faculties: Array<JSON> = []
      let allowed_slots: Array<JSON> = []
      for (var value of JSON.parse(faculty_ids)) {
        result = await getFacultyModel(value)
        if (result.rowCount == 0) {
          throw new Error("Faculty ID doesn't exist")
        }
        faculties.push(result.rows[0])
      }

      for (var value of JSON.parse(slot_ids)) {
        result = await getSlotsModel(value)
        if (result.rowCount == 0) {
          throw new Error("Slot ID doesn't exit")
        }
        allowed_slots.push(result.rows[0])
      }
      result = await createCourseModel(
        id,
        name,
        slot_ids,
        faculty_ids,
        course_type
      )
      res.status(200).json({
        success: true,
        data: {
          id: id,
          name: name,
          faculties: faculties,
          course_type: course_type,
          allowed_slots: allowed_slots,
        },
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      data: {},
      message: error.message,
    })
  }
}

export const createFaculty = async (
  req: Request,
  res: Response
): Promise<any> => {
  let id: string = req.body.id
  let name: string = req.body.name
  let result: QueryResult

  try {
    if (!name) {
      throw new Error('Name Field Missing')
    } else if (!id && name) {
      result = await createFacultyModelbyName(req.body.name)
      res.status(200).json({
        success: true,
        data: {
          name: req.body.name,
        },
      })
    } else if (id && name) {
      result = await createFacultyModel(req.body.id, req.body.name)
      res.status(200).json({
        success: true,
        data: {
          id: req.body.id,
          name: req.body.name,
        },
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      data: {},
      message: error.message,
    })
  }
}

export const createStudent = async (
  req: Request,
  res: Response
): Promise<any> => {
  let id: string = req.body.id
  let name: string = req.body.name
  let password: string = req.body.id
  let Hash: string
  try {
    Hash = await bcrypt.hash(password, 0)

    let result: QueryResult
    result = await createStudentModel(req.body.id, req.body.name, Hash)
    res.status(200).json({
      success: true,
      data: {
        id: req.body.id,
        name: req.body.name,
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
