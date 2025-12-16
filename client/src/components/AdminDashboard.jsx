"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import CourseForm from "./CourseForm";
import RoomForm from "./RoomForm";
import Registration from "./Registration";
import AdminRegistration from "./AdminRegistration";
import ScheduleDisplay from "./ScheduleDisplay";
import TimetableManager from "./TimetableManager";
import TimetableEditor from "./TimetableEditor";
import TeachingPracticeManager from "./TeachingPracticeManager";
import FieldWorkManager from "./FieldWorkManager";
import ScenarioSimulator from "./ScenarioSimulator";
import ExportManager from "./ExportManager";
import MultiProgramDashboard from "./MultiProgramDashboard";
import APIKeyManager from "./APIKeyManager";
import { logout, getCurrentUser } from "../utils/auth";
import toast from 'react-hot-toast';
import {
  Calendar,
  Users,
  Settings,
  LogOut,
  Plus,
  UserPlus,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  Building,
  BarChart3,
  FileText,
  Zap,
  Key,
  GraduationCap,
  Briefcase,
  FlaskConical,
  Download,
  Eye,
  ArrowLeft,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/schedule`;

// Conflict Resolution Section Component
function ConflictResolutionSection({ selectedYear, selectedBranch, selectedDivision, onScheduleUpdate, onError }) {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConflicts, setShowConflicts] = useState(false);

  const fetchConflicts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/conflicts`, {
        params: {
          year: selectedYear,
          branch: selectedBranch,
          division: selectedDivision,
        },
      });
      setConflicts(response.data.conflicts);
      setShowConflicts(true);
    } catch (error) {
      console.error("Error fetching conflicts:", error);
      toast.error("Error fetching conflicts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resolveAllConflicts = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/resolve-conflicts`, {
        year: selectedYear,
        branch: selectedBranch,
        division: selectedDivision,
      });
      onScheduleUpdate(response.data);
      setShowConflicts(false);
    } catch (error) {
      console.error("Error resolving conflicts:", error);
      toast.error("Error resolving conflicts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Conflict Resolution</h2>
      </div>

      {!showConflicts ? (
        <div className="space-y-4">
          <p className="text-gray-600">
            Check for scheduling conflicts and resolve them automatically.
          </p>
          <button
            onClick={fetchConflicts}
            disabled={loading}
            className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Checking Conflicts...</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Check for Conflicts</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {conflicts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-green-600 mb-4">
                <CheckCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Conflicts Found!</h3>
              <p className="text-gray-600">Your timetable is conflict-free and ready to use.</p>
              <button
                onClick={() => setShowConflicts(false)}
                className="mt-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-300"
              >
                Back
              </button>
            </div>
          ) : (
            <>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-red-800 mb-2">
                  Found {conflicts.length} Conflict{conflicts.length !== 1 ? 's' : ''}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="text-sm">
                    <span className="font-semibold text-red-700">Room Conflicts:</span>{' '}
                    {conflicts.filter(c => c.type === "room").length}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-red-700">Instructor Conflicts:</span>{' '}
                    {conflicts.filter(c => c.type === "instructor").length}
                  </div>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {conflicts.map((conflict, index) => (
                  <div
                    key={conflict._id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center mb-2">
                      <div className={`w-3 h-3 rounded-full mr-2 ${conflict.type === "room" ? "bg-red-500" : "bg-orange-500"
                        }`}></div>
                      <h4 className="font-semibold text-gray-900">
                        {conflict.type === "room" ? "Room Conflict" : "Instructor Conflict"}
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Day:</span> {conflict.day}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {conflict.startTime}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Affected Courses:</span>{' '}
                      {conflict.courses.map(c => c.name).join(", ")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={resolveAllConflicts}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Resolving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Resolve All Conflicts</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowConflicts(false)}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all duration-300"
                >
                  Back
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const YEARS = [1, 2, 3, 4];
const BRANCHES = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
];
const DIVISIONS = ["A", "B", "C"];

// Enhanced ManualScheduleChange component
function ManualScheduleChange({ notification, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [changes, setChanges] = useState([
    {
      day: notification.data.day,
      timeSlot: notification.data.timeSlot,
      courseId: "",
      roomId: "",
    },
  ]);

  useEffect(() => {
    fetchSchedules();
    fetchCourses();
    fetchRooms();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${API_URL}/timetables`);
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setError("Error fetching schedules. Please try again.");
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses-all`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Error fetching courses. Please try again.");
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/rooms`);
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setError("Error fetching rooms. Please try again.");
    }
  };

  const handleChangeUpdate = (index, field, value) => {
    const updatedChanges = [...changes];
    updatedChanges[index][field] = value;
    setChanges(updatedChanges);
  };

  const handleAddChange = () => {
    setChanges([
      ...changes,
      { day: "Monday", timeSlot: "09:00", courseId: "", roomId: "" },
    ]);
  };

  const handleRemoveChange = (index) => {
    const updatedChanges = [...changes];
    updatedChanges.splice(index, 1);
    setChanges(updatedChanges);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!selectedSchedule) {
        setError("Please select a schedule to modify");
        setLoading(false);
        return;
      }

      for (const change of changes) {
        if (!change.courseId || !change.roomId) {
          setError("Please select a course and room for each change");
          setLoading(false);
          return;
        }
      }

      const response = await axios.post(`${API_URL}/manual-schedule-change`, {
        scheduleId: selectedSchedule,
        changes,
      });

      setSuccess("Schedule updated successfully");
      await axios.post(`${API_URL}/notifications/${notification._id}/approve`);
      onSuccess();
    } catch (error) {
      console.error("Error updating schedule:", error);
      if (error.response?.data?.conflicts) {
        setError(
          `Error: ${error.response.data.message
          }. Conflicts detected: ${error.response.data.conflicts
            .map((c) => c.message)
            .join(", ")}`
        );
      } else {
        setError(
          error.response?.data?.message ||
          "Error updating schedule. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Manual Schedule Change
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Request Details */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Request Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <p>
                    <span className="font-medium text-gray-700">Teacher:</span>{" "}
                    <span className="text-gray-900">
                      {notification.data.teacherName}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Day:</span>{" "}
                    <span className="text-gray-900">
                      {notification.data.day}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Time:</span>{" "}
                    <span className="text-gray-900">
                      {notification.data.timeSlot}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Reason:</span>{" "}
                    <span className="text-gray-900">
                      {notification.data.reason}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Schedule Selection */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Schedule to Modify
              </label>
              <select
                value={selectedSchedule}
                onChange={(e) => setSelectedSchedule(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Select a schedule</option>
                {schedules.map((schedule) => (
                  <option key={schedule._id} value={schedule._id}>
                    Year {schedule.year} - {schedule.branch} - Division{" "}
                    {schedule.division}
                  </option>
                ))}
              </select>
            </div>

            {/* Schedule Changes */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Schedule Changes
                </h3>
                <button
                  type="button"
                  onClick={handleAddChange}
                  className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Change</span>
                </button>
              </div>

              <div className="space-y-4">
                {changes.map((change, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Day
                        </label>
                        <select
                          value={change.day}
                          onChange={(e) =>
                            handleChangeUpdate(index, "day", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        >
                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                          ].map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Time Slot
                        </label>
                        <select
                          value={change.timeSlot}
                          onChange={(e) =>
                            handleChangeUpdate(
                              index,
                              "timeSlot",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        >
                          {[
                            "09:00",
                            "10:00",
                            "11:00",
                            "12:00",
                            "13:00",
                            "14:00",
                            "15:00",
                            "16:00",
                          ].map((time) => (
                            <option key={time} value={time}>
                              {time} {time === "12:00" ? "(Lunch Break)" : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Course
                        </label>
                        <select
                          value={change.courseId}
                          onChange={(e) =>
                            handleChangeUpdate(
                              index,
                              "courseId",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select a course</option>
                          {courses.map((course) => (
                            <option key={course._id} value={course._id}>
                              {course.name} ({course.code}) -{" "}
                              {course.lectureType}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Room
                        </label>
                        <select
                          value={change.roomId}
                          onChange={(e) =>
                            handleChangeUpdate(index, "roomId", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select a room</option>
                          {rooms.map((room) => (
                            <option key={room._id} value={room._id}>
                              {room.name} ({room.type})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {changes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveChange(index)}
                        className="mt-3 flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm">Remove this change</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
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
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Apply Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const user = getCurrentUser();

  const [activeTab, setActiveTab] = useState("schedule");
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showAdminRegistration, setShowAdminRegistration] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [selectedDivision, setSelectedDivision] = useState(DIVISIONS[0]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showManualScheduleChange, setShowManualScheduleChange] =
    useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    if (activeTab === "schedule") {
      fetchCourses();
      fetchRooms();
      fetchNotifications();
    }
  }, [activeTab, selectedYear, selectedBranch, selectedDivision]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`, {
        params: {
          year: selectedYear,
          branch: selectedBranch,
          division: selectedDivision,
        },
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setErrorMessage("Error fetching courses. Please try again later.");
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/rooms`);
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setErrorMessage("Error fetching rooms. Please try again later.");
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const addCourse = async (course) => {
    try {
      console.log("Adding course:", course);
      const response = await axios.post(`${API_URL}/courses`, {
        ...course,
        year: selectedYear,
        branch: selectedBranch,
        division: selectedDivision,
      });
      console.log("Course added successfully:", response.data);
      toast.success("Course added successfully!");
      fetchCourses();
      return response.data;
    } catch (error) {
      console.error("Error adding course:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error adding course. Please try again.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const addRoom = async (room) => {
    try {
      await axios.post(`${API_URL}/rooms`, room);
      toast.success("Room added successfully!");
      fetchRooms();
    } catch (error) {
      console.error("Error adding room:", error);
      toast.error("Error adding room. Please try again.");
    }
  };

  const generateSchedule = async () => {
    setIsLoading(true);
    try {
      toast.loading("Generating schedule...", { id: 'generate-schedule' });
      const response = await axios.post(`${API_URL}/generate`, {
        year: selectedYear,
        branch: selectedBranch,
        division: selectedDivision,
      });
      setCurrentSchedule(response.data);
      setShowSchedule(true);
      toast.success("Schedule generated successfully!", { id: 'generate-schedule' });
    } catch (error) {
      console.error("Error generating schedule:", error);
      toast.error(
        "Error generating schedule. Please ensure you have added courses and rooms, then try again.",
        { id: 'generate-schedule' }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationClose = (message) => {
    setShowRegistration(false);
    setShowAdminRegistration(false);
    if (message) {
      setRegistrationMessage(message);
      setTimeout(() => setRegistrationMessage(""), 5000);
    }
  };

  const handleViewSchedule = async () => {
    try {
      toast.loading("Loading schedule...", { id: 'view-schedule' });
      const response = await axios.get(`${API_URL}/latest`, {
        params: {
          year: selectedYear,
          branch: selectedBranch,
          division: selectedDivision,
        },
      });
      setCurrentSchedule(response.data);
      setShowSchedule(true);
      toast.success("Schedule loaded successfully!", { id: 'view-schedule' });
    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast.error("Error fetching schedule. Please try again later.", { id: 'view-schedule' });
    }
  };

  const handleNotificationAction = async (notification, action) => {
    try {
      if (
        notification.type === "SCHEDULE_CHANGE_REQUEST" &&
        action === "approve"
      ) {
        setSelectedNotification(notification);
        setShowManualScheduleChange(true);
      } else {
        await axios.post(
          `${API_URL}/notifications/${notification._id}/${action}`
        );
        fetchNotifications();
      }
    } catch (error) {
      console.error(`Error ${action}ing notification:`, error);
      toast.error(`Error ${action}ing notification. Please try again.`);
    }
  };

  const handleScheduleChangeSuccess = () => {
    setShowManualScheduleChange(false);
    setSelectedNotification(null);
    fetchNotifications();
  };

  const tabs = [
    { id: "multi-program", label: "Multi-Program Overview", icon: BarChart3 },
    { id: "schedule", label: "Schedule Generator", icon: Calendar },
    { id: "timetables", label: "Timetable Manager", icon: Clock },
    { id: "editor", label: "Timetable Editor", icon: Settings },
    {
      id: "teaching-practice",
      label: "Teaching Practice",
      icon: GraduationCap,
    },
    { id: "field-work", label: "Field Work & Internships", icon: Briefcase },
    { id: "scenarios", label: "Scenario Simulation", icon: FlaskConical },
    { id: "export", label: "Export & Import", icon: Download },
    { id: "api-keys", label: "API Keys", icon: Key },
  ];

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Enhanced Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-20" : "w-80"
          } transition-all duration-300 ease-in-out flex-shrink-0`}
      >
        <div className="h-full bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 shadow-2xl relative overflow-hidden">
          {/* Background decorations - matching HomePage */}
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-transparent to-cyan-400/20"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-violet-500/10 to-emerald-400/20"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-12 translate-y-12"></div>

          <div className="relative h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  {!sidebarCollapsed && (
                    <div>
                      <h1 className="text-xl font-bold text-white">
                        Admin Panel
                      </h1>
                      <p className="text-blue-200 text-sm">Scheduling System</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
                >
                  <ArrowLeft
                    className={`w-4 h-4 transition-transform duration-300 ${sidebarCollapsed ? "rotate-180" : ""
                      }`}
                  />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                        ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20"
                        : "text-blue-200 hover:text-white hover:bg-white/10"
                      }`}
                    title={sidebarCollapsed ? tab.label : ""}
                  >
                    <Icon
                      className={`w-5 h-5 transition-all duration-300 ${isActive
                          ? "rotate-12 scale-110"
                          : "group-hover:rotate-12 group-hover:scale-110"
                        }`}
                    />
                    {!sidebarCollapsed && (
                      <span className="font-medium text-sm">{tab.label}</span>
                    )}
                    {isActive && !sidebarCollapsed && (
                      <div className="ml-auto w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* User Actions */}
            <div className="p-4 border-t border-white/10 space-y-2">
              <button
                onClick={() => setShowRegistration(true)}
                className="group w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-all duration-300"
                title={sidebarCollapsed ? "Add User" : ""}
              >
                <UserPlus className="w-5 h-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                {!sidebarCollapsed && (
                  <span className="font-medium text-sm">Add User</span>
                )}
              </button>
              <button
                onClick={() => setShowAdminRegistration(true)}
                className="group w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-all duration-300"
                title={sidebarCollapsed ? "Add Admin" : ""}
              >
                <Plus className="w-5 h-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                {!sidebarCollapsed && (
                  <span className="font-medium text-sm">Add Admin</span>
                )}
              </button>
              <button
                onClick={logout}
                className="group w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-300 hover:text-white hover:bg-red-500/20 transition-all duration-300"
                title={sidebarCollapsed ? "Logout" : ""}
              >
                <LogOut className="w-5 h-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                {!sidebarCollapsed && (
                  <span className="font-medium text-sm">Logout</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Top Header */}
        <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {tabs.find((tab) => tab.id === activeTab)?.label || "Dashboard"}
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your institution's scheduling system
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {notifications.length > 0 && (
                <div className="relative">
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {user?.name?.charAt(0) || "A"}
                  </span>
                </div>
                <span className="font-medium">{user?.name || "Admin"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-120px)]">
          {/* Messages */}
          {registrationMessage && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                <span className="text-green-700">{registrationMessage}</span>
              </div>
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                <span className="text-red-700">{errorMessage}</span>
              </div>
            </div>
          )}

          {activeTab === "multi-program" && <MultiProgramDashboard />}

          {activeTab === "schedule" && (
            <div className="space-y-8">
              {/* Notifications */}
              {notifications.length > 0 && (
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Notifications
                    </h2>
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {notifications.length}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`border rounded-xl p-4 transition-all duration-200 hover:shadow-md ${notification.type === "SCHEDULE_CHANGE_REQUEST"
                            ? "bg-blue-50 border-blue-200"
                            : notification.type === "TEACHER_ABSENCE"
                              ? "bg-yellow-50 border-yellow-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {notification.message}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() =>
                                handleNotificationAction(
                                  notification,
                                  "approve"
                                )
                              }
                              className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>
                                {notification.type === "SCHEDULE_CHANGE_REQUEST"
                                  ? "Manage"
                                  : "Approve"}
                              </span>
                            </button>
                            <button
                              onClick={() =>
                                handleNotificationAction(notification, "reject")
                              }
                              className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!showSchedule ? (
                <div className="space-y-8">
                  {/* Selection Controls */}
                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Select Configuration
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Year
                        </label>
                        <select
                          value={selectedYear}
                          onChange={(e) =>
                            setSelectedYear(Number(e.target.value))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        >
                          {YEARS.map((year) => (
                            <option key={year} value={year}>
                              Year {year}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Branch
                        </label>
                        <select
                          value={selectedBranch}
                          onChange={(e) => setSelectedBranch(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        >
                          {BRANCHES.map((branch) => (
                            <option key={branch} value={branch}>
                              {branch}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Division
                        </label>
                        <select
                          value={selectedDivision}
                          onChange={(e) => setSelectedDivision(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
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

                  {/* Course and Room Forms */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <CourseForm addCourse={addCourse} />
                    <RoomForm addRoom={addRoom} />
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={generateSchedule}
                        disabled={isLoading}
                        className={`group flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                            <span>Generate Schedule</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleViewSchedule}
                        className="group flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <Eye className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span>View Schedule</span>
                      </button>
                    </div>
                  </div>

                  {/* Conflict Resolution */}
                  <ConflictResolutionSection
                    selectedYear={selectedYear}
                    selectedBranch={selectedBranch}
                    selectedDivision={selectedDivision}
                    onScheduleUpdate={(schedule) => {
                      setCurrentSchedule(schedule);
                      setShowSchedule(true);
                    }}
                    onError={setErrorMessage}
                  />

                  {showRegistration && (
                    <Registration
                      onClose={handleRegistrationClose}
                      administratorId={user.id}
                    />
                  )}
                  {showAdminRegistration && (
                    <AdminRegistration
                      onClose={handleRegistrationClose}
                      administratorId={user.id}
                    />
                  )}
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Generated Schedule
                    </h2>
                    <button
                      onClick={() => setShowSchedule(false)}
                      className="group flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                      <span>Back to Dashboard</span>
                    </button>
                  </div>
                  <ScheduleDisplay schedule={currentSchedule} />
                </div>
              )}
            </div>
          )}

          {activeTab === "timetables" && <TimetableManager />}
          {activeTab === "editor" && <TimetableEditor />}
          {activeTab === "teaching-practice" && <TeachingPracticeManager />}
          {activeTab === "field-work" && <FieldWorkManager />}
          {activeTab === "scenarios" && <ScenarioSimulator />}
          {activeTab === "export" && <ExportManager />}
          {activeTab === "api-keys" && <APIKeyManager />}
        </div>
      </div>

      {showManualScheduleChange && selectedNotification && (
        <ManualScheduleChange
          notification={selectedNotification}
          onClose={() => setShowManualScheduleChange(false)}
          onSuccess={handleScheduleChangeSuccess}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
