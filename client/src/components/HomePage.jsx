"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Star,
  Play,
  Share2,
  Settings,
  BookOpen,
  Award,
  Lightbulb,
  UserCheck,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
} from "lucide-react";

// FAQ Item Component
function FAQItem({ question, answer, index, isOpen, onToggle }) {
  const gradients = [
    "from-blue-500 to-indigo-500",
    "from-green-500 to-emerald-500",
    "from-purple-500 to-pink-500",
    "from-orange-500 to-red-500",
    "from-teal-500 to-cyan-500",
    "from-indigo-500 to-purple-500",
  ];

  const bgGradients = [
    "from-blue-50 to-indigo-50 border-blue-500",
    "from-green-50 to-emerald-50 border-green-500",
    "from-purple-50 to-pink-50 border-purple-500",
    "from-orange-50 to-red-50 border-orange-500",
    "from-teal-50 to-cyan-50 border-teal-500",
    "from-indigo-50 to-purple-50 border-indigo-500",
  ];

  const gradient = gradients[index % gradients.length];
  const bgGradient = bgGradients[index % bgGradients.length];

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        isOpen ? "ring-2 ring-blue-200" : ""
      }`}
    >
      <button
        className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
        onClick={() => onToggle(index)}
      >
        <div className="flex items-center space-x-4">
          <div
            className={`bg-gradient-to-r ${gradient} text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg`}
          >
            {index + 1}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-left">
            {question}
          </h3>
        </div>
        <div className="flex-shrink-0">
          <div
            className={`p-1 rounded-full transition-all duration-200 ${
              isOpen ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
          >
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-blue-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-5">
          <div className="pl-12">
            <div
              className={`bg-gradient-to-r ${bgGradient} border-l-4 rounded-r-lg p-4 shadow-sm`}
            >
              <p className="text-gray-700 leading-relaxed">{answer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// FAQ Section Component
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is EduSync and how does it work?",
      answer: "EduSync is an AI-powered timetable generation system designed for educational institutions. It uses advanced genetic algorithms to automatically create conflict-free schedules by considering teacher availability, room capacity, course requirements, and student preferences. Simply input your courses, teachers, and rooms, and EduSync generates optimized timetables in minutes."
    },
    {
      question: "How does the AI scheduling algorithm ensure conflict-free timetables?",
      answer: "Our genetic algorithm systematically checks for conflicts including teacher double-booking, room overlaps, and student schedule clashes. It considers multiple constraints like teacher expertise, preferred time slots, room types (labs vs classrooms), and workload limits. The system iteratively improves the schedule until it finds the optimal solution with zero conflicts."
    },
    {
      question: "Can I customize and edit the generated timetables?",
      answer: "Absolutely! EduSync provides a powerful drag-and-drop timetable editor that allows you to make real-time adjustments. You can move classes between time slots, swap rooms, reassign teachers, and the system will automatically validate changes to prevent conflicts. All modifications are saved instantly and can be exported in multiple formats."
    },
    {
      question: "What types of educational institutions can use EduSync?",
      answer: "EduSync is designed for all types of educational institutions including schools, colleges, universities, training centers, and coaching institutes. It supports multiple academic programs (FYUP, B.Ed., M.Ed., ITEP), different course types (theory, lab, practical), and can handle complex scheduling requirements for institutions of any size."
    },
    {
      question: "How does EduSync handle lab sessions and practical classes?",
      answer: "EduSync intelligently schedules lab sessions by allocating consecutive time slots (typically 2 hours) and ensuring appropriate lab rooms are assigned. It considers lab equipment requirements, safety protocols, and teacher expertise in practical subjects. The system prioritizes lab scheduling first, then fills remaining slots with theory classes."
    },
    {
      question: "Can multiple users collaborate on schedule creation?",
      answer: "Yes! EduSync supports role-based access with different permission levels for administrators, teachers, and students. Administrators can create and modify schedules, teachers can view their assignments and request changes, and students can access their personal timetables. All changes are tracked with audit trails for accountability."
    },
    {
      question: "What happens if there are scheduling conflicts or changes needed?",
      answer: "EduSync includes a comprehensive conflict resolution system that identifies and highlights any scheduling issues. The system provides intelligent suggestions for resolving conflicts and allows for quick rescheduling. You can also use the scenario simulator to test different 'what-if' situations before implementing changes."
    },
    {
      question: "How secure is my institution's data on EduSync?",
      answer: "Data security is our top priority. EduSync uses enterprise-grade encryption, secure cloud storage, and complies with educational data privacy regulations. All data is backed up regularly, and we provide role-based access controls to ensure only authorized personnel can access sensitive information."
    },
    {
      question: "Can I export and share the generated timetables?",
      answer: "Yes! EduSync allows you to export timetables in multiple formats including PDF, Excel, CSV, and image formats. You can generate individual teacher schedules, student timetables, room utilization reports, and department-wise schedules. Sharing options include email distribution, web links, and integration with your institution's website."
    },
    {
      question: "What kind of support and training do you provide?",
      answer: "We provide comprehensive support including detailed documentation, video tutorials, live training sessions, and 24/7 customer support. Our team helps with initial setup, data migration, and ongoing optimization. We also offer regular webinars and best practice sessions to help you get the most out of EduSync."
    },
    {
      question: "How much does EduSync cost and what's included?",
      answer: "EduSync offers flexible pricing plans based on your institution size and needs. Our plans include unlimited timetable generation, drag-and-drop editing, conflict resolution, multi-user access, data export, and customer support. We also offer a free trial so you can experience the full capabilities before making a commitment."
    },
    {
      question: "Can EduSync integrate with our existing student information system?",
      answer: "Yes! EduSync provides APIs and integration capabilities to connect with popular student information systems, learning management systems, and HR platforms. We can import student data, course catalogs, and teacher information directly from your existing systems, eliminating the need for manual data entry."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <HelpCircle className="w-4 h-4 mr-2" />
          FREQUENTLY ASKED QUESTIONS
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Got Questions? We've Got Answers
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Everything you need to know about EduSync and how it can transform your scheduling process.
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-600 mb-1">12</div>
            <div className="text-sm text-gray-600">Common Questions</div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-600 mb-1">24/7</div>
            <div className="text-sm text-gray-600">Support Available</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-600 mb-1">&lt;2min</div>
            <div className="text-sm text-gray-600">Average Response</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HelpCircle className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          />
        </div>
      </div>

      {/* Popular Questions Badge */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
          <Star className="w-4 h-4 mr-2" />
          Most Popular Questions
        </div>
      </div>

      <div className="space-y-4">
        {faqData
          .filter(faq => 
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            index={index}
            isOpen={openIndex === index}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {/* Still have questions? */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Link>
            <a
              href="mailto:support@edusync.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Phone className="w-4 h-4 mr-2" />
              Schedule a Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const { user } = useAuth();

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

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Scroll Animation Styles */}
      <style jsx>{`
        /* Smooth scrolling for the entire page */
        html {
          scroll-behavior: smooth;
        }

        /* Navbar backdrop blur enhancement */
        .navbar-blur {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        /* Enhanced floating animation */
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(1deg);
          }
          66% {
            transform: translateY(5px) rotate(-1deg);
          }
        }

        .float-animation {
          animation: float 6s ease-in-out infinite;
        }

        /* Gradient text animation */
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .gradient-text {
          background: linear-gradient(
            -45deg,
            #ee7752,
            #e73c7e,
            #23a6d5,
            #23d5ab
          );
          background-size: 400% 400%;
          animation: gradient-shift 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Subtle parallax effect */
        .parallax-slow {
          transform: translateZ(0);
          will-change: transform;
        }
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

        .video-container {
          position: relative;
          background: linear-gradient(
            135deg,
            rgba(147, 51, 234, 0.4),
            rgba(59, 130, 246, 0.4),
            rgba(99, 102, 241, 0.4)
          );
          padding: 4px;
          border-radius: 1.5rem;
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.25);
          width: 100%;
          max-width: 100%;
        }

        @media (min-width: 1024px) {
          .video-container {
            padding: 6px;
            border-radius: 2rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
        }

        .video-container::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 6px;
          background: linear-gradient(
            135deg,
            rgba(147, 51, 234, 0.6),
            rgba(59, 130, 246, 0.6),
            rgba(99, 102, 241, 0.6)
          );
          border-radius: inherit;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: xor;
          -webkit-mask: linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
        }

        .video-inner {
          background: white;
          border-radius: 1.25rem;
          overflow: hidden;
          position: relative;
          width: 100%;
          height: auto;
        }

        @media (min-width: 1024px) {
          .video-inner {
            border-radius: 1.5rem;
          }
        }

        .video-container:hover {
          transform: scale(1.02);
          transition: transform 0.3s ease;
        }
      `}</style>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 min-h-screen flex items-center pt-16">
        {/* Enhanced Background Layers */}
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

        {/* Additional Subtle Orbs */}
        <div
          className="absolute top-1/3 left-1/4 w-16 h-16 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-lg animate-pulse opacity-30"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-2/3 right-1/3 w-12 h-12 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-lg animate-pulse opacity-25"
          style={{ animationDelay: "4s" }}
        ></div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-white lg:col-span-2 text-center lg:text-left">
              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6 lg:mb-8">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm font-medium">GDPR Compliant</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
                  <Star className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="text-sm font-medium">4.9/5 Rating</span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 lg:mb-6">
                <span className="block">Effortless Timetables.</span>
                <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  Powered by AI.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-blue-100 mb-6 lg:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Our intelligent timetable generator uses AI to create perfect,
                conflict-free school schedules in minutes. Automate complex
                tasks, save hours, and optimize your school's resources.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-white/10 rounded-lg mb-2 mx-auto">
                    <Award className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="text-xl lg:text-2xl font-bold">40,000+</div>
                  <div className="text-xs lg:text-sm text-blue-200">
                    Institutes Worldwide
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-white/10 rounded-lg mb-2 mx-auto">
                    <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="text-xl lg:text-2xl font-bold">200k+</div>
                  <div className="text-xs lg:text-sm text-blue-200">
                    Schedules
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-white/10 rounded-lg mb-2 mx-auto">
                    <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="text-xl lg:text-2xl font-bold">99.9%</div>
                  <div className="text-xs lg:text-sm text-blue-200">Uptime</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start">
                {user ? (
                  <Link
                    to={
                      user.role === "admin"
                        ? "/admin-dashboard"
                        : user.role === "teacher"
                        ? "/teacher-dashboard"
                        : "/student-dashboard"
                    }
                    className="group inline-flex items-center justify-center px-5 py-3 lg:px-6 lg:py-3 bg-white text-indigo-600 font-semibold text-sm lg:text-base rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-gray-50"
                  >
                    <Calendar className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="group inline-flex items-center justify-center px-5 py-3 lg:px-6 lg:py-3 bg-white text-indigo-600 font-semibold text-sm lg:text-base rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-gray-50"
                    >
                      <Play className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      Generate Free Timetable
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                    <Link
                      to="/about"
                      className="group inline-flex items-center justify-center px-5 py-3 lg:px-6 lg:py-3 bg-white/10 backdrop-blur-sm text-white font-semibold text-sm lg:text-base rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Guide
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Right Content - Demo Video */}
            <div className="relative lg:col-span-3 mt-8 lg:mt-0">
              <div className="video-container shadow-2xl transform rotate-2 lg:rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="video-inner p-2 lg:p-3">
                  <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster=""
                    >
                      <source
                        src="/src/assets/TimeTable_Demo.mp4"
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>

                    {/* Video overlay with play button */}
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Feature Callouts */}
              <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 bg-white rounded-lg shadow-lg p-2 lg:p-3 animate-bounce">
                <div className="flex items-center">
                  <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500 mr-1 lg:mr-2" />
                  <div>
                    <div className="text-xs lg:text-sm font-semibold text-gray-800">
                      Lightning Fast
                    </div>
                    <div className="text-xs text-gray-600 hidden sm:block">
                      Generate in seconds
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-2 -left-2 lg:-bottom-4 lg:-left-4 bg-white rounded-lg shadow-lg p-2 lg:p-3 animate-pulse">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 mr-1 lg:mr-2" />
                  <div>
                    <div className="text-xs lg:text-sm font-semibold text-gray-800">
                      Conflict-Free
                    </div>
                    <div className="text-xs text-gray-600 hidden sm:block">
                      AI-powered validation
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
            <div className="flex flex-col items-center">
              <span className="text-sm mb-2 font-medium">
                Scroll to explore
              </span>
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20 bg-gradient-to-b from-white via-gray-50/50 to-white scroll-animate"
        data-animate="fadeInUp"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              WHY CHOOSE US
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose EduSync?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simplify the entire scheduling process with our intuitive,
              AI-powered timetable software, no installations needed. EduSync is
              packed with features that help you create and manage conflict-free
              schedules and handle teacher substitutions in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden scroll-animate"
              data-animate="fadeInUp"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    AI-Powered Scheduling
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Our intelligent engine automatically detects conflicts,
                  optimizes class arrangements, and ensures a smooth timetable
                  without the guesswork.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Automatic conflict detection
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Smart resource optimization
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Instant schedule generation
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden scroll-animate"
              data-animate="fadeInUp"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Smart Substitute Management
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Effortlessly handle teacher absences with intelligent
                  substitute recommendations. Reduce administrative time by 80%
                  while maintaining learning continuity.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Intelligent teacher matching
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Real-time schedule updates
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Comprehensive tracking
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden scroll-animate"
              data-animate="fadeInUp"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-4">
                    <Share2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Easy Sharing & Collaboration
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Instantly share final schedules with teachers, students, or
                  parents online. Everyone stays updated in real time - no more
                  outdated PDFs or manual handouts.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    Real-time updates
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    Multiple sharing formats
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    Role-based access
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature Card 4 */}
            <div
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden scroll-animate"
              data-animate="fadeInUp"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Quick Editing & Regeneration
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Need to switch a class or change a time slot? Use our
                  drag-and-drop editor to rearrange your timetable, then
                  regenerate for a fresh, conflict-free version.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Drag-and-drop interface
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Instant regeneration
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Change tracking
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature Card 5 */}
            <div
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden scroll-animate"
              data-animate="fadeInUp"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="h-2 bg-gradient-to-r from-orange-500 to-yellow-500"></div>
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mr-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Access Anywhere
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  EduSync runs entirely online. No downloads or installations
                  needed - just an internet connection. Perfect for teachers and
                  students on the go.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    Browser-based access
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    Mobile responsive
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    Cloud storage
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature Card 6 */}
            <div
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden scroll-animate"
              data-animate="fadeInUp"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mr-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Security & Compliance
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Your data is protected with role-based access controls and
                  comprehensive audit trails. We ensure full compliance with
                  educational regulations and privacy standards.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Role-based access control
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Data privacy protection
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Compliance-ready
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section
        className="py-16 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 scroll-animate"
        data-animate="fadeInUp"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4 mr-2" />
              Trusted by Educational Institutions Worldwide
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Empowering schools in 100+ countries with AI-powered scheduling
            </h2>
          </div>

          {/* Country Flags Grid */}
          <div className="grid grid-cols-6 md:grid-cols-10 lg:grid-cols-15 gap-4 mb-12">
            {[
              "US",
              "CA",
              "GB",
              "DE",
              "FR",
              "IT",
              "ES",
              "NL",
              "SE",
              "CH",
              "JP",
              "KR",
              "CN",
              "IN",
              "SG",
            ].map((country, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm">
                  {country}
                </div>
                <div className="text-xs text-gray-600">
                  {
                    [
                      "United States",
                      "Canada",
                      "United Kingdom",
                      "Germany",
                      "France",
                      "Italy",
                      "Spain",
                      "Netherlands",
                      "Sweden",
                      "Switzerland",
                      "Japan",
                      "South Korea",
                      "China",
                      "India",
                      "Singapore",
                    ][index]
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        className="py-20 bg-gradient-to-b from-gray-50 via-indigo-50/20 to-gray-50 scroll-animate"
        data-animate="fadeInUp"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              HOW IT WORKS
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Create Your Timetable in 6 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these simple steps to generate your perfect, conflict-free
              schedule. EduSync handles the heavy lifting, so you can focus on
              delivering quality education.
            </p>
          </div>

          <div className="relative">
            {/* Vertical Timeline */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative flex items-start">
                <div className="absolute left-6 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
                <div className="ml-16 bg-white rounded-2xl shadow-lg p-8 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-blue-600 uppercase">
                      Step 1
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      Easy Start
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Enter Your Details
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Start by adding classes, subjects, teachers, and specific
                    constraints. EduSync's intuitive interface makes data entry
                    simple and error-free.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start">
                <div className="absolute left-6 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
                <div className="ml-16 bg-white rounded-2xl shadow-lg p-8 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-blue-600 uppercase">
                      Step 2
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Auto-Check
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Thorough Verification
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our platform automatically checks for missing or conflicting
                    information to ensure accurate, consistent inputs before
                    generating your timetable.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start">
                <div className="absolute left-6 w-4 h-4 bg-purple-500 rounded-full border-4 border-white shadow-lg"></div>
                <div className="ml-16 bg-white rounded-2xl shadow-lg p-8 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-purple-600 uppercase">
                      Step 3
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      AI-Powered
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Generate Optimal Timetable
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    With one click, our AI-driven engine processes your data and
                    creates a conflict-free, highly efficient schedule that
                    meets your unique constraints.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-start">
                <div className="absolute left-6 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-lg"></div>
                <div className="ml-16 bg-white rounded-2xl shadow-lg p-8 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-orange-600 uppercase">
                      Step 4
                    </span>
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      Flexible
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Adjust & Get Suggestions
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Need fine-tuning? Simply drag-and-drop to rearrange classes
                    or teachers. Our system offers intelligent suggestions to
                    maintain an optimal layout.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative flex items-start">
                <div className="absolute left-6 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                <div className="ml-16 bg-white rounded-2xl shadow-lg p-8 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-green-600 uppercase">
                      Step 5
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Smart Cover
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Manage Staff Absences
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Handle unexpected absences effortlessly. Mark teachers as
                    unavailable and our system automatically suggests qualified
                    substitute teachers to maintain continuity.
                  </p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="relative flex items-start">
                <div className="absolute left-6 w-4 h-4 bg-pink-500 rounded-full border-4 border-white shadow-lg"></div>
                <div className="ml-16 bg-white rounded-2xl shadow-lg p-8 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-pink-600 uppercase">
                      Step 6
                    </span>
                    <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                      Share
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Download & Share
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Export or print your timetable in multiple formats, or share
                    it online with staff and students. Invite teachers to join
                    the platform for real-time updates and collaboration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="py-20 bg-white scroll-animate"
        data-animate="fadeInUp"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              CUSTOMER STORIES
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of educators worldwide who have transformed their
              scheduling processes with EduSync.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-bold text-sm">"</span>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                "EduSync has been an excellent addition for our school. Its
                incredible ease of use made setting up our timetable simple and
                time-efficient. The platform also makes changes to the schedule
                smooth and quickly identifies overlaps or issues. What really
                stands out, though, is their individualized customer support."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">L</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Laura</div>
                  <div className="text-sm text-gray-600">
                    Principal, Mokykla Atradimai
                  </div>
                  <div className="text-sm text-gray-500">Kaunas, Lithuania</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-bold text-sm">"</span>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                "I was looking for a tech solution to create schedules for my
                school and came across EduSync. It's very easy to use, I was
                quickly able to build a timetable. The team was incredibly kind
                and helpful, and the support session was booked right on time.
                Most importantly, for the first time we now have a timetable
                with no clashes."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold">I</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Imogen</div>
                  <div className="text-sm text-gray-600">
                    Headteacher, A Middle & High School
                  </div>
                  <div className="text-sm text-gray-500">Gibraltar</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-bold text-sm">"</span>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                "Awesome Product and Awesome Support, literally 24/7. I have
                been using EduSync for a few months now, it's amazing, made
                several timetables. Substitute management is also very helpful,
                I don't have to find free teachers anymore, system takes care of
                that. Highly recommended for schools!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold">M</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Michael Chan
                  </div>
                  <div className="text-sm text-gray-600">
                    Headmaster, Knightsbridge House International School
                  </div>
                  <div className="text-sm text-gray-500">
                    Nonthaburi, Thailand
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className="py-20 bg-gradient-to-b from-gray-50 to-white scroll-animate"
        data-animate="fadeInUp"
      >
        <FAQSection />
      </section>

      {/* Contact Us Section */}
      <section
        className="py-20 bg-white scroll-animate"
        data-animate="fadeInUp"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              GET IN TOUCH
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Contact Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about EduSync? Our team is here to help you create
              the perfect schedule for your institution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="text-lg font-semibold text-gray-900">
                      hello@edusync.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="text-lg font-semibold text-gray-900">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Support Hours</p>
                    <p className="text-lg font-semibold text-gray-900">
                      24/7 Available
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Support Hours
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">All Days</span>
                    <span className="font-semibold text-gray-900">24/7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value="+1"
                        readOnly
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                    <div className="col-span-2 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        placeholder="Phone number"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <textarea
                      rows={4}
                      placeholder="How can we help you today?"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 scroll-animate"
        data-animate="fadeInUp"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Simplify Your{" "}
            <span className="text-yellow-400">Scheduling Process?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Join thousands of institutions who have streamlined their scheduling
            with EduSync.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {user ? (
              <Link
                to={
                  user.role === "admin"
                    ? "/admin-dashboard"
                    : user.role === "teacher"
                    ? "/teacher-dashboard"
                    : "/student-dashboard"
                }
                className="group inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-600 font-semibold text-base rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-gray-50"
              >
                <Calendar className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-600 font-semibold text-base rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-gray-50"
                >
                  Generate Your Timetable
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold text-base rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-purple-700"
                >
                  Schedule a Demo
                </Link>
              </>
            )}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                40,000+
              </div>
              <div className="text-blue-100">Institutes</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                200k+
              </div>
              <div className="text-blue-100">Schedules</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                99.9%
              </div>
              <div className="text-blue-100">Uptime</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                24/7
              </div>
              <div className="text-blue-100">Support</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
