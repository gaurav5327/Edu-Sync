import React, { useEffect, useState, useCallback, useMemo } from 'react';

/**
 * Performance Optimizations for Authentication UI
 * 
 * This module provides performance optimizations and cross-browser compatibility
 * enhancements for the enhanced authentication pages.
 */

/**
 * Hook to detect browser capabilities and provide fallbacks
 */
export const useBrowserCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    supportsBackdropFilter: false,
    supportsGridLayout: false,
    supportsCustomProperties: false,
    supportsIntersectionObserver: false,
    prefersReducedMotion: false,
    isLowEndDevice: false,
    supportsCSSContainment: false,
    supportsWillChange: false
  });

  useEffect(() => {
    const checkCapabilities = () => {
      // Check backdrop-filter support
      const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(1px)') || 
                                   CSS.supports('-webkit-backdrop-filter', 'blur(1px)');

      // Check CSS Grid support
      const supportsGridLayout = CSS.supports('display', 'grid');

      // Check CSS Custom Properties support
      const supportsCustomProperties = CSS.supports('--test', 'value');

      // Check Intersection Observer support
      const supportsIntersectionObserver = 'IntersectionObserver' in window;

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Detect low-end devices based on hardware concurrency and memory
      const isLowEndDevice = (
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
        (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
        /Android.*Chrome\/[.0-9]*\s(Mobile|$)/.test(navigator.userAgent)
      );

      // Check CSS containment support
      const supportsCSSContainment = CSS.supports('contain', 'layout style paint');

      // Check will-change support
      const supportsWillChange = CSS.supports('will-change', 'transform');

      setCapabilities({
        supportsBackdropFilter,
        supportsGridLayout,
        supportsCustomProperties,
        supportsIntersectionObserver,
        prefersReducedMotion,
        isLowEndDevice,
        supportsCSSContainment,
        supportsWillChange
      });
    };

    checkCapabilities();

    // Listen for changes in reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => {
      setCapabilities(prev => ({ ...prev, prefersReducedMotion: e.matches }));
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return capabilities;
};

/**
 * Optimized Intersection Observer hook with performance enhancements
 */
export const useOptimizedIntersectionObserver = (options = {}) => {
  const [entries, setEntries] = useState([]);
  const [observer, setObserver] = useState(null);

  const defaultOptions = useMemo(() => ({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    ...options
  }), [options]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers without Intersection Observer
      return;
    }

    const obs = new IntersectionObserver((observedEntries) => {
      setEntries(observedEntries);
    }, defaultOptions);

    setObserver(obs);

    return () => {
      obs.disconnect();
    };
  }, [defaultOptions]);

  const observe = useCallback((element) => {
    if (observer && element) {
      observer.observe(element);
    }
  }, [observer]);

  const unobserve = useCallback((element) => {
    if (observer && element) {
      observer.unobserve(element);
    }
  }, [observer]);

  return { entries, observe, unobserve };
};

/**
 * Performance-optimized CSS class generator
 */
export const generateOptimizedClasses = (capabilities) => {
  const baseClasses = {
    // Backdrop filter with fallbacks
    backdropBlur: capabilities.supportsBackdropFilter 
      ? 'backdrop-blur-lg' 
      : 'bg-white/95',
    
    // Grid layout with flexbox fallback
    gridLayout: capabilities.supportsGridLayout 
      ? 'grid grid-cols-1 lg:grid-cols-5' 
      : 'flex flex-col lg:flex-row',
    
    // Animation classes based on device capabilities
    animations: capabilities.prefersReducedMotion || capabilities.isLowEndDevice
      ? 'transition-none'
      : 'transition-all duration-300 ease-out',
    
    // Transform optimizations
    transform: capabilities.supportsWillChange
      ? 'will-change-transform'
      : '',
    
    // Containment for better performance
    containment: capabilities.supportsCSSContainment
      ? 'contain-layout contain-style'
      : ''
  };

  return baseClasses;
};

/**
 * Lazy loading component for background elements
 */
export const LazyBackgroundElement = ({ 
  children, 
  threshold = 0.1, 
  rootMargin = '100px',
  fallback = null 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [elementRef, setElementRef] = useState(null);

  const { observe, unobserve } = useOptimizedIntersectionObserver({
    threshold,
    rootMargin
  });

  useEffect(() => {
    if (elementRef) {
      observe(elementRef);
      
      return () => {
        unobserve(elementRef);
      };
    }
  }, [elementRef, observe, unobserve]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      // Fallback: immediately show content if no Intersection Observer
      setIsVisible(true);
    }
  }, []);

  const handleIntersection = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isVisible) {
      setIsVisible(true);
    }
  }, [isVisible]);

  return (
    <div ref={setElementRef}>
      {isVisible ? children : fallback}
    </div>
  );
};

/**
 * Optimized floating orbs with performance enhancements
 */
export const OptimizedFloatingOrbs = ({ variant = 'auth', className = '' }) => {
  const capabilities = useBrowserCapabilities();
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Disable orbs on low-end devices or when reduced motion is preferred
    if (capabilities.isLowEndDevice || capabilities.prefersReducedMotion) {
      setShouldRender(false);
    }
  }, [capabilities]);

  const orbConfigurations = useMemo(() => ({
    auth: [
      {
        position: 'top-16 left-8',
        size: 'w-20 sm:w-24 h-20 sm:h-24',
        gradient: 'from-pink-400/20 to-purple-400/20',
        opacity: 'opacity-40 hover:opacity-60',
        delay: '0s'
      },
      {
        position: 'top-32 right-16',
        size: 'w-16 sm:w-20 h-16 sm:h-20',
        gradient: 'from-blue-400/20 to-cyan-400/20',
        opacity: 'opacity-35 hover:opacity-55',
        delay: '1.5s'
      },
      {
        position: 'bottom-32 left-16',
        size: 'w-14 sm:w-16 h-14 sm:h-16',
        gradient: 'from-indigo-400/20 to-purple-400/20',
        opacity: 'opacity-30 hover:opacity-50',
        delay: '2.5s'
      },
      {
        position: 'bottom-16 right-8',
        size: 'w-18 sm:w-22 h-18 sm:h-22',
        gradient: 'from-violet-400/20 to-pink-400/20',
        opacity: 'opacity-35 hover:opacity-55',
        delay: '1s'
      }
    ]
  }), []);

  const orbs = orbConfigurations[variant] || orbConfigurations.auth;

  if (!shouldRender) {
    return null;
  }

  return (
    <LazyBackgroundElement threshold={0.1} rootMargin="200px">
      <div className={`absolute inset-0 pointer-events-none ${className}`}>
        {orbs.map((orb, index) => (
          <div
            key={index}
            className={`
              absolute ${orb.position} ${orb.size} 
              bg-gradient-to-r ${orb.gradient} 
              rounded-full blur-xl
              ${capabilities.prefersReducedMotion ? '' : 'animate-pulse'}
              ${orb.opacity} 
              transition-opacity duration-1000
              ${capabilities.supportsWillChange ? 'will-change-transform' : ''}
              ${capabilities.supportsCSSContainment ? 'contain-layout' : ''}
            `}
            style={{ 
              animationDelay: capabilities.prefersReducedMotion ? '0s' : orb.delay,
              pointerEvents: 'none',
              transform: 'translateZ(0)', // Force hardware acceleration
            }}
          />
        ))}
      </div>
    </LazyBackgroundElement>
  );
};

/**
 * Cross-browser compatible gradient background
 */
export const OptimizedGradientBackground = ({ variant = 'default', children }) => {
  const capabilities = useBrowserCapabilities();

  const gradientVariants = {
    default: {
      modern: 'bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600',
      fallback: 'bg-purple-600'
    },
    login: {
      modern: 'bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600',
      fallback: 'bg-purple-600'
    },
    registration: {
      modern: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600',
      fallback: 'bg-indigo-600'
    }
  };

  const selectedVariant = gradientVariants[variant] || gradientVariants.default;

  // Dot pattern with performance optimization
  const dotPattern = useMemo(() => 
    `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    []
  );

  return (
    <div className={`
      relative overflow-hidden min-h-screen
      ${selectedVariant.modern}
      ${capabilities.supportsCSSContainment ? 'contain-layout contain-style' : ''}
    `}>
      {/* Primary gradient layer */}
      <div className={`absolute inset-0 ${selectedVariant.modern}`}></div>
      
      {/* Additional gradient layers - only on capable devices */}
      {!capabilities.isLowEndDevice && (
        <>
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/15 via-transparent to-cyan-400/15"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-violet-500/8 to-emerald-400/15"></div>
        </>
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Background pattern - lazy loaded */}
      <LazyBackgroundElement threshold={0.1}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: dotPattern,
            opacity: capabilities.isLowEndDevice ? 0.5 : 1
          }}
        />
      </LazyBackgroundElement>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default {
  useBrowserCapabilities,
  useOptimizedIntersectionObserver,
  generateOptimizedClasses,
  LazyBackgroundElement,
  OptimizedFloatingOrbs,
  OptimizedGradientBackground
};