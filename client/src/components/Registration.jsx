"use client";

import { useState } from "react";
import { register } from "../utils/auth";
import { User, Mail, Lock, UserCheck, Building, GraduationCap, Users, X, CheckCircle, AlertTriangle, Sparkles } from "lucide-react";

const DEPARTMENTS = [
  "Computer Science",
  "Electrical Engineering", 
  "Mechanical Engineering",
  "Civil Engineering",
];

function Registration({ onClose, administratorId }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "teacher",
    department: "",
    teachableYears: [],
    year: 1,
    division: "A",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "teachableYears") {
      const yearValue = Number.parseInt(value);
      setFormData((prevState) => ({
        ...prevState,
        teachableYears: checked
          ? [...prevState.teachableYears, yearValue]
          : prevState.teachableYears.filter((year) => year !== yearValue),
      }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await register({
        ...formData,
        createdBy: administratorId,
      });
      setSuccess(response.message);
      setTimeout(() => {
        onClose(response.message);
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Register New User
              </h2>
              <p className="text-gray-600 text-sm">Add a new teacher or student to the system</p>
            </div>
          </div>
          <button
            onClick={() => onClose()}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                <User className="w-4 h-4 inline mr-1" />
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              <Lock className="w-4 h-4 inline mr-1" />
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
              placeholder="Create a secure password"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <UserCheck className="w-4 h-4 inline mr-1" />
              User Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-sm ${
                formData.role === "teacher" 
                  ? "bg-indigo-50 border-indigo-300 shadow-sm" 
                  : "bg-white border-gray-200 hover:border-indigo-300"
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={formData.role === "teacher"}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <div className="ml-3">
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 text-indigo-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Teacher</span>
                  </div>
                </div>
              </label>

              <label className={`flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-sm ${
                formData.role === "student" 
                  ? "bg-indigo-50 border-indigo-300 shadow-sm" 
                  : "bg-white border-gray-200 hover:border-indigo-300"
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === "student"}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <div className="ml-3">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-indigo-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Student</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <label htmlFor="department" className="block text-sm font-semibold text-gray-700">
              <Building className="w-4 h-4 inline mr-1" />
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
              required
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Teacher-specific fields */}
          {formData.role === "teacher" && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <GraduationCap className="w-4 h-4 inline mr-1" />
                Teachable Years
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((year) => (
                  <label
                    key={year}
                    className={`flex items-center p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-white ${
                      formData.teachableYears.includes(year)
                        ? "bg-green-50 border-green-300"
                        : "bg-white border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="teachableYears"
                      value={year}
                      checked={formData.teachableYears.includes(year)}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Year {year}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Student-specific fields */}
          {formData.role === "student" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="year" className="block text-sm font-semibold text-gray-700">
                  Academic Year
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
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
                <label htmlFor="division" className="block text-sm font-semibold text-gray-700">
                  Division
                </label>
                <select
                  id="division"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
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
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => onClose()}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Register User</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;