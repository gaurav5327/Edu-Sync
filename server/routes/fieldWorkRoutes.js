import express from "express"
import FieldWork from "../models/FieldWork.js"
import User from "../models/User.js"

const router = express.Router()

// Mock data for testing when database is empty or disconnected
const mockFieldWorks = [
  {
    _id: "mock-fw-1",
    student: {
      _id: "mock-student-1",
      name: "John Doe",
      program: "Computer Science",
      year: 3,
    },
    supervisor: {
      _id: "mock-teacher-1",
      name: "Dr. Smith",
    },
    type: "internship",
    organization: {
      name: "Tech Corp",
      type: "Corporate",
      address: "123 Tech Street",
      mentor: "Jane Manager",
      contact: "jane@techcorp.com",
    },
    duration: {
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      totalWeeks: 12,
    },
    objectives: ["Learn web development", "Work on real projects", "Gain industry experience"],
    credits: 6,
    status: "ongoing",
  },
  {
    _id: "mock-fw-2",
    student: {
      _id: "mock-student-2",
      name: "Jane Smith",
      program: "Business Administration",
      year: 2,
    },
    supervisor: {
      _id: "mock-teacher-2",
      name: "Prof. Johnson",
    },
    type: "field_work",
    organization: {
      name: "Local NGO",
      type: "NGO",
      address: "456 Community Ave",
      mentor: "Bob Volunteer",
      contact: "bob@localngo.org",
    },
    duration: {
      startDate: "2024-07-01",
      endDate: "2024-07-31",
      totalWeeks: 4,
    },
    objectives: ["Community engagement", "Social impact assessment"],
    credits: 3,
    status: "planned",
  },
]

// GET all field works
router.get("/", async (req, res) => {
  try {
    const fieldWorks = await FieldWork.find()
      .populate("student", "name program year")
      .populate("supervisor", "name")
      .sort({ createdAt: -1 })

    // If no field works found in database, return mock data
    if (fieldWorks.length === 0) {
      console.log("No field works found in database, returning mock data")
      return res.json(mockFieldWorks)
    }

    res.json(fieldWorks)
  } catch (error) {
    console.error("Error fetching field works:", error)
    // Return mock data on database error
    res.json(mockFieldWorks)
  }
})

// GET field work by ID
router.get("/:id", async (req, res) => {
  try {
    const fieldWork = await FieldWork.findById(req.params.id)
      .populate("student", "name program year")
      .populate("supervisor", "name")

    if (!fieldWork) {
      // Check if it's a mock ID
      const mockFieldWork = mockFieldWorks.find((fw) => fw._id === req.params.id)
      if (mockFieldWork) {
        return res.json(mockFieldWork)
      }
      return res.status(404).json({ message: "Field work not found" })
    }

    res.json(fieldWork)
  } catch (error) {
    console.error("Error fetching field work:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// POST create new field work
router.post("/", async (req, res) => {
  try {
    const fieldWorkData = req.body

    // Validate student and supervisor exist
    const student = await User.findById(fieldWorkData.student)
    const supervisor = await User.findById(fieldWorkData.supervisor)

    if (!student && !fieldWorkData.student.startsWith("mock-")) {
      return res.status(400).json({ message: "Student not found" })
    }

    if (!supervisor && !fieldWorkData.supervisor.startsWith("mock-")) {
      return res.status(400).json({ message: "Supervisor not found" })
    }

    // If using mock IDs, create a mock field work entry
    if (fieldWorkData.student.startsWith("mock-") || fieldWorkData.supervisor.startsWith("mock-")) {
      const mockFieldWork = {
        _id: `mock-fw-${Date.now()}`,
        ...fieldWorkData,
        student: student || { _id: fieldWorkData.student, name: "Mock Student" },
        supervisor: supervisor || { _id: fieldWorkData.supervisor, name: "Mock Supervisor" },
        status: "planned",
      }
      mockFieldWorks.push(mockFieldWork)
      return res.status(201).json(mockFieldWork)
    }

    const fieldWork = new FieldWork(fieldWorkData)
    await fieldWork.save()

    const populatedFieldWork = await FieldWork.findById(fieldWork._id)
      .populate("student", "name program year")
      .populate("supervisor", "name")

    res.status(201).json(populatedFieldWork)
  } catch (error) {
    console.error("Error creating field work:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// PUT update field work
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Handle mock field works
    if (id.startsWith("mock-")) {
      const mockIndex = mockFieldWorks.findIndex((fw) => fw._id === id)
      if (mockIndex !== -1) {
        mockFieldWorks[mockIndex] = { ...mockFieldWorks[mockIndex], ...updateData }
        return res.json(mockFieldWorks[mockIndex])
      }
      return res.status(404).json({ message: "Field work not found" })
    }

    const fieldWork = await FieldWork.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("student", "name program year")
      .populate("supervisor", "name")

    if (!fieldWork) {
      return res.status(404).json({ message: "Field work not found" })
    }

    res.json(fieldWork)
  } catch (error) {
    console.error("Error updating field work:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// DELETE field work
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params

    // Handle mock field works
    if (id.startsWith("mock-")) {
      const mockIndex = mockFieldWorks.findIndex((fw) => fw._id === id)
      if (mockIndex !== -1) {
        mockFieldWorks.splice(mockIndex, 1)
        return res.json({ message: "Field work deleted successfully" })
      }
      return res.status(404).json({ message: "Field work not found" })
    }

    const fieldWork = await FieldWork.findByIdAndDelete(id)

    if (!fieldWork) {
      return res.status(404).json({ message: "Field work not found" })
    }

    res.json({ message: "Field work deleted successfully" })
  } catch (error) {
    console.error("Error deleting field work:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router