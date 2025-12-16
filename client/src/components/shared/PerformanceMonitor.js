/**
 * Performance Monitoring Utilities
 * 
 * Provides performance monitoring and optimization tracking for
 * the enhanced authentication UI components.
 */

/**
 * Performance metrics collector
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.isEnabled = process.env.NODE_ENV === 'development';
  }

  /**
   * Start measuring a performance metric
   */
  startMeasure(name) {
    if (!this.isEnabled) return;
    
    this.metrics.set(name, {
      startTime: performance.now(),
      startMark: `${name}-start`
    });
    
    if (performance.mark) {
      performance.mark(`${name}-start`);
    }
  }

  /**
   * End measuring a performance metric
   */
  endMeasure(name) {
    if (!this.isEnabled) return;
    
    const metric = this.metrics.get(name);
    if (!metric) return;

    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    
    if (performance.mark && performance.measure) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }

    console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
    
    // Store the result
    this.metrics.set(name, {
      ...metric,
      endTime,
      duration
    });

    return duration;
  }

  /**
   * Monitor animation frame rate
   */
  monitorFPS(callback, duration = 5000) {
    if (!this.isEnabled) return;

    let frames = 0;
    let startTime = performance.now();
    let lastTime = startTime;

    const measureFrame = (currentTime) => {
      frames++;
      const elapsed = currentTime - startTime;
      
      if (elapsed >= duration) {
        const fps = Math.round((frames * 1000) / elapsed);
        console.log(`Average FPS over ${duration}ms: ${fps}`);
        if (callback) callback(fps);
        return;
      }
      
      requestAnimationFrame(measureFrame);
    };

    requestAnimationFrame(measureFrame);
  }

  /**
   * Monitor memory usage (if available)
   */
  monitorMemory() {
    if (!this.isEnabled || !performance.memory) return null;

    const memory = {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
    };

    console.log('Memory usage:', memory);
    return memory;
  }

  /**
   * Monitor paint timing
   */
  monitorPaintTiming() {
    if (!this.isEnabled) return;

    // First Paint and First Contentful Paint
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach(entry => {
      console.log(`${entry.name}: ${entry.startTime.toFixed(2)}ms`);
    });

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log(`Largest Contentful Paint: ${lastEntry.startTime.toFixed(2)}ms`);
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', lcpObserver);
      } catch (e) {
        console.warn('LCP monitoring not supported');
      }
    }
  }

  /**
   * Monitor layout shifts
   */
  monitorLayoutShift() {
    if (!this.isEnabled || !('PerformanceObserver' in window)) return;

    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      
      if (clsValue > 0) {
        console.log(`Cumulative Layout Shift: ${clsValue.toFixed(4)}`);
      }
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', clsObserver);
    } catch (e) {
      console.warn('CLS monitoring not supported');
    }
  }

  /**
   * Monitor long tasks
   */
  monitorLongTasks() {
    if (!this.isEnabled || !('PerformanceObserver' in window)) return;

    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
      }
    });

    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.set('longtask', longTaskObserver);
    } catch (e) {
      console.warn('Long task monitoring not supported');
    }
  }

  /**
   * Get all performance metrics
   */
  getMetrics() {
    if (!this.isEnabled) return {};

    const metrics = {};
    this.metrics.forEach((value, key) => {
      metrics[key] = value;
    });

    return {
      ...metrics,
      memory: this.monitorMemory(),
      navigation: performance.getEntriesByType('navigation')[0],
      paint: performance.getEntriesByType('paint')
    };
  }

  /**
   * Clean up observers
   */
  cleanup() {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();
  }

  /**
   * Generate performance report
   */
  generateReport() {
    if (!this.isEnabled) return;

    const metrics = this.getMetrics();
    const report = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      metrics,
      recommendations: this.generateRecommendations(metrics)
    };

    console.group('Performance Report');
    console.table(report.metrics);
    console.log('Recommendations:', report.recommendations);
    console.groupEnd();

    return report;
  }

  /**
   * Generate performance recommendations
   */
  generateRecommendations(metrics) {
    const recommendations = [];

    // Check memory usage
    if (metrics.memory && metrics.memory.used > metrics.memory.limit * 0.8) {
      recommendations.push('High memory usage detected. Consider reducing animation complexity.');
    }

    // Check for long tasks
    if (metrics.longtask && metrics.longtask.length > 0) {
      recommendations.push('Long tasks detected. Consider breaking up heavy operations.');
    }

    // Check paint timing
    if (metrics.paint) {
      const fcp = metrics.paint.find(p => p.name === 'first-contentful-paint');
      if (fcp && fcp.startTime > 2500) {
        recommendations.push('Slow first contentful paint. Consider optimizing critical rendering path.');
      }
    }

    return recommendations;
  }
}

/**
 * React hook for performance monitoring
 */
export const usePerformanceMonitor = (componentName) => {
  const monitor = new PerformanceMonitor();

  React.useEffect(() => {
    monitor.startMeasure(`${componentName}-mount`);
    monitor.monitorPaintTiming();
    monitor.monitorLayoutShift();
    monitor.monitorLongTasks();

    return () => {
      monitor.endMeasure(`${componentName}-mount`);
      monitor.cleanup();
    };
  }, [componentName]);

  return {
    startMeasure: (name) => monitor.startMeasure(`${componentName}-${name}`),
    endMeasure: (name) => monitor.endMeasure(`${componentName}-${name}`),
    monitorFPS: monitor.monitorFPS.bind(monitor),
    getMetrics: monitor.getMetrics.bind(monitor),
    generateReport: monitor.generateReport.bind(monitor)
  };
};

/**
 * Performance optimization recommendations
 */
export const PerformanceRecommendations = {
  // Animation optimizations
  animations: {
    useTransform: 'Use transform instead of changing layout properties',
    useWillChange: 'Add will-change property for elements that will be animated',
    useHardwareAcceleration: 'Use translateZ(0) to trigger hardware acceleration',
    limitAnimations: 'Limit concurrent animations on low-end devices',
    useRequestAnimationFrame: 'Use requestAnimationFrame for smooth animations'
  },

  // CSS optimizations
  css: {
    avoidLayoutThrashing: 'Avoid properties that trigger layout recalculation',
    useContainment: 'Use CSS containment for isolated components',
    optimizeSelectors: 'Use efficient CSS selectors',
    minimizeRepaints: 'Group DOM reads and writes to minimize repaints',
    useCompositing: 'Use CSS properties that create compositing layers'
  },

  // JavaScript optimizations
  javascript: {
    debounceEvents: 'Debounce scroll and resize event handlers',
    usePassiveListeners: 'Use passive event listeners where possible',
    optimizeLoops: 'Optimize loops and reduce iterations',
    useWebWorkers: 'Use Web Workers for heavy computations',
    lazyLoadComponents: 'Lazy load components that are not immediately visible'
  },

  // Memory optimizations
  memory: {
    cleanupEventListeners: 'Remove event listeners when components unmount',
    avoidMemoryLeaks: 'Avoid creating closures that retain large objects',
    useWeakReferences: 'Use WeakMap and WeakSet for temporary references',
    optimizeImages: 'Optimize images and use appropriate formats',
    limitDOMNodes: 'Limit the number of DOM nodes in the document'
  }
};

// Global performance monitor instance
export const globalPerformanceMonitor = new PerformanceMonitor();

// Initialize performance monitoring
export const initializePerformanceMonitoring = () => {
  if (process.env.NODE_ENV === 'development') {
    globalPerformanceMonitor.monitorPaintTiming();
    globalPerformanceMonitor.monitorLayoutShift();
    globalPerformanceMonitor.monitorLongTasks();
    
    // Generate report after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        globalPerformanceMonitor.generateReport();
      }, 2000);
    });
  }
};

export default {
  PerformanceMonitor,
  usePerformanceMonitor,
  PerformanceRecommendations,
  globalPerformanceMonitor,
  initializePerformanceMonitoring
};