import React, { useEffect, useRef } from 'react';

/**
 * AuthAnimations Component
 * 
 * Provides scroll-based animations and intersection observer functionality
 * for authentication pages. Extracted from HomePage for reuse.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to animate
 * @param {string} props.animation - Animation type ('fadeInUp', 'fadeInLeft', 'fadeInRight', 'scaleIn')
 * @param {string} props.delay - Animation delay (e.g., '0.1s', '0.2s')
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.triggerOnce - Whether animation should trigger only once
 */
const AuthAnimations = ({ 
  children, 
  animation = 'fadeInUp',
  delay = '0s',
  className = '',
  triggerOnce = true
}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          entry.target.classList.remove('animate');
        }
      });
    }, observerOptions);

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [triggerOnce]);

  return (
    <div
      ref={elementRef}
      className={`scroll-animate ${className}`}
      data-animate={animation}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
};

/**
 * AnimationStyles Component
 * 
 * Provides the CSS styles for scroll animations.
 * Should be included once in the app or page.
 */
export const AnimationStyles = () => (
  <style jsx global>{`
    /* Smooth scrolling for the entire page */
    html {
      scroll-behavior: smooth;
    }

    /* Base scroll animate styles */
    .scroll-animate {
      opacity: 0;
      transform: translateY(50px);
      transition: all 0.8s ease-out;
    }

    .scroll-animate.animate {
      opacity: 1;
      transform: translateY(0);
    }

    /* Fade In Up Animation */
    .scroll-animate[data-animate="fadeInUp"] {
      opacity: 0;
      transform: translateY(50px);
      transition: all 0.8s ease-out;
    }

    .scroll-animate[data-animate="fadeInUp"].animate {
      opacity: 1;
      transform: translateY(0);
    }

    /* Fade In Left Animation */
    .scroll-animate[data-animate="fadeInLeft"] {
      opacity: 0;
      transform: translateX(-50px);
      transition: all 0.8s ease-out;
    }

    .scroll-animate[data-animate="fadeInLeft"].animate {
      opacity: 1;
      transform: translateX(0);
    }

    /* Fade In Right Animation */
    .scroll-animate[data-animate="fadeInRight"] {
      opacity: 0;
      transform: translateX(50px);
      transition: all 0.8s ease-out;
    }

    .scroll-animate[data-animate="fadeInRight"].animate {
      opacity: 1;
      transform: translateX(0);
    }

    /* Scale In Animation */
    .scroll-animate[data-animate="scaleIn"] {
      opacity: 0;
      transform: scale(0.8);
      transition: all 0.8s ease-out;
    }

    .scroll-animate[data-animate="scaleIn"].animate {
      opacity: 1;
      transform: scale(1);
    }

    /* Enhanced floating animation */
    @keyframes float {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      33% {
        transform: translateY(-10px) rotate(1deg);
      }
      66% {
        transform: translateY(5px) rotate(-1deg);
      }
    }

    .float-animation {
      animation: float 6s ease-in-out infinite;
    }

    /* Gradient text animation */
    @keyframes gradient-shift {
      0%, 100% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
    }

    .gradient-text {
      background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
      background-size: 400% 400%;
      animation: gradient-shift 4s ease infinite;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Pulse animation for buttons and interactive elements */
    @keyframes auth-pulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
      }
      50% {
        transform: scale(1.02);
        box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
      }
    }

    .auth-pulse {
      animation: auth-pulse 2s infinite;
    }

    /* Backdrop blur enhancement */
    .auth-backdrop-blur {
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }

    /* Form field focus animations */
    .auth-input-focus {
      transition: all 0.3s ease;
    }

    .auth-input-focus:focus {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    }

    /* Button hover animations */
    .auth-button-hover {
      transition: all 0.3s ease;
    }

    .auth-button-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25);
    }

    /* Loading spinner animation */
    @keyframes auth-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .auth-spin {
      animation: auth-spin 1s linear infinite;
    }

    /* Error shake animation */
    @keyframes auth-shake {
      0%, 100% {
        transform: translateX(0);
      }
      25% {
        transform: translateX(-5px);
      }
      75% {
        transform: translateX(5px);
      }
    }

    .auth-shake {
      animation: auth-shake 0.5s ease-in-out;
    }

    /* Success bounce animation */
    @keyframes auth-bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }

    .auth-bounce {
      animation: auth-bounce 1s ease-in-out;
    }
  `}</style>
);

export default AuthAnimations;