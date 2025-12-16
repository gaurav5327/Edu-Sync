// @ts-nocheck
import express from "express"
import Course from "../models/Course.js"
import Room from "../models/Room.js"
import Schedule from "../models/Schedule.js"
import { generateSchedule } from "../utils/geneticAlgorithm.js"
import nodemailer from "nodemailer"
import Notification from "../models/Notification.js"
import User from "../models/User.js"
import { updateSchedule } from "../utils/scheduleUtils.js"
import Student from "../models/Student.js"
import Practicum from "../models/Practicum.js"
import { timetableToPDFBuffer } from "../utils/exporters/pdfExporter.js"
import { timetableToExcelBuffer } from "../utils/exporters/excelExporter.js"
import bcrypt from "bcrypt"
import { parseCSV, parseIntList, normalizeProgram } from "../utils/csv.js"

const router = express.Router()

// Get all courses for a specific year, branch, and division
router.get("/courses", async (req, res) => {
    try {
        const { year, branch, division } = req.query
        const courses = await Course.find({ year: Number.parseInt(year), branch, division }).populate("instructor")
        res.json(courses)
    } catch (error) {
        console.error("Error fetching courses:", error)
        res.status(500).json({ message: error.message })
    }
})

// Get the number of subjects taught by an instructor in a specific division
router.get("/instructor-subjects", async (req, res) => {
    try {
        const { instructorId, division } = req.query
        const count = await Course.countDocuments({ instructor: instructorId, division })
        res.json({ count })
    } catch (error) {
        console.error("Error fetching instructor subjects:", error)
        res.status(500).json({ message: error.message })
    }
})

// Get all instructors
router.get("/instructors", async (req, res) => {
    try {
        const instructors = await User.find({ role: "teacher" })
        res.json(instructors)
    } catch (error) {
        console.error("Error fetching instructors:", error)
        res.status(500).json({ message: error.message })
    }
})

// Get all teachers
router.get("/teachers", async (req, res) => {
    try {
        const teachers = await User.find({ role: "teacher" })
        res.json(teachers)
    } catch (error) {
        console.error("Error fetching teachers:", error)
        res.status(500).json({ message: error.message })
    }
})

// Get public teacher information
router.get("/teachers-public", async (req, res) => {
    try {
        // Only return necessary public information about teachers
        const teachers = await User.find({ role: "teacher" }, { name: 1, department: 1, teachableYears: 1 })
        res.json(teachers)
    } catch (error) {
        console.error("Error fetching public teacher information:", error)
        res.status(500).json({ message: error.message })
    }
})

// Get teacher data
router.get("/teachers/:id", async (req, res) => {
    try {
        const { id } = req.params
        const teacher = await User.findById(id)

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" })
        }

        res.json(teacher)
    } catch (error) {
        console.error("Error fetching teacher data:", error)
        res.status(500).json({ message: error.message })
    }
})

// Get courses taught by a teacher
router.get("/teacher-courses/:id", async (req, res) => {
    try {
        const { id } = req.params
        const courses = await Course.find({ instructor: id })
        res.json(courses)
    } catch (error) {
        console.error("Error fetching teacher courses:", error)
        res.status(500).json({ message: error.message })
    }
})

// Get schedules for a teacher
router.get("/teacher-schedules/:id", async (req, res) => {
    try {
        const { id } = req.params

        // Find all courses taught by this teacher
        const courses = await Course.find({ instructor: id })
        const courseIds = courses.map((course) => course._id)

        // Find all schedules that include these courses
        const schedules = await Schedule.find({ "timetable.course": { $in: courseIds } })
            .populate({
                path: "timetable.course",
                populate: {
                    path: "instructor",
                },
            })
            .populate("timetable.room")
            .sort({ year: 1, branch: 1, division: 1 })

        res.json(schedules)
    } catch (error) {
        console.error("Error fetching teacher schedules:", error)
        res.status(500).json({ message: error.message })
    }
})

// Get all rooms
router.get("/rooms", async (req, res) => {
    try {
        const rooms = await Room.find()
        res.json(rooms)
    } catch (error) {
        console.error("Error fetching rooms:", error)
        res.status(500).json({ message: error.message })
    }
})

// Add a new room
router.post("/rooms", async (req, res) => {
    try {
        const { name, capacity, type, department, allowedYears, isAvailable } = req.body
        const newRoom = new Room({
            name,
            capacity,
            type,
            department,
            allowedYears,
            isAvailable,
        })
        await newRoom.save()
        res.status(201).json(newRoom)
    } catch (error) {
        console.error("Error creating room:", error)
        res.status(500).json({ message: error.message })
    }
})

// Get all timetables for a specific year, branch, division, and optional program
router.get("/timetables", async (req, res) => {
    try {
        const { year, branch, division, program } = req.query
        const query = {}

        if (year) query.year = Number.parseInt(year)
        if (branch) query.branch = branch
        if (division) query.division = division
        if (program) query.program = program

        const timetables = await Schedule.find(query)
            .sort({ createdAt: -1 })
            .populate({
                path: "timetable.course",
                populate: {
                    path: "instructor",
                    select: "name",
                },
            })
            .populate("timetable.room")

        res.json(timetables)
    } catch (error) {
        console.error("Error fetching timetables:", error)
        res.status(500).json({ message: error.message })
    }
})

// Add this route to get a specific timetable by ID
router.get("/timetables/:id", async (req, res) => {
    try {
        const { id } = req.params
        const timetable = await Schedule.findById(id)
            .populate({
                path: "timetable.course",
                populate: {
                    path: "instructor",
                    select: "name",
                },
            })
            .populate("timetable.room")

        if (!timetable) {
            return res.status(404).json({ message: "Timetable not found" })
        }

        res.json(timetable)
    } catch (error) {
        console.error("Error fetching timetable:", error)
        res.status(500).json({ message: error.message })
    }
})

// Delete a timetable
router.delete("/timetables/:id", async (req, res) => {
    try {
        const { id } = req.params
        await Schedule.findByIdAndDelete(id)
        res.status(200).json({ message: "Timetable deleted successfully" })
    } catch (error) {
        console.error("Error deleting timetable:", error)
        res.status(500).json({ message: error.message })
    }
})

// Get the latest schedule for a specific year, branch, division, and optional program
router.get("/latest", async (req, res) => {
    try {
        const { year, branch, division, program } = req.query

        // Log the received parameters
        console.log("Fetching latest schedule with params:", { year, branch, division, program })

        // Validate the parameters
        if (!year || !branch || !division) {
            return res.status(400).json({
                message: "Missing required parameters. Please provide year, branch, and division.",
            })
        }

        // Ensure year is a number
        const yearNum = Number.parseInt(year)
        if (isNaN(yearNum)) {
            return res.status(400).json({ message: "Year must be a number." })
        }

        const find = { year: yearNum, branch, division }
        if (program) find.program = program

        const latestSchedule = await Schedule.findOne(find)
            .sort({ _id: -1 })
            .populate({
                path: "timetable.course",
                populate: {
                    path: "instructor",
                    select: "name",
                },
            })
            .populate("timetable.room")

        if (!latestSchedule) {
            return res.status(404).json({
                message: "No schedules found for the specified year, branch, and division. Please generate a schedule first.",
            })
        }

        res.json(latestSchedule)
    } catch (error) {
        console.error("Error fetching latest schedule:", error)
        res.status(500).json({ message: error.message || "Internal server error" })
    }
})

// Generate a schedule for a specific year, branch, division, and optional program
router.post("/generate", async (req, res) => {
    try {
        console.log("Schedule generation request received:", req.body)
        const { year, branch, division, program, options = {} } = req.body

        console.log("Fetching courses for:", { year, branch, division, program })
        const courses = await Course.find({
            year: Number.parseInt(year),
            branch,
            division,
            ...(program ? { program } : {}),
        }).populate("instructor")

        console.log("Found courses:", courses.length)
        const rooms = await Room.find()
        console.log("Found rooms:", rooms.length)
        const teachers = await User.find({ role: "teacher" })
        console.log("Found teachers:", teachers.length)

        if (courses.length === 0) {
            throw new Error(`No courses found for year ${year}, branch ${branch}, division ${division}`)
        }

        if (rooms.length === 0) {
            throw new Error("No rooms found in the database")
        }

        if (teachers.length === 0) {
            throw new Error("No teachers found in the database")
        }

        console.log("Starting schedule generation...")
        const generatedSchedule = await generateSchedule(
            courses,
            rooms,
            teachers,
            year,
            branch,
            division, [], // students not required for base generation
            program, [], // practicums not provided here
            options, // what-if knobs
        )

        console.log("Schedule generated successfully, saving to database...")
        const newSchedule = new Schedule({
            year: Number.parseInt(year),
            branch,
            division,
            program: program || "FYUP",
            timetable: generatedSchedule,
            createdAt: new Date(),
        })

        await newSchedule.save()
        console.log("Schedule saved successfully")
        res.status(201).json(newSchedule)
    } catch (error) {
        console.error("Error generating schedule:", error)
        console.error("Error stack:", error.stack)
        res.status(500).json({ message: error.message })
    }
})

// Update the course creation route to check teacher constraints and handle duplicate course codes
router.post("/courses", async (req, res) => {
    try {
        const { name, code, instructor, duration, capacity, year, branch, division, lectureType, preferredTimeSlots } =
            req.body

        console.log("Received course data:", {
            name,
            code,
            instructor,
            duration,
            capacity,
            year,
            branch,
            division,
            lectureType,
            preferredTimeSlots: preferredTimeSlots || [],
        })

        // Check if the instructor is allowed to teach this year
        const teacher = await User.findById(instructor)
        if (!teacher) {
            return res.status(404).json({ message: "Instructor not found" })
        }

        if (teacher.role !== "teacher") {
            return res.status(400).json({ message: "Selected user is not a teacher" })
        }

        if (teacher.teachableYears && !teacher.teachableYears.includes(Number.parseInt(year))) {
            return res.status(400).json({ message: "This teacher is not allowed to teach this year" })
        }

        if (teacher.department !== branch) {
            return res.status(400).json({ message: "This teacher is not in the same department" })
        }

        // Check if the instructor has already been assigned to 2 subjects in this division
        const count = await Course.countDocuments({ instructor, division })
        if (count >= 2) {
            return res
                .status(400)
                .json({ message: "This instructor has already been assigned to 2 subjects in this division" })
        }

        // Check if a course with the same code, lecture type, division, year, and branch already exists
        const existingCourse = await Course.findOne({
            code,
            lectureType,
            division,
            year: Number.parseInt(year),
            branch,
        })

        if (existingCourse) {
            return res.status(400).json({
                message: `A ${lectureType} course with code ${code} already exists for Year ${year}, ${branch}, Division ${division}`,
            })
        }

        // Ensure lab courses have preferred time slots in the allowed range
        let finalPreferredTimeSlots = preferredTimeSlots || []
        if (lectureType === "lab" && (!finalPreferredTimeSlots || finalPreferredTimeSlots.length === 0)) {
            // Automatically set preferred time slots for labs if none are provided
            finalPreferredTimeSlots = ["15:00", "16:00"]
        }

        const newCourse = new Course({
            name,
            code,
            instructor,
            duration,
            capacity,
            year: Number.parseInt(year),
            branch,
            division,
            lectureType,
            preferredTimeSlots: finalPreferredTimeSlots,
        })

        console.log("Creating new course:", newCourse)

        const savedCourse = await newCourse.save()
        console.log("Course saved successfully:", savedCourse)

        res.status(201).json(savedCourse)
    } catch (error) {
        console.error("Error creating course:", error)

        if (error.name === "MongoServerError" && error.code === 11000) {
            // Extract the duplicate key error details
            const keyPattern = error.keyPattern || {}
            const keyValue = error.keyValue || {}

            console.error("Duplicate key error:", { keyPattern, keyValue })

            return res.status(400).json({
                message: "A course with this code and lecture type already exists for this division",
                details: { keyPattern, keyValue },
            })
        }

        res.status(500).json({ message: error.message })
    }
})

// Debug endpoint to check existing courses
router.get("/debug/courses", async (req, res) => {
    try {
        const { code } = req.query
        const query = {}

        if (code) {
            query.code = code
        }

        const courses = await Course.find(query).populate("instructor")
        res.json(courses)
    } catch (error) {
        console.error("Error in debug endpoint:", error)
        res.status(500).json({ message: error.message })
    }
})

// Handle teacher availability updates
router.post("/teacher-availability", async (req, res) => {
    try {
        const { teacherId, availability } = req.body

        console.log("Received availability update:", { teacherId, availability })

        // First, update the teacher's availability directly
        const teacher = await User.findById(teacherId)
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" })
        }

        // Update the teacher's availability
        teacher.availability = availability
        await teacher.save()

        // Create a new notification for the admin
        const notification = new Notification({
            type: "AVAILABILITY_UPDATE",
            message: `Teacher ${teacher.name} has updated their availability.`,
            data: { teacherId, availability },
        })
        await notification.save()

        // Try to send email notification to admin if email config is available
        try {
            if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                })

                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: "admin@example.com", // This should be fetched from the database
                    subject: "Teacher Availability Update",
                    text: `Teacher ${teacher.name} has updated their availability. Please check the admin dashboard for details.`,
                })
            }
        } catch (emailError) {
            console.error("Error sending email notification:", emailError)
            // Continue execution even if email fails
        }

        res.status(200).json({ message: "Availability updated successfully" })
    } catch (error) {
        console.error("Error updating teacher availability:", error)
        res.status(500).json({ message: error.message })
    }
})

// Handle notifications
router.get("/notifications", async (req, res) => {
    try {
        const notifications = await Notification.find({ status: "PENDING" }).sort("-createdAt")
        res.json(notifications)
    } catch (error) {
        console.error("Error fetching notifications:", error)
        res.status(500).json({ message: error.message })
    }
})

router.post("/notifications/:id/:action", async (req, res) => {
    try {
        const { id, action } = req.params
        const notification = await Notification.findById(id)

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" })
        }

        if (action === "approve") {
            // Update teacher availability
            await User.findByIdAndUpdate(notification.data.teacherId, { availability: notification.data.availability })

            // Update the schedule
            await updateSchedule(notification.data.teacherId)
        }

        notification.status = action === "approve" ? "APPROVED" : "REJECTED"
        await notification.save()

        res.json({ message: `Notification ${action}d successfully` })
    } catch (error) {
        console.error(`Error ${req.params.action}ing notification:`, error)
        res.status(500).json({ message: error.message })
    }
})

// Resolve conflicts
router.post("/resolve-conflicts", async (req, res) => {
    try {
        const { year, branch, division } = req.body

        // Find the latest schedule
        const schedule = await Schedule.findOne({ year: Number.parseInt(year), branch, division })
            .sort({ _id: -1 })
            .populate({
                path: "timetable.course",
                populate: {
                    path: "instructor",
                },
            })
            .populate("timetable.room")

        if (!schedule) {
            return res.status(404).json({ message: "No schedule found to resolve conflicts" })
        }

        // Import the conflict resolution function
        const { resolveConflicts } = await
            import("../utils/conflictResolution.js")

        // Resolve conflicts
        const result = await resolveConflicts(schedule._id)

        if (result.success) {
            res.json(result.schedule)
        } else {
            res.status(400).json({ message: result.message })
        }
    } catch (error) {
        console.error("Error resolving conflicts:", error)
        res.status(500).json({ message: error.message })
    }
})

// Update a timetable
router.put("/timetables/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { timetable } = req.body

        const updatedSchedule = await Schedule.findByIdAndUpdate(
            id,
            { timetable, updatedAt: new Date() },
            { new: true }
        )
            .populate({
                path: "timetable.course",
                populate: {
                    path: "instructor",
                    select: "name",
                },
            })
            .populate("timetable.room")

        if (!updatedSchedule) {
            return res.status(404).json({ message: "Timetable not found" })
        }

        res.json(updatedSchedule)
    } catch (error) {
        console.error("Error updating timetable:", error)
        res.status(500).json({ message: error.message })
    }
})

// Get conflicts for a specific schedule
router.get("/conflicts", async (req, res) => {
    try {
        const { year, branch, division } = req.query

        // Find the latest schedule
        const schedule = await Schedule.findOne({
            year: Number.parseInt(year),
            branch,
            division,
        })
            .sort({ _id: -1 })
            .populate({
                path: "timetable.course",
                populate: {
                    path: "instructor",
                },
            })
            .populate("timetable.room")

        if (!schedule) {
            return res.status(404).json({ message: "No schedule found" })
        }

        // Detect conflicts
        const conflicts = []
        const roomConflicts = new Map()
        const instructorConflicts = new Map()

        // Group by day and time
        schedule.timetable.forEach((slot, index) => {
            const key = `${slot.day}-${slot.startTime}`
            
            // Check room conflicts
            const roomKey = `${key}-${slot.room._id}`
            if (!roomConflicts.has(roomKey)) {
                roomConflicts.set(roomKey, [])
            }
            roomConflicts.get(roomKey).push({ slot, index })

            // Check instructor conflicts
            const instructorKey = `${key}-${slot.course.instructor._id}`
            if (!instructorConflicts.has(instructorKey)) {
                instructorConflicts.set(instructorKey, [])
            }
            instructorConflicts.get(instructorKey).push({ slot, index })
        })

        // Find room conflicts
        roomConflicts.forEach((slots, key) => {
            if (slots.length > 1) {
                conflicts.push({
                    _id: `room-${key}`,
                    type: "room",
                    day: slots[0].slot.day,
                    startTime: slots[0].slot.startTime,
                    room: slots[0].slot.room,
                    courses: slots.map(s => s.slot.course),
                })
            }
        })

        // Find instructor conflicts
        instructorConflicts.forEach((slots, key) => {
            if (slots.length > 1) {
                conflicts.push({
                    _id: `instructor-${key}`,
                    type: "instructor",
                    day: slots[0].slot.day,
                    startTime: slots[0].slot.startTime,
                    instructor: slots[0].slot.course.instructor,
                    courses: slots.map(s => s.slot.course),
                })
            }
        })

        // Generate available slots for rescheduling
        const allTimeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]
        const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        const availableSlots = []

        allDays.forEach(day => {
            allTimeSlots.forEach(startTime => {
                if (startTime !== "12:00") { // Skip lunch break
                    const isOccupied = schedule.timetable.some(slot => 
                        slot.day === day && slot.startTime === startTime
                    )
                    if (!isOccupied) {
                        availableSlots.push({ day, startTime })
                    }
                }
            })
        })

        res.json({
            conflicts,
            schedule: {
                ...schedule.toObject(),
                availableSlots,
            },
        })
    } catch (error) {
        console.error("Error fetching conflicts:", error)
        res.status(500).json({ message: error.message })
    }
})

// Get all courses (for dropdown selection)
router.get("/courses-all", async (req, res) => {
    try {
        const courses = await Course.find().sort({ code: 1, lectureType: 1 })
        res.json(courses)
    } catch (error) {
        console.error("Error fetching all courses:", error)
        res.status(500).json({ message: error.message })
    }
})

// Import endpoints for integration with AMS
router.post("/import/courses", async (req, res) => {
    try {
        const { courses } = req.body
        if (!Array.isArray(courses)) return res.status(400).json({ message: "courses must be an array" })
        const docs = await Course.insertMany(courses, { ordered: false })
        res.status(201).json({ inserted: docs.length })
    } catch (e) {
        console.error("Import courses failed:", e)
        res.status(500).json({ message: e.message })
    }
})

router.post("/import/rooms", async (req, res) => {
    try {
        const { rooms } = req.body
        if (!Array.isArray(rooms)) return res.status(400).json({ message: "rooms must be an array" })
        const docs = await Room.insertMany(rooms, { ordered: false })
        res.status(201).json({ inserted: docs.length })
    } catch (e) {
        console.error("Import rooms failed:", e)
        res.status(500).json({ message: e.message })
    }
})

router.post("/import/courses-csv", async (req, res) => {
    try {
        const { csv } = req.body
        if (!csv || typeof csv !== "string") return res.status(400).json({ message: "csv string required" })
        const { rows } = parseCSV(csv)
        const docs = []
        for (const r of rows) {
            const name = r.name || r.courseName
            const code = r.code || r.courseCode
            const instructor = r.instructorId // expected to be ObjectId string
            const duration = Number.parseInt(r.duration || "60", 10)
            const capacity = Number.parseInt(r.capacity || "0", 10)
            const year = Number.parseInt(r.year, 10)
            const branch = r.branch
            const division = r.division
            const lectureType = (r.lectureType || "theory").toLowerCase()
            const preferredTimeSlots = (r.preferredTimeSlots || "")
                .split(/[ ,;|]+/)
                .map((s) => s.trim())
                .filter(Boolean)
            const credits = Number.parseInt(r.credits || "0", 10)
            const program = normalizeProgram(r.program)
            const isElective = String(r.isElective || "").toLowerCase() === "true"
            const category = (r.category || "CORE").toUpperCase()
            const electiveGroup = r.electiveGroup

            if (!name || !code || !instructor || !year || !branch || !division) {
                return res.status(400).json({ message: "Missing required fields in a row" })
            }
            docs.push({
                name,
                code,
                instructor,
                duration,
                capacity,
                year,
                branch,
                division,
                lectureType,
                preferredTimeSlots,
                credits,
                program,
                isElective,
                category,
                electiveGroup,
            })
        }
        const inserted = await Course.insertMany(docs, { ordered: false })
        res.status(201).json({ inserted: inserted.length })
    } catch (e) {
        console.error("Import courses-csv failed:", e)
        res.status(500).json({ message: e.message })
    }
})

router.post("/import/rooms-csv", async (req, res) => {
    try {
        const { csv } = req.body
        if (!csv || typeof csv !== "string") return res.status(400).json({ message: "csv string required" })
        const { rows } = parseCSV(csv)
        const docs = []
        for (const r of rows) {
            const name = r.name
            const capacity = Number.parseInt(r.capacity || "0", 10)
            const type = r.type
            const department = r.department || "All"
            const allowedYears = parseIntList(r.allowedYears)
            const isAvailable = (r.isAvailable ?? "true").toString().toLowerCase() !== "false"
            if (!name || !type) {
                return res.status(400).json({ message: "Missing required room fields in a row" })
            }
            docs.push({ name, capacity, type, department, allowedYears, isAvailable })
        }
        const inserted = await Room.insertMany(docs, { ordered: false })
        res.status(201).json({ inserted: inserted.length })
    } catch (e) {
        console.error("Import rooms-csv failed:", e)
        res.status(500).json({ message: e.message })
    }
})

router.post("/import/teachers-csv", async (req, res) => {
    try {
        const { csv, defaultPassword = "Welcome@123" } = req.body
        if (!csv || typeof csv !== "string") return res.status(400).json({ message: "csv string required" })
        const { rows } = parseCSV(csv)
        let inserted = 0
        for (const r of rows) {
            const name = r.name
            const email = r.email
            const department = r.department
            const teachableYears = parseIntList(r.teachableYears)
            const expertise = (r.expertise || "")
                .split(/[ ,;|]+/)
                .map((s) => s.trim())
                .filter(Boolean)
            if (!name || !email || !department) {
                return res.status(400).json({ message: "Missing required teacher fields in a row" })
            }
            const passwordHash = await bcrypt.hash(defaultPassword, 10)
            const update = {
                name,
                department,
                role: "teacher",
                teachableYears,
                expertise,
            }
            // upsert on email
            const result = await User.updateOne({ email }, { $setOnInsert: { email, password: passwordHash }, $set: update }, { upsert: true },)
            if (result.upsertedCount > 0 || result.modifiedCount > 0) inserted++
        }
        res.status(201).json({ upsertedOrUpdated: inserted })
    } catch (e) {
        console.error("Import teachers-csv failed:", e)
        res.status(500).json({ message: e.message })
    }
})

router.post("/import/students-csv", async (req, res) => {
    try {
        const { csv } = req.body
        if (!csv || typeof csv !== "string") return res.status(400).json({ message: "csv string required" })
        const { rows } = parseCSV(csv)
        const docs = []
        for (const r of rows) {
            const name = r.name
            const email = r.email
            const rollNo = r.rollNo || r.roll
            const year = Number.parseInt(r.year, 10)
            const branch = r.branch
            const division = r.division
            const program = normalizeProgram(r.program)
            const enrolledCredits = Number.parseInt(r.enrolledCredits || "0", 10)
            if (!name || !email || !year || !branch || !division) {
                return res.status(400).json({ message: "Missing required student fields in a row" })
            }
            docs.push({ name, email, rollNo, year, branch, division, program, enrolledCredits })
        }
        const inserted = await Student.insertMany(docs, { ordered: false })
        res.status(201).json({ inserted: inserted.length })
    } catch (e) {
        console.error("Import students-csv failed:", e)
        res.status(500).json({ message: e.message })
    }
})

// Add these routes to handle teacher absence and schedule change requests

// Handle teacher absence reports
router.post("/teacher-absence", async (req, res) => {
    try {
        const { teacherId, date, reason } = req.body

        // Get teacher information
        const teacher = await User.findById(teacherId)
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" })
        }

        // Create a new notification for the admin
        const notification = new Notification({
            type: "TEACHER_ABSENCE",
            message: `Teacher ${teacher.name} has reported absence for ${date}.`,
            data: { teacherId, teacherName: teacher.name, date, reason },
            status: "PENDING",
        })
        await notification.save()

        // Try to send email notification to admin if email config is available
        try {
            if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                })

                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: "admin@example.com", // This should be fetched from the database
                    subject: "Teacher Absence Report",
                    text: `Teacher ${teacher.name} has reported absence for ${date}. Reason: ${reason}`,
                })
            }
        } catch (emailError) {
            console.error("Error sending email notification:", emailError)
            // Continue execution even if email fails
        }

        res.status(200).json({ message: "Absence reported successfully" })
    } catch (error) {
        console.error("Error reporting teacher absence:", error)
        res.status(500).json({ message: error.message })
    }
})

// Handle schedule change requests
router.post("/schedule-change-request", async (req, res) => {
    try {
        const { teacherId, teacherName, day, timeSlot, reason } = req.body

        // Create a new notification for the admin
        const notification = new Notification({
            type: "SCHEDULE_CHANGE_REQUEST",
            message: `Teacher ${teacherName} has requested a schedule change for ${day} at ${timeSlot}.`,
            data: { teacherId, teacherName, day, timeSlot, reason },
            status: "PENDING",
        })
        await notification.save()

        // Try to send email notification to admin if email config is available
        try {
            if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                })

                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: "admin@example.com", // This should be fetched from the database
                    subject: "Schedule Change Request",
                    text: `Teacher ${teacherName} has requested a schedule change for ${day} at ${timeSlot}. Reason: ${reason}`,
                })
            }
        } catch (emailError) {
            console.error("Error sending email notification:", emailError)
            // Continue execution even if email fails
        }

        res.status(200).json({ message: "Schedule change request submitted successfully" })
    } catch (error) {
        console.error("Error submitting schedule change request:", error)
        res.status(500).json({ message: error.message })
    }
})

// Add a route to handle manual schedule changes by admin
router.post("/manual-schedule-change", async (req, res) => {
    try {
        const { scheduleId, changes } = req.body

        // Find the schedule
        const schedule = await Schedule.findById(scheduleId)
        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found" })
        }

        // Apply the changes
        for (const change of changes) {
            const { day, timeSlot, courseId, roomId } = change

            // Find the slot in the timetable
            const slotIndex = schedule.timetable.findIndex((slot) => slot.day === day && slot.startTime === timeSlot)

            if (slotIndex !== -1) {
                // Update the existing slot
                schedule.timetable[slotIndex].course = courseId
                schedule.timetable[slotIndex].room = roomId
            } else {
                // Add a new slot
                schedule.timetable.push({
                    day,
                    startTime: timeSlot,
                    course: courseId,
                    room: roomId,
                })
            }
        }

        // Check for conflicts
        const conflicts = await checkScheduleConflicts(schedule)
        if (conflicts.length > 0) {
            return res.status(400).json({
                message: "The changes would create conflicts in the schedule",
                conflicts,
            })
        }

        // Save the updated schedule
        await schedule.save()

        res.status(200).json({
            message: "Schedule updated successfully",
            schedule,
        })
    } catch (error) {
        console.error("Error updating schedule:", error)
        res.status(500).json({ message: error.message })
    }
})

// Helper function to check for conflicts in a schedule
async function checkScheduleConflicts(schedule) {
    const conflicts = []

    // Populate the schedule with course and room data
    await Schedule.populate(schedule, {
        path: "timetable.course",
        populate: {
            path: "instructor",
        },
    })
    await Schedule.populate(schedule, {
        path: "timetable.room",
    })

    // Check for room conflicts
    for (let i = 0; i < schedule.timetable.length; i++) {
        for (let j = i + 1; j < schedule.timetable.length; j++) {
            const slot1 = schedule.timetable[i]
            const slot2 = schedule.timetable[j]

            // Check if same day and time
            if (slot1.day === slot2.day && slot1.startTime === slot2.startTime) {
                // Check for room conflict
                if (slot1.room && slot2.room && slot1.room._id.toString() === slot2.room._id.toString()) {
                    conflicts.push({
                        type: "room",
                        message: `Room ${slot1.room.name} is scheduled for two different courses at the same time (${slot1.day} ${slot1.startTime})`,
                        slots: [i, j],
                    })
                }

                // Check for instructor conflict
                if (
                    slot1.course &&
                    slot2.course &&
                    slot1.course.instructor &&
                    slot2.course.instructor &&
                    slot1.course.instructor._id.toString() === slot2.course.instructor._id.toString()
                ) {
                    conflicts.push({
                        type: "instructor",
                        message: `Instructor ${slot1.course.instructor.name} is scheduled for two different courses at the same time (${slot1.day} ${slot1.startTime})`,
                        slots: [i, j],
                    })
                }
            }
        }
    }

    return conflicts
}

// Simulate schedule without saving, supports program and student electives
router.post("/simulate", async (req, res) => {
    try {
        const { year, branch, division, program, options = {} } = req.body

        const courses = await Course.find({ year: Number.parseInt(year), branch, division }).populate("instructor")
        const rooms = await Room.find()
        const teachers = await User.find({ role: "teacher" })

        const students = await Student.find({
            year: Number.parseInt(year),
            branch,
            division,
            ...(program ? { program } : {}),
        })
        const practicums = await Practicum.find({
            year: Number.parseInt(year),
            branch,
            division,
            ...(program ? { program } : {}),
        })

        // generate using extended GA (backward compatible if no extras present)
        const generated = await generateSchedule(
            courses,
            rooms,
            teachers,
            year,
            branch,
            division,
            students,
            program,
            practicums,
            options,
        )
        res.json({ simulated: true, timetable: generated })
    } catch (error) {
        console.error("Error simulating schedule:", error)
        res.status(500).json({ message: error.message })
    }
})

// Scenario-based simulation endpoint that applies what-if adjustments before simulation
router.post("/simulate-scenario", async (req, res) => {
    try {
        const { year, branch, division, program, scenario = {}, options = {} } = req.body

        // fetch base data
        const coursesBase = await Course.find({
            year: Number.parseInt(year),
            branch,
            division,
            ...(program ? { program } : {}),
        }).populate("instructor")
        const roomsBase = await Room.find()
        const teachersBase = await User.find({ role: "teacher" })
        const studentsBase = await Student.find({
            year: Number.parseInt(year),
            branch,
            division,
            ...(program ? { program } : {}),
        })
        const practicumsBase = await Practicum.find({
            year: Number.parseInt(year),
            branch,
            division,
            ...(program ? { program } : {}),
        })

        // apply scenario
        const { courses, rooms, teachers, students, practicums } = applyScenario(
            coursesBase,
            roomsBase,
            teachersBase,
            studentsBase,
            practicumsBase,
            scenario,
        )

        const timetable = await generateSchedule(
            courses,
            rooms,
            teachers,
            year,
            branch,
            division,
            students,
            program,
            practicums,
            options,
        )

        res.json({
            simulated: true,
            scenarioApplied: scenario?.type || "none",
            timetable,
        })
    } catch (error) {
        console.error("Error in simulate-scenario:", error)
        res.status(500).json({ message: error.message })
    }
})

// Helper that mutates datasets based on a scenario description
function applyScenario(courses, rooms, teachers, students, practicums, scenario) {
    const type = scenario?.type
    if (!type) return { courses, rooms, teachers, students, practicums }

    // shallow clones so original arrays are not mutated
    let c = courses.map((x) => x)
    let r = rooms.map((x) => ({ ...(x.toObject?.() ? x.toObject() : x) }))
    let t = teachers.map((x) => ({ ...(x.toObject?.() ? x.toObject() : x) }))
    let p = practicums.map((x) => ({ ...(x.toObject?.() ? x.toObject() : x) }))

    switch (type) {
        case "teacher-absent":
            {
                // params: { teacherId }
                const teacherId = scenario?.params?.teacherId
                if (teacherId) {
                    // remove courses taught by the absent teacher from simulation
                    c = c.filter((course) => course.instructor?._id?.toString() !== teacherId)
                    // optionally mark availability fully false (not strictly required after filtering)
                    t = t.map((tt) =>
                        tt._id?.toString() === teacherId ? { ...tt, availability: {} } : tt,
                    )
                }
                break
            }
        case "room-unavailable":
            {
                // params: { roomId }
                const roomId = scenario?.params?.roomId
                if (roomId) {
                    r = r.map((room) => (room._id?.toString() === roomId ? { ...room, isAvailable: false } : room))
                }
                break
            }
        case "capacity-change":
            {
                // params: { roomId, capacity }
                const roomId = scenario?.params?.roomId
                const capacity = scenario?.params?.capacity
                if (roomId && Number.isFinite(capacity)) {
                    r = r.map((room) => (room._id?.toString() === roomId ? { ...room, capacity: Number(capacity) } : room))
                }
                break
            }
        case "block-cohort":
            {
                // params: { days: string[], timeSlots: string[] }
                const days = Array.isArray(scenario?.params?.days) ? scenario.params.days : []
                const timeSlots = Array.isArray(scenario?.params?.timeSlots) ? scenario.params.timeSlots : []
                if (days.length && timeSlots.length) {
                    p = [
                        ...p,
                        {
                            name: "Scenario Block",
                            days,
                            timeSlots,
                        },
                    ]
                }
                break
            }
        case "compress-days":
            {
                // params: { daysToUse: number } e.g., 3 means block remaining days for the cohort
                const daysToUse = scenario?.params?.daysToUse
                const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
                if (Number.isFinite(daysToUse) && daysToUse > 0 && daysToUse < ALL_DAYS.length) {
                    const allowed = new Set(ALL_DAYS.slice(0, daysToUse))
                    const blockedDays = ALL_DAYS.filter((d) => !allowed.has(d))
                    const ALL_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]
                    p = [
                        ...p,
                        {
                            name: "Compressed Week",
                            days: blockedDays,
                            timeSlots: ALL_SLOTS,
                        },
                    ]
                }
                break
            }
        case "add-temp-course":
            {
                // params: { course: {...} } add a temporary course object to the pool
                const temp = scenario?.params?.course
                if (temp && temp.code && temp.instructor) {
                    c = [...c, temp]
                }
                break
            }
        case "limit-rooms-to":
            {
                // params: { roomIds: string[] }
                const roomIds = new Set(scenario?.params?.roomIds || [])
                if (roomIds.size) {
                    r = r.map((room) => (roomIds.has(room._id?.toString()) ? room : { ...room, isAvailable: false }))
                }
                break
            }
        default:
            // no adjustment
            break
    }

    return { courses: c, rooms: r, teachers: t, students: s, practicums: p }
}

// Export endpoints - PDF and Excel
router.get("/timetables/:id/export/pdf", async (req, res) => {
    try {
        const { view, teacherId, roomId } = req.query
        const tt = await Schedule.findById(req.params.id)
            .populate({ path: "timetable.course", populate: { path: "instructor", select: "name" } })
            .populate("timetable.room")
        if (!tt) return res.status(404).json({ message: "Timetable not found" })

        const buf = await timetableToPDFBuffer(tt, {
            teacherId: view === "teacher" ? teacherId : undefined,
            roomId: view === "room" ? roomId : undefined,
        })
        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `attachment; filename="timetable-${tt._id}.pdf"`)
        res.send(buf)
    } catch (e) {
        console.error("Export PDF failed:", e)
        res.status(500).json({ message: e.message })
    }
})

router.get("/timetables/:id/export/excel", async (req, res) => {
    try {
        const { view, teacherId, roomId } = req.query
        const tt = await Schedule.findById(req.params.id)
            .populate({ path: "timetable.course", populate: { path: "instructor", select: "name" } })
            .populate("timetable.room")
        if (!tt) return res.status(404).json({ message: "Timetable not found" })

        const buf = await timetableToExcelBuffer(tt, {
            teacherId: view === "teacher" ? teacherId : undefined,
            roomId: view === "room" ? roomId : undefined,
        })
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        res.setHeader("Content-Disposition", `attachment; filename="timetable-${tt._id}.xlsx"`)
        res.send(buf)
    } catch (e) {
        console.error("Export Excel failed:", e)
        res.status(500).json({ message: e.message })
    }
})

// Basic student import (JSON array) for integration with academic systems
router.post("/import/students", async (req, res) => {
    try {
        const { students } = req.body
        if (!Array.isArray(students)) return res.status(400).json({ message: "students must be an array" })
        const docs = await Student.insertMany(students, { ordered: false })
        res.status(201).json({ inserted: docs.length })
    } catch (e) {
        console.error("Import students failed:", e)
        res.status(500).json({ message: e.message })
    }
})

// Manual schedule change endpoint (for individual slot edits)
router.post("/manual-schedule-change", async (req, res) => {
    try {
        const { scheduleId, changes } = req.body

        // Find the schedule
        const schedule = await Schedule.findById(scheduleId)
        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found" })
        }

        // Apply changes
        for (const change of changes) {
            const { day, timeSlot, courseId, roomId } = change

            // Remove existing slot at this time
            schedule.timetable = schedule.timetable.filter(
                slot => !(slot.day === day && slot.startTime === timeSlot)
            )

            // Add new slot if course and room are provided
            if (courseId && roomId) {
                schedule.timetable.push({
                    day,
                    startTime: timeSlot,
                    course: courseId,
                    room: roomId
                })
            }
        }

        // Check for conflicts
        const conflicts = await checkScheduleConflicts(schedule)
        if (conflicts.length > 0) {
            return res.status(400).json({
                message: "The changes would create conflicts",
                conflicts,
            })
        }

        // Save the updated schedule
        schedule.updatedAt = new Date()
        await schedule.save()

        res.status(200).json({
            message: "Schedule updated successfully",
            schedule
        })
    } catch (error) {
        console.error("Error updating schedule:", error)
        res.status(500).json({ message: error.message })
    }
})

// Update entire timetable (for drag-and-drop editor)
router.put("/timetables/:id", async (req, res) => {
    try {
        const { timetable } = req.body
        const scheduleId = req.params.id

        // Find the schedule
        const schedule = await Schedule.findById(scheduleId)
        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found" })
        }

        // Update the timetable
        schedule.timetable = timetable
        schedule.updatedAt = new Date()

        // Check for conflicts before saving
        const conflicts = await checkScheduleConflicts(schedule)
        if (conflicts.length > 0) {
            return res.status(400).json({
                message: "The updated timetable contains conflicts",
                conflicts,
            })
        }

        // Save the updated schedule
        await schedule.save()

        // Populate the response
        const populatedSchedule = await Schedule.findById(scheduleId)
            .populate({
                path: "timetable.course",
                populate: {
                    path: "instructor",
                    select: "name email"
                }
            })
            .populate("timetable.room")

        res.status(200).json({
            message: "Timetable updated successfully",
            schedule: populatedSchedule,
        })
    } catch (error) {
        console.error("Error updating timetable:", error)
        res.status(500).json({ message: error.message })
    }
})

export default router