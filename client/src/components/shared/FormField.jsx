import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const FormField = ({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  error,
  success,
  icon: Icon,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  className = '',
  inputClassName = '',
  labelClassName = '',
  autoComplete,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasInteracted, setHasInteracted] = React.useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    setHasInteracted(true);
    if (onBlur) onBlur(e);
  };

  const fieldId = id || name;
  const errorId = `${fieldId}-error`;
  const successId = `${fieldId}-success`;
  
  const hasError = error && hasInteracted;
  const hasSuccess = success && hasInteracted && !error;

  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`space-y-1.5 sm:space-y-2 form-field-container ${className}`}>
      {label && (
        <label
          htmlFor={fieldId}
          className={`
            block text-sm font-semibold transition-colors duration-300
            ${hasError ? 'text-red-600' : hasSuccess ? 'text-green-600' : 'text-gray-700'}
            ${labelClassName}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon 
            className={`
              absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 
              w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300
              ${hasError ? 'text-red-400' : hasSuccess ? 'text-green-400' : isFocused ? 'text-blue-500' : 'text-gray-400'}
            `}
            aria-hidden="true"
          />
        )}
        
        <input
          id={fieldId}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-describedby={[
            hasError ? errorId : null,
            hasSuccess ? successId : null,
            ariaDescribedBy
          ].filter(Boolean).join(' ') || undefined}
          aria-invalid={hasError ? 'true' : 'false'}
          className={`
            w-full transition-all duration-300 rounded-lg sm:rounded-xl border-2 
            text-sm sm:text-base bg-white/90 backdrop-blur-sm
            ${Icon ? 'pl-10 sm:pl-12' : 'pl-3 sm:pl-4'}
            ${showPasswordToggle ? 'pr-12 sm:pr-14' : 'pr-3 sm:pr-4'}
            py-3 sm:py-4
            focus:outline-none focus:ring-2 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${hasError 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 form-field-error' 
              : hasSuccess 
                ? 'border-green-300 focus:border-green-500 focus:ring-green-500 form-field-success'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400'
            }
            ${isFocused ? 'form-field-focus' : ''}
            ${inputClassName}
          `}
          {...props}
        />
        
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className={`
              absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2
              p-1 rounded-md transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${hasError ? 'text-red-400 hover:text-red-600' : 'text-gray-400 hover:text-gray-600'}
            `}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={0}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        )}
      </div>
      
      {hasError && (
        <div 
          id={errorId}
          className="text-xs sm:text-sm text-red-600 animate-in slide-in-from-top-1 duration-200"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
      
      {hasSuccess && (
        <div 
          id={successId}
          className="text-xs sm:text-sm text-green-600 animate-in slide-in-from-top-1 duration-200"
          role="status"
          aria-live="polite"
        >
          {success}
        </div>
      )}
      
      <style jsx>{`
        .form-field-focus {
          transform: scale(1.01);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-field-error {
          animation: field-error-shake 0.4s ease-in-out;
        }

        .form-field-success {
          animation: field-success-pulse 0.5s ease-out;
        }

        @keyframes field-error-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }

        @keyframes field-success-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        
        /* Reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .form-field-focus,
          .form-field-error,
          .form-field-success {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FormField;