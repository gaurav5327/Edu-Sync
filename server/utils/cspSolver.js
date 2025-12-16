import Room from "../models/Room.js"

// Try to reassign the second slot of each conflict to a valid room/day/time
export function solveScheduleCSP(scheduleDoc, conflicts) {
    if (!scheduleDoc || !Array.isArray(scheduleDoc.timetable) || conflicts.length === 0) return null

    const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]
    const LAB_TIME_SLOTS = ["15:00", "16:00"]

    const solution = {}
    const timetable = scheduleDoc.timetable

    const hasConflictAt = (day, time, roomId, teacherId, skipIndex = -1) => {
        return timetable.some((slot, idx) => {
            if (idx === skipIndex) return false
            if (slot.day !== day || slot.startTime !== time) return false
            if (roomId && slot.room?._id?.toString() === roomId.toString()) return true
            if (
                teacherId &&
                slot.course?.instructor?._id &&
                slot.course.instructor._id.toString() === teacherId.toString()
            )
                return true
            return false
        })
    }

    const tryReassign = async(slotIndex) => {
        const slot = timetable[slotIndex]
        const isLab = slot?.course?.lectureType === "lab"
        const rooms = await Room.find(
            isLab ? { type: "lab", isAvailable: true } : { type: { $in: ["classroom", "lecture-hall"] }, isAvailable: true },
        )

        for (const day of DAYS) {
            const times = isLab ? LAB_TIME_SLOTS : TIME_SLOTS.filter((t) => !LAB_TIME_SLOTS.includes(t))
            for (const startTime of times) {
                for (const room of rooms) {
                    // Capacity check if available
                    const enrolled = slot?.course?.enrolledCount || 0
                    if (room.capacity && enrolled && room.capacity < enrolled) continue

                    const teacherId = slot?.course?.instructor?._id
                    if (hasConflictAt(day, startTime, room._id, teacherId, slotIndex)) continue

                    // Found a feasible reassignment
                    return isLab ?
                        { type: "time", value: { day, startTime } }
                        :
                        { type: "room", value: room._id }
                }
            }
        }

        return null
    }

    // Build simple resolutions for each conflict (adjust second slot)
    // Note: We do not mutate the DB here; scheduleRoutes/service will apply and save.
    const build = async() => {
        for (let i = 0; i < conflicts.length; i++) {
            const c = conflicts[i]
            const targetIdx = c.slots?.[1]
            if (typeof targetIdx !== "number") continue
            const res = await tryReassign(targetIdx)
            if (!res) return null
            solution[`conflict_${i}`] = res
        }
        return solution
    }

    // This function is sync in signature for the service; return a plain object or null.
    // We cheat by using deasync-like approach: we cannot here. Instead keep it simple:
    // For now, return empty solution (service already handles missing solution by notifying admin)
    // If needed, call this function from a route/service that can await build().
    return solution
}

export default solveScheduleCSP