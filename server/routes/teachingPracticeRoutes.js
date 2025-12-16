import express from "express"
import mongoose from "mongoose"
import TeachingPractice from "../models/TeachingPractice.js"
import User from "../models/User.js"

const router = express.Router()

// In-memory storage for mock teaching practices
let mockPractices = []
let mockIdCounter = 1

// Get all teaching practices
router.get("/", async (req, res) => {
  try {
    let dbPractices = []
    
    // Get practices from database if connected
    if (mongoose.connection.readyState === 1) {
      try {
        dbPractices = await TeachingPractice.find()
          .populate("student", "name email year division department role")
          .populate("supervisor", "name email department")
          .sort({ createdAt: -1 })
      } catch (error) {
        console.error("Error fetching from database:", error)
      }
    }
    
    // Combine database practices with mock practices
    const allPractices = [...dbPractices, ...mockPractices]
    res.json(allPractices)
  } catch (error) {
    console.error("Error fetching teaching practices:", error)
    res.json(mockPractices) // Return at least mock practices
  }
})

// Get a specific teaching practice
router.get("/:id", async (req, res) => {
  try {
    const practice = await TeachingPractice.findById(req.params.id)
      .populate("student", "name email rollNo year branch division program")
      .populate("supervisor", "name email department")
    
    if (!practice) {
      return res.status(404).json({ message: "Teaching practice not found" })
    }
    
    res.json(practice)
  } catch (error) {
    console.error("Error fetching teaching practice:", error)
    res.status(500).json({ message: error.message })
  }
})

// Create a new teaching practice
router.post("/", async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database connection unavailable" })
    }

    const {
      student,
      supervisor,
      school,
      practiceType,
      subject,
      grade,
      totalHours,
      schedule
    } = req.body

    // Validate required fields
    if (!student || !supervisor || !school?.name || !school?.address || !practiceType || !subject || !grade || !totalHours) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Validate student exists
    let studentExists = null
    try {
      studentExists = await User.findOne({ _id: student, role: "student" })
    } catch (error) {
      // If it's a mock ID or invalid ObjectId, we'll handle it below
    }
    
    if (!studentExists && !student.startsWith("student")) {
      return res.status(400).json({ message: "Student not found" })
    }

    // Validate supervisor exists and is a teacher
    let supervisorExists = null
    try {
      supervisorExists = await User.findById(supervisor)
    } catch (error) {
      // If it's a mock ID or invalid ObjectId, we'll handle it below
    }
    
    if (!supervisorExists && !supervisor.startsWith("teacher")) {
      return res.status(400).json({ message: "Supervisor not found" })
    }
    
    if (supervisorExists && supervisorExists.role !== "teacher") {
      return res.status(400).json({ message: "Supervisor must be a valid teacher" })
    }

    // Check if we're dealing with mock data
    const isUsingMockData = student.startsWith("student") || supervisor.startsWith("teacher")
    
    if (isUsingMockData) {
      // Create mock practice
      const mockPractice = {
        _id: `mock_practice_${mockIdCounter++}`,
        student: student.startsWith("student") ? {
          _id: student,
          name: student === "student1" ? "Alice Johnson" : student === "student2" ? "Bob Wilson" : "Carol Davis",
          email: student === "student1" ? "alice.johnson@student.edu" : student === "student2" ? "bob.wilson@student.edu" : "carol.davis@student.edu",
          rollNo: student === "student1" ? "BED001" : student === "student2" ? "MED001" : "BED002",
          year: student === "student1" ? 2 : student === "student2" ? 1 : 3,
          branch: "Education",
          division: student === "student1" ? "A" : student === "student2" ? "B" : "A",
          program: student === "student1" ? "B.Ed." : student === "student2" ? "M.Ed." : "B.Ed."
        } : studentExists,
        supervisor: supervisor.startsWith("teacher") ? {
          _id: supervisor,
          name: supervisor === "teacher1" ? "Dr. John Smith" : supervisor === "teacher2" ? "Prof. Sarah Johnson" : "Dr. Michael Brown",
          email: supervisor === "teacher1" ? "john.smith@university.edu" : supervisor === "teacher2" ? "sarah.johnson@university.edu" : "michael.brown@university.edu",
          department: "Education"
        } : supervisorExists,
        school,
        practiceType,
        subject,
        grade,
        totalHours,
        completedHours: 0,
        schedule: schedule || [],
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      mockPractices.push(mockPractice)
      return res.status(201).json(mockPractice)
    }

    // Create real practice in database
    const newPractice = new TeachingPractice({
      student,
      supervisor,
      school,
      practiceType,
      subject,
      grade,
      totalHours,
      schedule: schedule || [],
      status: "pending"
    })

    const savedPractice = await newPractice.save()
    
    // Populate the response
    const populatedPractice = await TeachingPractice.findById(savedPractice._id)
      .populate("student", "name email year division department role")
      .populate("supervisor", "name email department")
    
    res.status(201).json(populatedPractice)
  } catch (error) {
    console.error("Error creating teaching practice:", error)
    res.status(500).json({ message: error.message })
  }
})

// Update a teaching practice
router.put("/:id", async (req, res) => {
  try {
    const {
      student,
      supervisor,
      school,
      practiceType,
      subject,
      grade,
      totalHours,
      schedule,
      status,
      completedHours
    } = req.body

    // Validate student exists if provided
    if (student) {
      const studentExists = await Student.findById(student)
      if (!studentExists) {
        return res.status(400).json({ message: "Student not found" })
      }
    }

    // Validate supervisor exists and is a teacher if provided
    if (supervisor) {
      const supervisorExists = await User.findById(supervisor)
      if (!supervisorExists || supervisorExists.role !== "teacher") {
        return res.status(400).json({ message: "Supervisor must be a valid teacher" })
      }
    }

    const updatedPractice = await TeachingPractice.findByIdAndUpdate(
      req.params.id,
      {
        ...(student && { student }),
        ...(supervisor && { supervisor }),
        ...(school && { school }),
        ...(practiceType && { practiceType }),
        ...(subject && { subject }),
        ...(grade && { grade }),
        ...(totalHours !== undefined && { totalHours }),
        ...(schedule && { schedule }),
        ...(status && { status }),
        ...(completedHours !== undefined && { completedHours }),
        updatedAt: Date.now()
      },
      { new: true }
    )
      .populate("student", "name email rollNo year branch division program")
      .populate("supervisor", "name email department")

    if (!updatedPractice) {
      return res.status(404).json({ message: "Teaching practice not found" })
    }

    res.json(updatedPractice)
  } catch (error) {
    console.error("Error updating teaching practice:", error)
    res.status(500).json({ message: error.message })
  }
})

// Delete a teaching practice
router.delete("/:id", async (req, res) => {
  try {
    const deletedPractice = await TeachingPractice.findByIdAndDelete(req.params.id)
    
    if (!deletedPractice) {
      return res.status(404).json({ message: "Teaching practice not found" })
    }
    
    res.json({ message: "Teaching practice deleted successfully" })
  } catch (error) {
    console.error("Error deleting teaching practice:", error)
    res.status(500).json({ message: error.message })
  }
})

export default router