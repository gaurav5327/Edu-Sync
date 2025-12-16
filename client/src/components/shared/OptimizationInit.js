/**
 * Optimization Initialization
 * 
 * Initializes all performance optimizations and cross-browser compatibility
 * features for the enhanced authentication UI.
 */

import { initializeCrossBrowserSupport } from './CrossBrowserUtils';
import { initializePerformanceMonitoring } from './PerformanceMonitor';

/**
 * Initialize all optimizations
 */
export const initializeOptimizations = () => {
  // Initialize cross-browser support
  initializeCrossBrowserSupport();
  
  // Initialize performance monitoring
  initializePerformanceMonitoring();
  
  // Load optimized CSS
  loadOptimizedCSS();
  
  // Set up viewport optimizations
  setupViewportOptimizations();
  
  // Initialize accessibility enhancements
  initializeAccessibilityEnhancements();
  
  // Set up error boundaries for performance issues
  setupPerformanceErrorHandling();
  
  console.log('Authentication UI optimizations initialized');
};

/**
 * Load optimized CSS styles
 */
const loadOptimizedCSS = () => {
  // Check if styles are already loaded
  if (document.querySelector('#auth-optimized-styles')) {
    return;
  }

  // Create and append CSS link
  const link = document.createElement('link');
  link.id = 'auth-optimized-styles';
  link.rel = 'stylesheet';
  link.href = '/src/components/shared/OptimizedAuthStyles.css';
  link.media = 'all';
  
  // Add to head
  document.head.appendChild(link);
};

/**
 * Set up viewport optimizations
 */
const setupViewportOptimizations = () => {
  // Ensure proper viewport meta tag
  let viewportMeta = document.querySelector('meta[name="viewport"]');
  
  if (!viewportMeta) {
    viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    document.head.appendChild(viewportMeta);
  }
  
  // Set optimized viewport content
  viewportMeta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no';
  
  // Add theme color for mobile browsers
  let themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeColorMeta) {
    themeColorMeta = document.createElement('meta');
    themeColorMeta.name = 'theme-color';
    themeColorMeta.content = '#8b5cf6';
    document.head.appendChild(themeColorMeta);
  }
};

/**
 * Initialize accessibility enhancements
 */
const initializeAccessibilityEnhancements = () => {
  // Add skip navigation link if not present
  if (!document.querySelector('.auth-skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'auth-skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.setAttribute('aria-label', 'Skip to main content');
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
  
  // Set up focus management
  setupFocusManagement();
  
  // Set up keyboard navigation enhancements
  setupKeyboardNavigation();
};

/**
 * Set up focus management
 */
const setupFocusManagement = () => {
  // Track focus for better accessibility
  let focusedElement = null;
  
  document.addEventListener('focusin', (e) => {
    focusedElement = e.target;
  });
  
  // Restore focus when needed
  window.restoreFocus = () => {
    if (focusedElement && document.contains(focusedElement)) {
      focusedElement.focus();
    }
  };
};

/**
 * Set up keyboard navigation enhancements
 */
const setupKeyboardNavigation = () => {
  // Enhanced keyboard navigation for auth components
  document.addEventListener('keydown', (e) => {
    // Escape key handling for modals
    if (e.key === 'Escape') {
      const modal = document.querySelector('[role="dialog"][aria-modal="true"]');
      if (modal) {
        const closeButton = modal.querySelector('[aria-label*="close" i], [aria-label*="Close" i]');
        if (closeButton) {
          closeButton.click();
        }
      }
    }
    
    // Tab key handling for better focus management
    if (e.key === 'Tab') {
      // Add visual indication for keyboard users
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  // Remove keyboard navigation class on mouse use
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
};

/**
 * Set up performance error handling
 */
const setupPerformanceErrorHandling = () => {
  // Monitor for performance issues
  if ('PerformanceObserver' in window) {
    try {
      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn(`Long task detected: ${entry.duration}ms. Consider optimizing.`);
            
            // Automatically reduce animations on repeated long tasks
            if (entry.duration > 100) {
              document.documentElement.classList.add('reduce-animations');
            }
          }
        }
      });
      
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.warn('Performance monitoring not fully supported');
    }
  }
  
  // Monitor memory usage
  if (performance.memory) {
    const checkMemory = () => {
      const memoryUsage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
      
      if (memoryUsage > 0.8) {
        console.warn('High memory usage detected. Reducing visual effects.');
        document.documentElement.classList.add('low-memory-mode');
      }
    };
    
    // Check memory every 30 seconds
    setInterval(checkMemory, 30000);
  }
};

/**
 * Cleanup optimizations
 */
export const cleanupOptimizations = () => {
  // Remove added CSS
  const cssLink = document.querySelector('#auth-optimized-styles');
  if (cssLink) {
    cssLink.remove();
  }
  
  // Remove added classes
  document.documentElement.classList.remove(
    'reduce-animations',
    'low-memory-mode',
    'keyboard-navigation'
  );
  
  console.log('Authentication UI optimizations cleaned up');
};

/**
 * React hook for optimization lifecycle
 */
export const useOptimizations = () => {
  React.useEffect(() => {
    initializeOptimizations();
    
    return () => {
      // Cleanup is optional since optimizations are global
      // cleanupOptimizations();
    };
  }, []);
};

/**
 * Performance-aware component wrapper
 */
export const withPerformanceOptimizations = (WrappedComponent) => {
  return React.forwardRef((props, ref) => {
    const [isOptimized, setIsOptimized] = React.useState(false);
    
    React.useEffect(() => {
      initializeOptimizations();
      setIsOptimized(true);
    }, []);
    
    if (!isOptimized) {
      // Return a lightweight loading state
      return (
        <div className="auth-loading-placeholder">
          <div className="auth-spinner" />
        </div>
      );
    }
    
    return <WrappedComponent {...props} ref={ref} />;
  });
};

export default {
  initializeOptimizations,
  cleanupOptimizations,
  useOptimizations,
  withPerformanceOptimizations
};