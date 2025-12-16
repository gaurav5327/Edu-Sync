import express from "express"
import User from "../models/User.js"
import Course from "../models/Course.js"
import Schedule from "../models/Schedule.js"
import Room from "../models/Room.js"
import FieldWork from "../models/FieldWork.js"
import TeachingPractice from "../models/TeachingPractice.js"

const router = express.Router()

// Get enrollment analytics
router.get("/enrollment", async (req, res) => {
  try {
    const { program, year, branch } = req.query
    
    // Build query for students
    const studentQuery = { role: "student" }
    if (program) studentQuery.program = program
    if (year) studentQuery.year = parseInt(year)
    if (branch) studentQuery.department = branch

    // Get enrollment statistics
    const enrollmentStats = await User.aggregate([
      { $match: studentQuery },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          avgCredits: { $avg: "$enrolledCredits" },
          totalCredits: { $sum: "$enrolledCredits" }
        }
      }
    ])

    // Get enrollment by program
    const byProgram = await User.aggregate([
      { $match: { role: "student", ...(program ? { program } : {}) } },
      {
        $group: {
          _id: "$program",
          count: { $sum: 1 },
          avgCredits: { $avg: "$enrolledCredits" }
        }
      },
      { $sort: { count: -1 } }
    ])

    // Get enrollment by year
    const byYear = await User.aggregate([
      { $match: studentQuery },
      {
        $group: {
          _id: "$year",
          count: { $sum: 1 },
          avgCredits: { $avg: "$enrolledCredits" }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // Get enrollment by branch/department
    const byBranch = await User.aggregate([
      { $match: studentQuery },
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
          avgCredits: { $avg: "$enrolledCredits" }
        }
      },
      { $sort: { count: -1 } }
    ])

    // Get enrollment by division
    const byDivision = await User.aggregate([
      { $match: studentQuery },
      {
        $group: {
          _id: "$division",
          count: { $sum: 1 },
          avgCredits: { $avg: "$enrolledCredits" }
        }
      },
      { $sort: { _id: 1 } }
    ])

    res.json({
      overview: enrollmentStats[0] || { totalStudents: 0, avgCredits: 0, totalCredits: 0 },
      byProgram,
      byYear,
      byBranch,
      byDivision
    })
  } catch (error) {
    console.error("Error fetching enrollment analytics:", error)
    res.status(500).json({ message: "Error fetching enrollment analytics", error: error.message })
  }
})

// Get course analytics
router.get("/courses", async (req, res) => {
  try {
    const { program, year, branch } = req.query
    
    const courseQuery = {}
    if (program) courseQuery.program = program
    if (year) courseQuery.year = parseInt(year)
    if (branch) courseQuery.branch = branch

    // Get course statistics
    const courseStats = await Course.aggregate([
      { $match: courseQuery },
      {
        $group: {
          _id: null,
          totalCourses: { $sum: 1 },
          totalCredits: { $sum: "$credits" },
          avgCredits: { $avg: "$credits" },
          avgCapacity: { $avg: "$capacity" },
          labCourses: { $sum: { $cond: [{ $eq: ["$lectureType", "lab"] }, 1, 0] } },
          theoryCourses: { $sum: { $cond: [{ $eq: ["$lectureType", "theory"] }, 1, 0] } }
        }
      }
    ])

    // Get courses by instructor
    const byInstructor = await Course.aggregate([
      { $match: courseQuery },
      { $lookup: { from: "users", localField: "instructor", foreignField: "_id", as: "instructorInfo" } },
      { $unwind: "$instructorInfo" },
      {
        $group: {
          _id: "$instructor",
          instructorName: { $first: "$instructorInfo.name" },
          courseCount: { $sum: 1 },
          totalCredits: { $sum: "$credits" }
        }
      },
      { $sort: { courseCount: -1 } },
      { $limit: 10 }
    ])

    // Get courses by type
    const byType = await Course.aggregate([
      { $match: courseQuery },
      {
        $group: {
          _id: "$lectureType",
          count: { $sum: 1 },
          avgCredits: { $avg: "$credits" },
          avgCapacity: { $avg: "$capacity" }
        }
      }
    ])

    res.json({
      overview: courseStats[0] || {
        totalCourses: 0,
        totalCredits: 0,
        avgCredits: 0,
        avgCapacity: 0,
        labCourses: 0,
        theoryCourses: 0
      },
      byInstructor,
      byType
    })
  } catch (error) {
    console.error("Error fetching course analytics:", error)
    res.status(500).json({ message: "Error fetching course analytics", error: error.message })
  }
})

// Get schedule analytics
router.get("/schedules", async (req, res) => {
  try {
    const { program, year, branch } = req.query
    
    const scheduleQuery = {}
    if (program) scheduleQuery.program = program
    if (year) scheduleQuery.year = parseInt(year)
    if (branch) scheduleQuery.branch = branch

    // Get schedule statistics
    const scheduleStats = await Schedule.aggregate([
      { $match: scheduleQuery },
      {
        $group: {
          _id: null,
          totalSchedules: { $sum: 1 },
          totalSlots: { $sum: { $size: "$timetable" } }
        }
      }
    ])

    // Get utilization statistics
    const utilizationStats = await Schedule.aggregate([
      { $match: scheduleQuery },
      { $unwind: "$timetable" },
      {
        $group: {
          _id: null,
          totalSlots: { $sum: 1 },
          occupiedSlots: { $sum: { $cond: [{ $ne: ["$timetable.isFree", true] }, 1, 0] } },
          labSlots: { $sum: { $cond: [{ $eq: ["$timetable.course.lectureType", "lab"] }, 1, 0] } },
          theorySlots: { $sum: { $cond: [{ $eq: ["$timetable.course.lectureType", "theory"] }, 1, 0] } }
        }
      },
      {
        $project: {
          totalSlots: 1,
          occupiedSlots: 1,
          labSlots: 1,
          theorySlots: 1,
          utilization: { $multiply: [{ $divide: ["$occupiedSlots", "$totalSlots"] }, 100] }
        }
      }
    ])

    // Get peak hours analysis
    const peakHours = await Schedule.aggregate([
      { $match: scheduleQuery },
      { $unwind: "$timetable" },
      { $match: { "timetable.isFree": { $ne: true } } },
      {
        $group: {
          _id: "$timetable.startTime",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])

    // Get day-wise distribution
    const dayDistribution = await Schedule.aggregate([
      { $match: scheduleQuery },
      { $unwind: "$timetable" },
      { $match: { "timetable.isFree": { $ne: true } } },
      {
        $group: {
          _id: "$timetable.day",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])

    res.json({
      overview: scheduleStats[0] || { totalSchedules: 0, totalSlots: 0 },
      utilization: utilizationStats[0] || {
        totalSlots: 0,
        occupiedSlots: 0,
        labSlots: 0,
        theorySlots: 0,
        utilization: 0
      },
      peakHours,
      dayDistribution
    })
  } catch (error) {
    console.error("Error fetching schedule analytics:", error)
    res.status(500).json({ message: "Error fetching schedule analytics", error: error.message })
  }
})

// Get faculty analytics
router.get("/faculty", async (req, res) => {
  try {
    const { department } = req.query
    
    const facultyQuery = { role: "teacher" }
    if (department) facultyQuery.department = department

    // Get faculty statistics
    const facultyStats = await User.aggregate([
      { $match: facultyQuery },
      {
        $group: {
          _id: null,
          totalFaculty: { $sum: 1 }
        }
      }
    ])

    // Get faculty by department
    const byDepartment = await User.aggregate([
      { $match: { role: "teacher" } },
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])

    // Get faculty workload (courses assigned)
    const workload = await Course.aggregate([
      { $lookup: { from: "users", localField: "instructor", foreignField: "_id", as: "instructorInfo" } },
      { $unwind: "$instructorInfo" },
      {
        $group: {
          _id: "$instructor",
          instructorName: { $first: "$instructorInfo.name" },
          department: { $first: "$instructorInfo.department" },
          courseCount: { $sum: 1 },
          totalCredits: { $sum: "$credits" },
          labCourses: { $sum: { $cond: [{ $eq: ["$lectureType", "lab"] }, 1, 0] } },
          theoryCourses: { $sum: { $cond: [{ $eq: ["$lectureType", "theory"] }, 1, 0] } }
        }
      },
      { $sort: { courseCount: -1 } }
    ])

    res.json({
      overview: facultyStats[0] || { totalFaculty: 0 },
      byDepartment,
      workload
    })
  } catch (error) {
    console.error("Error fetching faculty analytics:", error)
    res.status(500).json({ message: "Error fetching faculty analytics", error: error.message })
  }
})

// Get resource analytics (rooms, etc.)
router.get("/resources", async (req, res) => {
  try {
    // Get room statistics
    const roomStats = await Room.aggregate([
      {
        $group: {
          _id: null,
          totalRooms: { $sum: 1 },
          totalCapacity: { $sum: "$capacity" },
          avgCapacity: { $avg: "$capacity" }
        }
      }
    ])

    // Get rooms by type
    const byType = await Room.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          totalCapacity: { $sum: "$capacity" },
          avgCapacity: { $avg: "$capacity" }
        }
      }
    ])

    // Get room utilization from schedules
    const roomUtilization = await Schedule.aggregate([
      { $unwind: "$timetable" },
      { $match: { "timetable.isFree": { $ne: true } } },
      { $lookup: { from: "rooms", localField: "timetable.room", foreignField: "_id", as: "roomInfo" } },
      { $unwind: "$roomInfo" },
      {
        $group: {
          _id: "$timetable.room",
          roomName: { $first: "$roomInfo.name" },
          roomType: { $first: "$roomInfo.type" },
          capacity: { $first: "$roomInfo.capacity" },
          usageCount: { $sum: 1 }
        }
      },
      { $sort: { usageCount: -1 } }
    ])

    res.json({
      overview: roomStats[0] || { totalRooms: 0, totalCapacity: 0, avgCapacity: 0 },
      byType,
      utilization: roomUtilization
    })
  } catch (error) {
    console.error("Error fetching resource analytics:", error)
    res.status(500).json({ message: "Error fetching resource analytics", error: error.message })
  }
})

// Get dashboard overview
router.get("/dashboard", async (req, res) => {
  try {
    const { program } = req.query
    
    // Get quick stats for dashboard
    const studentQuery = { role: "student" }
    const facultyQuery = { role: "teacher" }
    const courseQuery = {}
    const scheduleQuery = {}
    
    if (program) {
      studentQuery.program = program
      courseQuery.program = program
      scheduleQuery.program = program
    }

    const [
      studentCount,
      facultyCount,
      courseCount,
      scheduleCount,
      roomCount
    ] = await Promise.all([
      User.countDocuments(studentQuery),
      User.countDocuments(facultyQuery),
      Course.countDocuments(courseQuery),
      Schedule.countDocuments(scheduleQuery),
      Room.countDocuments()
    ])

    // Get recent activity (simplified)
    const recentSchedules = await Schedule.find(scheduleQuery)
      .sort({ createdAt: -1 })
      .limit(5)
      .select("program year branch division createdAt")

    res.json({
      counts: {
        students: studentCount,
        faculty: facultyCount,
        courses: courseCount,
        schedules: scheduleCount,
        rooms: roomCount
      },
      recentActivity: recentSchedules
    })
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error)
    res.status(500).json({ message: "Error fetching dashboard analytics", error: error.message })
  }
})

export default router