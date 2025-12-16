import mongoose from "mongoose"

const fieldWorkSchema = new mongoose.Schema(
  {
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
    type: {
      type: String,
      enum: ["field_work", "internship", "project", "community_service"],
      default: "field_work",
    },
    organization: {
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      mentor: {
        type: String,
        required: false,
      },
      contact: {
        type: String,
        required: false,
      },
    },
    duration: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      totalWeeks: {
        type: Number,
        default: 0,
      },
    },
    objectives: [
      {
        type: String,
      },
    ],
    credits: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["planned", "ongoing", "completed", "cancelled"],
      default: "planned",
    },
  },
  {
    timestamps: true,
  },
)

const FieldWork = mongoose.model("FieldWork", fieldWorkSchema)

export default FieldWork