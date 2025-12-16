"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { logout, getCurrentUser, updateUserProfile } from "../utils/auth"
import ScheduleDisplay from "./ScheduleDisplay"
import {
  Calendar,
  User,
  Settings,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Clock,
  BookOpen,
  Building,
  GraduationCap,
  Loader2,
  RefreshCw,
  Edit3,
  Sparkles
} from "lucide-react"
import { API_BASE_URL } from "../config"

const API_URL = `${API_BASE_URL}/schedule`
const AUTH_API_URL = `${API_BASE_URL}/auth`

function StudentDashboard() {
  const user = getCurrentUser()
  const [schedule, setSchedule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [profileData, setProfileData] = useState({
    year: user?.year || 1,
    department: user?.department || "",
    division: user?.division || "A",
  })
  const [departments, setDepartments] = useState([
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
  ])

  useEffect(() => {
    if (user) {
      if (!user.year || !user.department || !user.division) {
        setError("Your user profile is incomplete. Please update your profile information.")
        setShowProfileForm(true)
        setLoading(false)
      } else {
        fetchStudentSchedule()
      }
    }
  }, [])

  const fetchStudentSchedule = async () => {
    try {
      setLoading(true)
      setError("")

      console.log("Fetching schedule with params:", {
        year: user.year,
        branch: user.department,
        division: user.division,
      })

      const response = await axios.get(`${API_URL}/latest`, {
        params: {
          year: user.year,
          branch: user.department,
          division: user.division,
        },
      })

      console.log("Schedule response:", response.data)
      setSchedule(response.data)
    } catch (error) {
      console.error("Error fetching schedule:", error)

      if (error.response) {
        console.error("Server responded with error:", error.response.data)
        setError(`Error fetching your schedule: ${error.response.data.message || "Server error"}`)
      } else if (error.request) {
        console.error("No response received:", error.request)
        setError("No response from server. Please check your connection and try again.")
      } else {
        console.error("Request setup error:", error.message)
        setError(`Error setting up request: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData({
      ...profileData,
      [name]: name === "year" ? Number.parseInt(value, 10) : value,
    })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      const response = await axios.put(`${AUTH_API_URL}/update-profile`, {
        userId: user.id,
        ...profileData,
      })

      const updatedUser = {
        ...user,
        ...profileData,
      }
      updateUserProfile(updatedUser)

      setShowProfileForm(false)
      setError("")

      fetchStudentSchedule()
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("Failed to update profile. Please try again or contact an administrator.")
      setLoading(false)
    }
  }

  if (loading && !showProfileForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 text-lg">Loading your schedule...</p>
        </div>
      </div>
    )
  }

  const sidebarItems = [
    { id: "schedule", label: "My Schedule", icon: Calendar },
    { id: "profile", label: "Profile Settings", icon: Settings },
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
                <h1 className="text-xl font-bold text-white">Student Portal</h1>
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
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = (item.id === "schedule" && !showProfileForm) || (item.id === "profile" && showProfileForm)
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "profile") {
                    setShowProfileForm(true)
                  } else {
                    setShowProfileForm(false)
                  }
                }}
                className={`w-full group flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                  }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'rotate-12' : 'group-hover:rotate-12'
                  }`} />
                <span>{item.label}</span>
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
                {showProfileForm ? 'Profile Settings' : 'My Schedule'}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {showProfileForm ? 'Update your profile information' : 'View your class schedule'}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {showProfileForm ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
                  <Edit3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Update Your Profile
                  </h2>
                  <p className="text-gray-600 text-sm">Complete your profile to view your schedule</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="year" className="block text-sm font-semibold text-gray-700">
                      <GraduationCap className="w-4 h-4 inline mr-1" />
                      Academic Year
                    </label>
                    <select
                      id="year"
                      name="year"
                      value={profileData.year}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      {[1, 2, 3, 4].map((year) => (
                        <option key={year} value={year}>
                          Year {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="department" className="block text-sm font-semibold text-gray-700">
                      <Building className="w-4 h-4 inline mr-1" />
                      Department
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={profileData.department}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="division" className="block text-sm font-semibold text-gray-700">
                      Division
                    </label>
                    <select
                      id="division"
                      name="division"
                      value={profileData.division}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      {["A", "B", "C"].map((division) => (
                        <option key={division} value={division}>
                          Division {division}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 ${loading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Update Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                      <div>
                        <p className="font-bold text-red-700">Error</p>
                        <p className="text-red-700">{error}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={fetchStudentSchedule}
                        className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                      <button
                        onClick={() => setShowProfileForm(true)}
                        className="flex items-center space-x-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Update Profile</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!loading && !error && !schedule && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
                    <div>
                      <p className="font-bold text-yellow-700">No Schedule Available</p>
                      <p className="text-yellow-700">
                        There is no schedule available for your class yet. Please check back later or contact an administrator.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {schedule ? (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-blue-200 rounded-xl p-6">
                  <ScheduleDisplay schedule={schedule} />
                </div>
              ) : !loading && !error && (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-r from-gray-100 to-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Schedule Available</h3>
                  <p className="text-gray-600">No schedule available for your class yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard