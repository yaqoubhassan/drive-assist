import { UserCircleIcon } from '@heroicons/react/24/outline';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * UserAvatar Component
 * 
 * Displays user avatar with intelligent fallback:
 * 1. If avatarUrl exists -> show uploaded avatar
 * 2. If no avatar -> show initials with colored background
 * 3. Supports different sizes
 * 4. Fully accessible
 */
export default function UserAvatar({ name, avatarUrl, size = 'md', className = '' }: UserAvatarProps) {
  // Size configurations
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-xl',
  };

  // Get initials from name
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  // Generate consistent color based on name
  const getColorFromName = (name: string): string => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500',
    ];

    // Generate a number from the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const initials = getInitials(name);
  const colorClass = getColorFromName(name);

  // If avatar URL exists, show image
  if (avatarUrl) {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        <img
          src={avatarUrl}
          alt={`${name}'s avatar`}
          className="h-full w-full rounded-full object-cover ring-2 ring-white dark:ring-gray-700"
          onError={(e) => {
            // If image fails to load, hide it and show fallback
            e.currentTarget.style.display = 'none';
            if (e.currentTarget.nextElementSibling) {
              (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
            }
          }}
        />
        {/* Hidden fallback - will show if image fails to load */}
        <div
          className={`absolute inset-0 ${colorClass} rounded-full hidden items-center justify-center text-white font-semibold`}
          style={{ display: 'none' }}
        >
          {initials}
        </div>
      </div>
    );
  }

  // Show initials with colored background
  return (
    <div
      className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center text-white font-semibold ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
}