import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImprovedDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  error?: string;
  className?: string;
  focused?: boolean;
  setFocused?: () => void;
  setUnfocused?: () => void;
}

const ImprovedDatePicker: React.FC<ImprovedDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Sélectionner une date',
  minDate,
  maxDate,
  error,
  className = '',
  focused = false,
  setFocused,
  setUnfocused
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    value ? new Date(value) : new Date()
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Fermer le calendrier en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        if (setUnfocused) setUnfocused();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, setUnfocused]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleSelectDate = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = selectedDate.toISOString().split('T')[0];
    onChange(dateString);
    setIsOpen(false);
    if (setUnfocused) setUnfocused();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days: (number | null)[] = [];

  // Ajouter les jours vides du mois précédent
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Ajouter les jours du mois actuel
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isDateDisabled = (day: number): boolean => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];

    if (minDate && dateString < minDate) return true;
    if (maxDate && dateString > maxDate) return true;

    return false;
  };

  const isDateSelected = (day: number): boolean => {
    if (!value) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    return dateString === value;
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const monthName = currentMonth.toLocaleDateString('fr-FR', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-gray-700 mb-3 pl-1 uppercase tracking-widest">
          {label}
        </label>
      )}

      {/* Input visuel */}
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && setFocused) setFocused();
        }}
        className={`w-full px-4 py-3.5 border-2 rounded-xl cursor-pointer flex items-center gap-2 transition-all duration-300 font-medium
          ${error
            ? 'border-red-500 bg-red-50'
            : isOpen || focused
            ? 'border-pink-500 bg-pink-50/30 shadow-lg transform scale-105'
            : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
          }`}
      >
        <div className={`transition-colors ${error ? 'text-red-500' : isOpen || focused ? 'text-pink-500' : 'text-gray-500'}`}>
          <Calendar size={18} strokeWidth={2.5} />
        </div>
        <span
          className={`flex-1 text-sm ${
            value ? 'font-semibold text-gray-900' : 'text-gray-500'
          }`}
        >
          {value ? formatDate(value) : placeholder}
        </span>
      </div>

      {error && <p className="text-red-500 text-xs mt-1.5 font-medium pl-1">{error}</p>}

      {/* Calendrier */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl z-50 p-5">
          {/* En-tête du calendrier */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-pink-100 rounded-lg transition-all duration-300 text-gray-600 hover:text-pink-600"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
              {monthName}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-pink-100 rounded-lg transition-all duration-300 text-gray-600 hover:text-pink-600"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day) => (
              <div key={day} className="text-center text-xs font-bold text-gray-600 py-2 uppercase">
                {day}
              </div>
            ))}
          </div>

          {/* Jours du calendrier */}
          <div className="grid grid-cols-7 gap-2 mb-5">
            {days.map((day, idx) => (
              <button
                key={idx}
                onClick={() => day && !isDateDisabled(day) && handleSelectDate(day)}
                disabled={!day || isDateDisabled(day)}
                className={`aspect-square text-sm font-semibold rounded-lg transition-all duration-200 ${
                  !day
                    ? ''
                    : isDateDisabled(day)
                    ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                    : isDateSelected(day)
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold shadow-lg'
                    : isToday(day)
                    ? 'bg-pink-100 text-pink-600 font-bold border-2 border-pink-300'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-pink-600'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setIsOpen(false);
                if (setUnfocused) setUnfocused();
              }}
              className="flex-1 px-3 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 uppercase tracking-wide"
            >
              Fermer
            </button>
            {value && (
              <button
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                  if (setUnfocused) setUnfocused();
                }}
                className="flex-1 px-3 py-2.5 text-sm font-bold text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-all duration-300 uppercase tracking-wide"
              >
                Effacer
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovedDatePicker;
