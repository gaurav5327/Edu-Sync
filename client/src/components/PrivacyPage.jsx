import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Shield, Lock, Eye, Database, Users, FileText, Calendar, Server, UserCheck } from 'lucide-react';
const PrivacyPage = () => {
  const privacySections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Information We Collect",
      content: [
        "Account Information: Name, email address, institution details, and role within your organization",
        "Timetable Data: Course schedules, room assignments, faculty information, and student enrollment data",
        "Usage Data: How you interact with our platform, features used, and system performance metrics",
        "Technical Data: IP address, browser type, device information, and access logs for security purposes"
      ]
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "How We Use Your Information",
      content: [
        "Provide and maintain the EduSync timetable scheduling service",
        "Generate AI-powered conflict-free timetables based on your institutional requirements",
        "Improve our algorithms and enhance platform functionality",
        "Communicate with you about service updates, support, and account-related matters",
        "Ensure platform security and prevent unauthorized access"
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Data Protection & Security",
      content: [
        "End-to-end encryption for all data transmission and storage",
        "Regular security audits and penetration testing by third-party experts",
        "Multi-factor authentication and role-based access controls",
        "Automated backups with 99.9% uptime guarantee",
        "Compliance with GDPR, CCPA, and other applicable data protection regulations"
      ]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Data Sharing & Third Parties",
      content: [
        "We do not sell, rent, or trade your personal information to third parties",
        "Data may be shared with trusted service providers who assist in platform operations",
        "All third-party providers are bound by strict confidentiality agreements",
        "Anonymous, aggregated data may be used for research and platform improvement",
        "Legal compliance: Data may be disclosed if required by law or legal process"
      ]
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Your Rights & Controls",
      content: [
        "Access: Request a copy of all personal data we hold about you",
        "Correction: Update or correct any inaccurate personal information",
        "Deletion: Request deletion of your account and associated data",
        "Portability: Export your timetable data in standard formats",
        "Opt-out: Unsubscribe from marketing communications at any time"
      ]
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "Data Retention & Storage",
      content: [
        "Active account data is retained for the duration of your subscription",
        "Deleted accounts: Data is permanently removed within 30 days of deletion request",
        "Backup data: Retained for 90 days for disaster recovery purposes",
        "Legal requirements: Some data may be retained longer if required by law",
        "Data centers located in secure, certified facilities with 24/7 monitoring"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold mb-6">
              <Shield className="w-4 h-4 mr-2" />
              PRIVACY POLICY
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Privacy is Our
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Priority</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We are committed to protecting your personal information and being transparent about how we collect, use, and safeguard your data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Last Updated: December 2024
              </div>
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                GDPR & CCPA Compliant
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid gap-8">
          {privacySections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                    {section.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Questions About Our Privacy Policy?</h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            If you have any questions about this Privacy Policy or how we handle your data, 
            please don't hesitate to contact our privacy team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:privacy@edusync.com"
              className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-300"
            >
              <Eye className="w-4 h-4 mr-2" />
              privacy@edusync.com
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors duration-300"
            >
              <Users className="w-4 h-4 mr-2" />
              Contact Support
            </a>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Privacy Policy Summary</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Data Protection</h4>
              <p className="text-gray-600 text-sm">Your data is encrypted and protected with enterprise-grade security measures.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Transparency</h4>
              <p className="text-gray-600 text-sm">We're clear about what data we collect and how we use it for your benefit.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Your Control</h4>
              <p className="text-gray-600 text-sm">You have full control over your data with easy access, correction, and deletion options.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPage;