"use client";

import { useState, useEffect } from "react";
import { login, redirectBasedOnRole } from "../utils/auth";
import { validateLoginForm, validateField, getEnhancedErrorMessage, getSuccessMessage } from "../utils/validation";
import ErrorMessage from "./shared/ErrorMessage";
import SuccessMessage from "./shared/SuccessMessage";
import LoadingOverlay from "./shared/LoadingOverlay";
import FormField from "./shared/FormField";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Loader2,
  CheckCircle,
  Shield,
  Star,
} from "lucide-react";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [fieldSuccess, setFieldSuccess] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      });
    }, observerOptions);

    // Observe all elements with scroll-animate class
    const animateElements = document.querySelectorAll(".scroll-animate");
    animateElements.forEach((el) => observer.observe(el));

    return () => {
      animateElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("[v0] Form field changed:", name, value);
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    
    // Clear field-specific errors when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    
    // Clear general error when user starts typing
    if (error) {
      setError("");
    }
    
    // Clear success messages when user starts typing
    if (success) {
      setSuccess("");
    }
    
    // Real-time validation for better UX (only after first submit attempt)
    if (hasSubmitted) {
      const fieldError = validateField(name, value, formData);
      if (fieldError) {
        setFieldErrors((prev) => ({ ...prev, [name]: fieldError }));
        setFieldSuccess((prev) => ({ ...prev, [name]: "" }));
      } else {
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
        // Show success for valid fields (except password for security)
        if (name !== 'password' && value.trim()) {
          setFieldSuccess((prev) => ({ ...prev, [name]: "✓ Valid" }));
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    console.log("[v0] Form submit triggered");
    e.preventDefault();
    console.log("[v0] Form submission prevented default");

    setHasSubmitted(true);

    // Validate form before submission
    const validation = validateLoginForm(formData);
    
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setError("Please correct the errors below and try again.");
      
      // Add shake animation to form on validation error
      const formElement = document.querySelector('.login-form');
      if (formElement) {
        formElement.classList.add('shake-animation');
        setTimeout(() => {
          formElement.classList.remove('shake-animation');
        }, 600);
      }
      return;
    }

    // Clear previous errors and start loading
    setFieldErrors({});
    setFieldSuccess({});
    setError("");
    setSuccess("");
    setIsLoading(true);
    console.log("[v0] Loading state set to true, error cleared");

    try {
      console.log("[v0] Attempting login with:", formData.email);
      const user = await login(formData.email, formData.password);
      console.log("[v0] Login successful:", user);

      // Show success state with enhanced message
      const successMsg = getSuccessMessage('login', user);
      setSuccess(successMsg);
      setIsSuccess(true);
      
      // Delay redirect to show success animation
      setTimeout(() => {
        redirectBasedOnRole(user);
      }, 1500);
    } catch (error) {
      console.error("[v0] Login error:", error);
      const enhancedError = getEnhancedErrorMessage(error);
      setError(enhancedError);
      
      // Add shake animation to form on error
      const formElement = document.querySelector('.login-form');
      if (formElement) {
        formElement.classList.add('shake-animation');
        setTimeout(() => {
          formElement.classList.remove('shake-animation');
        }, 600);
      }
    } finally {
      if (!isSuccess) {
        setIsLoading(false);
      }
      console.log("[v0] Loading state set to false");
    }
  };

  const handleButtonClick = (e) => {
    console.log("[v0] Button clicked directly");
    console.log("[v0] Button type:", e.target.type);
    console.log("[v0] Form data:", formData);
    console.log("[v0] Is loading:", isLoading);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div 
        className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 min-h-screen flex items-center auth-container pt-16"
        role="main"
        aria-label="Login page"
      >
      {/* Skip navigation link for keyboard users */}
      <a 
        href="#login-form-heading" 
        className="skip-link focus-visible-ring"
        aria-label="Skip to login form"
      >
        Skip to login form
      </a>
      {/* Enhanced Animation Styles */}
      <style>{`
        /* Scroll Animation Styles */
        .scroll-animate {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s ease-out;
        }

        .scroll-animate.animate {
          opacity: 1;
          transform: translateY(0);
        }

        .scroll-animate[data-animate="fadeInUp"] {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s ease-out;
        }

        .scroll-animate[data-animate="fadeInUp"].animate {
          opacity: 1;
          transform: translateY(0);
        }

        .scroll-animate[data-animate="fadeInLeft"] {
          opacity: 0;
          transform: translateX(-50px);
          transition: all 0.8s ease-out;
        }

        .scroll-animate[data-animate="fadeInLeft"].animate {
          opacity: 1;
          transform: translateX(0);
        }

        .scroll-animate[data-animate="fadeInRight"] {
          opacity: 0;
          transform: translateX(50px);
          transition: all 0.8s ease-out;
        }

        .scroll-animate[data-animate="fadeInRight"].animate {
          opacity: 1;
          transform: translateX(0);
        }

        .scroll-animate[data-animate="scaleIn"] {
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.8s ease-out;
        }

        .scroll-animate[data-animate="scaleIn"].animate {
          opacity: 1;
          transform: scale(1);
        }

        /* Form Animation Styles */
        .form-field-focus {
          transform: scale(1.02);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-field-error {
          animation: field-error-shake 0.4s ease-in-out;
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }

        @keyframes field-error-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .shake-animation {
          animation: shake 0.6s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        /* Loading Overlay */
        .loading-overlay {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        /* Success Animation */
        .success-pulse {
          animation: success-pulse 0.6s ease-out;
        }

        @keyframes success-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        /* Enhanced Hover Effects */
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        /* Enhanced Focus Indicators for Accessibility */
        .focus-visible-ring {
          outline: none;
          transition: all 0.2s ease-in-out;
        }

        .focus-visible-ring:focus-visible {
          outline: 3px solid #fbbf24;
          outline-offset: 2px;
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.3);
        }

        .focus-visible-ring:focus {
          outline: 3px solid #fbbf24;
          outline-offset: 2px;
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.3);
        }

        /* High contrast focus for gradient backgrounds */
        .gradient-focus:focus-visible {
          outline: 3px solid #ffffff;
          outline-offset: 2px;
          box-shadow: 0 0 0 6px rgba(251, 191, 36, 0.8);
          background-color: rgba(255, 255, 255, 0.1);
        }

        .gradient-focus:focus {
          outline: 3px solid #ffffff;
          outline-offset: 2px;
          box-shadow: 0 0 0 6px rgba(251, 191, 36, 0.8);
          background-color: rgba(255, 255, 255, 0.1);
        }

        /* Enhanced accessibility focus indicators for split-screen layout */
        .auth-panel:focus-within {
          outline: none;
          outline-offset: 4px;
        }

        /* Skip link for keyboard navigation */
        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #000;
          color: #fff;
          padding: 8px;
          text-decoration: none;
          border-radius: 4px;
          z-index: 1000;
          transition: top 0.3s;
        }

        .skip-link:focus {
          top: 6px;
        }

        /* Screen reader only content */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Mobile-specific optimizations */
        @media (max-width: 768px) {
          .auth-container {
            padding: 0.75rem;
            min-height: 100vh;
            min-height: 100dvh; /* Dynamic viewport height for mobile browsers */
          }
          
          .auth-grid {
            gap: 1rem;
            padding: 0;
            min-height: calc(100vh - 1.5rem);
            min-height: calc(100dvh - 1.5rem);
          }
          
          .login-form {
            margin: 0;
            padding: 1.25rem;
            max-width: 100%;
            border-radius: 1rem;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
          
          .mobile-stack {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          
          .mobile-touch-target {
            min-height: 48px;
            min-width: 48px;
            padding: 0.75rem;
          }
          
          .mobile-form-field {
            padding: 1rem 0.875rem;
            font-size: 16px; /* Prevents zoom on iOS */
            border-radius: 0.75rem;
            min-height: 52px;
          }
          
          .mobile-button {
            padding: 1rem 2rem;
            font-size: 1.1rem;
            min-height: 56px;
            border-radius: 0.875rem;
            font-weight: 600;
          }
          
          .mobile-text-large {
            font-size: 1.125rem;
            line-height: 1.6;
          }
          
          .mobile-spacing {
            margin-bottom: 1.25rem;
          }
          
          .mobile-header-spacing {
            margin-bottom: 1rem;
          }
          
          .mobile-compact-spacing {
            margin-bottom: 0.75rem;
          }
          
          /* Enhanced mobile typography */
          .mobile-title {
            font-size: 1.5rem;
            line-height: 1.3;
            margin-bottom: 0.5rem;
          }
          
          .mobile-subtitle {
            font-size: 0.875rem;
            line-height: 1.4;
            margin-bottom: 1.5rem;
          }
          
          .mobile-label {
            font-size: 0.875rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }
          
          /* Optimize floating orbs for mobile performance */
          .floating-orb {
            opacity: 0.2 !important;
            animation-duration: 4s !important;
            will-change: transform;
          }
          
          /* Mobile-specific animations with performance optimization */
          .mobile-fade-in {
            animation: mobile-fade-in 0.5s ease-out;
          }
          
          @keyframes mobile-fade-in {
            from {
              opacity: 0;
              transform: translateY(15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Mobile form enhancements */
          .mobile-form-container {
            padding: 1rem;
            margin: 0.5rem 0;
          }
          
          .mobile-input-group {
            margin-bottom: 1.25rem;
          }
          
          .mobile-input-icon {
            left: 0.875rem;
            width: 1.125rem;
            height: 1.125rem;
          }
          
          .mobile-input-padding {
            padding-left: 2.75rem;
            padding-right: 0.875rem;
          }
          
          /* Mobile button enhancements */
          .mobile-button-group {
            gap: 0.75rem;
            margin-top: 1.5rem;
          }
          
          .mobile-link-button {
            padding: 0.75rem;
            font-size: 0.875rem;
            min-height: 44px;
          }
          
          /* Mobile trust badges optimization */
          .mobile-trust-badges {
            gap: 0.5rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .mobile-trust-badge {
            padding: 0.5rem 0.75rem;
            font-size: 0.75rem;
            border-radius: 1rem;
          }
          
          /* Mobile feature highlights */
          .mobile-feature-item {
            padding: 0.5rem 0;
            font-size: 0.875rem;
          }
          
          .mobile-feature-dot {
            width: 0.375rem;
            height: 0.375rem;
            margin-right: 0.75rem;
          }
        }

        /* Tablet optimizations */
        @media (min-width: 769px) and (max-width: 1023px) {
          .auth-container {
            padding: 1.5rem;
          }
          
          .auth-grid {
            gap: 2rem;
            max-width: 900px;
            margin: 0 auto;
          }
          
          .login-form {
            max-width: 420px;
            padding: 2rem;
          }
          
          .tablet-spacing {
            margin-bottom: 2rem;
          }
          
          .tablet-title {
            font-size: 2rem;
            line-height: 1.2;
          }
          
          .tablet-subtitle {
            font-size: 1rem;
            line-height: 1.5;
          }
          
          .tablet-form-field {
            padding: 0.875rem 1rem;
            font-size: 1rem;
            min-height: 48px;
          }
          
          .tablet-button {
            padding: 0.875rem 1.75rem;
            font-size: 1rem;
            min-height: 50px;
          }
        }

        /* Touch-friendly enhancements for all devices */
        @media (pointer: coarse) {
          .touch-target {
            min-height: 44px;
            min-width: 44px;
            padding: 0.75rem;
            border-radius: 0.5rem;
          }
          
          .touch-button {
            min-height: 48px;
            padding: 0.875rem 1.5rem;
            border-radius: 0.75rem;
            font-weight: 600;
          }
          
          .touch-input {
            padding: 1rem;
            font-size: 16px;
            border-radius: 0.75rem;
            min-height: 48px;
          }
          
          .touch-icon-button {
            min-height: 48px;
            min-width: 48px;
            padding: 0.75rem;
            border-radius: 0.5rem;
          }
          
          /* Enhanced touch feedback */
          .touch-feedback:active {
            transform: scale(0.98);
            transition: transform 0.1s ease-out;
          }
          
          .touch-ripple {
            position: relative;
            overflow: hidden;
          }
          
          .touch-ripple::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s;
          }
          
          .touch-ripple:active::after {
            width: 200px;
            height: 200px;
          }
        }

        /* Reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          /* Disable all animations */
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
          
          .scroll-animate,
          .animate-pulse,
          .animate-bounce,
          .animate-spin,
          .animate-ping {
            animation: none !important;
          }
          
          .hover-lift:hover,
          .hover\\:scale-105:hover,
          .hover\\:scale-110:hover,
          .group-hover\\:scale-110,
          .hover\\:translate-x-2:hover,
          .hover\\:translate-y-2:hover {
            transform: none !important;
          }
          
          .transition-all,
          .transition-transform,
          .transition-opacity,
          .transition-colors,
          .transition-shadow {
            transition: none !important;
          }
          
          .mobile-fade-in,
          .success-pulse,
          .shake-animation {
            animation: none !important;
          }
          
          /* Maintain focus indicators for accessibility */
          .focus-visible-ring:focus-visible,
          .focus-visible-ring:focus,
          .gradient-focus:focus-visible,
          .gradient-focus:focus {
            transition: outline 0.01ms, box-shadow 0.01ms !important;
          }
          
          /* Keep essential loading indicators but reduce motion */
          .loading-spinner {
            animation: reduced-spin 2s linear infinite !important;
          }
          
          @keyframes reduced-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        }

        /* Button Ripple Effect */
        .btn-ripple {
          position: relative;
          overflow: hidden;
        }

        .btn-ripple::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .btn-ripple:active::before {
          width: 300px;
          height: 300px;
        }

        /* Staggered Animation Delays */
        .animate-delay-100 { animation-delay: 0.1s; }
        .animate-delay-200 { animation-delay: 0.2s; }
        .animate-delay-300 { animation-delay: 0.3s; }
        .animate-delay-400 { animation-delay: 0.4s; }
        .animate-delay-500 { animation-delay: 0.5s; }
      `}</style>
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

      {/* Floating Orbs with Enhanced Animation - matching HomePage */}
      <div 
        className="absolute top-20 left-10 w-20 sm:w-24 md:w-28 lg:w-32 h-20 sm:h-24 md:h-28 lg:h-32 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-xl animate-pulse opacity-30 sm:opacity-40 md:opacity-50 lg:opacity-60 hover:opacity-80 transition-opacity duration-1000 floating-orb"
        aria-hidden="true"
      ></div>
      <div
        className="absolute top-40 right-20 w-16 sm:w-20 md:w-22 lg:w-24 h-16 sm:h-20 md:h-22 lg:h-24 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-xl animate-pulse opacity-25 sm:opacity-35 md:opacity-45 lg:opacity-50 hover:opacity-70 transition-opacity duration-1000 floating-orb"
        style={{ animationDelay: "1s" }}
        aria-hidden="true"
      ></div>
      <div
        className="absolute bottom-40 left-20 w-14 sm:w-16 md:w-18 lg:w-20 h-14 sm:h-16 md:h-18 lg:h-20 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full blur-xl animate-pulse opacity-20 sm:opacity-30 md:opacity-35 lg:opacity-40 hover:opacity-60 transition-opacity duration-1000 floating-orb"
        style={{ animationDelay: "2s" }}
        aria-hidden="true"
      ></div>
      <div
        className="absolute bottom-20 right-10 w-18 sm:w-22 md:w-24 lg:w-28 h-18 sm:h-22 md:h-24 lg:h-28 bg-gradient-to-r from-violet-400/30 to-pink-400/30 rounded-full blur-xl animate-pulse opacity-25 sm:opacity-35 md:opacity-45 lg:opacity-55 hover:opacity-75 transition-opacity duration-1000 floating-orb"
        style={{ animationDelay: "0.5s" }}
        aria-hidden="true"
      ></div>

      {/* Additional Subtle Orbs */}
      <div
        className="absolute top-1/3 left-1/4 w-10 sm:w-12 md:w-14 lg:w-16 h-10 sm:h-12 md:h-14 lg:h-16 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-lg animate-pulse opacity-15 sm:opacity-20 md:opacity-25 lg:opacity-30 floating-orb"
        style={{ animationDelay: "3s" }}
        aria-hidden="true"
      ></div>
      <div
        className="absolute top-2/3 right-1/3 w-8 sm:w-10 md:w-11 lg:w-12 h-8 sm:h-10 md:h-11 lg:h-12 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-lg animate-pulse opacity-12 sm:opacity-17 md:opacity-20 lg:opacity-25 floating-orb"
        style={{ animationDelay: "4s" }}
        aria-hidden="true"
      ></div>

      <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 md:py-8 lg:py-12">
        <div 
          className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-12 items-center min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-2rem)] lg:min-h-0 auth-grid"
          role="group"
          aria-label="Login page content with branding and form"
        >
          {/* Left Panel - Branded Content */}
          <section 
            className="text-white lg:col-span-2 text-center lg:text-left order-1 lg:order-1 auth-panel px-2 sm:px-4 lg:px-0"
            aria-labelledby="welcome-heading"
            role="banner"
          >
            {/* Trust Badges */}
            <div 
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6 lg:mb-8 scroll-animate animate-delay-100 mobile-trust-badges" 
              data-animate="fadeInLeft"
              role="list"
              aria-label="Security and trust indicators"
            >
              <div 
                className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1.5 sm:py-2 hover-lift hover:bg-white/20 transition-all duration-300 gradient-focus mobile-touch-target touch-target touch-feedback mobile-trust-badge"
                role="listitem"
                tabIndex="0"
                aria-label="Secure login verification badge"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.currentTarget.click();
                  }
                }}
              >
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 mr-1 sm:mr-1.5 md:mr-2" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-medium">Secure Login</span>
              </div>
              <div 
                className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1.5 sm:py-2 hover-lift hover:bg-white/20 transition-all duration-300 gradient-focus mobile-touch-target touch-target touch-feedback mobile-trust-badge"
                role="listitem"
                tabIndex="0"
                aria-label="Protected system badge"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.currentTarget.click();
                  }
                }}
              >
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 mr-1 sm:mr-1.5 md:mr-2" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-medium">Protected</span>
              </div>
              <div 
                className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1.5 sm:py-2 hover-lift hover:bg-white/20 transition-all duration-300 gradient-focus mobile-touch-target touch-target touch-feedback mobile-trust-badge"
                role="listitem"
                tabIndex="0"
                aria-label="Trusted platform badge"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.currentTarget.click();
                  }
                }}
              >
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-1 sm:mr-1.5 md:mr-2" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-medium">Trusted</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 
              id="welcome-heading"
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-2 sm:mb-3 md:mb-4 lg:mb-6 scroll-animate animate-delay-200 mobile-title tablet-title" 
              data-animate="fadeInLeft"
            >
              <span className="block">Welcome Back to</span>
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                EduSync
              </span>
            </h1>

            <p 
              className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 mb-3 sm:mb-4 md:mb-6 lg:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-1 sm:px-2 lg:px-0 scroll-animate animate-delay-300 mobile-text-large mobile-subtitle tablet-subtitle" 
              data-animate="fadeInLeft"
              aria-describedby="welcome-heading"
            >
              Continue your journey of effortless scheduling and time management
              with the most intelligent timetable generator.
            </p>
            
            {/* Screen reader description for visual elements */}
            <div className="sr-only" aria-live="polite">
              This page features an animated gradient background with floating decorative elements. 
              The login form is located on the right side of the screen on desktop, or below this content on mobile devices.
            </div>

            {/* Feature Highlights */}
            <div 
              className="grid grid-cols-1 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6 lg:mb-8 px-1 sm:px-2 lg:px-0 scroll-animate animate-delay-400 mobile-spacing" 
              data-animate="fadeInLeft"
              role="list"
              aria-label="Key features of TimetableMaster"
            >
              <div 
                className="flex items-center justify-center lg:justify-start hover:translate-x-2 transition-transform duration-300 mobile-feature-item"
                role="listitem"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 sm:mr-3 flex-shrink-0 animate-pulse mobile-feature-dot" aria-hidden="true"></div>
                <span className="text-blue-100 text-xs sm:text-sm md:text-base">
                  AI-powered conflict detection
                </span>
              </div>
              <div 
                className="flex items-center justify-center lg:justify-start hover:translate-x-2 transition-transform duration-300 mobile-feature-item"
                role="listitem"
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 sm:mr-3 flex-shrink-0 animate-pulse mobile-feature-dot" style={{animationDelay: "0.5s"}} aria-hidden="true"></div>
                <span className="text-blue-100 text-xs sm:text-sm md:text-base">
                  Instant schedule generation
                </span>
              </div>
              <div 
                className="flex items-center justify-center lg:justify-start hover:translate-x-2 transition-transform duration-300 mobile-feature-item"
                role="listitem"
              >
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 sm:mr-3 flex-shrink-0 animate-pulse mobile-feature-dot" style={{animationDelay: "1s"}} aria-hidden="true"></div>
                <span className="text-blue-100 text-xs sm:text-sm md:text-base">
                  Smart resource optimization
                </span>
              </div>
            </div>
          </section>

          {/* Right Panel - Login Form */}
          <section 
            className="lg:col-span-3 mt-2 sm:mt-4 md:mt-6 lg:mt-0 order-2 lg:order-2 auth-panel scroll-animate animate-delay-100 px-1 sm:px-2 md:px-0" 
            data-animate="fadeInRight"
            aria-labelledby="login-form-heading"
            role="form"
          >
            <div className={`bg-white/90 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 p-3 sm:p-4 md:p-6 lg:p-8 max-w-md mx-auto w-full login-form hover-lift mobile-fade-in mobile-form-container ${isSuccess ? 'success-pulse' : ''}`}>
              {/* Loading Overlay */}
              {isLoading && (
                <div 
                  className="absolute inset-0 bg-white/50 loading-overlay rounded-2xl flex items-center justify-center z-10"
                  role="status"
                  aria-live="polite"
                  aria-label="Signing in, please wait"
                >
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" aria-hidden="true" />
                    <p className="text-sm text-gray-600">Signing you in...</p>
                  </div>
                </div>
              )}

              {/* Loading Overlay */}
              <LoadingOverlay 
                isVisible={isLoading}
                message="Signing you in..."
                variant="default"
                size="medium"
              />

              {/* Success Overlay */}
              <LoadingOverlay 
                isVisible={isSuccess}
                message="Welcome back! Redirecting..."
                variant="default"
                size="medium"
              />

              {/* Form Header */}
              <div className="text-center mb-3 sm:mb-4 md:mb-6 lg:mb-8 scroll-animate animate-delay-300 mobile-header-spacing" data-animate="scaleIn">
                <div className="flex justify-center mb-2 sm:mb-3 md:mb-4 lg:mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-2 sm:p-2.5 md:p-3 lg:p-4 rounded-full hover:scale-110 transition-transform duration-300 touch-target">
                      <LogIn className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                  </div>
                </div>
                <h2 
                  id="login-form-heading"
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mobile-title tablet-title"
                >
                  Log In to Your Account
                </h2>
                <p className="mt-1 sm:mt-1.5 md:mt-2 text-xs sm:text-sm md:text-base text-gray-600 mobile-subtitle tablet-subtitle">
                  Sign in to continue your scheduling journey
                </p>
              </div>
              <form 
                className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 mobile-stack" 
                onSubmit={handleSubmit}
                noValidate
                aria-describedby={error ? "login-error" : undefined}
              >
                {/* Email Field */}
                <div className="scroll-animate animate-delay-400 mobile-input-group" data-animate="fadeInUp">
                  <FormField
                    id="email"
                    name="email"
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    icon={Mail}
                    error={fieldErrors.email}
                    success={fieldSuccess.email}
                    className="mobile-input-group"
                    inputClassName="mobile-form-field touch-input tablet-form-field bg-white/50 backdrop-blur-sm hover:bg-white/70"
                    labelClassName="mobile-label"
                  />
                </div>

                {/* Password Field */}
                <div className="scroll-animate animate-delay-500 mobile-input-group" data-animate="fadeInUp">
                  <FormField
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    icon={Lock}
                    error={fieldErrors.password}
                    success={fieldSuccess.password}
                    showPasswordToggle={true}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    className="mobile-input-group"
                    inputClassName="mobile-form-field touch-input tablet-form-field bg-white/50 backdrop-blur-sm hover:bg-white/70"
                    labelClassName="mobile-label"
                  />
                </div>

                {/* Error Message */}
                <ErrorMessage 
                  message={error}
                  onDismiss={() => setError("")}
                  dismissible={true}
                  id="login-error"
                  className="mobile-compact-spacing"
                />

                {/* Success Message */}
                <SuccessMessage 
                  message={success}
                  onDismiss={() => setSuccess("")}
                  dismissible={false}
                  id="login-success"
                  className="mobile-compact-spacing"
                />

                {/* Submit Button */}
                <div className="scroll-animate animate-delay-500 mobile-button-group" data-animate="fadeInUp">
                  <button
                    type="submit"
                    disabled={isLoading || isSuccess}
                    onClick={handleButtonClick}
                    className={`group relative w-full flex justify-center items-center py-3 sm:py-4 px-4 border border-transparent text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg touch-manipulation min-h-[52px] btn-ripple focus-visible-ring mobile-button touch-button tablet-button touch-feedback touch-ripple ${
                      isLoading || isSuccess
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:shadow-xl hover:-translate-y-0.5"
                    } ${isSuccess ? 'bg-gradient-to-r from-green-600 to-emerald-600' : ''}`}
                    aria-describedby={isLoading ? "loading-status" : isSuccess ? "success-status" : undefined}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 animate-spin loading-spinner" />
                        <span className="text-sm sm:text-base font-medium">
                          Signing in...
                        </span>
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 animate-bounce" />
                        <span className="text-sm sm:text-base font-medium">Success!</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-sm sm:text-base font-medium">Sign in</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Additional Links */}
              <div className="mt-4 sm:mt-5 md:mt-6 text-center animate-delay-100 mobile-spacing" data-animate="fadeInUp">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <a
                    href="/register-admin"
                    className="font-semibold text-blue-600 hover:text-blue-500 transition-all duration-300 touch-manipulation inline-block py-2 px-2 hover:scale-105 hover:underline focus-visible-ring rounded-md mobile-link-button touch-target"
                    aria-label="Navigate to admin registration page"
                  >
                    Register as Admin
                  </a>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
