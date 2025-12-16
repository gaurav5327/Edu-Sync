"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { logout, getCurrentUser } from "../utils/auth"
import { 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  User,
  FileText,
  Send,
  X,
  Loader2,
  GraduationCap,
  Building,
  Sparkles
} from "lucide-react"

const API_URL = "http://localhost:3000/api/schedule"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const TIME_SLOTS = [
  { value: "09:00", label: "09:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "01:00 PM" },
  { value: "14:00", label: "02:00 PM" },
  { value: "15:00", label: "03:00 PM" },
  { value: "16:00", label: "04:00 PM" },
]

function TeacherDashboard() {
  const user = getCurrentUser()
  const [teacherData, setTeacherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [courses, setCourses] = useState([])
  const [schedules, setSchedules] = useState([])
  const [activeTab, setActiveTab] = useState("schedules")
  const [dataFetched, setDataFetched] = useState(false)

  // For absence reporting
  const [absenceData, setAbsenceData] = useState({
    date: "",
    reason: "",
  })

  // For schedule change request
  const [showScheduleChangeForm, setShowScheduleChangeForm] = useState(false)
  const [scheduleChangeData, setScheduleChangeData] = useState({
    day: DAYS[0],
    timeSlot: TIME_SLOTS[0].value,
    reason: "",
  })

  useEffect(() => {
    if (user && !dataFetched) {
      setDataFetched(true)
      fetchData()
    }
  }, [user, dataFetched])

  const fetchData = async () => {
    setLoading(true)
    setError("")

    try {
      const [teacherResponse, coursesResponse, schedulesResponse] =
        await Promise.all([
          axios.get(`${API_URL}/teachers/${user.id}`),
          axios.get(`${API_URL}/teacher-courses/${user.id}`),
          axios.get(`${API_URL}/teacher-schedules/${user.id}`),
        ])

      setTeacherData(teacherResponse.data)
      setCourses(coursesResponse.data)
      setSchedules(schedulesResponse.data)
    } catch (error) {
      console.error("Error fetching teacher data:", error)
      setError("Error fetching your data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleAbsenceChange = (e) => {
    const { name, value } = e.target
    setAbsenceData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAbsenceSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      await axios.post(`${API_URL}/teacher-absence`, {
        teacherId: user.id,
        ...absenceData,
      })
      setSuccess("Absence reported successfully!")
      setAbsenceData({
        date: "",
        reason: "",
      })
    } catch (error) {
      console.error("Error reporting absence:", error)
      setError("Error reporting absence. Please try again.")
    }
  }

  const handleScheduleChangeDataChange = (e) => {
    const { name, value } = e.target
    setScheduleChangeData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleScheduleChangeSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      await axios.post(`${API_URL}/schedule-change-request`, {
        teacherId: user.id,
        teacherName: user.name,
        ...scheduleChangeData,
      })
      setSuccess("Schedule change request submitted successfully!")
      setShowScheduleChangeForm(false)
      setScheduleChangeData({
        day: DAYS[0],
        timeSlot: TIME_SLOTS[0].value,
        reason: "",
      })
    } catch (error) {
      console.error("Error submitting schedule change request:", error)
      setError("Error submitting request. Please try again.")
    }
  }

  const handleRetryFetch = () => {
    setDataFetched(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 text-lg">Loading teacher data...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "absence", label: "Report Absence", icon: AlertTriangle },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "schedules", label: "My Schedules", icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white/90 backdrop-blur-lg shadow-2xl border-r border-white/20 flex flex-col">
        {/* Sidebar Header */}
        <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-transparent to-cyan-400/20"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-violet-500/10 to-emerald-400/20"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-20 h-20 bg-white/5 rounded-full -translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/5 rounded-full translate-x-8 translate-y-8"></div>
          
          <div className="relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Teacher Portal</h1>
                <p className="text-blue-100 text-sm">Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <span className="text-white text-sm font-medium truncate">
                {user?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full group flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${
                  activeTab === tab.id ? 'rotate-12' : 'group-hover:rotate-12'
                }`} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full group flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-300"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {tabs.find(tab => tab.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <p className="text-gray-600 text-sm mt-1">Manage your courses and schedule</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                <span className="text-red-700">{error}</span>
              </div>
              <button
                onClick={handleRetryFetch}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-all duration-200 hover:scale-105"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
              <span className="text-green-700">{success}</span>
            </div>
          </div>
        )}

          {/* Tab Content */}
          {activeTab === "absence" && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Report Absence
                </h2>
                <p className="text-gray-600 text-sm">Notify administration about your absence</p>
              </div>
            </div>

            <form onSubmit={handleAbsenceSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="date" className="block text-sm font-semibold text-gray-700">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date of Absence
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={absenceData.date}
                    onChange={handleAbsenceChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="reason" className="block text-sm font-semibold text-gray-700">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Reason for Absence
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={absenceData.reason}
                  onChange={handleAbsenceChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  rows="4"
                  placeholder="Please provide details about your absence..."
                  required
                />
              </div>

              <button
                type="submit"
                className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Send className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span>Submit Absence Report</span>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowScheduleChangeForm(true)}
                className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Settings className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span>Request Schedule Change</span>
              </button>
            </div>

            {/* Schedule Change Form Modal */}
            {showScheduleChangeForm && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white flex items-center">
                        <Settings className="w-6 h-6 mr-2" />
                        Request Schedule Change
                      </h3>
                      <button
                        onClick={() => setShowScheduleChangeForm(false)}
                        className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-8">
                    <form onSubmit={handleScheduleChangeSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="day" className="block text-sm font-semibold text-gray-700">
                            Day
                          </label>
                          <select
                            id="day"
                            name="day"
                            value={scheduleChangeData.day}
                            onChange={handleScheduleChangeDataChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            required
                          >
                            {DAYS.map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="timeSlot" className="block text-sm font-semibold text-gray-700">
                            Time Slot
                          </label>
                          <select
                            id="timeSlot"
                            name="timeSlot"
                            value={scheduleChangeData.timeSlot}
                            onChange={handleScheduleChangeDataChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            required
                          >
                            {TIME_SLOTS.map((slot) => (
                              <option key={slot.value} value={slot.value}>
                                {slot.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="changeReason" className="block text-sm font-semibold text-gray-700">
                          Reason for Schedule Change
                        </label>
                        <textarea
                          id="changeReason"
                          name="reason"
                          value={scheduleChangeData.reason}
                          onChange={handleScheduleChangeDataChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          rows="4"
                          placeholder="Please explain why you need this schedule change..."
                          required
                        />
                      </div>

                      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => setShowScheduleChangeForm(false)}
                          className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <Send className="w-4 h-4" />
                          <span>Submit Request</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "courses" && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  My Courses
                </h2>
                <p className="text-gray-600 text-sm">Courses assigned to you</p>
              </div>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-r from-gray-100 to-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Assigned</h3>
                <p className="text-gray-600">You are not assigned to any courses yet.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Course Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Year</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Branch</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Division</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map((course) => (
                      <tr key={course._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{course.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{course.code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Year {course.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{course.branch}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Division {course.division}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            course.lectureType === "lab"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-green-100 text-green-800 border border-green-200"
                          }`}>
                            {course.lectureType === "lab" ? "Lab" : "Theory"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "schedules" && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  My Schedules
                </h2>
                <p className="text-gray-600 text-sm">Your teaching schedule overview</p>
              </div>
            </div>

            {schedules.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-r from-gray-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Schedules Available</h3>
                <p className="text-gray-600">No schedules available for your courses yet.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {schedules.map((schedule) => (
                  <div key={schedule._id} className="bg-gradient-to-r from-gray-50 to-purple-50 border border-purple-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Building className="w-5 h-5 text-purple-600" />
                      <h3 className="text-xl font-bold text-gray-900">
                        Year {schedule.year} - {schedule.branch} - Division {schedule.division}
                      </h3>
                    </div>
                    
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="min-w-full bg-white">
                        <thead className="bg-gradient-to-r from-gray-100 to-purple-100">
                          <tr>
                            <th className="py-3 px-4 border-b border-gray-200 font-bold text-gray-700">
                              <Clock className="w-4 h-4 inline mr-1" />
                              Time
                            </th>
                            {DAYS.map((day) => (
                              <th key={day} className="py-3 px-4 border-b border-gray-200 font-bold text-gray-700">
                                {day}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {TIME_SLOTS.map((timeSlot) => (
                            <tr key={timeSlot.value} className="hover:bg-gray-50 transition-colors duration-200">
                              <td className="py-3 px-4 border-b border-gray-200 font-semibold text-gray-700 bg-gray-50">
                                {timeSlot.label}
                              </td>
                              {DAYS.map((day) => {
                                const slot = schedule.timetable.find(
                                  (s) =>
                                    s.day === day &&
                                    s.startTime === timeSlot.value &&
                                    s.course?.instructor?._id === user.id
                                )
                                return (
                                  <td
                                    key={`${day}-${timeSlot.value}`}
                                    className={`py-3 px-4 border-b border-gray-200 ${
                                      slot
                                        ? slot.course?.lectureType === "lab"
                                          ? "bg-blue-50 border-l-4 border-blue-400"
                                          : "bg-green-50 border-l-4 border-green-400"
                                        : "bg-gray-50"
                                    }`}
                                  >
                                    {slot ? (
                                      <div className="space-y-1">
                                        <p className="font-semibold text-gray-900 text-sm">
                                          {slot.course?.name || "Unnamed Course"}
                                        </p>
                                        <p className="text-xs text-gray-600 flex items-center">
                                          <Building className="w-3 h-3 mr-1" />
                                          {slot.room?.name || "No Room"}
                                        </p>
                                        {slot.course?.lectureType === "lab" && (
                                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full border border-blue-200">
                                            Lab
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-gray-400 text-center">-</p>
                                    )}
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard