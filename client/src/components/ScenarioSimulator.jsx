"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import {
  FlaskConical,
  Plus,
  Play,
  Copy,
  Eye,
  BarChart3,
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Building,
  Sparkles,
  Trash2,
  Edit3
} from "lucide-react"
import { API_BASE_URL } from "../config"

const API_URL = API_BASE_URL

function ScenarioSimulator() {
  const [scenarios, setScenarios] = useState([])
  const [currentScenario, setCurrentScenario] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [selectedScenarios, setSelectedScenarios] = useState([])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    baseScenario: "",
    parameters: {
      semester: "Fall 2024",
      academicYear: "2024-25",
      programs: ["FYUP"],
      constraints: {
        maxDailyHours: 8,
        lunchBreakDuration: 60,
        facultyMaxLoad: 20,
        roomUtilization: 85,
      },
    },
    modifications: [],
  })

  useEffect(() => {
    fetchScenarios()
  }, [])

  const fetchScenarios = async () => {
    try {
      const response = await axios.get(`${API_URL}/scenarios`)
      setScenarios(response.data)
    } catch (error) {
      console.error("Error fetching scenarios:", error)
      toast.error("Error fetching scenarios")
    }
  }

  const handleCreateScenario = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/scenarios`, formData)
      toast.success("Scenario created successfully")
      setCurrentScenario(response.data)
      resetForm()
      fetchScenarios()
    } catch (error) {
      console.error("Error creating scenario:", error)
      toast.error(error.response?.data?.message || "Error creating scenario")
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateScenario = async (scenarioId) => {
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/scenarios/${scenarioId}/generate`)
      toast.success("Scenario generated successfully")
      setCurrentScenario(response.data)
      fetchScenarios()
    } catch (error) {
      console.error("Error generating scenario:", error)
      toast.error(error.response?.data?.message || "Error generating scenario")
    } finally {
      setLoading(false)
    }
  }

  const handleCloneScenario = async (scenarioId) => {
    try {
      const response = await axios.post(`${API_URL}/scenarios/${scenarioId}/clone`)
      toast.success("Scenario cloned successfully")
      fetchScenarios()
    } catch (error) {
      console.error("Error cloning scenario:", error)
      toast.error("Error cloning scenario")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      baseScenario: "",
      parameters: {
        semester: "Fall 2024",
        academicYear: "2024-25",
        programs: ["FYUP"],
        constraints: {
          maxDailyHours: 8,
          lunchBreakDuration: 60,
          facultyMaxLoad: 20,
          roomUtilization: 85,
        },
      },
      modifications: [],
    })
    setShowForm(false)
  }

  const addModification = () => {
    setFormData({
      ...formData,
      modifications: [
        ...formData.modifications,
        {
          type: "add_course",
          target: "",
          changes: {},
        },
      ],
    })
  }

  const updateModification = (index, field, value) => {
    const updatedModifications = [...formData.modifications]
    updatedModifications[index][field] = value
    setFormData({ ...formData, modifications: updatedModifications })
  }

  const removeModification = (index) => {
    const updatedModifications = formData.modifications.filter((_, i) => i !== index)
    setFormData({ ...formData, modifications: updatedModifications })
  }

  const handleCompareScenarios = () => {
    if (selectedScenarios.length < 2) {
      toast.error("Please select at least 2 scenarios to compare")
      return
    }
    setShowComparison(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "generated":
        return "bg-green-100 text-green-800 border-green-200"
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200"
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
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
              <FlaskConical className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Scenario Simulation & What-If Analysis
              </h2>
              <p className="text-gray-600">Test different scheduling scenarios and compare outcomes</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span>Create Scenario</span>
            </button>
            <button
              onClick={handleCompareScenarios}
              disabled={selectedScenarios.length < 2}
              className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BarChart3 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span>Compare Scenarios</span>
            </button>
          </div>
        </div>



        {/* Create Scenario Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <FlaskConical className="w-6 h-6 mr-2" />
                  Create New Scenario
                </h3>
              </div>

              <div className="p-8">
                <form onSubmit={handleCreateScenario} className="space-y-8">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Scenario Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter scenario name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Base Scenario</label>
                      <select
                        value={formData.baseScenario}
                        onChange={(e) => setFormData({ ...formData, baseScenario: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Create from scratch</option>
                        {scenarios.map((scenario) => (
                          <option key={scenario._id} value={scenario._id}>
                            {scenario.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      rows="3"
                      placeholder="Describe the scenario and its purpose"
                    />
                  </div>

                  {/* Parameters */}
                  <div className="bg-gradient-to-r from-gray-50 to-purple-50 border border-purple-200 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-purple-600" />
                      Parameters
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                        <input
                          type="text"
                          value={formData.parameters.semester}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              parameters: { ...formData.parameters, semester: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                        <input
                          type="text"
                          value={formData.parameters.academicYear}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              parameters: { ...formData.parameters, academicYear: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Programs</label>
                        <select
                          multiple
                          value={formData.parameters.programs}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              parameters: {
                                ...formData.parameters,
                                programs: Array.from(e.target.selectedOptions, (option) => option.value),
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="FYUP">FYUP</option>
                          <option value="B.Ed.">B.Ed.</option>
                          <option value="M.Ed.">M.Ed.</option>
                          <option value="ITEP">ITEP</option>
                        </select>
                      </div>
                    </div>

                    <h5 className="text-md font-semibold text-gray-900 mb-3">Constraints</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Daily Hours</label>
                        <input
                          type="number"
                          value={formData.parameters.constraints.maxDailyHours}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              parameters: {
                                ...formData.parameters,
                                constraints: {
                                  ...formData.parameters.constraints,
                                  maxDailyHours: Number.parseInt(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lunch Break (min)</label>
                        <input
                          type="number"
                          value={formData.parameters.constraints.lunchBreakDuration}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              parameters: {
                                ...formData.parameters,
                                constraints: {
                                  ...formData.parameters.constraints,
                                  lunchBreakDuration: Number.parseInt(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Faculty Max Load</label>
                        <input
                          type="number"
                          value={formData.parameters.constraints.facultyMaxLoad}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              parameters: {
                                ...formData.parameters,
                                constraints: {
                                  ...formData.parameters.constraints,
                                  facultyMaxLoad: Number.parseInt(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Room Utilization (%)</label>
                        <input
                          type="number"
                          value={formData.parameters.constraints.roomUtilization}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              parameters: {
                                ...formData.parameters,
                                constraints: {
                                  ...formData.parameters.constraints,
                                  roomUtilization: Number.parseInt(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Modifications */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-bold text-gray-900 flex items-center">
                        <Edit3 className="w-5 h-5 mr-2 text-blue-600" />
                        Modifications
                      </h4>
                      <button
                        type="button"
                        onClick={addModification}
                        className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Modification</span>
                      </button>
                    </div>

                    {formData.modifications.map((modification, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 bg-white rounded-lg border border-gray-200">
                        <select
                          value={modification.type}
                          onChange={(e) => updateModification(index, "type", e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="add_course">Add Course</option>
                          <option value="remove_course">Remove Course</option>
                          <option value="change_faculty">Change Faculty</option>
                          <option value="change_room">Change Room</option>
                          <option value="change_time">Change Time</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Target ID"
                          value={modification.target}
                          onChange={(e) => updateModification(index, "target", e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Changes (JSON)"
                          value={JSON.stringify(modification.changes)}
                          onChange={(e) => {
                            try {
                              const changes = JSON.parse(e.target.value)
                              updateModification(index, "changes", changes)
                            } catch (error) {
                              // Invalid JSON, ignore
                            }
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => removeModification(index)}
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
                      className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 ${loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Create Scenario</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Modal */}
        {showComparison && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-2xl">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2" />
                  Scenario Comparison
                </h3>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {selectedScenarios.slice(0, 2).map((scenarioId) => {
                    const scenario = scenarios.find((s) => s._id === scenarioId)
                    return (
                      <div key={scenarioId} className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          <FlaskConical className="w-5 h-5 mr-2 text-blue-600" />
                          {scenario?.name}
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <span className="font-medium text-gray-700">Status</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(scenario?.status)}`}>
                              {scenario?.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <span className="font-medium text-gray-700">Conflicts</span>
                            <span className="font-bold text-red-600">{scenario?.metrics?.conflictCount || 0}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <span className="font-medium text-gray-700">Room Utilization</span>
                            <span className="font-bold text-blue-600">{scenario?.metrics?.roomUtilization || 0}%</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <span className="font-medium text-gray-700">Faculty Workload</span>
                            <span className="font-bold text-green-600">{scenario?.metrics?.facultyWorkload || 0}%</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <span className="font-medium text-gray-700">Student Satisfaction</span>
                            <span className="font-bold text-purple-600">{scenario?.metrics?.studentSatisfaction || 0}%</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => setShowComparison(false)}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scenarios List */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <FlaskConical className="w-5 h-5 mr-2 text-purple-600" />
              Scenarios
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {scenarios.map((scenario) => (
              <div key={scenario._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedScenarios.includes(scenario._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedScenarios([...selectedScenarios, scenario._id])
                        } else {
                          setSelectedScenarios(selectedScenarios.filter((id) => id !== scenario._id))
                        }
                      }}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-lg font-semibold text-purple-600">{scenario.name}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(scenario.status)}`}>
                          {scenario.status}
                        </span>
                      </div>
                      <div className="mb-3">
                        <p className="text-gray-600">{scenario.description}</p>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          Programs: {scenario.parameters?.programs?.join(", ")}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(scenario.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {scenario.metrics && (
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="bg-red-50 px-3 py-2 rounded-lg">
                            <span className="text-red-600 font-medium">Conflicts: {scenario.metrics.conflictCount}</span>
                          </div>
                          <div className="bg-blue-50 px-3 py-2 rounded-lg">
                            <span className="text-blue-600 font-medium">Room Util: {scenario.metrics.roomUtilization}%</span>
                          </div>
                          <div className="bg-green-50 px-3 py-2 rounded-lg">
                            <span className="text-green-600 font-medium">Faculty Load: {scenario.metrics.facultyWorkload}%</span>
                          </div>
                          <div className="bg-purple-50 px-3 py-2 rounded-lg">
                            <span className="text-purple-600 font-medium">Satisfaction: {scenario.metrics.studentSatisfaction}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleGenerateScenario(scenario._id)}
                      disabled={loading}
                      className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200 hover:scale-105 disabled:opacity-50"
                    >
                      <Play className="w-3 h-3" />
                      <span>Generate</span>
                    </button>
                    <button
                      onClick={() => handleCloneScenario(scenario._id)}
                      className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Clone</span>
                    </button>
                    <button
                      onClick={() => setCurrentScenario(scenario)}
                      className="flex items-center space-x-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Scenario Display */}
        {currentScenario && (
          <div className="mt-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Eye className="w-6 h-6 mr-2 text-indigo-600" />
              Current Scenario: {currentScenario.name}
            </h3>
            {currentScenario.generatedTimetable && (
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Generated Timetable</h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200 overflow-x-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(currentScenario.generatedTimetable, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ScenarioSimulator