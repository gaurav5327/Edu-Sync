"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  GraduationCap,
  Plus,
  Edit3,
  Trash2,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  Building,
  Phone,
  BookOpen,
  Award,
  Sparkles
} from "lucide-react"
import { API_BASE_URL } from "../config"

const API_URL = API_BASE_URL

function TeachingPracticeManager() {
  const [practices, setPractices] = useState([])
  const [students, setStudents] = useState([])
  const [supervisors, setSupervisors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingPractice, setEditingPractice] = useState(null)

  const [formData, setFormData] = useState({
    student: "",
    supervisor: "",
    school: {
      name: "",
      address: "",
      contactPerson: "",
      phone: "",
    },
    practiceType: "observation",
    subject: "",
    grade: "",
    totalHours: 0,
    schedule: [],
  })

  useEffect(() => {
    fetchPractices()
    fetchStudents()
    fetchSupervisors()
  }, [])

  const fetchPractices = async () => {
    try {
      const response = await axios.get(`${API_URL}/teaching-practices`)
      setPractices(response.data)
    } catch (error) {
      console.error("Error fetching teaching practices:", error)
      setError("Error fetching teaching practices")
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students?program=B.Ed.,M.Ed`)
      setStudents(response.data)
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const fetchSupervisors = async () => {
    try {
      const response = await axios.get(`${API_URL}/users?role=teacher`)
      setSupervisors(response.data)
    } catch (error) {
      console.error("Error fetching supervisors:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (editingPractice) {
        await axios.put(`${API_URL}/teaching-practices/${editingPractice._id}`, formData)
        setSuccess("Teaching practice updated successfully")
      } else {
        await axios.post(`${API_URL}/teaching-practices`, formData)
        setSuccess("Teaching practice created successfully")
      }

      resetForm()
      fetchPractices()
    } catch (error) {
      console.error("Error saving teaching practice:", error)
      setError(error.response?.data?.message || "Error saving teaching practice")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      student: "",
      supervisor: "",
      school: {
        name: "",
        address: "",
        contactPerson: "",
        phone: "",
      },
      practiceType: "observation",
      subject: "",
      grade: "",
      totalHours: 0,
      schedule: [],
    })
    setEditingPractice(null)
    setShowForm(false)
  }

  const handleEdit = (practice) => {
    setFormData(practice)
    setEditingPractice(practice)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teaching practice?")) {
      try {
        await axios.delete(`${API_URL}/teaching-practices/${id}`)
        setSuccess("Teaching practice deleted successfully")
        fetchPractices()
      } catch (error) {
        console.error("Error deleting teaching practice:", error)
        setError("Error deleting teaching practice")
      }
    }
  }

  const addScheduleSlot = () => {
    setFormData({
      ...formData,
      schedule: [
        ...formData.schedule,
        {
          date: "",
          startTime: "",
          endTime: "",
          activity: "",
          completed: false,
        },
      ],
    })
  }

  const updateScheduleSlot = (index, field, value) => {
    const updatedSchedule = [...formData.schedule]
    updatedSchedule[index][field] = value
    setFormData({ ...formData, schedule: updatedSchedule })
  }

  const removeScheduleSlot = (index) => {
    const updatedSchedule = formData.schedule.filter((_, i) => i !== index)
    setFormData({ ...formData, schedule: updatedSchedule })
  }

  const practiceTypes = [
    { value: "observation", label: "Observation", icon: "👁️", color: "bg-blue-100 text-blue-800" },
    { value: "assisted_teaching", label: "Assisted Teaching", icon: "🤝", color: "bg-green-100 text-green-800" },
    { value: "independent_teaching", label: "Independent Teaching", icon: "🎓", color: "bg-purple-100 text-purple-800" },
    { value: "internship", label: "Internship", icon: "💼", color: "bg-orange-100 text-orange-800" },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-6 lg:mb-0">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Teaching Practice Management
              </h2>
              <p className="text-gray-600">Manage student teaching practices and internships</p>
            </div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Add Teaching Practice</span>
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
              <span className="text-red-700">{error}</span>
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

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <GraduationCap className="w-6 h-6 mr-2" />
                  {editingPractice ? "Edit Teaching Practice" : "Add Teaching Practice"}
                </h3>
              </div>

              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Student and Supervisor */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Student
                      </label>
                      <select
                        value={formData.student}
                        onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        required
                      >
                        <option value="">Select Student</option>
                        {students.map((student) => (
                          <option key={student._id} value={student._id}>
                            {student.name} - {student.program} Year {student.year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Users className="w-4 h-4 inline mr-1" />
                        Supervisor
                      </label>
                      <select
                        value={formData.supervisor}
                        onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        required
                      >
                        <option value="">Select Supervisor</option>
                        {supervisors.map((supervisor) => (
                          <option key={supervisor._id} value={supervisor._id}>
                            {supervisor.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* School Information */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Building className="w-5 h-5 mr-2 text-blue-600" />
                      School Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                        <input
                          type="text"
                          value={formData.school.name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              school: { ...formData.school, name: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter school name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                        <input
                          type="text"
                          value={formData.school.contactPerson}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              school: { ...formData.school, contactPerson: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter contact person name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          Address
                        </label>
                        <input
                          type="text"
                          value={formData.school.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              school: { ...formData.school, address: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter school address"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="w-4 h-4 inline mr-1" />
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.school.phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              school: { ...formData.school, phone: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Practice Details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Practice Type</label>
                      <select
                        value={formData.practiceType}
                        onChange={(e) => setFormData({ ...formData, practiceType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      >
                        {practiceTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <BookOpen className="w-4 h-4 inline mr-1" />
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter subject"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Award className="w-4 h-4 inline mr-1" />
                        Grade
                      </label>
                      <input
                        type="text"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter grade level"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Total Hours
                      </label>
                      <input
                        type="number"
                        value={formData.totalHours}
                        onChange={(e) => setFormData({ ...formData, totalHours: e.target.value ? Number.parseInt(e.target.value) : 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter total hours"
                        required
                      />
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-bold text-gray-900 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-green-600" />
                        Schedule
                      </h4>
                      <button
                        type="button"
                        onClick={addScheduleSlot}
                        className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Schedule Slot</span>
                      </button>
                    </div>

                    {formData.schedule.map((slot, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 p-3 bg-white rounded-lg border border-gray-200">
                        <input
                          type="date"
                          value={slot.date}
                          onChange={(e) => updateScheduleSlot(index, "date", e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => updateScheduleSlot(index, "startTime", e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => updateScheduleSlot(index, "endTime", e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Activity"
                          value={slot.activity}
                          onChange={(e) => updateScheduleSlot(index, "activity", e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => removeScheduleSlot(index)}
                          className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 ${loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>{editingPractice ? "Update" : "Create"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Practices List */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-indigo-600" />
              Teaching Practices
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {practices.map((practice) => (
              <div key={practice._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                          <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-indigo-600">
                            {practice.student?.name} - {practice.practiceType}
                          </p>
                          <p className="text-sm text-gray-600">
                            {practice.school.name} • {practice.subject} • Grade {practice.grade}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(practice.status)}`}>
                        {practice.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">School</span>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">{practice.school.name}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-900">Progress</span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          {practice.completedHours || 0}/{practice.totalHours} hours
                        </p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">Supervisor</span>
                        </div>
                        <p className="text-sm text-purple-700 mt-1">{practice.supervisor?.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(practice)}
                      className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(practice._id)}
                      className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {practices.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-gray-100 to-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Teaching Practices</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first teaching practice</p>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg mx-auto"
              >
                <Sparkles className="w-4 h-4" />
                <span>Add First Practice</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeachingPracticeManager