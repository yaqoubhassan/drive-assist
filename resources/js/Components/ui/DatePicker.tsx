import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DatePickerProps {
  value?: string;
  onChange: (date: string | null) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  minDate?: string;
  maxDate?: string;
  className?: string;
  yearRange?: number;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  required = false,
  disabled = false,
  error,
  minDate,
  maxDate,
  className = '',
  yearRange = 10,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(() => {
    if (value) {
      return new Date(value);
    }
    return new Date();
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const formatDisplayDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const isDateSelected = (day: number) => {
    if (!value || !day) return false;
    const selectedDate = new Date(value);
    return selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewDate.getMonth() &&
      selectedDate.getFullYear() === viewDate.getFullYear();
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day &&
      today.getMonth() === viewDate.getMonth() &&
      today.getFullYear() === viewDate.getFullYear();
  };

  const isDateDisabled = (day: number) => {
    if (!day) return true;

    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];

    if (minDate && dateString < minDate) return true;
    if (maxDate && dateString > maxDate) return true;

    return false;
  };

  const handleDateSelect = (day: number) => {
    if (isDateDisabled(day)) return;

    const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const dateString = selectedDate.toISOString().split('T')[0];
    onChange(dateString);
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setViewDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    setViewDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setFullYear(newDate.getFullYear() - 1);
      } else {
        newDate.setFullYear(newDate.getFullYear() + 1);
      }
      return newDate;
    });
  };

  const handleClear = () => {
    onChange(null);
    setIsOpen(false);
  };

  const calendarDays = generateCalendarDays();

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value ? formatDisplayDate(value) : ''}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            w-full px-4 py-3 pr-12
            bg-white dark:bg-gray-800
            border-2 rounded-lg
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            transition-all duration-200
            cursor-pointer
            ${error
              ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 dark:hover:border-gray-500'}
            ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : ''}
          `}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              aria-label="Clear date"
            >
              <XMarkIcon className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <CalendarIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full min-w-[280px]  bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-1.5">
                <button
                  type="button"
                  onClick={() => navigateYear('prev')}
                  className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  aria-label="Previous year"
                >
                  <ChevronLeftIcon className="w-3.5 h-3.5" />
                </button>

                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                  {viewDate.getFullYear()}
                </span>

                <button
                  type="button"
                  onClick={() => navigateYear('next')}
                  className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  aria-label="Next year"
                >
                  <ChevronRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigateMonth('prev')}
                  className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>

                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {MONTHS[viewDate.getMonth()]}
                </span>

                <button
                  type="button"
                  onClick={() => navigateMonth('next')}
                  className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-2">
              <div className="grid grid-cols-7 gap-1 mb-1">
                {DAYS.map(day => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 h-6 flex items-center justify-center"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => day && handleDateSelect(day)}
                    disabled={!day || (day !== null && isDateDisabled(day))}
                    className={`
                      h-8 w-8 flex items-center justify-center rounded-md text-sm font-medium
                      transition-all duration-150
                      ${!day ? 'invisible' : ''}
                      ${(day !== null && isDateDisabled(day))
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'hover:bg-blue-50 dark:hover:bg-blue-900/30'
                      }
                      ${isDateSelected(day as number)
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'text-gray-700 dark:text-gray-300'
                      }
                      ${(day !== null && isToday(day as number)) && !isDateSelected(day as number)
                        ? 'border-2 border-blue-600 dark:border-blue-400'
                        : ''
                      }
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    const todayString = today.toISOString().split('T')[0];
                    onChange(todayString);
                    setIsOpen(false);
                  }}
                  className="w-full px-2 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                >
                  Today
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}