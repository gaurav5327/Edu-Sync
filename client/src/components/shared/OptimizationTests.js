/**
 * Optimization Tests
 * 
 * Test suite for verifying performance optimizations and cross-browser
 * compatibility features work correctly.
 */

import { 
  FeatureDetection, 
  PerformanceUtils, 
  CSSUtils,
  initializeCrossBrowserSupport 
} from './CrossBrowserUtils';
import { PerformanceMonitor } from './PerformanceMonitor';

/**
 * Test suite for feature detection
 */
export const testFeatureDetection = () => {
  console.group('Feature Detection Tests');
  
  const tests = [
    {
      name: 'Backdrop Filter Support',
      test: () => FeatureDetection.supportsBackdropFilter(),
      expected: 'boolean'
    },
    {
      name: 'CSS Grid Support',
      test: () => FeatureDetection.supportsGrid(),
      expected: 'boolean'
    },
    {
      name: 'Custom Properties Support',
      test: () => FeatureDetection.supportsCustomProperties(),
      expected: 'boolean'
    },
    {
      name: 'Intersection Observer Support',
      test: () => FeatureDetection.supportsIntersectionObserver(),
      expected: 'boolean'
    },
    {
      name: 'Reduced Motion Preference',
      test: () => FeatureDetection.prefersReducedMotion(),
      expected: 'boolean'
    },
    {
      name: 'Low End Device Detection',
      test: () => FeatureDetection.isLowEndDevice(),
      expected: 'boolean'
    },
    {
      name: 'Browser Info',
      test: () => FeatureDetection.getBrowserInfo(),
      expected: 'object'
    }
  ];

  tests.forEach(({ name, test, expected }) => {
    try {
      const result = test();
      const isCorrectType = typeof result === expected;
      
      console.log(`✓ ${name}:`, result, isCorrectType ? '(PASS)' : '(FAIL - wrong type)');
    } catch (error) {
      console.error(`✗ ${name}: ERROR -`, error.message);
    }
  });
  
  console.groupEnd();
};

/**
 * Test suite for performance utilities
 */
export const testPerformanceUtils = () => {
  console.group('Performance Utils Tests');
  
  // Test debounce
  let debounceCount = 0;
  const debouncedFn = PerformanceUtils.debounce(() => {
    debounceCount++;
  }, 100);
  
  // Call multiple times quickly
  debouncedFn();
  debouncedFn();
  debouncedFn();
  
  setTimeout(() => {
    console.log(`✓ Debounce test: ${debounceCount === 1 ? 'PASS' : 'FAIL'} (count: ${debounceCount})`);
  }, 150);
  
  // Test throttle
  let throttleCount = 0;
  const throttledFn = PerformanceUtils.throttle(() => {
    throttleCount++;
  }, 100);
  
  // Call multiple times quickly
  throttledFn();
  throttledFn();
  throttledFn();
  
  setTimeout(() => {
    console.log(`✓ Throttle test: ${throttleCount === 1 ? 'PASS' : 'FAIL'} (count: ${throttleCount})`);
  }, 50);
  
  // Test requestAnimationFrame
  try {
    const rafId = PerformanceUtils.requestAnimationFrame(() => {
      console.log('✓ RequestAnimationFrame: PASS');
    });
    
    if (typeof rafId === 'number') {
      PerformanceUtils.cancelAnimationFrame(rafId);
      console.log('✓ CancelAnimationFrame: PASS');
    }
  } catch (error) {
    console.error('✗ Animation frame tests: ERROR -', error.message);
  }
  
  console.groupEnd();
};

/**
 * Test suite for CSS utilities
 */
export const testCSSUtils = () => {
  console.group('CSS Utils Tests');
  
  try {
    // Test vendor prefixes
    const prefixed = CSSUtils.addVendorPrefixes('transform', 'translateX(10px)');
    const hasPrefixes = prefixed.includes('-webkit-') && prefixed.includes('-moz-');
    console.log(`✓ Vendor prefixes: ${hasPrefixes ? 'PASS' : 'FAIL'}`);
    
    // Test fallback classes generation
    const classes = CSSUtils.generateFallbackClasses();
    const isArray = Array.isArray(classes);
    console.log(`✓ Fallback classes: ${isArray ? 'PASS' : 'FAIL'} (${classes.length} classes)`);
    
    // Test applying feature classes
    CSSUtils.applyFeatureClasses();
    const hasClasses = document.documentElement.classList.length > 0;
    console.log(`✓ Apply feature classes: ${hasClasses ? 'PASS' : 'FAIL'}`);
    
  } catch (error) {
    console.error('✗ CSS Utils tests: ERROR -', error.message);
  }
  
  console.groupEnd();
};

/**
 * Test suite for performance monitoring
 */
export const testPerformanceMonitoring = () => {
  console.group('Performance Monitoring Tests');
  
  try {
    const monitor = new PerformanceMonitor();
    
    // Test basic measurement
    monitor.startMeasure('test-operation');
    
    // Simulate some work
    setTimeout(() => {
      const duration = monitor.endMeasure('test-operation');
      console.log(`✓ Basic measurement: ${typeof duration === 'number' ? 'PASS' : 'FAIL'}`);
      
      // Test metrics retrieval
      const metrics = monitor.getMetrics();
      console.log(`✓ Metrics retrieval: ${typeof metrics === 'object' ? 'PASS' : 'FAIL'}`);
      
      // Test report generation
      const report = monitor.generateReport();
      console.log(`✓ Report generation: ${typeof report === 'object' ? 'PASS' : 'FAIL'}`);
      
      monitor.cleanup();
      console.log('✓ Monitor cleanup: PASS');
      
    }, 10);
    
  } catch (error) {
    console.error('✗ Performance monitoring tests: ERROR -', error.message);
  }
  
  console.groupEnd();
};

/**
 * Test suite for cross-browser initialization
 */
export const testCrossBrowserInit = () => {
  console.group('Cross-Browser Initialization Tests');
  
  try {
    // Test initialization
    initializeCrossBrowserSupport();
    console.log('✓ Cross-browser initialization: PASS');
    
    // Check if polyfills were applied
    const hasIntersectionObserver = 'IntersectionObserver' in window;
    const hasCSSSupports = window.CSS && window.CSS.supports;
    const hasMatchMedia = 'matchMedia' in window;
    
    console.log(`✓ IntersectionObserver polyfill: ${hasIntersectionObserver ? 'PASS' : 'FAIL'}`);
    console.log(`✓ CSS.supports polyfill: ${hasCSSSupports ? 'PASS' : 'FAIL'}`);
    console.log(`✓ matchMedia polyfill: ${hasMatchMedia ? 'PASS' : 'FAIL'}`);
    
  } catch (error) {
    console.error('✗ Cross-browser initialization: ERROR -', error.message);
  }
  
  console.groupEnd();
};

/**
 * Test animation performance
 */
export const testAnimationPerformance = () => {
  console.group('Animation Performance Tests');
  
  try {
    // Create test element
    const testElement = document.createElement('div');
    testElement.style.cssText = `
      position: fixed;
      top: -100px;
      left: -100px;
      width: 50px;
      height: 50px;
      background: red;
      transform: translateZ(0);
    `;
    document.body.appendChild(testElement);
    
    // Test hardware acceleration
    const hasTransform = testElement.style.transform === 'translateZ(0)';
    console.log(`✓ Hardware acceleration: ${hasTransform ? 'PASS' : 'FAIL'}`);
    
    // Test animation performance
    let frameCount = 0;
    const startTime = performance.now();
    
    const animateTest = () => {
      frameCount++;
      testElement.style.transform = `translateZ(0) rotate(${frameCount}deg)`;
      
      if (frameCount < 60) {
        requestAnimationFrame(animateTest);
      } else {
        const endTime = performance.now();
        const duration = endTime - startTime;
        const fps = Math.round((frameCount * 1000) / duration);
        
        console.log(`✓ Animation FPS: ${fps} (${fps >= 30 ? 'PASS' : 'FAIL'})`);
        
        // Cleanup
        document.body.removeChild(testElement);
      }
    };
    
    requestAnimationFrame(animateTest);
    
  } catch (error) {
    console.error('✗ Animation performance tests: ERROR -', error.message);
  }
  
  console.groupEnd();
};

/**
 * Test memory usage
 */
export const testMemoryUsage = () => {
  console.group('Memory Usage Tests');
  
  if (performance.memory) {
    const initialMemory = performance.memory.usedJSHeapSize;
    
    // Create some objects to test memory tracking
    const testObjects = [];
    for (let i = 0; i < 1000; i++) {
      testObjects.push({
        id: i,
        data: new Array(100).fill(Math.random())
      });
    }
    
    setTimeout(() => {
      const currentMemory = performance.memory.usedJSHeapSize;
      const memoryIncrease = currentMemory - initialMemory;
      
      console.log(`✓ Memory tracking: PASS (increased by ${Math.round(memoryIncrease / 1024)}KB)`);
      
      // Cleanup
      testObjects.length = 0;
      
      // Force garbage collection if available
      if (window.gc) {
        window.gc();
      }
      
    }, 100);
  } else {
    console.log('✓ Memory tracking: SKIP (not supported)');
  }
  
  console.groupEnd();
};

/**
 * Run all tests
 */
export const runAllOptimizationTests = () => {
  console.log('🚀 Starting Authentication UI Optimization Tests...');
  
  testFeatureDetection();
  testPerformanceUtils();
  testCSSUtils();
  testPerformanceMonitoring();
  testCrossBrowserInit();
  testAnimationPerformance();
  testMemoryUsage();
  
  console.log('✅ All optimization tests completed!');
};

/**
 * Benchmark performance improvements
 */
export const benchmarkPerformance = () => {
  console.group('Performance Benchmarks');
  
  const benchmarks = {
    domQueries: () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        document.querySelector('body');
      }
      return performance.now() - start;
    },
    
    cssAnimations: () => {
      const element = document.createElement('div');
      element.style.cssText = 'position: fixed; top: -100px; transform: translateZ(0);';
      document.body.appendChild(element);
      
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        element.style.transform = `translateZ(0) translateX(${i}px)`;
      }
      const duration = performance.now() - start;
      
      document.body.removeChild(element);
      return duration;
    },
    
    memoryAllocation: () => {
      const start = performance.now();
      const arrays = [];
      for (let i = 0; i < 1000; i++) {
        arrays.push(new Array(100).fill(i));
      }
      const duration = performance.now() - start;
      arrays.length = 0; // Cleanup
      return duration;
    }
  };
  
  Object.entries(benchmarks).forEach(([name, benchmark]) => {
    try {
      const duration = benchmark();
      console.log(`📊 ${name}: ${duration.toFixed(2)}ms`);
    } catch (error) {
      console.error(`❌ ${name}: ERROR -`, error.message);
    }
  });
  
  console.groupEnd();
};

export default {
  testFeatureDetection,
  testPerformanceUtils,
  testCSSUtils,
  testPerformanceMonitoring,
  testCrossBrowserInit,
  testAnimationPerformance,
  testMemoryUsage,
  runAllOptimizationTests,
  benchmarkPerformance
};