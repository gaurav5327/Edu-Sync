import React, { useMemo } from 'react';
import FloatingOrbs from './FloatingOrbs';
import { useBrowserCapabilities, LazyBackgroundElement } from './PerformanceOptimizations';

/**
 * AuthBackground Component (Performance Optimized)
 * 
 * Provides the shared background layers and patterns for authentication pages.
 * Includes performance optimizations and cross-browser compatibility.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render over background
 * @param {string} props.variant - Background variant ('default', 'login', 'registration')
 * @param {boolean} props.showOrbs - Whether to show floating orbs
 * @param {string} props.orbVariant - Variant for floating orbs
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.lazyLoad - Enable lazy loading for background elements
 */
const AuthBackground = ({ 
  children, 
  variant = 'default',
  showOrbs = true,
  orbVariant = 'auth',
  className = '',
  lazyLoad = true
}) => {
  const capabilities = useBrowserCapabilities();

  // Memoize dot pattern for performance
  const dotPattern = useMemo(() => {
    const opacity = capabilities.isLowEndDevice ? '0.02' : '0.05';
    return `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='${opacity}'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;
  }, [capabilities.isLowEndDevice]);

  // Background gradient variations with fallbacks
  const gradientVariants = useMemo(() => ({
    default: {
      primary: 'from-purple-600 via-blue-600 to-indigo-600',
      fallback: 'bg-purple-600'
    },
    login: {
      primary: 'from-purple-600 via-blue-600 to-indigo-600',
      fallback: 'bg-purple-600'
    },
    registration: {
      primary: 'from-indigo-600 via-purple-600 to-blue-600',
      fallback: 'bg-indigo-600'
    },
    admin: {
      primary: 'from-blue-600 via-indigo-600 to-purple-600',
      fallback: 'bg-blue-600'
    }
  }), []);

  const selectedGradient = gradientVariants[variant] || gradientVariants.default;

  // Generate optimized classes based on capabilities
  const containerClasses = useMemo(() => {
    const baseClasses = [
      'relative overflow-hidden min-h-screen',
      `bg-gradient-to-br ${selectedGradient.primary}`,
      selectedGradient.fallback, // Fallback for older browsers
      className
    ];

    if (capabilities.supportsCSSContainment) {
      baseClasses.push('contain-layout contain-style');
    }

    return baseClasses.join(' ');
  }, [selectedGradient, className, capabilities.supportsCSSContainment]);

  const BackgroundLayers = () => (
    <>
      {/* Primary gradient layer */}
      <div className={`absolute inset-0 bg-gradient-to-br ${selectedGradient.primary}`}></div>
      
      {/* Additional gradient layers - only on capable devices */}
      {!capabilities.isLowEndDevice && (
        <>
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/15 via-transparent to-cyan-400/15 auth-gradient-layers"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-violet-500/8 to-emerald-400/15 auth-gradient-layers"></div>
        </>
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>
    </>
  );

  const BackgroundPattern = () => (
    <div
      className="absolute inset-0 auth-perf-lazy"
      style={{
        backgroundImage: dotPattern,
        opacity: capabilities.isLowEndDevice ? 0.5 : 1
      }}
    />
  );

  return (
    <div className={containerClasses}>
      {/* Background layers */}
      <BackgroundLayers />

      {/* Animated Background Pattern - lazy loaded */}
      {lazyLoad ? (
        <LazyBackgroundElement threshold={0.1}>
          <BackgroundPattern />
        </LazyBackgroundElement>
      ) : (
        <BackgroundPattern />
      )}

      {/* Floating Orbs - performance optimized */}
      {showOrbs && (
        <FloatingOrbs 
          variant={orbVariant} 
          lazy={lazyLoad}
          className="auth-perf-lazy"
        />
      )}

      {/* Content */}
      <div className="relative z-10 auth-perf-critical">
        {children}
      </div>
    </div>
  );
};

export default AuthBackground;