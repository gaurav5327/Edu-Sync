/**
 * Accessibility utilities and components for enhanced auth pages
 * Provides reusable accessibility features for Login and AdminRegistration components
 */

import React, { useEffect } from 'react';

/**
 * Hook to manage focus trap within a modal or dialog
 * @param {boolean} isActive - Whether the focus trap should be active
 * @param {React.RefObject} containerRef - Reference to the container element
 */
export const useFocusTrap = (isActive, containerRef) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    // Focus first element when trap becomes active
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive, containerRef]);
};

/**
 * Hook to announce dynamic content changes to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const useScreenReaderAnnouncement = (message, priority = 'polite') => {
  useEffect(() => {
    if (!message) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Clean up after announcement
    const timer = setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    };
  }, [message, priority]);
};

/**
 * Enhanced form field component with built-in accessibility features
 */
export const AccessibleFormField = ({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  required = false,
  error = null,
  icon: Icon,
  showToggle = false,
  showValue = false,
  onToggleShow,
  autoComplete,
  className = '',
  ...props
}) => {
  const fieldId = id || name;
  const errorId = error ? `${fieldId}-error` : undefined;
  const toggleId = showToggle ? `${fieldId}-toggle` : undefined;

  return (
    <div className="space-y-2">
      <label
        htmlFor={fieldId}
        className="block text-sm font-semibold text-gray-700 transition-colors duration-300"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-all duration-300 group-focus-within:scale-110" aria-hidden="true" />
          </div>
        )}
        
        <input
          id={fieldId}
          name={name}
          type={showToggle ? (showValue ? 'text' : 'password') : type}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} ${showToggle ? 'pr-12' : 'pr-3'} py-3 sm:py-4 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70 text-base touch-manipulation hover:shadow-md focus:shadow-lg focus-visible-ring ${
            error 
              ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
              : 'border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-gray-300'
          } ${className}`}
          placeholder={placeholder}
          aria-describedby={errorId || (showToggle ? toggleId : undefined)}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        
        {showToggle && (
          <button
            id={toggleId}
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center touch-manipulation min-w-[44px] min-h-[44px] justify-center hover:scale-110 transition-transform duration-200 focus-visible-ring rounded-lg"
            onClick={onToggleShow}
            aria-label={showValue ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            aria-pressed={showValue}
            aria-controls={fieldId}
          >
            {showValue ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-300" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-300" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <div 
          id={errorId}
          className="flex items-center mt-2 text-red-600 text-sm animate-in slide-in-from-top-2 duration-300"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
          {error}
        </div>
      )}
    </div>
  );
};

/**
 * Accessible button component with enhanced focus and interaction states
 */
export const AccessibleButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  success = false,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  loadingText = 'Loading...',
  successText = 'Success!',
  ariaLabel,
  ...props
}) => {
  const baseClasses = `
    group relative flex justify-center items-center font-semibold rounded-xl 
    focus:outline-none focus:ring-2 focus:ring-offset-2 transform transition-all duration-300 
    touch-manipulation focus-visible-ring
  `;
  
  const sizeClasses = {
    sm: 'py-2 px-3 text-sm min-h-[40px]',
    md: 'py-3 sm:py-4 px-4 text-sm sm:text-base min-h-[48px]',
    lg: 'py-4 px-6 text-base min-h-[52px]'
  };
  
  const variantClasses = {
    primary: `
      text-white bg-gradient-to-r from-indigo-600 to-purple-600 
      hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500
      ${!disabled && !loading ? 'hover:scale-[1.02] hover:shadow-lg hover:-translate-y-0.5' : ''}
    `,
    secondary: `
      text-indigo-600 bg-white border border-indigo-600 
      hover:bg-indigo-50 focus:ring-indigo-500
      ${!disabled && !loading ? 'hover:scale-[1.02] hover:shadow-md' : ''}
    `
  };
  
  const disabledClasses = disabled || loading ? 'opacity-70 cursor-not-allowed' : '';
  const successClasses = success ? 'bg-gradient-to-r from-green-600 to-emerald-600' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${successClasses} ${className}`}
      aria-label={ariaLabel}
      aria-describedby={loading ? 'loading-status' : success ? 'success-status' : undefined}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 mr-3 animate-spin" aria-hidden="true" />
          <span>{loadingText}</span>
        </>
      ) : success ? (
        <>
          <CheckCircle className="w-5 h-5 mr-3 animate-bounce" aria-hidden="true" />
          <span>{successText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

/**
 * Skip link component for keyboard navigation
 */
export const SkipLink = ({ href, children, className = '' }) => (
  <a 
    href={href} 
    className={`skip-link focus-visible-ring ${className}`}
    aria-label={`Skip to ${children.toLowerCase()}`}
  >
    {children}
  </a>
);

/**
 * Screen reader only content component
 */
export const ScreenReaderOnly = ({ children, live = false, atomic = false }) => (
  <div 
    className="sr-only" 
    aria-live={live ? 'polite' : undefined}
    aria-atomic={atomic}
  >
    {children}
  </div>
);

/**
 * Landmark region component for better navigation
 */
export const LandmarkRegion = ({ 
  children, 
  role, 
  ariaLabel, 
  ariaLabelledBy, 
  className = '',
  ...props 
}) => (
  <section
    role={role}
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledBy}
    className={className}
    {...props}
  >
    {children}
  </section>
);

// Import required icons for the components
import { Eye, EyeOff, AlertCircle, Loader2, CheckCircle } from 'lucide-react';