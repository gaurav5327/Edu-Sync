import { useState } from "react"
import axios from "axios"

const API_URL = "http://localhost:3000/api/schedule"
const YEARS = [1, 2, 3, 4]
const BRANCHES = ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"]
const DIVISIONS = ["A", "B", "C"]

export default function ConflictViewer() {
  const [year, setYear] = useState(1)
  const [branch, setBranch] = useState(BRANCHES[0])
  const [division, setDivision] = useState(DIVISIONS[0])
  const [conflicts, setConflicts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const detectConflicts = (tt) => {
    const out = []
    for (let i = 0; i < tt.length; i++) {
      for (let j = i + 1; j < tt.length; j++) {
        const a = tt[i]
        const b = tt[j]
        if (a.day === b.day && a.startTime === b.startTime) {
          if (a.room?._id === b.room?._id) out.push({ type: "room", a, b })
          if (a.course?.instructor?._id === b.course?.instructor?._id) out.push({ type: "instructor", a, b })
        }
      }
    }
    return out
  }

  const fetchLatest = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${API_URL}/latest`, { params: { year, branch, division } })
      const list = detectConflicts(data?.timetable || [])
      setConflicts(list)
      setError("")
    } catch (e) {
      console.error(e)
      setError("Failed to fetch timetable")
      setConflicts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Conflict Viewer</h1>
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-wrap gap-4">
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="border rounded p-2">
          {YEARS.map((y) => (
            <option key={y} value={y}>
              Year {y}
            </option>
          ))}
        </select>
        <select value={branch} onChange={(e) => setBranch(e.target.value)} className="border rounded p-2">
          {BRANCHES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <select value={division} onChange={(e) => setDivision(e.target.value)} className="border rounded p-2">
          {DIVISIONS.map((d) => (
            <option key={d} value={d}>
              Division {d}
            </option>
          ))}
        </select>
        <button onClick={fetchLatest} className="bg-indigo-600 text-white rounded px-3 py-2">
          Analyze
        </button>
      </div>
      {loading && <div>Analyzing...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {conflicts.length === 0 && !loading ? (
        <div className="text-gray-600">No conflicts detected.</div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold mb-2">Detected Conflicts ({conflicts.length})</h2>
          <ul className="space-y-2">
            {conflicts.map((c, idx) => (
              <li key={idx} className="text-sm">
                <span className="font-medium capitalize">{c.type} conflict</span> on {c.a.day} at {c.a.startTime}{" "}
                between{" "}
                <span className="text-gray-700">
                  {c.a.course?.name || "Course A"} (Room {c.a.room?.name || "?"})
                </span>{" "}
                and{" "}
                <span className="text-gray-700">
                  {c.b.course?.name || "Course B"} (Room {c.b.room?.name || "?"})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
