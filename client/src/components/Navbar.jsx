"use client";

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { logout } from "../utils/auth";
import {
  Calendar,
  Menu,
  X,
  User,
  LogOut,
  Home,
  Info,
  Users,
  Settings,
} from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    authLogout();
    navigate("/", { replace: true });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-gradient-to-r from-indigo-600/95 via-blue-600/95 to-purple-600/95 backdrop-blur-xl shadow-2xl border-b border-white/20"
          : "bg-gradient-to-r from-indigo-600/70 via-blue-600/70 to-purple-600/70 backdrop-blur-lg shadow-xl border-b border-white/10"
      }`}
    >
      {/* Decorative background elements */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          isScrolled
            ? "bg-gradient-to-r from-indigo-600/30 to-purple-600/30"
            : "bg-gradient-to-r from-indigo-600/10 to-purple-600/10"
        }`}
      ></div>
      <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-20 -translate-y-20"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-16 translate-y-16"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center group">
              <Link
                to="/"
                className="flex items-center space-x-3 text-white hover:text-blue-100 transition-colors duration-300"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-lg blur-sm group-hover:blur-none transition-all duration-300"></div>
                  <Calendar className="relative w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  EduSync
                </span>
              </Link>
            </div>

            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              <Link
                to="/"
                className="group flex items-center space-x-2 text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
              >
                <Home className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span>Home</span>
              </Link>
              <Link
                to="/about"
                className="group flex items-center space-x-2 text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
              >
                <Info className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span>About</span>
              </Link>
              <Link
                to="/teachers"
                className="group flex items-center space-x-2 text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
              >
                <Users className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span>Teachers</span>
              </Link>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white text-sm font-medium">
                    Welcome, {user.name}
                  </span>
                </div>
                <Link
                  to={
                    user.role === "admin"
                      ? "/admin-dashboard"
                      : user.role === "teacher"
                      ? "/teacher-dashboard"
                      : "/student-dashboard"
                  }
                  className="group flex items-center space-x-2 text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  <Settings className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="group flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group flex items-center space-x-2 text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                  onClick={() =>
                    console.log(
                      "[v0] Navbar Login button clicked, navigating to /login"
                    )
                  }
                >
                  <User className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register-admin"
                  className="group flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <Settings className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Register Admin</span>
                </Link>
              </>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50 transition-all duration-300"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6 rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="block h-6 w-6 hover:rotate-12 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden relative bg-white/10 backdrop-blur-xl border-t border-white/20">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link
              to="/"
              className="group flex items-center space-x-3 text-white hover:bg-white/10 hover:text-white px-4 py-3 rounded-lg text-base font-medium transition-all duration-300"
            >
              <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Home</span>
            </Link>
            <Link
              to="/about"
              className="group flex items-center space-x-3 text-white hover:bg-white/10 hover:text-white px-4 py-3 rounded-lg text-base font-medium transition-all duration-300"
            >
              <Info className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>About</span>
            </Link>
            <Link
              to="/teachers"
              className="group flex items-center space-x-3 text-white hover:bg-white/10 hover:text-white px-4 py-3 rounded-lg text-base font-medium transition-all duration-300"
            >
              <Users className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Teachers</span>
            </Link>

            <div className="border-t border-white/20 pt-4 mt-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3 bg-white/10 rounded-lg mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white text-base font-medium">
                      Welcome, {user.name}
                    </span>
                  </div>
                  <Link
                    to={
                      user.role === "admin"
                        ? "/admin-dashboard"
                        : user.role === "teacher"
                        ? "/teacher-dashboard"
                        : "/student-dashboard"
                    }
                    className="group flex items-center space-x-3 text-white hover:bg-white/10 hover:text-white px-4 py-3 rounded-lg text-base font-medium transition-all duration-300"
                  >
                    <Settings className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="group flex items-center space-x-3 bg-white/20 hover:bg-white/30 text-white w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="group flex items-center space-x-3 text-white hover:bg-white/10 hover:text-white px-4 py-3 rounded-lg text-base font-medium transition-all duration-300"
                    onClick={() =>
                      console.log(
                        "[v0] Mobile Navbar Login button clicked, navigating to /login"
                      )
                    }
                  >
                    <User className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register-admin"
                    className="group flex items-center space-x-3 bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg text-base font-medium transition-all duration-300"
                  >
                    <Settings className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Register Admin</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
