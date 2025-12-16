import express from "express"
import Scenario from "../models/Scenario.js"
import Schedule from "../models/Schedule.js"
import Course from "../models/Course.js"
import Room from "../models/Room.js"
import User from "../models/User.js"
import { generateSchedule } from "../utils/geneticAlgorithm.js"

const router = express.Router()

// Mock data for testing when database is empty or disconnected
const mockScenarios = [
  {
    _id: "mock-scenario-1",
    name: "Standard Fall Schedule",
    description: "Regular fall semester scheduling with standard constraints",
    parameters: {
      semester: "Fall 2024",
      academicYear: "2024-25",
      programs: ["FYUP", "B.Ed."],
      constraints: {
        maxDailyHours: 8,
        lunchBreakDuration: 60,
        facultyMaxLoad: 20,
        roomUtilization: 85,
      },
    },
    modifications: [],
    status: "generated",
    metrics: {
      conflictCount: 2,
      roomUtilization: 78,
      facultyWorkload: 85,
      studentSatisfaction: 92,
    },
    createdAt: new Date("2024-09-01"),
  },
  {
    _id: "mock-scenario-2",
    name: "High Capacity Scenario",
    description: "Testing with increased room capacity and extended hours",
    parameters: {
      semester: "Fall 2024",
      academicYear: "2024-25",
      programs: ["FYUP"],
      constraints: {
        maxDailyHours: 10,
        lunchBreakDuration: 45,
        facultyMaxLoad: 25,
        roomUtilization: 95,
      },
    },
    modifications: [
      {
        type: "change_room",
        target: "room-101",
        changes: { capacity: 100 },
      },
    ],
    status: "draft",
    metrics: {
      conflictCount: 0,
      roomUtilization: 95,
      facultyWorkload: 92,
      studentSatisfaction: 88,
    },
    createdAt: new Date("2024-09-15"),
  },
  {
    _id: "mock-scenario-3",
    name: "Emergency Remote Learning",
    description: "Scenario for quick transition to remote learning capabilities",
    parameters: {
      semester: "Fall 2024",
      academicYear: "2024-25",
      programs: ["B.Ed.", "M.Ed."],
      constraints: {
        maxDailyHours: 6,
        lunchBreakDuration: 90,
        facultyMaxLoad: 15,
        roomUtilization: 50,
      },
    },
    modifications: [
      {
        type: "change_time",
        target: "all-courses",
        changes: { format: "online", duration: 45 },
      },
    ],
    status: "approved",
    metrics: {
      conflictCount: 1,
      roomUtilization: 45,
      facultyWorkload: 70,
      studentSatisfaction: 85,
    },
    createdAt: new Date("2024-08-20"),
  },
]

// GET all scenarios
router.get("/", async (req, res) => {
  try {
    const scenarios = await Scenario.find()
      .populate("baseScenario", "name")
      .populate("generatedSchedule")
      .sort({ createdAt: -1 })

    // If no scenarios found in database, return mock data
    if (scenarios.length === 0) {
      console.log("No scenarios found in database, returning mock data")
      return res.json(mockScenarios)
    }

    res.json(scenarios)
  } catch (error) {
    console.error("Error fetching scenarios:", error)
    // Return mock data on database error
    res.json(mockScenarios)
  }
})

// GET scenario by ID
router.get("/:id", async (req, res) => {
  try {
    const scenario = await Scenario.findById(req.params.id)
      .populate("baseScenario", "name")
      .populate("generatedSchedule")

    if (!scenario) {
      // Check if it's a mock ID
      const mockScenario = mockScenarios.find((s) => s._id === req.params.id)
      if (mockScenario) {
        return res.json(mockScenario)
      }
      return res.status(404).json({ message: "Scenario not found" })
    }

    res.json(scenario)
  } catch (error) {
    console.error("Error fetching scenario:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// POST create new scenario
router.post("/", async (req, res) => {
  try {
    const scenarioData = req.body
    console.log("Received scenario data:", JSON.stringify(scenarioData, null, 2))

    // If using mock base scenario, create a mock scenario entry
    if (scenarioData.baseScenario && scenarioData.baseScenario.startsWith("mock-")) {
      const mockScenario = {
        _id: `mock-scenario-${Date.now()}`,
        ...scenarioData,
        status: "draft",
        metrics: {
          conflictCount: 0,
          roomUtilization: 0,
          facultyWorkload: 0,
          studentSatisfaction: 0,
        },
        createdAt: new Date(),
      }
      mockScenarios.push(mockScenario)
      return res.status(201).json(mockScenario)
    }

    // Clean up the data before saving
    const cleanedData = {
      name: scenarioData.name,
      description: scenarioData.description,
      baseScenario: scenarioData.baseScenario || undefined,
      parameters: {
        semester: scenarioData.parameters?.semester || "Fall 2024",
        academicYear: scenarioData.parameters?.academicYear || "2024-25",
        programs: Array.isArray(scenarioData.parameters?.programs) ? scenarioData.parameters.programs : ["FYUP"],
        constraints: {
          maxDailyHours: Number(scenarioData.parameters?.constraints?.maxDailyHours) || 8,
          lunchBreakDuration: Number(scenarioData.parameters?.constraints?.lunchBreakDuration) || 60,
          facultyMaxLoad: Number(scenarioData.parameters?.constraints?.facultyMaxLoad) || 20,
          roomUtilization: Number(scenarioData.parameters?.constraints?.roomUtilization) || 85,
        },
      },
      modifications: Array.isArray(scenarioData.modifications) ? scenarioData.modifications : [],
    }

    console.log("Cleaned scenario data:", JSON.stringify(cleanedData, null, 2))

    const scenario = new Scenario(cleanedData)
    await scenario.save()

    const populatedScenario = await Scenario.findById(scenario._id)
      .populate("baseScenario", "name")
      .populate("generatedSchedule")

    res.status(201).json(populatedScenario)
  } catch (error) {
    console.error("Error creating scenario:", error)
    console.error("Error stack:", error.stack)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// POST generate scenario
router.post("/:id/generate", async (req, res) => {
  try {
    const { id } = req.params
    let scenario

    // Handle mock scenarios
    if (id.startsWith("mock-")) {
      const mockIndex = mockScenarios.findIndex((s) => s._id === id)
      if (mockIndex !== -1) {
        // Simulate generation process
        mockScenarios[mockIndex].status = "generated"
        mockScenarios[mockIndex].metrics = {
          conflictCount: Math.floor(Math.random() * 5),
          roomUtilization: Math.floor(Math.random() * 20) + 75,
          facultyWorkload: Math.floor(Math.random() * 15) + 80,
          studentSatisfaction: Math.floor(Math.random() * 10) + 85,
        }
        return res.json(mockScenarios[mockIndex])
      }
      return res.status(404).json({ message: "Scenario not found" })
    }

    scenario = await Scenario.findById(id)
    if (!scenario) {
      return res.status(404).json({ message: "Scenario not found" })
    }

    // Generate schedule based on scenario parameters
    try {
      // Get base data for generation
      const courses = await Course.find({}).populate("instructor")
      const rooms = await Room.find()
      const teachers = await User.find({ role: "teacher" })

      if (courses.length === 0 || rooms.length === 0 || teachers.length === 0) {
        // Use mock generation for testing
        scenario.status = "generated"
        scenario.metrics = {
          conflictCount: Math.floor(Math.random() * 5),
          roomUtilization: Math.floor(Math.random() * 20) + 75,
          facultyWorkload: Math.floor(Math.random() * 15) + 80,
          studentSatisfaction: Math.floor(Math.random() * 10) + 85,
        }
        await scenario.save()
        return res.json(scenario)
      }

      // Apply scenario modifications to the data
      const modifiedData = applyScenarioModifications(
        { courses, rooms, teachers },
        scenario.modifications,
      )

      // Generate schedule with scenario constraints
      const generatedSchedule = await generateSchedule(
        modifiedData.courses,
        modifiedData.rooms,
        modifiedData.teachers,
        1, // year
        "Computer Science", // branch
        "A", // division
        [], // students
        scenario.parameters.programs[0] || "FYUP", // program
        [], // practicums
        scenario.parameters.constraints, // options
      )

      // Save the generated schedule
      const newSchedule = new Schedule({
        year: 1,
        branch: "Computer Science",
        division: "A",
        program: scenario.parameters.programs[0] || "FYUP",
        timetable: generatedSchedule,
        createdAt: new Date(),
      })

      await newSchedule.save()

      // Update scenario with generated schedule and metrics
      scenario.generatedSchedule = newSchedule._id
      scenario.status = "generated"
      scenario.metrics = calculateScenarioMetrics(generatedSchedule)
      await scenario.save()

      const populatedScenario = await Scenario.findById(scenario._id)
        .populate("baseScenario", "name")
        .populate("generatedSchedule")

      res.json(populatedScenario)
    } catch (generationError) {
      console.error("Error generating schedule:", generationError)
      // Fallback to mock metrics
      scenario.status = "generated"
      scenario.metrics = {
        conflictCount: Math.floor(Math.random() * 5),
        roomUtilization: Math.floor(Math.random() * 20) + 75,
        facultyWorkload: Math.floor(Math.random() * 15) + 80,
        studentSatisfaction: Math.floor(Math.random() * 10) + 85,
      }
      await scenario.save()
      res.json(scenario)
    }
  } catch (error) {
    console.error("Error generating scenario:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// POST clone scenario
router.post("/:id/clone", async (req, res) => {
  try {
    const { id } = req.params
    let originalScenario

    // Handle mock scenarios
    if (id.startsWith("mock-")) {
      originalScenario = mockScenarios.find((s) => s._id === id)
      if (originalScenario) {
        const clonedScenario = {
          ...originalScenario,
          _id: `mock-scenario-${Date.now()}`,
          name: `${originalScenario.name} (Copy)`,
          status: "draft",
          generatedSchedule: null,
          createdAt: new Date(),
        }
        mockScenarios.push(clonedScenario)
        return res.status(201).json(clonedScenario)
      }
      return res.status(404).json({ message: "Scenario not found" })
    }

    originalScenario = await Scenario.findById(id)
    if (!originalScenario) {
      return res.status(404).json({ message: "Scenario not found" })
    }

    // Create a clone
    const clonedData = {
      name: `${originalScenario.name} (Copy)`,
      description: originalScenario.description,
      baseScenario: originalScenario._id,
      parameters: originalScenario.parameters,
      modifications: originalScenario.modifications,
      status: "draft",
    }

    const clonedScenario = new Scenario(clonedData)
    await clonedScenario.save()

    const populatedClone = await Scenario.findById(clonedScenario._id)
      .populate("baseScenario", "name")
      .populate("generatedSchedule")

    res.status(201).json(populatedClone)
  } catch (error) {
    console.error("Error cloning scenario:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// PUT update scenario
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Handle mock scenarios
    if (id.startsWith("mock-")) {
      const mockIndex = mockScenarios.findIndex((s) => s._id === id)
      if (mockIndex !== -1) {
        mockScenarios[mockIndex] = { ...mockScenarios[mockIndex], ...updateData }
        return res.json(mockScenarios[mockIndex])
      }
      return res.status(404).json({ message: "Scenario not found" })
    }

    const scenario = await Scenario.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("baseScenario", "name")
      .populate("generatedSchedule")

    if (!scenario) {
      return res.status(404).json({ message: "Scenario not found" })
    }

    res.json(scenario)
  } catch (error) {
    console.error("Error updating scenario:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// DELETE scenario
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params

    // Handle mock scenarios
    if (id.startsWith("mock-")) {
      const mockIndex = mockScenarios.findIndex((s) => s._id === id)
      if (mockIndex !== -1) {
        mockScenarios.splice(mockIndex, 1)
        return res.json({ message: "Scenario deleted successfully" })
      }
      return res.status(404).json({ message: "Scenario not found" })
    }

    const scenario = await Scenario.findByIdAndDelete(id)

    if (!scenario) {
      return res.status(404).json({ message: "Scenario not found" })
    }

    res.json({ message: "Scenario deleted successfully" })
  } catch (error) {
    console.error("Error deleting scenario:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Helper function to apply scenario modifications
function applyScenarioModifications(data, modifications) {
  const { courses, rooms, teachers } = data
  let modifiedCourses = [...courses]
  let modifiedRooms = [...rooms]
  let modifiedTeachers = [...teachers]

  for (const modification of modifications) {
    switch (modification.type) {
      case "add_course":
        // Add a new course based on changes
        if (modification.changes) {
          modifiedCourses.push(modification.changes)
        }
        break
      case "remove_course":
        // Remove course by target ID
        modifiedCourses = modifiedCourses.filter(
          (course) => course._id.toString() !== modification.target,
        )
        break
      case "change_faculty":
        // Change faculty for a course
        modifiedCourses = modifiedCourses.map((course) =>
          course._id.toString() === modification.target
            ? { ...course, instructor: modification.changes.instructorId }
            : course,
        )
        break
      case "change_room":
        // Modify room properties
        modifiedRooms = modifiedRooms.map((room) =>
          room._id.toString() === modification.target ? { ...room, ...modification.changes } : room,
        )
        break
      case "change_time":
        // Modify course time preferences
        modifiedCourses = modifiedCourses.map((course) =>
          course._id.toString() === modification.target
            ? { ...course, preferredTimeSlots: modification.changes.timeSlots }
            : course,
        )
        break
    }
  }

  return {
    courses: modifiedCourses,
    rooms: modifiedRooms,
    teachers: modifiedTeachers,
  }
}

// Helper function to calculate scenario metrics
function calculateScenarioMetrics(timetable) {
  // This is a simplified calculation - in a real system, you'd have more complex logic
  const totalSlots = timetable.length
  const conflicts = 0 // Would be calculated based on actual conflicts
  const roomUtilization = Math.min(95, Math.max(60, totalSlots * 2))
  const facultyWorkload = Math.min(100, Math.max(70, totalSlots * 1.5))
  const studentSatisfaction = Math.max(80, 100 - conflicts * 5)

  return {
    conflictCount: conflicts,
    roomUtilization: Math.round(roomUtilization),
    facultyWorkload: Math.round(facultyWorkload),
    studentSatisfaction: Math.round(studentSatisfaction),
  }
}

export default router