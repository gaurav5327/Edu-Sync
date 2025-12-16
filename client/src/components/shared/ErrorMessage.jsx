import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({ 
  message, 
  onDismiss, 
  variant = 'default',
  className = '',
  showIcon = true,
  dismissible = false,
  id
}) => {
  if (!message) return null;

  const variants = {
    default: {
      container: 'bg-red-50 border-l-4 border-red-400',
      text: 'text-red-700',
      icon: 'text-red-400'
    },
    field: {
      container: 'bg-red-50/80 border border-red-200 rounded-md',
      text: 'text-red-600',
      icon: 'text-red-400'
    },
    inline: {
      container: 'bg-transparent',
      text: 'text-red-500',
      icon: 'text-red-400'
    }
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div 
      id={id}
      className={`
        ${currentVariant.container} 
        p-3 sm:p-4 rounded-lg 
        animate-in slide-in-from-top-2 duration-300 
        error-message-enter
        ${className}
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          {showIcon && (
            <AlertCircle 
              className={`h-4 w-4 sm:h-5 sm:w-5 ${currentVariant.icon} mr-2 sm:mr-3 flex-shrink-0 mt-0.5 animate-bounce`} 
              aria-hidden="true" 
            />
          )}
          <p className={`text-sm ${currentVariant.text} leading-relaxed`}>
            {message}
          </p>
        </div>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className={`ml-3 ${currentVariant.icon} hover:text-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-sm`}
            aria-label="Dismiss error message"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <style jsx>{`
        .error-message-enter {
          animation: error-shake 0.4s ease-in-out, error-fade-in 0.3s ease-out;
        }
        
        @keyframes error-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        
        @keyframes error-fade-in {
          from { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        /* Reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .error-message-enter {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ErrorMessage;