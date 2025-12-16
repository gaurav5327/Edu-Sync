"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import ScheduleDisplay from "./ScheduleDisplay"
import {
  Calendar,
  Clock,
  Eye,
  Trash2,
  Building,
  Filter,
  CheckCircle,
  AlertTriangle,
  Loader2,
  X,
  Sparkles
} from "lucide-react"
import { API_BASE_URL } from "../config"

const API_URL = `${API_BASE_URL}/schedule`

const YEARS = [1, 2, 3, 4]
const BRANCHES = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
]
const DIVISIONS = ["A", "B", "C"]

function TimetableManager() {
  const [timetables, setTimetables] = useState([])
  const [selectedYear, setSelectedYear] = useState(1)
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0])
  const [selectedDivision, setSelectedDivision] = useState(DIVISIONS[0])
  const [selectedTimetable, setSelectedTimetable] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTimetables()
  }, [selectedYear, selectedBranch, selectedDivision])

  const fetchTimetables = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/timetables`, {
        params: {
          year: selectedYear,
          branch: selectedBranch,
          division: selectedDivision,
        },
      })
      setTimetables(response.data)
      setError("")
    } catch (error) {
      console.error("Error fetching timetables:", error)
      setError("Error fetching timetables. Please try again later.")
      setTimetables([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewTimetable = (timetable) => {
    setSelectedTimetable(timetable)
  }

  const handleDeleteTimetable = async (timetableId) => {
    if (!window.confirm("Are you sure you want to delete this timetable?")) {
      return
    }

    try {
      await axios.delete(`${API_URL}/timetables/${timetableId}`)
      fetchTimetables()
      if (selectedTimetable && selectedTimetable._id === timetableId) {
        setSelectedTimetable(null)
      }
    } catch (error) {
      console.error("Error deleting timetable:", error)
      setError("Error deleting timetable. Please try again.")
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl">
          <Clock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Timetable Manager
          </h2>
          <p className="text-gray-600 text-sm">View and manage all timetables</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter Timetables</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  Year {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {BRANCHES.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Division</label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {DIVISIONS.map((division) => (
                <option key={division} value={division}>
                  Division {division}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-pulse" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Timetables List */}
          {timetables.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-blue-200">
              <div className="bg-gradient-to-r from-gray-100 to-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Timetables Found</h3>
              <p className="text-gray-600">No timetables found for the selected criteria.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Year
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Branch
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Division
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {timetables.map((timetable) => (
                      <tr key={timetable._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                          {timetable._id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          Year {timetable.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {timetable.branch}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          Division {timetable.division}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(timetable.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewTimetable(timetable)}
                              className="group flex items-center space-x-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                            >
                              <Eye className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300" />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => handleDeleteTimetable(timetable._id)}
                              className="group flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                            >
                              <Trash2 className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Selected Timetable Modal */}
          {selectedTimetable && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Selected Timetable</h3>
                    </div>
                    <button
                      onClick={() => setSelectedTimetable(null)}
                      className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-8">
                  <ScheduleDisplay schedule={selectedTimetable} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TimetableManager