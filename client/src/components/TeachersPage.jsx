"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "./Navbar"
import { Users, GraduationCap, Building, Award, Loader2, AlertTriangle, Sparkles, User } from "lucide-react"

const API_URL = "http://localhost:3000/api/schedule"

function TeachersPage() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All")

  // Add CSS animation styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${API_URL}/teachers-public`)
      setTeachers(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching teachers:", error)
      setError("Error fetching teachers. Please try again later.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Enhanced Background Layers - matching HomePage */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-transparent to-cyan-400/20"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-violet-500/10 to-emerald-400/20"></div>
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Animated Background Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Floating Orbs with Enhanced Animation */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-xl animate-pulse opacity-60 hover:opacity-80 transition-opacity duration-1000"></div>
      <div
        className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-xl animate-pulse opacity-50 hover:opacity-70 transition-opacity duration-1000"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-40 left-20 w-20 h-20 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full blur-xl animate-pulse opacity-40 hover:opacity-60 transition-opacity duration-1000"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-r from-violet-400/30 to-pink-400/30 rounded-full blur-xl animate-pulse opacity-55 hover:opacity-75 transition-opacity duration-1000"
        style={{ animationDelay: "0.5s" }}
      ></div>

      <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section - matching HomePage style */}
        <div className="text-center mb-16 text-white">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-sm p-4 rounded-full">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 lg:mb-6">
            <span className="block">Our Teachers</span>
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              Excellence in Education.
            </span>
          </h1>
          <div className="flex items-center justify-center mt-4 mb-8">
            <Sparkles className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="text-blue-100 font-semibold text-lg">Dedicated • Experienced • Inspiring</span>
            <Sparkles className="w-5 h-5 text-yellow-400 ml-2" />
          </div>
          
          <p className="mt-6 max-w-xl mx-auto text-xl text-blue-100 leading-relaxed">
            Meet our dedicated faculty members who make learning a 
            <span className="text-yellow-400 font-semibold"> wonderful experience</span> for every student.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-green-600 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg mb-8">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-400 mr-3" />
              <span className="text-red-700 text-lg">{error}</span>
            </div>
          </div>
        )}

        {/* Department Filter */}
        {!loading && !error && teachers.length > 0 && (
          <div className="mb-12">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Filter by Department</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {["All", ...new Set(teachers.map(t => t.department || 'Other'))].sort().map((dept) => (
                  <button
                    key={dept}
                    onClick={() => {
                      setSelectedDepartment(dept);
                      // Smooth scroll to teachers section
                      setTimeout(() => {
                        const teachersSection = document.getElementById('teachers-section');
                        if (teachersSection) {
                          teachersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedDepartment === dept
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                        : "bg-white/70 text-gray-700 hover:bg-white/90 border border-gray-200"
                    }`}
                  >
                    {dept}
                    <span className="ml-2 text-xs opacity-75">
                      ({dept === "All" 
                        ? teachers.length 
                        : teachers.filter(t => (t.department || 'Other') === dept).length
                      })
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Teachers by Department */}
        {!loading && !error && (
          <>
            {teachers.length > 0 ? (
              <div id="teachers-section" className="space-y-12">
                {/* Group teachers by department */}
                {Object.entries(
                  teachers.reduce((acc, teacher) => {
                    const dept = teacher.department || 'Other';
                    if (!acc[dept]) {
                      acc[dept] = [];
                    }
                    acc[dept].push(teacher);
                    return acc;
                  }, {})
                )
                .filter(([department]) => selectedDepartment === "All" || department === selectedDepartment)
                .map(([department, departmentTeachers]) => (
                  <div 
                    key={department} 
                    className="space-y-6 animate-fade-in"
                    style={{
                      animation: 'fadeIn 0.5s ease-in-out'
                    }}
                  >
                    {/* Department Header */}
                    <div className="text-center">
                      <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/30 px-8 py-4">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {department} Department
                          </h2>
                          <p className="text-sm text-gray-600 font-medium">
                            {departmentTeachers.length} {departmentTeachers.length === 1 ? 'Faculty Member' : 'Faculty Members'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Department Teachers Grid */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {departmentTeachers.map((teacher) => (
                        <div
                          key={teacher._id}
                          className="group bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                        >
                          {/* Teacher Avatar */}
                          <div className="relative p-6 pb-4">
                            <div className="flex justify-center mb-4">
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                                <div className="relative w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                                  {teacher.name.charAt(0).toUpperCase()}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                                {teacher.name}
                              </h3>
                              <div className="flex items-center justify-center space-x-2 mb-3">
                                <Building className="w-4 h-4 text-gray-500" />
                                <p className="text-sm text-gray-600 font-medium">
                                  {teacher.department}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Teacher Details */}
                          <div className="px-6 pb-6">
                            <div className="space-y-3">
                              {teacher.expertise && teacher.expertise.length > 0 && (
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <Award className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-semibold text-gray-700">Expertise</span>
                                  </div>
                                  <div className="ml-6">
                                    <div className="flex flex-wrap gap-1">
                                      {teacher.expertise.slice(0, 3).map((skill, index) => (
                                        <span
                                          key={index}
                                          className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full border border-purple-200"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                      {teacher.expertise.length > 3 && (
                                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full border border-gray-200">
                                          +{teacher.expertise.length - 3} more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Users className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-semibold text-gray-700">Teaching Years</span>
                                </div>
                                <p className="text-sm text-gray-600 ml-6">
                                  {teacher.teachableYears?.length > 0 
                                    ? `Year ${teacher.teachableYears.join(", ")}` 
                                    : "All years"
                                  }
                                </p>
                              </div>

                              {teacher.maxWeeklyLoad && (
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <GraduationCap className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-semibold text-gray-700">Weekly Load</span>
                                  </div>
                                  <p className="text-sm text-gray-600 ml-6">
                                    {teacher.maxWeeklyLoad} hours/week
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Hover Effect Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-gradient-to-r from-gray-100 to-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Teachers Found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  There are currently no teachers available to display. Please check back later.
                </p>
              </div>
            )}
          </>
        )}

        {/* Enhanced Stats Section */}
        {!loading && !error && teachers.length > 0 && (
          <div className="mt-16 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Faculty Statistics</h2>
            
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">{teachers.length}</div>
                <div className="text-gray-600 font-medium">Total Faculty</div>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {new Set(teachers.map(t => t.department || 'Other')).size}
                </div>
                <div className="text-gray-600 font-medium">Departments</div>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {Math.max(...teachers.flatMap(t => t.teachableYears || []), 4)}
                </div>
                <div className="text-gray-600 font-medium">Academic Years</div>
              </div>
            </div>

            {/* Department Breakdown */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Department Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(
                  teachers.reduce((acc, teacher) => {
                    const dept = teacher.department || 'Other';
                    acc[dept] = (acc[dept] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([department, count]) => (
                  <div
                    key={department}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="text-2xl font-bold text-indigo-600 mb-1">{count}</div>
                    <div className="text-sm text-gray-700 font-medium">{department}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeachersPage