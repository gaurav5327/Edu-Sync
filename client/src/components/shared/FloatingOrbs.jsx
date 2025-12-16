import React, { useState, useEffect, useMemo } from 'react';
import { useBrowserCapabilities, LazyBackgroundElement } from './PerformanceOptimizations';

/**
 * FloatingOrbs Component (Performance Optimized)
 * 
 * Renders animated floating orbs with configurable positions and animations.
 * Includes performance optimizations and cross-browser compatibility.
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Orb variant ('default', 'auth', 'minimal')
 * @param {Array} props.customOrbs - Custom orb configurations
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.lazy - Enable lazy loading (default: true)
 */
const FloatingOrbs = ({ 
  variant = 'default', 
  customOrbs = null, 
  className = '',
  lazy = true
}) => {
  const capabilities = useBrowserCapabilities();
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Disable orbs on low-end devices or when reduced motion is preferred
    if (capabilities.isLowEndDevice || capabilities.prefersReducedMotion) {
      setShouldRender(false);
    }
  }, [capabilities]);

  // Memoize orb configurations for performance
  const orbConfigurations = useMemo(() => ({
    default: [
      {
        position: 'top-20 left-10',
        size: 'w-20 sm:w-24 md:w-28 lg:w-32 h-20 sm:h-24 md:h-28 lg:h-32',
        gradient: 'from-pink-400/20 to-purple-400/20',
        opacity: 'opacity-40 sm:opacity-50 md:opacity-60 hover:opacity-80',
        delay: '0s'
      },
      {
        position: 'top-40 right-20',
        size: 'w-16 sm:w-20 md:w-22 lg:w-24 h-16 sm:h-20 md:h-22 lg:h-24',
        gradient: 'from-blue-400/20 to-cyan-400/20',
        opacity: 'opacity-35 sm:opacity-40 md:opacity-50 hover:opacity-70',
        delay: '1s'
      },
      {
        position: 'bottom-40 left-20',
        size: 'w-14 sm:w-16 md:w-18 lg:w-20 h-14 sm:h-16 md:h-18 lg:h-20',
        gradient: 'from-indigo-400/20 to-purple-400/20',
        opacity: 'opacity-30 sm:opacity-35 md:opacity-40 hover:opacity-60',
        delay: '2s'
      },
      {
        position: 'bottom-20 right-10',
        size: 'w-18 sm:w-22 md:w-24 lg:w-28 h-18 sm:h-22 md:h-24 lg:h-28',
        gradient: 'from-violet-400/20 to-pink-400/20',
        opacity: 'opacity-35 sm:opacity-45 md:opacity-55 hover:opacity-75',
        delay: '0.5s'
      },
      {
        position: 'top-1/3 left-1/4',
        size: 'w-10 sm:w-12 md:w-14 lg:w-16 h-10 sm:h-12 md:h-14 lg:h-16',
        gradient: 'from-emerald-400/15 to-teal-400/15',
        opacity: 'opacity-20 sm:opacity-25 md:opacity-30',
        delay: '3s'
      },
      {
        position: 'top-2/3 right-1/3',
        size: 'w-8 sm:w-10 md:w-11 lg:w-12 h-8 sm:h-10 md:h-11 lg:h-12',
        gradient: 'from-orange-400/15 to-red-400/15',
        opacity: 'opacity-15 sm:opacity-20 md:opacity-25',
        delay: '4s'
      }
    ],
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
    ],
    minimal: [
      {
        position: 'top-20 left-12',
        size: 'w-16 sm:w-20 h-16 sm:h-20',
        gradient: 'from-purple-400/15 to-blue-400/15',
        opacity: 'opacity-30 hover:opacity-50',
        delay: '0s'
      },
      {
        position: 'bottom-20 right-12',
        size: 'w-14 sm:w-16 h-14 sm:h-16',
        gradient: 'from-pink-400/15 to-purple-400/15',
        opacity: 'opacity-25 hover:opacity-45',
        delay: '2s'
      }
    ]
  }), []);

  const orbs = customOrbs || orbConfigurations[variant] || orbConfigurations.default;

  if (!shouldRender) {
    return null;
  }

  const OrbsContent = () => (
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
            auth-floating-orb auth-optimized
          `}
          style={{ 
            animationDelay: capabilities.prefersReducedMotion ? '0s' : orb.delay,
            pointerEvents: 'none',
            transform: 'translateZ(0)', // Force hardware acceleration
            backfaceVisibility: 'hidden'
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );

  // Use lazy loading if enabled
  if (lazy) {
    return (
      <LazyBackgroundElement threshold={0.1} rootMargin="200px">
        <OrbsContent />
      </LazyBackgroundElement>
    );
  }

  return <OrbsContent />;
};

export default FloatingOrbs;