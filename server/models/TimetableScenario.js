import mongoose from "mongoose"

const TimetableScenarioSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    baseScenario: { type: mongoose.Schema.Types.ObjectId, ref: "TimetableScenario" },
    parameters: {
      semester: { type: String, required: true },
      academicYear: { type: String, required: true },
      programs: [{ type: String, enum: ["FYUP", "B.Ed.", "M.Ed.", "ITEP"] }],
      constraints: {
        maxDailyHours: { type: Number, default: 8 },
        lunchBreakDuration: { type: Number, default: 60 },
        facultyMaxLoad: { type: Number, default: 20 },
        roomUtilization: { type: Number, default: 85 },
      },
    },
    modifications: [
      {
        type: { type: String, enum: ["add_course", "remove_course", "change_faculty", "change_room", "change_time"] },
        target: { type: String }, // course/faculty/room ID
        changes: { type: mongoose.Schema.Types.Mixed },
      },
    ],
    generatedTimetable: { type: mongoose.Schema.Types.Mixed },
    metrics: {
      conflictCount: { type: Number, default: 0 },
      roomUtilization: { type: Number, default: 0 },
      facultyWorkload: { type: Number, default: 0 },
      studentSatisfaction: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ["draft", "generated", "approved", "archived"],
      default: "draft",
    },
  },
  { timestamps: true },
)

export default mongoose.model("TimetableScenario", TimetableScenarioSchema)
