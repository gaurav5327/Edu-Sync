import React, { useState } from 'react';
import { Mail, Lock, User, Building } from 'lucide-react';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';
import LoadingOverlay from './LoadingOverlay';
import FormField from './FormField';
import { validateLoginForm, validateAdminRegistrationForm, getEnhancedErrorMessage, getSuccessMessage } from '../../utils/validation';

/**
 * Demo component showcasing the enhanced error handling and validation system
 * This demonstrates all the features implemented in task 9:
 * - Enhanced error message styling with proper contrast
 * - Smooth error animations and form field highlighting
 * - Loading state management with consistent visual feedback
 * - Success message components with proper styling and animations
 */
const ErrorHandlingDemo = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminId: '',
    department: 'Administration'
  });
  
  const [loginErrors, setLoginErrors] = useState({});
  const [adminErrors, setAdminErrors] = useState({});
  const [loginSuccess, setLoginSuccess] = useState({});
  const [adminSuccess, setAdminSuccess] = useState({});
  
  const [generalError, setGeneralError] = useState('');
  const [generalSuccess, setGeneralSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (loginErrors[name]) {
      setLoginErrors(prev => ({ ...prev, [name]: '' }));
    }
    setGeneralError('');
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (adminErrors[name]) {
      setAdminErrors(prev => ({ ...prev, [name]: '' }));
    }
    setGeneralError('');
  };

  const testLoginValidation = () => {
    const validation = validateLoginForm(loginData);
    if (!validation.isValid) {
      setLoginErrors(validation.errors);
      setGeneralError('Please correct the errors below and try again.');
    } else {
      setLoginErrors({});
      setGeneralError('');
      setGeneralSuccess(getSuccessMessage('login', { name: 'Demo User' }));
    }
  };

  const testAdminValidation = () => {
    const validation = validateAdminRegistrationForm(adminData);
    if (!validation.isValid) {
      setAdminErrors(validation.errors);
      setGeneralError('Please correct the errors below and try again.');
    } else {
      setAdminErrors({});
      setGeneralError('');
      setGeneralSuccess(getSuccessMessage('admin_register', { name: adminData.name }));
    }
  };

  const testLoadingState = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setGeneralSuccess('Loading completed successfully!');
    }, 2000);
  };

  const testErrorMessages = () => {
    const errors = [
      'Invalid credentials. Please check your email and password.',
      'This email address is already registered. Please use a different email or try logging in.',
      'Server error. Please try again later.',
      'Too many attempts. Please wait a moment before trying again.'
    ];
    
    const randomError = errors[Math.floor(Math.random() * errors.length)];
    setGeneralError(randomError);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Enhanced Error Handling & Validation Demo
        </h1>
        <p className="text-gray-600">
          This demo showcases the comprehensive error handling and validation system implemented for the authentication components.
        </p>
      </div>

      {/* General Messages */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Message Components</h2>
        
        <ErrorMessage 
          message={generalError}
          onDismiss={() => setGeneralError('')}
          dismissible={true}
        />
        
        <SuccessMessage 
          message={generalSuccess}
          onDismiss={() => setGeneralSuccess('')}
          dismissible={true}
          autoHide={true}
          autoHideDelay={3000}
        />
        
        <div className="flex gap-4">
          <button
            onClick={testErrorMessages}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Test Error Messages
          </button>
          <button
            onClick={testLoadingState}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Loading State
          </button>
        </div>
      </div>

      {/* Loading Overlay Demo */}
      <div className="relative bg-gray-50 rounded-lg p-6 min-h-[200px]">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Loading Overlay</h2>
        <p className="text-gray-600">Click "Test Loading State" above to see the loading overlay in action.</p>
        
        <LoadingOverlay 
          isVisible={isLoading}
          message="Processing your request..."
          variant="default"
          size="medium"
        />
      </div>

      {/* Login Form Demo */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Login Form Validation</h2>
        
        <div className="space-y-4 max-w-md">
          <FormField
            id="demo-email"
            name="email"
            type="email"
            label="Email Address"
            value={loginData.email}
            onChange={handleLoginChange}
            placeholder="Enter your email"
            required
            icon={Mail}
            error={loginErrors.email}
            success={loginSuccess.email}
          />
          
          <FormField
            id="demo-password"
            name="password"
            type="password"
            label="Password"
            value={loginData.password}
            onChange={handleLoginChange}
            placeholder="Enter your password"
            required
            icon={Lock}
            error={loginErrors.password}
            success={loginSuccess.password}
            showPasswordToggle={true}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
          
          <button
            onClick={testLoginValidation}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Test Login Validation
          </button>
        </div>
      </div>

      {/* Admin Registration Form Demo */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Registration Validation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          <FormField
            id="demo-name"
            name="name"
            type="text"
            label="Full Name"
            value={adminData.name}
            onChange={handleAdminChange}
            placeholder="Enter your full name"
            required
            icon={User}
            error={adminErrors.name}
            success={adminSuccess.name}
          />
          
          <FormField
            id="demo-admin-email"
            name="email"
            type="email"
            label="Email Address"
            value={adminData.email}
            onChange={handleAdminChange}
            placeholder="Enter your email"
            required
            icon={Mail}
            error={adminErrors.email}
            success={adminSuccess.email}
          />
          
          <FormField
            id="demo-admin-password"
            name="password"
            type="password"
            label="Password"
            value={adminData.password}
            onChange={handleAdminChange}
            placeholder="Create a strong password"
            required
            icon={Lock}
            error={adminErrors.password}
            success={adminSuccess.password}
            showPasswordToggle={true}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
          
          <FormField
            id="demo-confirm-password"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            value={adminData.confirmPassword}
            onChange={handleAdminChange}
            placeholder="Confirm your password"
            required
            icon={Lock}
            error={adminErrors.confirmPassword}
            success={adminSuccess.confirmPassword}
          />
          
          <FormField
            id="demo-admin-id"
            name="adminId"
            type="text"
            label="Admin ID"
            value={adminData.adminId}
            onChange={handleAdminChange}
            placeholder="Enter admin ID"
            required
            icon={Building}
            error={adminErrors.adminId}
            success={adminSuccess.adminId}
          />
          
          <div className="md:col-span-2">
            <button
              onClick={testAdminValidation}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Test Admin Registration Validation
            </button>
          </div>
        </div>
      </div>

      {/* Features Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Implemented Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Error Handling</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Enhanced error message styling with proper contrast</li>
              <li>• Smooth error animations and form field highlighting</li>
              <li>• Real-time field validation with visual feedback</li>
              <li>• Dismissible error messages</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Success & Loading States</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Success message components with animations</li>
              <li>• Loading overlays with consistent visual feedback</li>
              <li>• Auto-hide success messages</li>
              <li>• Accessibility-compliant ARIA labels</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorHandlingDemo;