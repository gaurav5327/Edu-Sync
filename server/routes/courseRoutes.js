import express from "express"
import Course from "../models/Course.js"
import User from "../models/User.js"

const router = express.Router()

// Get all courses with optional filtering
router.get("/", async (req, res) => {
  try {
    const { program, year, branch, division, instructor } = req.query
    
    // Build query object
    const query = {}
    if (program) query.program = program
    if (year) query.year = parseInt(year)
    if (branch) query.branch = branch
    if (division) query.division = division
    if (instructor) query.instructor = instructor

    const courses = await Course.find(query)
      .populate("instructor", "name email department")
      .sort({ year: 1, branch: 1, name: 1 })

    res.json(courses)
  } catch (error) {
    console.error("Error fetching courses:", error)
    res.status(500).json({ message: "Error fetching courses", error: error.message })
  }
})

// Get course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email department")

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    res.json(course)
  } catch (error) {
    console.error("Error fetching course:", error)
    res.status(500).json({ message: "Error fetching course", error: error.message })
  }
})

// Create new course
router.post("/", async (req, res) => {
  try {
    const course = new Course(req.body)
    const savedCourse = await course.save()
    
    const populatedCourse = await Course.findById(savedCourse._id)
      .populate("instructor", "name email department")
    
    res.status(201).json(populatedCourse)
  } catch (error) {
    console.error("Error creating course:", error)
    res.status(400).json({ message: "Error creating course", error: error.message })
  }
})

// Update course
router.put("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("instructor", "name email department")

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    res.json(course)
  } catch (error) {
    console.error("Error updating course:", error)
    res.status(400).json({ message: "Error updating course", error: error.message })
  }
})

// Delete course
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    res.json({ message: "Course deleted successfully" })
  } catch (error) {
    console.error("Error deleting course:", error)
    res.status(500).json({ message: "Error deleting course", error: error.message })
  }
})

// Get courses by instructor
router.get("/instructor/:instructorId", async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.params.instructorId })
      .populate("instructor", "name email department")
      .sort({ year: 1, branch: 1, name: 1 })

    res.json(courses)
  } catch (error) {
    console.error("Error fetching instructor courses:", error)
    res.status(500).json({ message: "Error fetching instructor courses", error: error.message })
  }
})

// Get course statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const { program } = req.query
    
    const matchStage = program ? { program } : {}
    
    const stats = await Course.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalCourses: { $sum: 1 },
          totalCredits: { $sum: "$credits" },
          avgCredits: { $avg: "$credits" },
          labCourses: {
            $sum: { $cond: [{ $eq: ["$lectureType", "lab"] }, 1, 0] }
          },
          theoryCourses: {
            $sum: { $cond: [{ $eq: ["$lectureType", "theory"] }, 1, 0] }
          }
        }
      }
    ])

    const programStats = await Course.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$program",
          count: { $sum: 1 },
          totalCredits: { $sum: "$credits" }
        }
      }
    ])

    const yearStats = await Course.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$year",
          count: { $sum: 1 },
          totalCredits: { $sum: "$credits" }
        }
      },
      { $sort: { _id: 1 } }
    ])

    res.json({
      overview: stats[0] || {
        totalCourses: 0,
        totalCredits: 0,
        avgCredits: 0,
        labCourses: 0,
        theoryCourses: 0
      },
      byProgram: programStats,
      byYear: yearStats
    })
  } catch (error) {
    console.error("Error fetching course statistics:", error)
    res.status(500).json({ message: "Error fetching course statistics", error: error.message })
  }
})

export default router