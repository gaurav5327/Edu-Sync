// Shared components for enhanced authentication UI
export { default as ErrorMessage } from './ErrorMessage';
export { default as SuccessMessage } from './SuccessMessage';
export { default as LoadingOverlay } from './LoadingOverlay';
export { default as FormField } from './FormField';

// Enhanced UI components
export { default as FloatingOrbs } from './FloatingOrbs';
export { default as AuthBackground } from './AuthBackground';
export { default as AuthAnimations, AnimationStyles } from './AuthAnimations';
export { default as TrustBadges } from './TrustBadges';

// Performance optimization components
export { 
  useBrowserCapabilities,
  useOptimizedIntersectionObserver,
  generateOptimizedClasses,
  LazyBackgroundElement,
  OptimizedFloatingOrbs,
  OptimizedGradientBackground
} from './PerformanceOptimizations';

// Cross-browser compatibility utilities
export { 
  FeatureDetection,
  Polyfills,
  PerformanceUtils,
  CSSUtils,
  AnimationUtils,
  AccessibilityUtils,
  initializeCrossBrowserSupport
} from './CrossBrowserUtils';

// Performance monitoring
export {
  PerformanceMonitor,
  usePerformanceMonitor,
  PerformanceRecommendations,
  globalPerformanceMonitor,
  initializePerformanceMonitoring
} from './PerformanceMonitor';

// Optimization initialization
export {
  initializeOptimizations,
  cleanupOptimizations,
  useOptimizations,
  withPerformanceOptimizations
} from './OptimizationInit';