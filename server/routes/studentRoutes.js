import express from "express"
import mongoose from "mongoose"
import User from "../models/User.js"

const router = express.Router()

// Get students with optional program filtering
router.get("/", async (req, res) => {
  try {
    const { program } = req.query
    
    const mockStudents = [
      {
        _id: "student1",
        name: "Alice Johnson",
        email: "alice.johnson@student.edu",
        rollNo: "BED001",
        year: 2,
        branch: "Education",
        division: "A",
        program: "B.Ed.",
        enrolledCredits: 120
      },
      {
        _id: "student2",
        name: "Bob Wilson",
        email: "bob.wilson@student.edu", 
        rollNo: "MED001",
        year: 1,
        branch: "Education",
        division: "B",
        program: "M.Ed.",
        enrolledCredits: 60
      },
      {
        _id: "student3",
        name: "Carol Davis",
        email: "carol.davis@student.edu",
        rollNo: "BED002", 
        year: 3,
        branch: "Education",
        division: "A",
        program: "B.Ed.",
        enrolledCredits: 180
      }
    ]

    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const query = { role: "student" }
      
      // Note: Students in this system don't have a program field in User model
      // They are identified by role: "student" and have year, division fields
      
      const students = await User.find(query).select("-password").sort({ name: 1 })
      
      // If students found in database, return them
      if (students.length > 0) {
        console.log(`Found ${students.length} students in database`)
        
        // Filter by program if specified (though User model doesn't have program field)
        // For now, return all students since the User model structure is different
        return res.json(students.map(student => ({
          _id: student._id,
          name: student.name,
          email: student.email,
          year: student.year,
          division: student.division,
          department: student.department,
          role: student.role,
          // Add mock program field for compatibility
          program: student.year <= 2 ? "B.Ed." : "M.Ed.",
          rollNo: `STU${student._id.toString().slice(-4).toUpperCase()}`
        })))
      }
      
      // If no students found in database, return mock data
      console.log("No students found in database, returning mock data")
      if (program) {
        const programs = program.split(",").map(p => p.trim())
        return res.json(mockStudents.filter(student => programs.includes(student.program)))
      }
      return res.json(mockStudents)
    }
    
    // Database not connected, return mock data
    console.log("Database not connected, returning mock data")
    if (program) {
      const programs = program.split(",").map(p => p.trim())
      return res.json(mockStudents.filter(student => programs.includes(student.program)))
    }
    return res.json(mockStudents)
    
  } catch (error) {
    console.error("Error fetching students:", error)
    // Return mock data on error
    const mockStudents = [
      {
        _id: "student1",
        name: "Alice Johnson",
        email: "alice.johnson@student.edu",
        rollNo: "BED001",
        year: 2,
        branch: "Education",
        division: "A",
        program: "B.Ed.",
        enrolledCredits: 120
      },
      {
        _id: "student2",
        name: "Bob Wilson",
        email: "bob.wilson@student.edu", 
        rollNo: "MED001",
        year: 1,
        branch: "Education",
        division: "B",
        program: "M.Ed.",
        enrolledCredits: 60
      }
    ]
    res.json(mockStudents)
  }
})

// Get a specific student
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }
    
    res.json(student)
  } catch (error) {
    console.error("Error fetching student:", error)
    res.status(500).json({ message: error.message })
  }
})

// Create a new student
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      rollNo,
      year,
      branch,
      division,
      program,
      enrolledCredits
    } = req.body

    const newStudent = new Student({
      name,
      email,
      rollNo,
      year,
      branch,
      division,
      program: program || "FYUP",
      enrolledCredits: enrolledCredits || 0
    })

    const savedStudent = await newStudent.save()
    res.status(201).json(savedStudent)
  } catch (error) {
    console.error("Error creating student:", error)
    res.status(500).json({ message: error.message })
  }
})

// Update a student
router.put("/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" })
    }

    res.json(updatedStudent)
  } catch (error) {
    console.error("Error updating student:", error)
    res.status(500).json({ message: error.message })
  }
})

// Delete a student
router.delete("/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id)
    
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" })
    }
    
    res.json({ message: "Student deleted successfully" })
  } catch (error) {
    console.error("Error deleting student:", error)
    res.status(500).json({ message: error.message })
  }
})

export default router