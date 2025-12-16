import React from 'react';
import { CheckCircle, X } from 'lucide-react';

const SuccessMessage = ({ 
  message, 
  onDismiss, 
  variant = 'default',
  className = '',
  showIcon = true,
  dismissible = false,
  id,
  autoHide = false,
  autoHideDelay = 5000
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoHide && message) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) {
          setTimeout(onDismiss, 300); // Allow fade out animation
        }
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [message, autoHide, autoHideDelay, onDismiss]);

  if (!message || !isVisible) return null;

  const variants = {
    default: {
      container: 'bg-green-50 border-l-4 border-green-400',
      text: 'text-green-700',
      icon: 'text-green-400'
    },
    field: {
      container: 'bg-green-50/80 border border-green-200 rounded-md',
      text: 'text-green-600',
      icon: 'text-green-400'
    },
    inline: {
      container: 'bg-transparent',
      text: 'text-green-500',
      icon: 'text-green-400'
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
        success-message-enter
        ${className}
      `}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          {showIcon && (
            <CheckCircle 
              className={`h-4 w-4 sm:h-5 sm:w-5 ${currentVariant.icon} mr-2 sm:mr-3 flex-shrink-0 mt-0.5 animate-pulse`} 
              aria-hidden="true" 
            />
          )}
          <p className={`text-sm ${currentVariant.text} leading-relaxed font-medium`}>
            {message}
          </p>
        </div>
        {dismissible && onDismiss && (
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onDismiss, 300);
            }}
            className={`ml-3 ${currentVariant.icon} hover:text-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-sm`}
            aria-label="Dismiss success message"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <style jsx>{`
        .success-message-enter {
          animation: success-scale 0.5s ease-out, success-fade-in 0.3s ease-out;
        }
        
        @keyframes success-scale {
          0% { transform: scale(0.95); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        
        @keyframes success-fade-in {
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
          .success-message-enter {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SuccessMessage;