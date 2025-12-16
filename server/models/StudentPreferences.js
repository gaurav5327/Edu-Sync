// New model: server/models/StudentPreferences.js
const StudentPreferenceSchema = new mongoose.Schema({
  studentId: { type: ObjectId, ref: "Student", required: true },
  preferences: {
    preferredTimeSlots: [{ type: String }],
    preferredDays: [{ type: String }],
    subjectPreferences: [{ type: String }],
    instructorPreferences: [{ type: ObjectId, ref: "User" }],
    roomPreferences: [{ type: ObjectId, ref: "Room" }]
  },
  behaviorPatterns: {
    attendanceRate: { type: Number, default: 0 },
    performanceByTime: { type: Object },
    performanceByInstructor: { type: Object },
    performanceBySubject: { type: Object }
  },
  feedbackHistory: [{
    courseId: { type: ObjectId, ref: "Course" },
    rating: { type: Number, min: 1, max: 5 },
    comments: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
});