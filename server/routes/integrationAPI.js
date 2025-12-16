import express from "express"
import Course from "../models/Course.js"
import Student from "../models/Student.js"
import User from "../models/User.js"
import Schedule from "../models/Schedule.js"
import TeachingPractice from "../models/TeachingPractice.js"
import FieldWork from "../models/FieldWork.js"

const router = express.Router()

// Middleware for API key authentication
const authenticateAPIKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"]
  const validAPIKey = process.env.INTEGRATION_API_KEY || "default-api-key-change-in-production"

  if (!apiKey || apiKey !== validAPIKey) {
    return res.status(401).json({ error: "Invalid or missing API key" })
  }

  next()
}

// Apply authentication middleware to all routes
router.use(authenticateAPIKey)

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  })
})

// Student Management APIs
router.get("/students", async (req, res) => {
  try {
    const { program, year, branch, division, limit = 100, offset = 0 } = req.query
    const filter = {}

    if (program) filter.program = program
    if (year) filter.year = Number.parseInt(year)
    if (branch) filter.branch = branch
    if (division) filter.division = division

    const students = await Student.find(filter)
      .limit(Number.parseInt(limit))
      .skip(Number.parseInt(offset))
      .populate("selectedElectives", "name code credits category")

    const total = await Student.countDocuments(filter)

    res.json({
      students,
      pagination: {
        total,
        limit: Number.parseInt(limit),
        offset: Number.parseInt(offset),
        hasMore: total > Number.parseInt(offset) + Number.parseInt(limit),
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body)
    await student.save()
    res.status(201).json(student)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.put("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!student) {
      return res.status(404).json({ error: "Student not found" })
    }
    res.json(student)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Faculty Management APIs
router.get("/faculty", async (req, res) => {
  try {
    const { department, expertise, limit = 100, offset = 0 } = req.query
    const filter = { role: "teacher" }

    if (department) filter.department = department
    if (expertise) filter.expertise = { $in: [expertise] }

    const faculty = await User.find(filter)
      .select("-password")
      .limit(Number.parseInt(limit))
      .skip(Number.parseInt(offset))

    const total = await User.countDocuments(filter)

    res.json({
      faculty,
      pagination: {
        total,
        limit: Number.parseInt(limit),
        offset: Number.parseInt(offset),
        hasMore: total > Number.parseInt(offset) + Number.parseInt(limit),
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Course Management APIs
router.get("/courses", async (req, res) => {
  try {
    const { program, year, branch, category, limit = 100, offset = 0 } = req.query
    const filter = {}

    if (program) filter.program = program
    if (year) filter.year = Number.parseInt(year)
    if (branch) filter.branch = branch
    if (category) filter.category = category

    const courses = await Course.find(filter)
      .populate("instructor", "name email")
      .limit(Number.parseInt(limit))
      .skip(Number.parseInt(offset))

    const total = await Course.countDocuments(filter)

    res.json({
      courses,
      pagination: {
        total,
        limit: Number.parseInt(limit),
        offset: Number.parseInt(offset),
        hasMore: total > Number.parseInt(offset) + Number.parseInt(limit),
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post("/courses", async (req, res) => {
  try {
    const course = new Course(req.body)
    await course.save()
    await course.populate("instructor", "name email")
    res.status(201).json(course)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Timetable APIs
router.get("/timetables", async (req, res) => {
  try {
    const { program, year, branch, division, semester, limit = 50, offset = 0 } = req.query
    const filter = {}

    if (program) filter.program = program
    if (year) filter.year = Number.parseInt(year)
    if (branch) filter.branch = branch
    if (division) filter.division = division
    if (semester) filter.semester = semester

    const timetables = await Schedule.find(filter)
      .populate("courses.course", "name code credits category")
      .populate("courses.instructor", "name email")
      .populate("courses.room", "name type capacity")
      .limit(Number.parseInt(limit))
      .skip(Number.parseInt(offset))
      .sort({ createdAt: -1 })

    const total = await Schedule.countDocuments(filter)

    res.json({
      timetables,
      pagination: {
        total,
        limit: Number.parseInt(limit),
        offset: Number.parseInt(offset),
        hasMore: total > Number.parseInt(offset) + Number.parseInt(limit),
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Teaching Practice APIs
router.get("/teaching-practices", async (req, res) => {
  try {
    const { student, supervisor, status, limit = 100, offset = 0 } = req.query
    const filter = {}

    if (student) filter.student = student
    if (supervisor) filter.supervisor = supervisor
    if (status) filter.status = status

    const practices = await TeachingPractice.find(filter)
      .populate("student", "name email program year")
      .populate("supervisor", "name email")
      .limit(Number.parseInt(limit))
      .skip(Number.parseInt(offset))

    const total = await TeachingPractice.countDocuments(filter)

    res.json({
      practices,
      pagination: {
        total,
        limit: Number.parseInt(limit),
        offset: Number.parseInt(offset),
        hasMore: total > Number.parseInt(offset) + Number.parseInt(limit),
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Field Work APIs
router.get("/field-works", async (req, res) => {
  try {
    const { student, type, status, limit = 100, offset = 0 } = req.query
    const filter = {}

    if (student) filter.student = student
    if (type) filter.type = type
    if (status) filter.status = status

    const fieldWorks = await FieldWork.find(filter)
      .populate("student", "name email program year")
      .populate("supervisor", "name email")
      .limit(Number.parseInt(limit))
      .skip(Number.parseInt(offset))

    const total = await FieldWork.countDocuments(filter)

    res.json({
      fieldWorks,
      pagination: {
        total,
        limit: Number.parseInt(limit),
        offset: Number.parseInt(offset),
        hasMore: total > Number.parseInt(offset) + Number.parseInt(limit),
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Bulk Data Import/Export APIs
router.post("/bulk/students", async (req, res) => {
  try {
    const { students, options = {} } = req.body
    const { upsert = false, validateOnly = false } = options

    if (!Array.isArray(students)) {
      return res.status(400).json({ error: "Students must be an array" })
    }

    const results = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: [],
    }

    if (validateOnly) {
      // Validate data without saving
      for (const [index, studentData] of students.entries()) {
        try {
          const student = new Student(studentData)
          await student.validate()
          results.processed++
        } catch (error) {
          results.errors.push({
            index,
            data: studentData,
            error: error.message,
          })
        }
      }
    } else {
      // Process and save data
      for (const [index, studentData] of students.entries()) {
        try {
          if (upsert && studentData.email) {
            const existingStudent = await Student.findOneAndUpdate({ email: studentData.email }, studentData, {
              new: true,
              upsert: true,
            })
            results.updated++
          } else {
            const student = new Student(studentData)
            await student.save()
            results.created++
          }
          results.processed++
        } catch (error) {
          results.errors.push({
            index,
            data: studentData,
            error: error.message,
          })
        }
      }
    }

    res.json(results)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post("/bulk/courses", async (req, res) => {
  try {
    const { courses, options = {} } = req.body
    const { upsert = false, validateOnly = false } = options

    if (!Array.isArray(courses)) {
      return res.status(400).json({ error: "Courses must be an array" })
    }

    const results = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: [],
    }

    if (validateOnly) {
      for (const [index, courseData] of courses.entries()) {
        try {
          const course = new Course(courseData)
          await course.validate()
          results.processed++
        } catch (error) {
          results.errors.push({
            index,
            data: courseData,
            error: error.message,
          })
        }
      }
    } else {
      for (const [index, courseData] of courses.entries()) {
        try {
          if (upsert && courseData.code) {
            const existingCourse = await Course.findOneAndUpdate(
              {
                code: courseData.code,
                year: courseData.year,
                branch: courseData.branch,
                division: courseData.division,
              },
              courseData,
              { new: true, upsert: true },
            )
            results.updated++
          } else {
            const course = new Course(courseData)
            await course.save()
            results.created++
          }
          results.processed++
        } catch (error) {
          results.errors.push({
            index,
            data: courseData,
            error: error.message,
          })
        }
      }
    }

    res.json(results)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Webhook endpoints for external system notifications
router.post("/webhooks/student-enrollment", async (req, res) => {
  try {
    const { action, student, courses } = req.body

    switch (action) {
      case "enroll":
        await Student.findByIdAndUpdate(student.id, {
          $addToSet: { selectedElectives: { $each: courses } },
        })
        break
      case "unenroll":
        await Student.findByIdAndUpdate(student.id, {
          $pull: { selectedElectives: { $in: courses } },
        })
        break
      default:
        return res.status(400).json({ error: "Invalid action" })
    }

    res.json({ success: true, message: "Enrollment updated successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post("/webhooks/faculty-update", async (req, res) => {
  try {
    const { action, faculty } = req.body

    switch (action) {
      case "create":
      case "update":
        await User.findOneAndUpdate({ email: faculty.email }, faculty, { upsert: true, new: true })
        break
      case "delete":
        await User.findOneAndDelete({ email: faculty.email })
        break
      default:
        return res.status(400).json({ error: "Invalid action" })
    }

    res.json({ success: true, message: "Faculty updated successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Analytics and Reporting APIs
router.get("/analytics/enrollment", async (req, res) => {
  try {
    const { program, year, semester } = req.query

    const pipeline = [
      {
        $match: {
          ...(program && { program }),
          ...(year && { year: Number.parseInt(year) }),
        },
      },
      {
        $group: {
          _id: {
            program: "$program",
            year: "$year",
            branch: "$branch",
          },
          count: { $sum: 1 },
          totalCredits: { $sum: "$enrolledCredits" },
        },
      },
      {
        $sort: { "_id.program": 1, "_id.year": 1, "_id.branch": 1 },
      },
    ]

    const enrollmentStats = await Student.aggregate(pipeline)

    res.json({
      enrollmentStats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get("/analytics/faculty-workload", async (req, res) => {
  try {
    const { department, semester } = req.query

    const pipeline = [
      {
        $match: {
          ...(department && { department }),
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "instructor",
          as: "courses",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          department: 1,
          maxWeeklyLoad: 1,
          courseCount: { $size: "$courses" },
          totalCredits: { $sum: "$courses.credits" },
          workloadPercentage: {
            $multiply: [{ $divide: [{ $sum: "$courses.credits" }, "$maxWeeklyLoad"] }, 100],
          },
        },
      },
      {
        $sort: { workloadPercentage: -1 },
      },
    ]

    const workloadStats = await User.aggregate(pipeline)

    res.json({
      workloadStats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Export data in various formats
router.get("/export/students", async (req, res) => {
  try {
    const { format = "json", program, year } = req.query
    const filter = {}

    if (program) filter.program = program
    if (year) filter.year = Number.parseInt(year)

    const students = await Student.find(filter).populate("selectedElectives", "name code credits")

    switch (format.toLowerCase()) {
      case "csv":
        const csvData = students
          .map((student) => {
            return [
              student.name,
              student.email,
              student.program,
              student.year,
              student.branch,
              student.division,
              student.enrolledCredits,
              student.selectedElectives.map((e) => e.code).join(";"),
            ].join(",")
          })
          .join("\n")

        const csvHeader = "Name,Email,Program,Year,Branch,Division,Credits,Electives\n"
        res.setHeader("Content-Type", "text/csv")
        res.setHeader("Content-Disposition", "attachment; filename=students.csv")
        res.send(csvHeader + csvData)
        break

      case "xml":
        let xmlData = '<?xml version="1.0" encoding="UTF-8"?>\n<students>\n'
        students.forEach((student) => {
          xmlData += `  <student>
    <name>${student.name}</name>
    <email>${student.email}</email>
    <program>${student.program}</program>
    <year>${student.year}</year>
    <branch>${student.branch}</branch>
    <division>${student.division}</division>
    <credits>${student.enrolledCredits}</credits>
  </student>\n`
        })
        xmlData += "</students>"

        res.setHeader("Content-Type", "application/xml")
        res.setHeader("Content-Disposition", "attachment; filename=students.xml")
        res.send(xmlData)
        break

      default:
        res.json({
          students,
          exportedAt: new Date().toISOString(),
          totalRecords: students.length,
        })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
