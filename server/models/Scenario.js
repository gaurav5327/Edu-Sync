import mongoose from "mongoose"

const scenarioSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    baseScenario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scenario",
      required: false,
    },
    parameters: {
      semester: {
        type: String,
        default: "Fall 2024",
      },
      academicYear: {
        type: String,
        default: "2024-25",
      },
      programs: [
        {
          type: String,
          enum: ["FYUP", "B.Ed.", "M.Ed.", "ITEP"],
        },
      ],
      constraints: {
        maxDailyHours: {
          type: Number,
          default: 8,
        },
        lunchBreakDuration: {
          type: Number,
          default: 60,
        },
        facultyMaxLoad: {
          type: Number,
          default: 20,
        },
        roomUtilization: {
          type: Number,
          default: 85,
        },
      },
    },
    modifications: [
      {
        type: {
          type: String,
          enum: ["add_course", "remove_course", "change_faculty", "change_room", "change_time"],
        },
        target: String,
        changes: mongoose.Schema.Types.Mixed,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "generated", "approved", "archived"],
      default: "draft",
    },
    metrics: {
      conflictCount: {
        type: Number,
        default: 0,
      },
      roomUtilization: {
        type: Number,
        default: 0,
      },
      facultyWorkload: {
        type: Number,
        default: 0,
      },
      studentSatisfaction: {
        type: Number,
        default: 0,
      },
    },
    generatedSchedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: false,
    },
  },
  {
    timestamps: true,
  },
)

const Scenario = mongoose.model("Scenario", scenarioSchema)

export default Scenario