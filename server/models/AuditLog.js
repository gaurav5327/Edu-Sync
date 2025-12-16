import mongoose from "mongoose"

const AuditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // e.g., generate, simulate, publish, import
    entityType: { type: String, required: true }, // schedule, course, room, user
    entityId: { type: mongoose.Schema.Types.ObjectId, required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, required: false, ref: "User" },
    metadata: { type: Object, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema)
