import { config } from '../config'
import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'

export const parseBearer = (bearer: string) => {
  const [_, token] = bearer.trim().split(' ')
  return token
}

export const studentAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bearerHeader = req.headers['authorization']
    if (!bearerHeader) {
      throw new Error('Please Authenticate yourself')
    }
    const token = parseBearer(bearerHeader)
    jwt.verify(token, config.studentSecretKey, (err, result) => {
      if (err) throw new Error('Wrong token')
      else {
        req['user'] = result
      }
    })
    next()
  } catch (error) {
    res.status(500).json({
      success: false,
      data: {},
      message: error.message,
    })
  }
}

export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bearerHeader = req.headers['authorization']
    if (!bearerHeader) {
      throw new Error('Please Authenticate yourself')
    }
    const token = parseBearer(bearerHeader)
    jwt.verify(token, config.adminSecretKey, (err, result) => {
      if (err) throw new Error('Wrong token')
      else {
        req['user'] = result
      }
    })
    next()
  } catch (error) {
    res.status(500).json({
      success: false,
      data: {},
      message: error.message,
    })
  }
}
