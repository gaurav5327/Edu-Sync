import XLSX from "xlsx"

export function timetableToExcelBuffer(schedule) {
    const rows = (schedule?.timetable || []).map((row) => ({
        Day: row.day,
        Time: row.startTime,
        Course: row.course?.name || row.course?.code || "",
        Code: row.course?.code || "",
        Instructor: row.course?.instructor?.name || "",
        Room: row.room?.name || "",
        LectureType: row.course?.lectureType || "",
    }))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(rows)
    XLSX.utils.book_append_sheet(wb, ws, "Timetable")
    return XLSX.write(wb, { type: "buffer", bookType: "xlsx" })
}