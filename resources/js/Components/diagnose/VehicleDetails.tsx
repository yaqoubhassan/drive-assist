import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Calendar, Gauge, AlertCircle } from 'lucide-react';

interface VehicleDetailsProps {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  onMakeChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onYearChange: (value: number | undefined) => void;
  onMileageChange: (value: number | undefined) => void;
}

// Popular car makes for autocomplete
const popularMakes = [
  'Toyota',
  'Honda',
  'Ford',
  'Chevrolet',
  'Nissan',
  'BMW',
  'Mercedes-Benz',
  'Volkswagen',
  'Audi',
  'Hyundai',
  'Kia',
  'Mazda',
  'Subaru',
  'Jeep',
  'Ram',
  'GMC',
  'Dodge',
  'Lexus',
  'Acura',
  'Infiniti',
  'Tesla',
  'Volvo',
  'Porsche',
  'Land Rover',
  'Cadillac',
  'Lincoln',
  'Buick',
  'Chrysler',
  'Mitsubishi',
];

export default function VehicleDetails({
  make = '',
  model = '',
  year,
  mileage,
  onMakeChange,
  onModelChange,
  onYearChange,
  onMileageChange,
}: VehicleDetailsProps) {
  const [showMakeSuggestions, setShowMakeSuggestions] = useState(false);
  const [filteredMakes, setFilteredMakes] = useState<string[]>([]);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i + 1);

  useEffect(() => {
    if (make) {
      const filtered = popularMakes.filter((m) =>
        m.toLowerCase().includes(make.toLowerCase())
      );
      setFilteredMakes(filtered);
    } else {
      setFilteredMakes([]);
    }
  }, [make]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Make */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <div className="flex items-center">
            <Car className="w-4 h-4 mr-2" />
            Make
          </div>
        </label>
        <div className="relative">
          <input
            type="text"
            value={make}
            onChange={(e) => {
              onMakeChange(e.target.value);
              setShowMakeSuggestions(true);
            }}
            onFocus={() => setShowMakeSuggestions(true)}
            onBlur={() => setTimeout(() => setShowMakeSuggestions(false), 200)}
            placeholder="e.g., Toyota"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     transition-all duration-200"
          />

          {/* Autocomplete Suggestions */}
          {showMakeSuggestions && filteredMakes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto"
            >
              {filteredMakes.slice(0, 8).map((suggestedMake) => (
                <button
                  key={suggestedMake}
                  type="button"
                  onClick={() => {
                    onMakeChange(suggestedMake);
                    setShowMakeSuggestions(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 
                           text-gray-900 dark:text-white transition-colors duration-150
                           first:rounded-t-lg last:rounded-b-lg"
                >
                  {suggestedMake}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Model */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <div className="flex items-center">
            <Car className="w-4 h-4 mr-2" />
            Model
          </div>
        </label>
        <input
          type="text"
          value={model}
          onChange={(e) => onModelChange(e.target.value)}
          placeholder="e.g., Camry"
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   transition-all duration-200"
        />
      </div>

      {/* Year */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Year
          </div>
        </label>
        <select
          value={year || ''}
          onChange={(e) => onYearChange(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   transition-all duration-200"
        >
          <option value="">Select year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Mileage */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <div className="flex items-center">
            <Gauge className="w-4 h-4 mr-2" />
            Mileage (optional)
          </div>
        </label>
        <div className="relative">
          <input
            type="number"
            value={mileage || ''}
            onChange={(e) => onMileageChange(e.target.value ? Number(e.target.value) : undefined)}
            placeholder="e.g., 50000"
            min="0"
            className="w-full px-4 py-3 pr-16 rounded-lg border-2 border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     transition-all duration-200"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
            miles
          </span>
        </div>
      </div>

      {/* Info Box */}
      <div className="md:col-span-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
        >
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Why vehicle details help
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Providing your vehicle information helps our AI give more accurate diagnoses and cost
                estimates specific to your car model and year. This is completely optional.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}