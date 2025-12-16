"use client";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import HomePage from "./components/HomePage";
import AboutPage from "./components/AboutPage";
import TeachersPage from "./components/TeachersPage";
import RegisterAdminPage from "./components/RegisterAdminPage";
import AdminRegistration from "./components/AdminRegistration";
import Schedule from "./pages/schedule";
import ReportsDashboard from "./components/ReportsDashboard";
import ConflictViewer from "./components/ConflictViewer";
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Protected route component
  const ProtectedRoute = ({ element, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on role
      switch (user.role) {
        case "admin":
          return <Navigate to="/admin-dashboard" replace />;
        case "teacher":
          return <Navigate to="/teacher-dashboard" replace />;
        case "student":
          return <Navigate to="/student-dashboard" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }

    return element;
  };

  // Public route component that redirects authenticated users
  const PublicRoute = ({ element }) => {
    if (user) {
      // Redirect authenticated users to their dashboard
      switch (user.role) {
        case "admin":
          return <Navigate to="/admin-dashboard" replace />;
        case "teacher":
          return <Navigate to="/teacher-dashboard" replace />;
        case "student":
          return <Navigate to="/student-dashboard" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
    return element;
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route
          path="/login"
          element={
            <PublicRoute
              element={
                <>
                  {console.log("[v0] Rendering /login route")}
                  <Login />
                </>
              }
            />
          }
        />
        <Route path="/register-admin" element={<AdminRegistration />} />
        {/* <Route path="/register-admin" element={<RegisterAdminPage />} /> */}

        {/* Protected routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute
              element={<AdminDashboard />}
              allowedRoles={["admin"]}
            />
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute
              element={<TeacherDashboard />}
              allowedRoles={["teacher"]}
            />
          }
        />
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute
              element={<StudentDashboard />}
              allowedRoles={["student"]}
            />
          }
        />
        {/* add protected route to schedule page (all roles) */}
        <Route
          path="/schedule"
          element={
            <ProtectedRoute
              element={<Schedule />}
              allowedRoles={["admin", "teacher", "student"]}
            />
          }
        />
        {/* add reports dashboard (admin + teacher) */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute
              element={<ReportsDashboard />}
              allowedRoles={["admin", "teacher"]}
            />
          }
        />
        {/* add conflict viewer (admin only) */}
        <Route
          path="/conflicts"
          element={
            <ProtectedRoute
              element={<ConflictViewer />}
              allowedRoles={["admin"]}
            />
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
