import mongoose from "mongoose"

const PracticumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    program: { type: String, enum: ["FYUP", "B.Ed.", "M.Ed.", "ITEP"], required: true },
    year: { type: Number, required: true },
    branch: { type: String, required: true },
    division: { type: String, required: true },
    // recurring weekly pattern
    days: [{ type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], required: true }],
    timeSlots: [{ type: String, enum: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"] }],
    // involved teachers or supervisors (optional)
    instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    location: { type: String },
}, { timestamps: true }, )

export default mongoose.models.Practicum || mongoose.model("Practicum", PracticumSchema)