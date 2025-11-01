import UserAvatar from '@/Components/UserAvatar';

interface PersonalInfoSectionProps {
  data: any;
  setData: (key: string, value: any) => void;
  errors: Record<string, string>;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
    location_address: string | null;
  };
}

export default function PersonalInfoSection({ data, setData, errors, user }: PersonalInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Update your personal details and contact information
        </p>
      </div>

      {/* Avatar Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Profile Picture
        </label>
        <div className="flex items-center gap-6">
          <UserAvatar
            name={data.name || user.name}
            avatarUrl={user.avatar_url}
            size="xl"
          />
          <div>
            <button
              type="button"
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Change Photo
            </button>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={data.name}
          onChange={e => setData('name', e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
          placeholder="John Doe"
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={data.email}
          onChange={e => setData('email', e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
          placeholder="john@example.com"
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          value={data.phone}
          onChange={e => setData('phone', e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
          placeholder="+1 (555) 123-4567"
        />
        {errors.phone && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
        )}
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Business Address
        </label>
        <input
          type="text"
          id="location_address"
          value={data.location_address}
          onChange={e => setData('location_address', e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
          placeholder="123 Main Street, City, State 12345"
        />
        {errors.location_address && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.location_address}</p>
        )}
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          This address will be shown to customers looking for nearby experts
        </p>
      </div>
    </div>
  );
}