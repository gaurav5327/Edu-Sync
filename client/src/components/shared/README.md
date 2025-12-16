# Shared Authentication UI Components

This directory contains reusable UI components extracted from the HomePage for use across authentication pages (Login, AdminRegistration, etc.). These components ensure visual consistency and maintain the same modern design aesthetic throughout the authentication flow.

## Components

### FloatingOrbs

Renders animated floating orbs with configurable positions and animations.

```jsx
import { FloatingOrbs } from '../shared';

// Basic usage
<FloatingOrbs />

// With custom variant
<FloatingOrbs variant="auth" />

// With custom orb configurations
<FloatingOrbs 
  customOrbs={[
    {
      position: 'top-20 left-10',
      size: 'w-32 h-32',
      gradient: 'from-pink-400/30 to-purple-400/30',
      opacity: 'opacity-60 hover:opacity-80',
      delay: '0s'
    }
  ]} 
/>
```

**Props:**
- `variant` (string): Orb variant ('default', 'auth', 'minimal')
- `customOrbs` (Array): Custom orb configurations
- `className` (string): Additional CSS classes

### TrustBadges

Renders customizable trust badges with icons and text.

```jsx
import { TrustBadges } from '../shared';

// Basic usage
<TrustBadges />

// With custom variant
<TrustBadges variant="auth" alignment="left" />

// With custom badges
<TrustBadges 
  badges={[
    {
      icon: 'CheckCircle',
      text: 'Secure Login',
      color: 'green'
    }
  ]} 
/>
```

**Props:**
- `badges` (Array): Array of badge configurations
- `variant` (string): Badge variant ('default', 'auth', 'admin', 'registration')
- `className` (string): Additional CSS classes
- `alignment` (string): Badge alignment ('center', 'left', 'right')

### AuthBackground

Provides the shared background layers and patterns for authentication pages.

```jsx
import { AuthBackground } from '../shared';

<AuthBackground variant="login" showOrbs={true} orbVariant="auth">
  {/* Your content here */}
</AuthBackground>
```

**Props:**
- `children` (ReactNode): Child components to render over background
- `variant` (string): Background variant ('default', 'login', 'registration', 'admin')
- `showOrbs` (boolean): Whether to show floating orbs
- `orbVariant` (string): Variant for floating orbs
- `className` (string): Additional CSS classes

### AuthAnimations

Provides scroll-based animations and intersection observer functionality.

```jsx
import { AuthAnimations, AnimationStyles } from '../shared';

// Include styles once in your app
<AnimationStyles />

// Wrap components that need animation
<AuthAnimations animation="fadeInUp" delay="0.1s">
  <div>Content to animate</div>
</AuthAnimations>
```

**Props:**
- `children` (ReactNode): Child components to animate
- `animation` (string): Animation type ('fadeInUp', 'fadeInLeft', 'fadeInRight', 'scaleIn')
- `delay` (string): Animation delay (e.g., '0.1s', '0.2s')
- `className` (string): Additional CSS classes
- `triggerOnce` (boolean): Whether animation should trigger only once

## CSS Animations

Import the shared CSS animations file for consistent styling:

```jsx
import '../../styles/authAnimations.css';
```

### Available CSS Classes

**Animation Classes:**
- `.scroll-animate` - Base animation class
- `.float-animation` - Floating animation
- `.gradient-text` - Animated gradient text
- `.auth-pulse` - Pulse animation for buttons
- `.auth-spin` - Loading spinner animation
- `.auth-shake` - Error shake animation
- `.auth-bounce` - Success bounce animation
- `.slide-in-up` - Slide in from bottom
- `.slide-in-down` - Slide in from top

**Utility Classes:**
- `.auth-backdrop-blur` - Backdrop blur effect
- `.auth-input-focus` - Form field focus animations
- `.auth-button-hover` - Button hover animations
- `.auth-card-hover` - Card hover effects
- `.auth-glow` - Glow effects

## Usage Examples

### Complete Login Page Setup

```jsx
import React from 'react';
import { 
  AuthBackground, 
  TrustBadges, 
  AuthAnimations, 
  AnimationStyles 
} from '../shared';
import '../../styles/authAnimations.css';

const LoginPage = () => {
  return (
    <>
      <AnimationStyles />
      <AuthBackground variant="login" showOrbs={true} orbVariant="auth">
        <div className="flex items-center min-h-screen pt-16">
          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
              
              {/* Left Panel */}
              <div className="text-white lg:col-span-2 text-center lg:text-left">
                <AuthAnimations animation="fadeInLeft" delay="0.1s">
                  <TrustBadges variant="auth" alignment="left" />
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 lg:mb-6">
                    <span className="block">Welcome Back to</span>
                    <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                      TimetableMaster
                    </span>
                  </h1>
                  
                  <p className="text-lg sm:text-xl text-blue-100 mb-6 lg:mb-8 leading-relaxed">
                    Continue your journey of effortless scheduling and time management.
                  </p>
                </AuthAnimations>
              </div>
              
              {/* Right Panel */}
              <div className="lg:col-span-3 mt-8 lg:mt-0">
                <AuthAnimations animation="fadeInRight" delay="0.2s">
                  <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md mx-auto">
                    {/* Your login form here */}
                  </div>
                </AuthAnimations>
              </div>
              
            </div>
          </div>
        </div>
      </AuthBackground>
    </>
  );
};
```

### Admin Registration Modal Setup

```jsx
import React from 'react';
import { TrustBadges, AuthAnimations } from '../shared';

const AdminRegistrationModal = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <AuthAnimations animation="scaleIn" delay="0.1s">
        <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[600px]">
            
            {/* Left Panel */}
            <div className="lg:col-span-2 p-8 text-white">
              <TrustBadges variant="admin" alignment="left" />
              {/* Admin content */}
            </div>
            
            {/* Right Panel */}
            <div className="lg:col-span-3 bg-white/90 backdrop-blur-lg p-8">
              {/* Registration form */}
            </div>
            
          </div>
        </div>
      </AuthAnimations>
    </div>
  );
};
```

## Design Tokens

The components use consistent design tokens extracted from the HomePage:

**Colors:**
- Primary gradients: `from-purple-600 via-blue-600 to-indigo-600`
- Accent gradients: `from-pink-500/20 via-transparent to-cyan-400/20`
- Text gradients: `from-yellow-400 via-orange-400 to-pink-400`

**Spacing:**
- Container padding: `px-4 sm:px-6 lg:px-8`
- Section padding: `py-12 lg:py-20`
- Element spacing: `gap-8 lg:gap-12`

**Typography:**
- Headings: `text-4xl sm:text-5xl lg:text-6xl font-bold`
- Body text: `text-lg sm:text-xl`
- Small text: `text-sm font-medium`

**Effects:**
- Backdrop blur: `backdrop-blur-lg`
- Shadows: `shadow-2xl`
- Borders: `border border-white/20`
- Opacity: Various levels from `/10` to `/90`

## Accessibility

All components include accessibility features:
- Proper ARIA labels and semantic markup
- Keyboard navigation support
- Screen reader compatibility
- Reduced motion preferences support
- High contrast mode compatibility

## Browser Support

Components support modern browsers with:
- CSS Grid and Flexbox
- CSS backdrop-filter (with fallbacks)
- CSS custom properties
- Intersection Observer API
- CSS animations and transforms