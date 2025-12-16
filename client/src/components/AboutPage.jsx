"use client"

import Navbar from "./Navbar"
import Footer from "./Footer"
import { BookOpen, Users, Clock, CheckCircle, Mail, Phone, Sparkles, Award, Target, Heart } from "lucide-react"

function AboutPage() {
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
                <BookOpen className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 lg:mb-6">
            <span className="block">About EduSync</span>
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              Intelligent Scheduling.
            </span>
          </h1>
          <div className="flex items-center justify-center mt-4 mb-8">
            <Sparkles className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="text-blue-100 font-semibold text-lg">Simplifying Academic Scheduling</span>
            <Sparkles className="w-5 h-5 text-yellow-400 ml-2" />
          </div>
          
          <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100 leading-relaxed">
            Learn more about our mission to revolutionize educational scheduling with 
            <span className="text-yellow-400 font-semibold"> intelligent automation</span> and seamless management.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Our Mission
            </h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-lg leading-relaxed mb-6">
              Class Scheduler was created to solve the complex problem of academic scheduling. Our mission is to provide educational 
              institutions with a powerful, easy-to-use tool that saves time and reduces conflicts in the scheduling process.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Time</h3>
                <p className="text-gray-600 text-sm">Automate complex scheduling tasks that traditionally take hours</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Reduce Conflicts</h3>
                <p className="text-gray-600 text-sm">Intelligent algorithms prevent scheduling conflicts before they occur</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Improve Experience</h3>
                <p className="text-gray-600 text-sm">Create better schedules that work for everyone involved</p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              How It Works
            </h2>
          </div>
          
          <p className="text-lg text-gray-700 mb-6">
            Our system uses advanced algorithms including genetic algorithms and constraint satisfaction problems (CSP) 
            to generate optimal schedules. It takes into account various constraints such as:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Teacher availability and preferences",
              "Room availability and capacity", 
              "Course requirements",
              "Department and year constraints",
              "Special requirements for lab sessions",
              "Student enrollment limits"
            ].map((constraint, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{constraint}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Key Features
            </h2>
          </div>
          
          <p className="text-lg text-gray-700 mb-8">
            Class Scheduler offers a comprehensive set of features designed to make academic scheduling as efficient as possible:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: "Automated Schedule Generation", desc: "Generate complete schedules in minutes, not hours" },
              { icon: CheckCircle, title: "Conflict Detection & Resolution", desc: "Automatically identify and resolve scheduling conflicts" },
              { icon: Users, title: "Teacher Availability Management", desc: "Respect teacher preferences and availability" },
              { icon: BookOpen, title: "Room Allocation Optimization", desc: "Efficiently allocate rooms based on capacity and type" },
              { icon: Award, title: "Theory & Lab Course Support", desc: "Handle both regular classes and laboratory sessions" },
              { icon: Target, title: "Department Constraints", desc: "Manage year and department-specific requirements" }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="group p-6 bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-blue/10"></div>
          <div className="absolute bg-gradient-to-r from-indigo-600/90 to-purple-600/90"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 translate-y-16"></div>
          
          <div className="relative p-8 text-center">
            <div className="flex items-center space-x-3 justify-center mb-6">
              <div className="bg-white/20 p-3 rounded-xl">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Contact Us</h2>
            </div>
            
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Have questions or want to learn more about Class Scheduler? We'd love to hear from you!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-3 p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                <Mail className="w-5 h-5 text-white" />
                <span className="text-white font-medium">classscheduler@gmail.com</span>
              </div>
              
              <div className="flex items-center justify-center space-x-3 p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                <Phone className="w-5 h-5 text-white" />
                <span className="text-white font-medium">(123) 456-7890</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default AboutPage