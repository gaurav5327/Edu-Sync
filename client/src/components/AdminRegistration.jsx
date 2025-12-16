"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  validateAdminRegistrationForm,
  validateField,
  getEnhancedErrorMessage,
  getSuccessMessage,
} from "../utils/validation";
import ErrorMessage from "./shared/ErrorMessage";
import SuccessMessage from "./shared/SuccessMessage";
import LoadingOverlay from "./shared/LoadingOverlay";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  User,
  Mail,
  Lock,
  Shield,
  Building,
  Eye,
  EyeOff,
  UserPlus,
  Loader2,
  Settings,
  Users,
  Clock,
  BarChart3,
  Crown,
  Star,
} from "lucide-react";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/auth`;

function AdminRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminId: "",
    department: "Administration",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));

    // Clear field-specific errors when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Real-time validation for better UX (only after first submit attempt)
    if (hasSubmitted) {
      const fieldError = validateField(name, value, {
        ...formData,
        [name]: value,
        role: "admin",
      });
      if (fieldError) {
        setFieldErrors((prev) => ({ ...prev, [name]: fieldError }));
      } else {
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    // Validate form before submission
    const validation = validateAdminRegistrationForm(formData);

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      toast.error("Please correct the errors below and try again.");
      return;
    }

    // Clear previous errors and start loading
    setFieldErrors({});
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/register`, {
        ...formData,
        role: "admin",
      });

      // Show enhanced success message
      const successMsg = getSuccessMessage("admin_register", {
        name: formData.name,
      });
      toast.success(successMsg);
      setSuccess(true);

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        adminId: "",
        department: "Administration",
      });

      // Redirect to login after successful registration
      setTimeout(() => {
        window.location.href = "/login";
      }, 2500);
    } catch (error) {
      const enhancedError = getEnhancedErrorMessage(error);
      toast.error(enhancedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-8rem)]">
              {/* Left Panel - Branding */}
              <div className="text-white text-center lg:text-left">
                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
                    <Shield className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-sm font-medium">Secure Access</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
                    <Settings className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="text-sm font-medium">Full Control</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
                    <Crown className="w-4 h-4 text-purple-400 mr-2" />
                    <span className="text-sm font-medium">Admin Access</span>
                  </div>
                </div>

                {/* Headline */}
                <h1 className="text-3xl lg:text-5xl font-bold leading-tight mb-4">
                  <span className="block">Admin Registration</span>
                  <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                    EduSync
                  </span>
                </h1>

                <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                  Create your administrator account to manage the scheduling
                  system
                </p>

                {/* Key Features */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-center lg:justify-start">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                      <Users className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-blue-100">
                      Manage users and permissions
                    </span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start">
                    <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                      <Clock className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-blue-100">
                      Control scheduling system
                    </span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                      <BarChart3 className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-blue-100">
                      Access analytics and reports
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Panel - Registration Form */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 relative">
                    {/* Loading Overlay */}
                    <LoadingOverlay
                      isVisible={loading}
                      message="Creating your admin account..."
                      variant="default"
                      size="medium"
                    />

                    {/* Success Overlay */}
                    <LoadingOverlay
                      isVisible={success && !loading}
                      message="Registration successful! Redirecting..."
                      variant="default"
                      size="medium"
                    />

                    {/* Form Header */}
                    <div className="text-center mb-8">
                      <div className="flex justify-center mb-4">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-full">
                          <UserPlus className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                        Create Admin Account
                      </h2>
                      <p className="mt-2 text-gray-600">
                        Fill in the details to register as an administrator
                      </p>
                    </div>



                    {/* Registration Form */}
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-6"
                      noValidate
                    >
                      {/* Full Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${fieldErrors.name
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300 bg-white/50"
                              }`}
                            placeholder="Enter your full name"
                          />
                        </div>
                        {fieldErrors.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {fieldErrors.name}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${fieldErrors.email
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300 bg-white/50"
                              }`}
                            placeholder="Enter your email address"
                          />
                        </div>
                        {fieldErrors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {fieldErrors.email}
                          </p>
                        )}
                      </div>

                      {/* Password */}
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className={`block w-full pl-10 pr-12 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${fieldErrors.password
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300 bg-white/50"
                              }`}
                            placeholder="Create a strong password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        </div>
                        {fieldErrors.password && (
                          <p className="mt-1 text-sm text-red-600">
                            {fieldErrors.password}
                          </p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`block w-full pl-10 pr-12 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${fieldErrors.confirmPassword
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300 bg-white/50"
                              }`}
                            placeholder="Confirm your password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        </div>
                        {fieldErrors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">
                            {fieldErrors.confirmPassword}
                          </p>
                        )}
                      </div>

                      {/* Admin ID */}
                      <div>
                        <label
                          htmlFor="adminId"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Admin ID
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Shield className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="adminId"
                            name="adminId"
                            type="text"
                            required
                            value={formData.adminId}
                            onChange={handleChange}
                            className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${fieldErrors.adminId
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300 bg-white/50"
                              }`}
                            placeholder="Enter your admin ID"
                          />
                        </div>
                        {fieldErrors.adminId && (
                          <p className="mt-1 text-sm text-red-600">
                            {fieldErrors.adminId}
                          </p>
                        )}
                      </div>

                      {/* Department
                      <div>
                        <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-2">
                          Department
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building className="h-5 w-5 text-gray-400" />
                          </div>
                          <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                          >
                            <option value="Administration">Administration</option>
                            <option value="Academic Affairs">Academic Affairs</option>
                            <option value="IT Department">IT Department</option>
                            <option value="Student Affairs">Student Affairs</option>
                          </select>
                        </div>
                      </div> */}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 ${loading ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Create Admin Account
                          </>
                        )}
                      </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <a
                          href="/login"
                          className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                        >
                          Sign in here
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminRegistration;
