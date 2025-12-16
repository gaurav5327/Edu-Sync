import PDFDocument from "pdfkit"

export function timetableToPDFBuffer(schedule) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 36 })
            const chunks = []
            doc.on("data", (c) => chunks.push(c))
            doc.on("end", () => resolve(Buffer.concat(chunks)))

            doc.fontSize(16).text("Academic Timetable", { align: "center" })
            doc.moveDown()

            if (schedule?.year) doc.fontSize(10).text(`Year: ${schedule.year}`)
            if (schedule?.branch) doc.text(`Branch: ${schedule.branch}`)
            if (schedule?.division) doc.text(`Division: ${schedule.division}`)
            doc.moveDown()

            doc.fontSize(12).text("Entries:", { underline: true })
            doc.moveDown(0.5)

            const rows = schedule?.timetable || []
            rows.forEach((row, idx) => {
                const day = row.day
                const time = row.startTime
                const course = row.course?.name || row.course?.code || "Course"
                const instructor = row.course?.instructor?.name || "Instructor"
                const room = row.room?.name || "Room"
                doc.fontSize(10).text(`${idx + 1}. ${day} ${time} - ${course} (${instructor}) @ ${room}`)
            })

            doc.end()
        } catch (e) {
            reject(e)
        }
    })
}