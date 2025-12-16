import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import scheduleRoutes from "./routes/scheduleRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import integrationAPI from "./routes/integrationAPI.js"
import teachingPracticeRoutes from "./routes/teachingPracticeRoutes.js"
import studentRoutes from "./routes/studentRoutes.js"
import fieldWorkRoutes from "./routes/fieldWorkRoutes.js"
import scenarioRoutes from "./routes/scenarioRoutes.js"
import exportRoutes from "./routes/exportRoutes.js"
import courseRoutes from "./routes/courseRoutes.js"
import timetableRoutes from "./routes/timetableRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Configure CORS
app.use(
  cors({
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Middleware
app.use(express.json())

// Check for required environment variables
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI environment variable is required")
  process.exit(1)
}

if (!process.env.ADMIN_ID) {
  console.error("ADMIN_ID environment variable is required")
  process.exit(1)
}

// Connect to MongoDB with graceful error handling
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB")

    // Ensure indexes are properly set up
    try {
      const collection = mongoose.connection.collection("courses")
      const indexes = await collection.indexes()

      // Check if we have the simple code index that needs to be dropped
      const codeIndex = indexes.find(
        (index) => index.key && Object.keys(index.key).length === 1 && index.key.code === 1 && index.unique === true,
      )

      if (codeIndex) {
        console.log("Found simple unique code index. Dropping it...")
        await collection.dropIndex(codeIndex.name)
        console.log("Simple code index dropped")

        // Create the compound index
        console.log("Creating compound index")
        await collection.createIndex(
          { code: 1, lectureType: 1, division: 1, year: 1, branch: 1 },
          { unique: true, background: true },
        )
        console.log("Compound index created")
      }
    } catch (error) {
      console.error("Error checking/fixing indexes:", error)
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    console.log("Server will continue running without database connection...")
    console.log("API endpoints will return mock data for testing purposes")
  })

// Routes
app.use("/api/schedule", scheduleRoutes)
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/teaching-practices", teachingPracticeRoutes)
app.use("/api/students", studentRoutes)
app.use("/api/field-works", fieldWorkRoutes)
app.use("/api/scenarios", scenarioRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/timetables", timetableRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api", exportRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" })
})

// Root route for testing
app.get("/", (req, res) => {
  res.send("Server is running")
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
