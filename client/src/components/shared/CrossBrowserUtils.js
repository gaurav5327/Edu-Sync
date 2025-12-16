/**
 * Cross-Browser Compatibility Utilities
 * 
 * Provides feature detection, polyfills, and fallbacks for enhanced
 * authentication UI components across different browsers and devices.
 */

/**
 * Feature detection utilities
 */
export const FeatureDetection = {
  // Check if backdrop-filter is supported
  supportsBackdropFilter() {
    return (
      CSS.supports('backdrop-filter', 'blur(1px)') ||
      CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
    );
  },

  // Check if CSS Grid is supported
  supportsGrid() {
    return CSS.supports('display', 'grid');
  },

  // Check if CSS Custom Properties are supported
  supportsCustomProperties() {
    return CSS.supports('--test', 'value');
  },

  // Check if Intersection Observer is supported
  supportsIntersectionObserver() {
    return 'IntersectionObserver' in window;
  },

  // Check if user prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Check if device has limited resources
  isLowEndDevice() {
    return (
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
      /Android.*Chrome\/[.0-9]*\s(Mobile|$)/.test(navigator.userAgent)
    );
  },

  // Check if CSS containment is supported
  supportsCSSContainment() {
    return CSS.supports('contain', 'layout style paint');
  },

  // Check if will-change is supported
  supportsWillChange() {
    return CSS.supports('will-change', 'transform');
  },

  // Check if container queries are supported
  supportsContainerQueries() {
    return CSS.supports('container-type', 'inline-size');
  },

  // Detect browser type
  getBrowserInfo() {
    const userAgent = navigator.userAgent;
    const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
    const isFirefox = /Firefox/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor);
    const isEdge = /Edg/.test(userAgent);
    const isIE = /Trident/.test(userAgent);

    return {
      isChrome,
      isFirefox,
      isSafari,
      isEdge,
      isIE,
      userAgent
    };
  }
};

/**
 * Polyfills for missing features
 */
export const Polyfills = {
  // Intersection Observer polyfill (lightweight)
  intersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      // Simple fallback that immediately triggers visibility
      window.IntersectionObserver = class {
        constructor(callback) {
          this.callback = callback;
        }
        
        observe(element) {
          // Immediately call callback with visible entry
          setTimeout(() => {
            this.callback([{
              target: element,
              isIntersecting: true,
              intersectionRatio: 1
            }]);
          }, 100);
        }
        
        unobserve() {}
        disconnect() {}
      };
    }
  },

  // CSS.supports polyfill for older browsers
  cssSupports() {
    if (!window.CSS || !window.CSS.supports) {
      window.CSS = window.CSS || {};
      window.CSS.supports = function(property, value) {
        // Basic feature detection fallback
        const element = document.createElement('div');
        const camelProperty = property.replace(/-([a-z])/g, (match, letter) => 
          letter.toUpperCase()
        );
        
        try {
          element.style[camelProperty] = value;
          return element.style[camelProperty] === value;
        } catch (e) {
          return false;
        }
      };
    }
  },

  // matchMedia polyfill for IE
  matchMedia() {
    if (!window.matchMedia) {
      window.matchMedia = function(query) {
        return {
          matches: false,
          media: query,
          addListener: function() {},
          removeListener: function() {},
          addEventListener: function() {},
          removeEventListener: function() {}
        };
      };
    }
  }
};

/**
 * Performance optimization utilities
 */
export const PerformanceUtils = {
  // Debounce function for performance-critical operations
  debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  // Throttle function for scroll/resize events
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Request animation frame with fallback
  requestAnimationFrame(callback) {
    const raf = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback) {
                  window.setTimeout(callback, 1000 / 60);
                };
    
    return raf(callback);
  },

  // Cancel animation frame with fallback
  cancelAnimationFrame(id) {
    const caf = window.cancelAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.oCancelAnimationFrame ||
                window.msCancelAnimationFrame ||
                clearTimeout;
    
    return caf(id);
  },

  // Optimize images for different screen densities
  getOptimizedImageSrc(baseSrc, options = {}) {
    const { width, quality = 80, format = 'webp' } = options;
    const devicePixelRatio = window.devicePixelRatio || 1;
    const optimizedWidth = width ? Math.ceil(width * devicePixelRatio) : null;
    
    // Return optimized URL (this would typically integrate with an image service)
    return baseSrc; // Placeholder - would be replaced with actual optimization logic
  }
};

/**
 * CSS class generation utilities
 */
export const CSSUtils = {
  // Generate browser-specific prefixes
  addVendorPrefixes(property, value) {
    const prefixes = ['-webkit-', '-moz-', '-ms-', '-o-', ''];
    return prefixes.map(prefix => `${prefix}${property}: ${value};`).join(' ');
  },

  // Generate fallback classes based on feature support
  generateFallbackClasses() {
    const features = FeatureDetection;
    const classes = [];

    if (!features.supportsBackdropFilter()) {
      classes.push('no-backdrop-filter');
    }

    if (!features.supportsGrid()) {
      classes.push('no-grid');
    }

    if (features.prefersReducedMotion()) {
      classes.push('reduced-motion');
    }

    if (features.isLowEndDevice()) {
      classes.push('low-end-device');
    }

    const browserInfo = features.getBrowserInfo();
    if (browserInfo.isIE) classes.push('ie');
    if (browserInfo.isEdge) classes.push('edge');
    if (browserInfo.isSafari) classes.push('safari');
    if (browserInfo.isFirefox) classes.push('firefox');
    if (browserInfo.isChrome) classes.push('chrome');

    return classes;
  },

  // Apply classes to document element
  applyFeatureClasses() {
    const classes = this.generateFallbackClasses();
    document.documentElement.classList.add(...classes);
  }
};

/**
 * Animation utilities with fallbacks
 */
export const AnimationUtils = {
  // Create optimized keyframes
  createOptimizedKeyframes(name, keyframes) {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ${name} {
        ${Object.entries(keyframes).map(([key, value]) => 
          `${key} { ${value} }`
        ).join(' ')}
      }
    `;
    document.head.appendChild(style);
    return style;
  },

  // Animate element with fallback
  animateElement(element, animation, options = {}) {
    const { duration = 300, easing = 'ease-out', fill = 'forwards' } = options;

    if (element.animate && !FeatureDetection.prefersReducedMotion()) {
      // Use Web Animations API if available
      return element.animate(animation, { duration, easing, fill });
    } else {
      // Fallback to CSS transitions
      const originalTransition = element.style.transition;
      element.style.transition = `all ${duration}ms ${easing}`;
      
      // Apply final state immediately for reduced motion
      if (animation.length > 0) {
        const finalState = animation[animation.length - 1];
        Object.assign(element.style, finalState);
      }
      
      // Restore original transition after animation
      setTimeout(() => {
        element.style.transition = originalTransition;
      }, duration);
      
      return { finished: Promise.resolve() };
    }
  }
};

/**
 * Accessibility utilities
 */
export const AccessibilityUtils = {
  // Announce content to screen readers
  announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'auth-sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Manage focus for keyboard navigation
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }
};

/**
 * Initialize all polyfills and utilities
 */
export const initializeCrossBrowserSupport = () => {
  // Apply polyfills
  Polyfills.intersectionObserver();
  Polyfills.cssSupports();
  Polyfills.matchMedia();
  
  // Apply feature detection classes
  CSSUtils.applyFeatureClasses();
  
  // Log browser capabilities for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('Browser capabilities:', {
      supportsBackdropFilter: FeatureDetection.supportsBackdropFilter(),
      supportsGrid: FeatureDetection.supportsGrid(),
      supportsIntersectionObserver: FeatureDetection.supportsIntersectionObserver(),
      prefersReducedMotion: FeatureDetection.prefersReducedMotion(),
      isLowEndDevice: FeatureDetection.isLowEndDevice(),
      browserInfo: FeatureDetection.getBrowserInfo()
    });
  }
};

export default {
  FeatureDetection,
  Polyfills,
  PerformanceUtils,
  CSSUtils,
  AnimationUtils,
  AccessibilityUtils,
  initializeCrossBrowserSupport
};