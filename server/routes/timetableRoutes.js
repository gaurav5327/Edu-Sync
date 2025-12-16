import express from "express"
import Schedule from "../models/Schedule.js"

const router = express.Router()

// Get all timetables with optional filtering
router.get("/", async (req, res) => {
  try {
    const { program, year, branch, division } = req.query
    
    // Build query object
    const query = {}
    if (program) query.program = program
    if (year) query.year = parseInt(year)
    if (branch) query.branch = branch
    if (division) query.division = division

    const timetables = await Schedule.find(query)
      .populate({
        path: "timetable.course",
        populate: { path: "instructor", select: "name email department" }
      })
      .populate("timetable.room", "name capacity type")
      .sort({ program: 1, year: 1, branch: 1, division: 1 })

    res.json(timetables)
  } catch (error) {
    console.error("Error fetching timetables:", error)
    res.status(500).json({ message: "Error fetching timetables", error: error.message })
  }
})

// Get timetable by ID
router.get("/:id", async (req, res) => {
  try {
    const timetable = await Schedule.findById(req.params.id)
      .populate({
        path: "timetable.course",
        populate: { path: "instructor", select: "name email department" }
      })
      .populate("timetable.room", "name capacity type")

    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" })
    }

    res.json(timetable)
  } catch (error) {
    console.error("Error fetching timetable:", error)
    res.status(500).json({ message: "Error fetching timetable", error: error.message })
  }
})

// Get timetables by program
router.get("/program/:program", async (req, res) => {
  try {
    const { program } = req.params
    const { year, branch, division } = req.query
    
    const query = { program }
    if (year) query.year = parseInt(year)
    if (branch) query.branch = branch
    if (division) query.division = division

    const timetables = await Schedule.find(query)
      .populate({
        path: "timetable.course",
        populate: { path: "instructor", select: "name email department" }
      })
      .populate("timetable.room", "name capacity type")
      .sort({ year: 1, branch: 1, division: 1 })

    res.json(timetables)
  } catch (error) {
    console.error("Error fetching program timetables:", error)
    res.status(500).json({ message: "Error fetching program timetables", error: error.message })
  }
})

// Get timetable statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const { program } = req.query
    
    const matchStage = program ? { program } : {}
    
    const stats = await Schedule.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalTimetables: { $sum: 1 },
          totalSlots: { $sum: { $size: "$timetable" } }
        }
      }
    ])

    const programStats = await Schedule.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$program",
          count: { $sum: 1 },
          totalSlots: { $sum: { $size: "$timetable" } }
        }
      }
    ])

    const yearStats = await Schedule.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$year",
          count: { $sum: 1 },
          totalSlots: { $sum: { $size: "$timetable" } }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // Get utilization stats
    const utilizationStats = await Schedule.aggregate([
      { $match: matchStage },
      { $unwind: "$timetable" },
      {
        $group: {
          _id: null,
          totalSlots: { $sum: 1 },
          occupiedSlots: {
            $sum: { $cond: [{ $ne: ["$timetable.isFree", true] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          totalSlots: 1,
          occupiedSlots: 1,
          utilization: {
            $multiply: [
              { $divide: ["$occupiedSlots", "$totalSlots"] },
              100
            ]
          }
        }
      }
    ])

    res.json({
      overview: stats[0] || { totalTimetables: 0, totalSlots: 0 },
      byProgram: programStats,
      byYear: yearStats,
      utilization: utilizationStats[0] || { totalSlots: 0, occupiedSlots: 0, utilization: 0 }
    })
  } catch (error) {
    console.error("Error fetching timetable statistics:", error)
    res.status(500).json({ message: "Error fetching timetable statistics", error: error.message })
  }
})

// Get conflicts in timetables
router.get("/conflicts/check", async (req, res) => {
  try {
    const { program } = req.query
    
    const matchStage = program ? { program } : {}
    
    const conflicts = await Schedule.aggregate([
      { $match: matchStage },
      { $unwind: "$timetable" },
      {
        $group: {
          _id: {
            day: "$timetable.day",
            startTime: "$timetable.startTime",
            instructor: "$timetable.course.instructor",
            room: "$timetable.room"
          },
          schedules: {
            $push: {
              scheduleId: "$_id",
              program: "$program",
              year: "$year",
              branch: "$branch",
              division: "$division",
              course: "$timetable.course"
            }
          },
          count: { $sum: 1 }
        }
      },
      { $match: { count: { $gt: 1 } } }
    ])

    res.json({
      conflicts: conflicts,
      totalConflicts: conflicts.length
    })
  } catch (error) {
    console.error("Error checking conflicts:", error)
    res.status(500).json({ message: "Error checking conflicts", error: error.message })
  }
})

export default router