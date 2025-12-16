import React from 'react';
import { 
  CheckCircle, 
  Star, 
  Shield, 
  Award, 
  Lock, 
  Globe, 
  Users,
  Zap
} from 'lucide-react';

/**
 * TrustBadges Component
 * 
 * Renders customizable trust badges with icons and text.
 * Extracted from HomePage for reuse across authentication pages.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.badges - Array of badge configurations
 * @param {string} props.variant - Badge variant ('default', 'auth', 'admin')
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.alignment - Badge alignment ('center', 'left', 'right')
 */
const TrustBadges = ({ 
  badges = null, 
  variant = 'default', 
  className = '',
  alignment = 'center'
}) => {
  // Icon mapping for easy reference
  const iconMap = {
    CheckCircle,
    Star,
    Shield,
    Award,
    Lock,
    Globe,
    Users,
    Zap
  };

  // Predefined badge configurations
  const badgeConfigurations = {
    default: [
      {
        icon: 'CheckCircle',
        text: 'GDPR Compliant',
        color: 'green'
      },
      {
        icon: 'Star',
        text: '4.9/5 Rating',
        color: 'yellow'
      }
    ],
    auth: [
      {
        icon: 'CheckCircle',
        text: 'Secure Login',
        color: 'green'
      },
      {
        icon: 'Shield',
        text: 'Protected',
        color: 'blue'
      },
      {
        icon: 'Star',
        text: 'Trusted',
        color: 'yellow'
      }
    ],
    admin: [
      {
        icon: 'Shield',
        text: 'Admin Access',
        color: 'blue'
      },
      {
        icon: 'Lock',
        text: 'Secure',
        color: 'green'
      },
      {
        icon: 'Award',
        text: 'Verified',
        color: 'purple'
      }
    ],
    registration: [
      {
        icon: 'Users',
        text: 'Join 40k+ Schools',
        color: 'blue'
      },
      {
        icon: 'Zap',
        text: 'Instant Setup',
        color: 'yellow'
      },
      {
        icon: 'Globe',
        text: 'Global Access',
        color: 'green'
      }
    ]
  };

  // Get color classes for icons
  const getIconColorClass = (color) => {
    const colorMap = {
      green: 'text-green-400',
      yellow: 'text-yellow-400',
      blue: 'text-blue-400',
      purple: 'text-purple-400',
      red: 'text-red-400',
      orange: 'text-orange-400',
      pink: 'text-pink-400',
      indigo: 'text-indigo-400'
    };
    return colorMap[color] || 'text-white';
  };

  // Get alignment classes
  const getAlignmentClass = () => {
    const alignmentMap = {
      center: 'justify-center',
      left: 'justify-start',
      right: 'justify-end'
    };
    return alignmentMap[alignment] || 'justify-center';
  };

  const badgesToRender = badges || badgeConfigurations[variant] || badgeConfigurations.default;

  return (
    <div className={`flex flex-wrap items-center ${getAlignmentClass()} gap-3 lg:gap-4 ${className}`}>
      {badgesToRender.map((badge, index) => {
        const IconComponent = iconMap[badge.icon];
        
        return (
          <div
            key={index}
            className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 hover:bg-white/15 transition-colors duration-300"
          >
            {IconComponent && (
              <IconComponent className={`w-4 h-4 ${getIconColorClass(badge.color)} mr-2 flex-shrink-0`} />
            )}
            <span className="text-sm font-medium text-white whitespace-nowrap">
              {badge.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default TrustBadges;