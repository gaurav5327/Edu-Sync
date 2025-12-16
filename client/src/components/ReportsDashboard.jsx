import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import ScheduleDisplay from "./ScheduleDisplay"
import {
  BarChart3,
  Users,
  Building,
  Clock,
  TrendingUp,
  FileText,
  Eye,
  Download,
  AlertTriangle,
  CheckCircle,
  Sparkles
} from "lucide-react"
import { API_BASE_URL } from "../config"

const API_URL = `${API_BASE_URL}/schedule`

export default function ReportsDashboard() {
  const [year, setYear] = useState(1)
  const [branch, setBranch] = useState("Computer Science")
  const [division, setDivision] = useState("A")
  const [timetables, setTimetables] = useState([])
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTimetables()
  }, [year, branch, division])

  async function fetchTimetables() {
    setLoading(true)
    try {
      const { data } = await axios.get(`${API_URL}/timetables`, { params: { year, branch, division } })
      setTimetables(data || [])
      setError("")
    } catch (e) {
      console.error(e)
      setError("Failed to load timetables")
      setTimetables([])
    } finally {
      setLoading(false)
    }
  }

  const teacherWorkload = useMemo(() => {
    const map = {}
    for (const tt of timetables) {
      for (const slot of tt.timetable || []) {
        const t = slot?.course?.instructor
        if (!t?._id) continue
        map[t._id] = map[t._id] || { name: t.name || "Unknown", hours: 0 }
        map[t._id].hours += 1
      }
    }
    return Object.values(map).sort((a, b) => b.hours - a.hours)
  }, [timetables])

  const roomUtilization = useMemo(() => {
    const map = {}
    for (const tt of timetables) {
      for (const slot of tt.timetable || []) {
        const r = slot?.room
        if (!r?._id) continue
        map[r._id] = map[r._id] || { name: r.name || "Room", used: 0 }
        map[r._id].used += 1
      }
    }
    return Object.values(map).sort((a, b) => b.used - a.used)
  }, [timetables])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Reports Dashboard
            </h1>
            <p className="text-gray-600">Comprehensive analytics and insights</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Filter Options</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                {[1, 2, 3, 4].map((y) => (
                  <option key={y} value={y}>
                    Year {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                {["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"].map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Division</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                {["A", "B", "C"].map((d) => (
                  <option key={d} value={d}>
                    Division {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-indigo-600 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Analytics Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Teacher Workload */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Teacher Workload</h2>
                <span className="text-sm text-gray-500">(hours per week)</span>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {teacherWorkload.length > 0 ? (
                  teacherWorkload.map((teacher, index) => (
                    <div key={teacher.name} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                            index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                              index === 2 ? 'bg-gradient-to-r from-orange-400 to-red-400' :
                                'bg-gradient-to-r from-blue-400 to-indigo-400'
                          }`}>
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900">{teacher.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-indigo-600">{teacher.hours}</span>
                        <Clock className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No teacher data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Room Utilization */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Room Utilization</h2>
                <span className="text-sm text-gray-500">(slots used)</span>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {roomUtilization.length > 0 ? (
                  roomUtilization.map((room, index) => (
                    <div key={room.name} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                            index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                              index === 2 ? 'bg-gradient-to-r from-orange-400 to-red-400' :
                                'bg-gradient-to-r from-green-400 to-emerald-400'
                          }`}>
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900">{room.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-emerald-600">{room.used}</span>
                        <Building className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Building className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No room data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Timetable Preview */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Timetable Preview</h2>
            </div>

            <div className="flex items-center space-x-3">
              {selected && (
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  Loaded: {selected?._id?.slice(0, 8)}...
                </span>
              )}
              <button
                onClick={() => setSelected(timetables[0] || null)}
                disabled={!timetables.length}
                className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span>Load Latest</span>
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            {selected ? (
              <ScheduleDisplay schedule={selected} />
            ) : (
              <div className="text-center py-12">
                <div className="bg-gradient-to-r from-gray-100 to-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Timetable Selected</h3>
                <p className="text-gray-600">Click "Load Latest" to view the most recent timetable</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}