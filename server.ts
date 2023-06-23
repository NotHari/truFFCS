import * as express from 'express'
import { config } from './config'
import { adminLogin } from './controllers/adminController'
import { adminAuth, studentAuth } from './middleware/auth'
import {
  createStudent,
  createFaculty,
  createSlot,
  createCourse,
} from './controllers/adminController'
import {
  courseRegistration,
  getCourse,
  getFaculty,
  studentLogin,
} from './controllers/studentController'
import { getTimetable } from './controllers/timetableController'

const app: express.Application = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/admin/faculty', adminAuth, createFaculty)
app.post('/admin/course', adminAuth, createCourse)
app.post('/admin/slot', adminAuth, createSlot)
app.post('/admin/student', adminAuth, createStudent)

app.get('/faculty/:id?', studentAuth, getFaculty)
app.get('/course/:id?', studentAuth, getCourse)
app.post('/register', studentAuth, courseRegistration)
app.get('/timetable', studentAuth, getTimetable)

app.post('/admin/login', adminLogin)
app.post('/login', studentLogin)

app.listen(config.port, () => {
  console.log(`Server Running 🚀 at http://localhost:${config.port}/`)
})
