import mongoose from "mongoose"

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, index: true, unique: true, sparse: true },
    program: { type: String, enum: ["FYUP", "B.Ed.", "M.Ed.", "ITEP"], required: true },
    year: { type: Number, required: true },
    branch: { type: String, required: true },
    division: { type: String, required: true },
    selectedElectives: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    enrolledCredits: { type: Number, default: 0 },
    rollNo: { type: String },
    creditDistribution: {
      major: { type: Number, default: 0 },
      minor: { type: Number, default: 0 },
      sec: { type: Number, default: 0 }, // Skill Enhancement Courses
      aec: { type: Number, default: 0 }, // Ability Enhancement Courses
      vac: { type: Number, default: 0 }, // Value Added Courses
      core: { type: Number, default: 0 },
    },
    multidisciplinaryChoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    academicProgress: [
      {
        semester: { type: Number },
        creditsCompleted: { type: Number },
        gpa: { type: Number },
        courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
      },
    ],
    careerInterests: [{ type: String }],
    skillsAcquired: [{ type: String }],
    internshipRecords: [
      {
        organization: { type: String },
        duration: { type: String },
        skills: [{ type: String }],
        credits: { type: Number },
      },
    ],
  },
  { timestamps: true },
)

export default mongoose.models.Student || mongoose.model("Student", StudentSchema)
