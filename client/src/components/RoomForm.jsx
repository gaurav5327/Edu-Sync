"use client";

import { useState } from "react";
import { Building, Users, MapPin, CheckCircle, AlertTriangle, Plus, Settings } from "lucide-react";

const DEPARTMENTS = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
];

function RoomForm({ addRoom }) {
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    type: "classroom",
    department: "",
    allowedYears: [],
    isAvailable: true,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "allowedYears") {
      const yearValue = Number.parseInt(value);
      setFormData((prevState) => ({
        ...prevState,
        allowedYears: checked
          ? [...prevState.allowedYears, yearValue]
          : prevState.allowedYears.filter((year) => year !== yearValue),
      }));
    } else if (type === "checkbox") {
      setFormData((prevState) => ({ ...prevState, [name]: checked }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addRoom(formData);
      setFormData({
        name: "",
        capacity: "",
        type: "classroom",
        department: "",
        allowedYears: [],
        isAvailable: true,
      });
      setError("");
    } catch (error) {
      setError("Error adding room. Please try again.");
    }
  };

  const roomTypes = [
    { value: "classroom", label: "Classroom", icon: "🏫" },
    { value: "lab", label: "Laboratory", icon: "🔬" },
    { value: "lecture-hall", label: "Lecture Hall", icon: "🎓" },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-xl">
          <Building className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Add Room
          </h2>
          <p className="text-gray-600 text-sm">Create a new room for scheduling</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Room Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Room Name/Number
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 hover:border-emerald-300"
            placeholder="Enter room name or number (e.g., Room 101)"
            required
          />
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 hover:border-emerald-300"
            placeholder="Enter maximum capacity"
            required
          />
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Room Type
          </label>
          <div className="grid grid-cols-1 gap-3">
            {roomTypes.map((type) => (
              <label
                key={type.value}
                className={`flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-sm ${
                  formData.type === type.value
                    ? "bg-emerald-50 border-emerald-300 shadow-sm"
                    : "bg-white border-gray-200 hover:border-emerald-300"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={type.value}
                  checked={formData.type === type.value}
                  onChange={handleChange}
                  className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                />
                <span className="ml-3 text-2xl">{type.icon}</span>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Building className="w-4 h-4 inline mr-1" />
            Department
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 hover:border-emerald-300"
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

        {/* Allowed Years */}
        <div className="bg-gradient-to-r from-gray-50 to-emerald-50 border border-gray-200 rounded-xl p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Allowed Years
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((year) => (
              <label
                key={year}
                className={`flex items-center p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-white ${
                  formData.allowedYears.includes(year)
                    ? "bg-emerald-50 border-emerald-300"
                    : "bg-white border-gray-200 hover:border-emerald-300"
                }`}
              >
                <input
                  type="checkbox"
                  name="allowedYears"
                  value={year}
                  checked={formData.allowedYears.includes(year)}
                  onChange={handleChange}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Year {year}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-xl p-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <div className="ml-3">
              <span className="text-sm font-medium text-gray-700">
                Room is available for scheduling
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Uncheck if the room is under maintenance or temporarily unavailable
              </p>
            </div>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="group w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-semibold">Add Room</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default RoomForm;