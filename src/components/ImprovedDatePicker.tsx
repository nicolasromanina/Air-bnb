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
}

const ImprovedDatePicker: React.FC<ImprovedDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Sélectionner une date',
  minDate,
  maxDate,
  error,
  className = ''
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
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

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
        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-tight">
          {label}
        </label>
      )}

      {/* Input visuel */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border-2 rounded-lg cursor-pointer flex items-center gap-2 transition-all ${
          error
            ? 'border-red-500 bg-red-50'
            : isOpen
            ? 'border-pink-500 bg-pink-50'
            : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
      >
        <Calendar size={18} className={error ? 'text-red-500' : 'text-gray-600'} />
        <span
          className={`flex-1 text-sm ${
            value ? 'font-medium text-gray-900' : 'text-gray-500'
          }`}
        >
          {value ? formatDate(value) : placeholder}
        </span>
      </div>

      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}

      {/* Calendrier */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4">
          {/* En-tête du calendrier */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
              {monthName}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Jours du calendrier */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => (
              <button
                key={idx}
                onClick={() => day && !isDateDisabled(day) && handleSelectDate(day)}
                disabled={!day || isDateDisabled(day)}
                className={`aspect-square text-sm font-medium rounded transition-all ${
                  !day
                    ? ''
                    : isDateDisabled(day)
                    ? 'text-gray-300 cursor-not-allowed'
                    : isDateSelected(day)
                    ? 'bg-pink-500 text-white font-bold'
                    : isToday(day)
                    ? 'bg-pink-100 text-pink-600 font-semibold border border-pink-300'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Annuler
            </button>
            {value && (
              <button
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded transition-colors"
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
