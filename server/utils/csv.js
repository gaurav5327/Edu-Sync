export function parseCSV(csvText) {
    // Accepts a UTF-8 CSV string with header row
    const lines = csvText
        .replace(/\r\n/g, "\n")
        .split("\n")
        .filter((l) => l.trim().length > 0)
    if (lines.length === 0) return { headers: [], rows: [] }
    const headers = splitCSVLine(lines[0]).map((h) => h.trim())
    const rows = lines.slice(1).map((line) => {
        const cols = splitCSVLine(line)
        const obj = {}
        headers.forEach((h, i) => (obj[h] = (cols[i] ?? "").trim()))
        return obj
    })
    return { headers, rows }
}

function splitCSVLine(line) {
    const out = []
    let cur = ""
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
        const ch = line[i]
        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
                cur += '"'
                i++
            } else {
                inQuotes = !inQuotes
            }
        } else if (ch === "," && !inQuotes) {
            out.push(cur)
            cur = ""
        } else {
            cur += ch
        }
    }
    out.push(cur)
    return out
}

// Common helpers
export function parseIntList(val) {
    if (!val) return []
    return val
        .split(/[,|; ]+/)
        .map((v) => Number.parseInt(v, 10))
        .filter((n) => Number.isFinite(n))
}

export function normalizeProgram(p) {
    const map = new Map([
        ["fyup", "FYUP"],
        ["b.ed.", "B.Ed."],
        ["bed", "B.Ed."],
        ["m.ed.", "M.Ed."],
        ["med", "M.Ed."],
        ["itep", "ITEP"],
    ])
    const key = String(p || "")
        .toLowerCase()
        .trim()
    return map.get(key) || "FYUP"
}