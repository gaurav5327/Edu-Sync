import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import axios from "axios"
import ScheduleDisplay from "./ScheduleDisplay"
import { API_BASE_URL } from "../config"

const API_URL = `${API_BASE_URL}/schedule`

const YEARS = [1, 2, 3, 4]
const BRANCHES = ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"]
const DIVISIONS = ["A", "B", "C"]

export default function SchedulePage() {
  const [schedule, setSchedule] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const searchParams = useSearchParams()[0]
  const navigate = useNavigate()

  const year = searchParams.get("year") ? Number(searchParams.get("year")) : YEARS[0]
  const branch = searchParams.get("branch") || BRANCHES[0]
  const division = searchParams.get("division") || DIVISIONS[0]

  useEffect(() => {
    fetchSchedule(year, branch, division)
  }, [year, branch, division])

  const fetchSchedule = async (y, b, d) => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/latest`, {
        params: { year: y, branch: b, division: d },
      })
      setSchedule(response.data)
      setError("")
    } catch (error) {
      console.error("Error fetching schedule:", error)
      setError("Failed to fetch schedule. Please try again later.")
      setSchedule(null)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilters = (y, b, d) => {
    const sp = new URLSearchParams()
    sp.set("year", String(y))
    sp.set("branch", b)
    sp.set("division", d)
    navigate(`/schedule?${sp.toString()}`, { replace: true })
  }

  const conflictCount = useMemo(() => {
    if (!schedule?.timetable) return 0
    let count = 0
    for (let i = 0; i < schedule.timetable.length; i++) {
      for (let j = i + 1; j < schedule.timetable.length; j++) {
        const a = schedule.timetable[i]
        const b = schedule.timetable[j]
        if (a.day === b.day && a.startTime === b.startTime) {
          if (a.room?._id === b.room?._id) count++
          if (a.course?.instructor?._id === b.course?.instructor?._id) count++
        }
      }
    }
    return count
  }, [schedule])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
        <h2 className="text-lg font-semibold mb-3">Filters</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              defaultValue={year}
              onChange={(e) => handleApplyFilters(Number(e.target.value), branch, division)}
              className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <select
              defaultValue={branch}
              onChange={(e) => handleApplyFilters(year, e.target.value, division)}
              className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
            <select
              defaultValue={division}
              onChange={(e) => handleApplyFilters(year, branch, e.target.value)}
              className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          {schedule && (
            <div className="ml-auto text-sm text-gray-600">
              Conflicts detected:{" "}
              <span className={conflictCount > 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                {conflictCount}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Schedule content and status */}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading && <div>Loading schedule...</div>}
      {!loading && schedule && (
        <>
          <h1 className="text-2xl font-bold mb-4">
            Schedule for Year {year} - {branch} - Division {division}
          </h1>
          <ScheduleDisplay schedule={schedule} year={year} branch={branch} />
        </>
      )}
    </div>
  )
}
