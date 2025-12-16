import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Users,
  Clock,
  Shield
} from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Statistics Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">40,000+</div>
              <div className="text-blue-100">Institutes Worldwide</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">200k+</div>
              <div className="text-blue-100">Schedules Generated</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg mr-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">EduSync</h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              EduSync simplifies scheduling for educational institutions worldwide. Our AI-powered platform creates efficient, conflict-free timetables in minutes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-colors duration-300">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-colors duration-300">
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-colors duration-300">
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-colors duration-300">
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 border-b border-purple-500 pb-2">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-300">Features</Link></li>
              <li><Link to="/schedule" className="text-gray-300 hover:text-white transition-colors duration-300">Schedule Generator</Link></li>
              <li><Link to="/pricing" className="text-gray-300 hover:text-white transition-colors duration-300">Pricing</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">Contact</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors duration-300">Blog</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 border-b border-purple-500 pb-2">Resources</h4>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors duration-300">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors duration-300">Terms of Service</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors duration-300">FAQ</Link></li>
              <li><Link to="/support" className="text-gray-300 hover:text-white transition-colors duration-300">Support</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-300">About Us</Link></li>
              <li><Link to="/help" className="text-gray-300 hover:text-white transition-colors duration-300">Help Center</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 border-b border-purple-500 pb-2">Stay Connected</h4>
            
            {/* Contact Info */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <Mail className="w-5 h-5 text-purple-400 mr-3" />
                <span className="text-gray-300">hello@edusync.com</span>
              </div>
              <div className="flex items-center mb-3">
                <Phone className="w-5 h-5 text-purple-400 mr-3" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-purple-400 mr-3" />
                <span className="text-gray-300">Global Support</span>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h5 className="text-white font-semibold mb-3">Subscribe to Our Newsletter</h5>
              <p className="text-gray-300 text-sm mb-4">
                Get the latest updates and scheduling tips delivered to your inbox.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-l-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-r-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 EduSync. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors duration-300">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
