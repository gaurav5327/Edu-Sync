import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingOverlay = ({ 
  isVisible, 
  message = 'Loading...', 
  variant = 'default',
  className = '',
  backdrop = true,
  size = 'medium'
}) => {
  if (!isVisible) return null;

  const variants = {
    default: {
      container: 'bg-white/95 backdrop-blur-lg',
      text: 'text-gray-700',
      spinner: 'text-blue-600'
    },
    dark: {
      container: 'bg-gray-900/95 backdrop-blur-lg',
      text: 'text-white',
      spinner: 'text-blue-400'
    },
    transparent: {
      container: 'bg-transparent',
      text: 'text-gray-700',
      spinner: 'text-blue-600'
    }
  };

  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  const currentVariant = variants[variant] || variants.default;
  const spinnerSize = sizes[size] || sizes.medium;

  return (
    <div 
      className={`
        absolute inset-0 
        ${backdrop ? currentVariant.container : 'bg-transparent'} 
        rounded-2xl flex items-center justify-center z-10
        loading-overlay-enter
        ${className}
      `}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 loading-content-enter">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader2 
              className={`${spinnerSize} ${currentVariant.spinner} animate-spin loading-spinner`} 
              aria-hidden="true"
            />
            <div className={`absolute inset-0 ${spinnerSize} ${currentVariant.spinner} rounded-full blur-sm opacity-30 animate-ping`}></div>
          </div>
          <p className={`text-sm font-medium ${currentVariant.text} animate-pulse`}>
            {message}
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .loading-overlay-enter {
          animation: loading-fade-in 0.3s ease-out;
        }
        
        .loading-content-enter {
          animation: loading-scale-in 0.4s ease-out 0.1s both;
        }
        
        @keyframes loading-fade-in {
          from { 
            opacity: 0; 
          }
          to { 
            opacity: 1; 
          }
        }
        
        @keyframes loading-scale-in {
          from { 
            opacity: 0;
            transform: scale(0.9) translateY(10px); 
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0); 
          }
        }
        
        /* Enhanced loading spinner animation */
        .loading-spinner {
          animation: enhanced-spin 1s linear infinite;
        }
        
        @keyframes enhanced-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .loading-overlay-enter,
          .loading-content-enter {
            animation: none !important;
          }
          
          .loading-spinner {
            animation: reduced-spin 2s linear infinite !important;
          }
          
          @keyframes reduced-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;