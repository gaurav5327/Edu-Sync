import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Calendar, Clock, User, ArrowRight, Tag } from 'lucide-react';

function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "10 Best Practices for Academic Scheduling",
      excerpt: "Learn the essential strategies that top educational institutions use to create efficient, conflict-free timetables.",
      author: "Sarah Johnson",
      date: "March 15, 2025",
      readTime: "5 min read",
      category: "Best Practices",
      image: "/api/placeholder/400/250",
      featured: true
    },
    {
      id: 2,
      title: "How AI is Revolutionizing Educational Scheduling",
      excerpt: "Discover how artificial intelligence is transforming the way schools and universities manage their academic schedules.",
      author: "Dr. Michael Chen",
      date: "March 12, 2025",
      readTime: "7 min read",
      category: "Technology",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 3,
      title: "Managing Multi-Campus Scheduling Challenges",
      excerpt: "Strategies for coordinating schedules across multiple campuses and handling complex institutional requirements.",
      author: "Emily Rodriguez",
      date: "March 10, 2025",
      readTime: "6 min read",
      category: "Management",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 4,
      title: "The Complete Guide to Lab Scheduling",
      excerpt: "Everything you need to know about scheduling laboratory sessions, equipment allocation, and safety considerations.",
      author: "Prof. David Kim",
      date: "March 8, 2025",
      readTime: "8 min read",
      category: "Tutorials",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 5,
      title: "Student Satisfaction Through Better Scheduling",
      excerpt: "How optimized timetables can improve student experience, reduce conflicts, and boost academic performance.",
      author: "Lisa Thompson",
      date: "March 5, 2025",
      readTime: "4 min read",
      category: "Student Experience",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 6,
      title: "Integration Tips: Connecting EduSync with Your SIS",
      excerpt: "Step-by-step guide to integrating EduSync with popular Student Information Systems for seamless data flow.",
      author: "Tech Team",
      date: "March 3, 2025",
      readTime: "10 min read",
      category: "Integration",
      image: "/api/placeholder/400/250",
      featured: false
    }
  ];

  const categories = ["All", "Best Practices", "Technology", "Management", "Tutorials", "Student Experience", "Integration"];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            EduSync Blog
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Insights, tips, and best practices for educational scheduling and institutional management.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Article</h2>
            {blogPosts.filter(post => post.featured).map(post => (
              <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-8 lg:p-12 flex items-center">
                    <div className="w-full h-64 bg-gradient-to-br from-purple-200 to-blue-200 rounded-lg flex items-center justify-center">
                      <Calendar className="w-24 h-24 text-purple-600" />
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center mb-4">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-sm">Featured</span>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-2" />
                        <span className="mr-4">{post.author}</span>
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{post.readTime}</span>
                      </div>
                      <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map(category => (
                <button
                  key={category}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors duration-300"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).map(post => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-purple-600" />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <button className="text-purple-600 hover:text-purple-800 font-medium flex items-center">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get the latest articles and scheduling tips delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default BlogPage;