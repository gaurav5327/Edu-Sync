"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  BarChart3,
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  GraduationCap,
  Sparkles,
  Eye,
  Settings,
} from "lucide-react";
import { API_BASE_URL } from "../config";

const API_URL = API_BASE_URL;

function MultiProgramDashboard() {
  const [programs, setPrograms] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState(["FYUP"]);
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("overview");

  const programConfigs = {
    FYUP: {
      name: "Four Year Undergraduate Programme",
      color: "from-blue-500 to-blue-600",
      lightColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      years: [1, 2, 3, 4],
      categories: ["MAJOR", "MINOR", "SEC", "AEC", "VAC", "CORE"],
      minCredits: 176,
      maxCredits: 200,
    },
    "B.Ed.": {
      name: "Bachelor of Education",
      color: "from-green-500 to-green-600",
      lightColor: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      textColor: "text-green-600",
      years: [1, 2],
      categories: ["CORE", "MAJOR", "MINOR", "OTHER"],
      minCredits: 120,
      maxCredits: 140,
      requiresTeachingPractice: true,
    },
    "M.Ed.": {
      name: "Master of Education",
      color: "from-purple-500 to-purple-600",
      lightColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      textColor: "text-purple-600",
      years: [1, 2],
      categories: ["CORE", "MAJOR", "MINOR", "OTHER"],
      minCredits: 80,
      maxCredits: 100,
      requiresResearch: true,
    },
    ITEP: {
      name: "Integrated Teacher Education Programme",
      color: "from-orange-500 to-orange-600",
      lightColor: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      textColor: "text-orange-600",
      years: [1, 2, 3, 4],
      categories: ["CORE", "MAJOR", "MINOR", "SEC", "AEC"],
      minCredits: 200,
      maxCredits: 220,
      requiresTeachingPractice: true,
    },
  };

  useEffect(() => {
    fetchProgramData();
  }, [selectedPrograms]);

  const fetchProgramData = async () => {
    setLoading(true);

    try {
      const promises = selectedPrograms.map(async (program) => {
        const [students, courses, timetables, analytics] = await Promise.all([
          axios.get(`${API_URL}/students?program=${program}`),
          axios.get(`${API_URL}/courses?program=${program}`),
          axios.get(`${API_URL}/timetables?program=${program}`),
          axios.get(`${API_URL}/analytics/enrollment?program=${program}`),
        ]);

        return {
          program,
          students: students.data || [],
          courses: courses.data || [],
          timetables: timetables.data || [],
          analytics: analytics.data || {},
        };
      });

      const results = await Promise.all(promises);
      const data = {};
      results.forEach((result) => {
        data[result.program] = result;
      });

      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching program data:", error);
      toast.error("Error fetching program data");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgramMetrics = (program, data) => {
    const config = programConfigs[program];
    const students = data.students || [];
    const courses = data.courses || [];

    const totalStudents = students.length;
    const totalCourses = courses.length;
    const avgCredits =
      students.reduce((sum, s) => sum + (s.enrolledCredits || 0), 0) /
      totalStudents || 0;

    const yearDistribution = config.years.reduce((acc, year) => {
      acc[year] = students.filter((s) => s.year === year).length;
      return acc;
    }, {});

    const categoryDistribution = config.categories.reduce((acc, category) => {
      acc[category] = courses.filter((c) => c.category === category).length;
      return acc;
    }, {});

    const creditCompliance = students.filter(
      (s) =>
        s.enrolledCredits >= config.minCredits &&
        s.enrolledCredits <= config.maxCredits
    ).length;

    return {
      totalStudents,
      totalCourses,
      avgCredits: Math.round(avgCredits * 10) / 10,
      yearDistribution,
      categoryDistribution,
      creditCompliance,
      complianceRate:
        totalStudents > 0
          ? Math.round((creditCompliance / totalStudents) * 100)
          : 0,
    };
  };

  const renderProgramCard = (program) => {
    const config = programConfigs[program];
    const data = dashboardData[program] || {};
    const metrics = calculateProgramMetrics(program, data);

    return (
      <div
        key={program}
        className={`bg-gradient-to-br ${config.lightColor} ${config.borderColor} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div
              className={`bg-gradient-to-r ${config.color} p-3 rounded-xl shadow-lg`}
            >
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${config.textColor}`}>
                {config.name}
              </h3>
              <p className="text-sm text-gray-600 font-medium">{program}</p>
            </div>
          </div>
          <div
            className={`bg-gradient-to-r ${config.color} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}
          >
            <Users className="w-4 h-4 inline mr-1" />
            {metrics.totalStudents}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5 text-gray-600 mr-1" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {metrics.totalCourses}
            </div>
            <div className="text-sm text-gray-600 font-medium">Courses</div>
          </div>
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-5 h-5 text-gray-600 mr-1" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {metrics.avgCredits}
            </div>
            <div className="text-sm text-gray-600 font-medium">Avg Credits</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Credit Compliance
            </span>
            <span className={`text-sm font-bold ${config.textColor}`}>
              {metrics.complianceRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`bg-gradient-to-r ${config.color} h-3 rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${metrics.complianceRate}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-700 flex items-center">
            <BarChart3 className="w-4 h-4 mr-1" />
            Year Distribution
          </h4>
          {Object.entries(metrics.yearDistribution).map(([year, count]) => (
            <div
              key={year}
              className="flex justify-between items-center bg-white/40 backdrop-blur-sm rounded-lg p-2"
            >
              <span className="text-sm font-medium text-gray-700">
                Year {year}
              </span>
              <span
                className={`font-bold ${config.textColor} bg-white px-2 py-1 rounded-full text-xs`}
              >
                {count}
              </span>
            </div>
          ))}
        </div>

        {config.requiresTeachingPractice && (
          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
              <span className="text-yellow-700 text-sm font-medium">
                Requires Teaching Practice
              </span>
            </div>
          </div>
        )}

        {config.requiresResearch && (
          <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl">
            <div className="flex items-center">
              <Sparkles className="w-4 h-4 text-indigo-600 mr-2" />
              <span className="text-indigo-700 text-sm font-medium">
                Requires Research Component
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderComparisonView = () => {
    if (selectedPrograms.length < 2) {
      return (
        <div className="text-center py-12 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
          <div className="bg-gradient-to-r from-gray-100 to-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-600 text-lg">
            Select at least 2 programs to compare
          </p>
        </div>
      );
    }

    const comparisonData = selectedPrograms.map((program) => {
      const data = dashboardData[program] || {};
      const metrics = calculateProgramMetrics(program, data);
      return { program, metrics, config: programConfigs[program] };
    });

    return (
      <div className="space-y-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-indigo-600" />
            Program Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Avg Credits
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Compliance
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comparisonData.map(({ program, metrics, config }) => (
                  <tr
                    key={program}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 bg-gradient-to-r ${config.color} rounded-full mr-3`}
                        ></div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">
                            {program}
                          </div>
                          <div className="text-sm text-gray-500">
                            {config.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {metrics.totalStudents}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {metrics.totalCourses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {metrics.avgCredits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${metrics.complianceRate >= 80
                            ? "bg-green-100 text-green-800"
                            : metrics.complianceRate >= 60
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {metrics.complianceRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {Math.max(...config.years)} Years
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-indigo-600" />
              Credit Requirements
            </h4>
            <div className="space-y-4">
              {comparisonData.map(({ program, config }) => (
                <div
                  key={program}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 bg-gradient-to-r ${config.color} rounded-full mr-3`}
                    ></div>
                    <span className="text-sm font-semibold text-gray-900">
                      {program}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-700 bg-white px-3 py-1 rounded-full">
                    {config.minCredits} - {config.maxCredits} credits
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
              Special Requirements
            </h4>
            <div className="space-y-4">
              {comparisonData.map(({ program, config }) => (
                <div
                  key={program}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 bg-gradient-to-r ${config.color} rounded-full mr-3`}
                    ></div>
                    <span className="text-sm font-semibold text-gray-900">
                      {program}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-gray-700 bg-white px-3 py-1 rounded-full">
                    {config.requiresTeachingPractice && "Teaching Practice"}
                    {config.requiresResearch && "Research"}
                    {!config.requiresTeachingPractice &&
                      !config.requiresResearch &&
                      "None"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="flex items-center space-x-3 mb-4 lg:mb-0">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Multi-Program Dashboard
            </h2>
            <p className="text-gray-600">
              Comprehensive overview of all academic programs
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <select
            multiple
            value={selectedPrograms}
            onChange={(e) =>
              setSelectedPrograms(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            className="border border-gray-300 rounded-xl px-4 py-2 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {Object.keys(programConfigs).map((program) => (
              <option key={program} value={program}>
                {program} - {programConfigs[program].name}
              </option>
            ))}
          </select>

          <div className="flex border border-gray-300 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm">
            <button
              onClick={() => setViewMode("overview")}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${viewMode === "overview"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
            >
              <Eye className="w-4 h-4" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setViewMode("comparison")}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${viewMode === "comparison"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Comparison</span>
            </button>
          </div>
        </div>
      </div>



      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Settings className="w-6 h-6 text-indigo-600 animate-pulse" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {viewMode === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {selectedPrograms.map(renderProgramCard)}
            </div>
          )}

          {viewMode === "comparison" && renderComparisonView()}
        </>
      )}

      {/* Cross-Program Analytics */}
      <div className="mt-12 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
          Cross-Program Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {Object.values(dashboardData).reduce(
                (sum, data) => sum + (data.students?.length || 0),
                0
              )}
            </div>
            <div className="text-sm font-medium text-gray-600">
              Total Students
            </div>
          </div>
          <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {Object.values(dashboardData).reduce(
                (sum, data) => sum + (data.courses?.length || 0),
                0
              )}
            </div>
            <div className="text-sm font-medium text-gray-600">
              Total Courses
            </div>
          </div>
          <div className="text-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Object.values(dashboardData).reduce(
                (sum, data) => sum + (data.timetables?.length || 0),
                0
              )}
            </div>
            <div className="text-sm font-medium text-gray-600">
              Active Timetables
            </div>
          </div>
        </div>
      </div>

      {/* NEP 2020 Compliance Summary */}
      <div className="mt-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Award className="w-6 h-6 mr-2 text-yellow-600" />
          NEP 2020 Compliance Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
              Multidisciplinary Approach
            </h4>
            <div className="space-y-3">
              {selectedPrograms.map((program) => {
                const config = programConfigs[program];
                const data = dashboardData[program] || {};
                const multidisciplinaryCourses = (data.courses || []).filter(
                  (c) => c.isMultidisciplinary
                ).length;
                const totalCourses = data.courses?.length || 0;
                const percentage =
                  totalCourses > 0
                    ? Math.round(
                      (multidisciplinaryCourses / totalCourses) * 100
                    )
                    : 0;

                return (
                  <div
                    key={program}
                    className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 bg-gradient-to-r ${config.color} rounded-full mr-3`}
                      ></div>
                      <span className="text-sm font-semibold text-gray-900">
                        {program}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      {percentage}% multidisciplinary
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Flexible Credit System
            </h4>
            <div className="space-y-3">
              {selectedPrograms.map((program) => {
                const config = programConfigs[program];
                const data = dashboardData[program] || {};
                const metrics = calculateProgramMetrics(program, data);

                return (
                  <div
                    key={program}
                    className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 bg-gradient-to-r ${config.color} rounded-full mr-3`}
                      ></div>
                      <span className="text-sm font-semibold text-gray-900">
                        {program}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-bold px-3 py-1 rounded-full ${metrics.complianceRate >= 80
                          ? "bg-green-100 text-green-800"
                          : metrics.complianceRate >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {metrics.complianceRate}% compliant
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultiProgramDashboard;
