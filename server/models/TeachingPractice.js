import mongoose from "mongoose"

const teachingPracticeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  school: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: String,
    },
    phone: {
      type: String,
    },
  },
  practiceType: {
    type: String,
    enum: ["observation", "assisted_teaching", "independent_teaching", "internship"],
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  totalHours: {
    type: Number,
    required: true,
    min: 0,
  },
  completedHours: {
    type: Number,
    default: 0,
    min: 0,
  },
  schedule: [{
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    activity: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  }],
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

teachingPracticeSchema.pre("save", function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.model("TeachingPractice", teachingPracticeSchema)