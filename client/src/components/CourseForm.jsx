"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import { BookOpen, User, Clock, Users, CheckCircle, AlertTriangle, Plus, Sparkles } from "lucide-react";

const API_URL = "http://localhost:3000/api/schedule";

const TIME_SLOTS = [
  { value: "09:00", label: "09:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "01:00 PM" },
  { value: "14:00", label: "02:00 PM" },
  { value: "15:00", label: "03:00 PM" },
  { value: "16:00", label: "04:00 PM" },
];

function CourseForm({ addCourse }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    instructor: "",
    duration: "",
    capacity: "",
    lectureType: "theory",
    preferredTimeSlots: [],
  });
  const [instructors, setInstructors] = useState([]);
  const [existingCourses, setExistingCourses] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchInstructors();
    fetchExistingCourses();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await axios.get(`${API_URL}/instructors`);
      setInstructors(response.data);
    } catch (error) {
      console.error("Error fetching instructors:", error);
      toast.error("Error fetching instructors. Please try again later.");
    }
  };

  const fetchExistingCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses-all`);
      setExistingCourses(response.data);
    } catch (error) {
      console.error("Error fetching existing courses:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        preferredTimeSlots: checked
          ? [...prevState.preferredTimeSlots, value]
          : prevState.preferredTimeSlots.filter((slot) => slot !== value),
      }));
    } else if (type === "radio") {
      if (name === "lectureType") {
        if (value === "lab") {
          setFormData((prevState) => ({
            ...prevState,
            lectureType: value,
            duration: "120",
            // Remove fixed time slot restriction for labs
            preferredTimeSlots: prevState.preferredTimeSlots,
          }));
        } else {
          setFormData((prevState) => ({
            ...prevState,
            [name]: value,
            duration: prevState.duration === "120" ? "120" : prevState.duration,
          }));
        }
      } else {
        setFormData((prevState) => ({ ...prevState, [name]: value }));
      }
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));

      if (name === "code") {
        const matchingCourse = existingCourses.find(
          (course) => course.code === value
        );
        if (matchingCourse) {
          setFormData((prevState) => ({
            ...prevState,
            name: matchingCourse.name,
          }));
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (formData.lectureType === "lab" && Number(formData.duration) !== 120) {
        toast.error("Lab duration must be 120 minutes (2 hours)");
        return;
      }

      const response = await axios.get(`${API_URL}/instructor-subjects`, {
        params: {
          instructorId: formData.instructor,
        },
      });

      if (response.data.count >= 2) {
        setError("This instructor has already been assigned to 2 subjects.");
        return;
      }

      // Remove lab time slot restrictions - labs can be scheduled at any time
      console.log("Submitting course data:", formData);
      await addCourse(formData);

      setSuccess(
        `${
          formData.lectureType === "theory" ? "Theory" : "Lab"
        } course added successfully!`
      );

      if (formData.lectureType === "theory") {
        const courseCode = formData.code;
        const courseName = formData.name;

        if (
          window.confirm(
            "Would you like to add a lab component for this course?"
          )
        ) {
          setFormData({
            name: courseName,
            code: courseCode,
            instructor: "",
            duration: "120",
            capacity: "",
            lectureType: "lab",
            preferredTimeSlots: [], // Allow any time slots for labs
          });
        } else {
          setFormData({
            name: "",
            code: "",
            instructor: "",
            duration: "",
            capacity: "",
            lectureType: "theory",
            preferredTimeSlots: [],
          });
        }
      } else {
        setFormData({
          name: "",
          code: "",
          instructor: "",
          duration: "",
          capacity: "",
          lectureType: "theory",
          preferredTimeSlots: [],
        });
      }

      fetchExistingCourses();
    } catch (error) {
      console.error("Error adding course:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred while adding the course"
      );
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Add Course
          </h2>
          <p className="text-gray-600 text-sm">Create a new course for the schedule</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Lecture Type Selection */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Lecture Type
          </label>
          <div className="flex space-x-6">
            <label className="flex items-center group cursor-pointer">
              <input
                type="radio"
                name="lectureType"
                value="theory"
                checked={formData.lectureType === "theory"}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-3 text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
                Theory
              </span>
            </label>
            <label className="flex items-center group cursor-pointer">
              <input
                type="radio"
                name="lectureType"
                value="lab"
                checked={formData.lectureType === "lab"}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-3 text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
                Lab
              </span>
            </label>
          </div>
        </div>

        {/* Course Code */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Course Code
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
            placeholder="Enter course code (e.g., CS101)"
            required
          />
          {formData.lectureType === "lab" && (
            <p className="text-sm text-indigo-600 mt-2 flex items-center">
              <Sparkles className="w-4 h-4 mr-1" />
              You can use the same code as a theory course to create a lab component. Labs can be scheduled at any time.
            </p>
          )}
        </div>

        {/* Course Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Course Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
            placeholder="Enter course name"
            required
          />
        </div>

        {/* Instructor */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Instructor
          </label>
          <select
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
            required
          >
            <option value="">Select an instructor</option>
            {instructors.map((instructor) => (
              <option key={instructor._id} value={instructor._id}>
                {instructor.name}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Duration (minutes)
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            readOnly={formData.lectureType === "lab"}
            className={`w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300 ${
              formData.lectureType === "lab" ? "bg-gray-50" : ""
            }`}
            placeholder="Enter duration in minutes"
            required
          />
          {formData.lectureType === "lab" && (
            <p className="text-sm text-indigo-600 mt-2 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Lab duration is fixed at 120 minutes (2 hours)
            </p>
          )}
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            Capacity
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
            placeholder="Enter student capacity"
            required
          />
        </div>

        {/* Preferred Time Slots */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Preferred Time Slots
          </label>
          <div className="grid grid-cols-2 gap-3">
            {TIME_SLOTS.map((slot) => (
              <label
                key={slot.value}
                className={`flex items-center p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-white hover:border-indigo-300 hover:shadow-sm ${
                  formData.preferredTimeSlots.includes(slot.value)
                    ? "bg-indigo-50 border-indigo-300"
                    : "bg-white border-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  name="preferredTimeSlots"
                  value={slot.value}
                  checked={formData.preferredTimeSlots.includes(slot.value)}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {slot.label}
                </span>
              </label>
            ))}
          </div>
          {formData.lectureType === "lab" && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Labs can now be scheduled at any available time slot
              </p>
            </div>
          )}
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="group w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-semibold">
              Add {formData.lectureType === "theory" ? "Theory" : "Lab"} Course
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseForm;