import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { api } from '@/services/api';

interface CalendarDay {
  date: Date;
  day: number;
  isAvailable: boolean;
  isBooked: boolean;
  isBlocked: boolean;
}

interface AvailabilityCalendarProps {
  apartmentId: number;
  onDateRangeSelect?: (checkIn: Date, checkOut: Date) => void;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  apartmentId,
  onDateRangeSelect
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        setLoading(true);
        const response = await api.get('/search/calendar/:apartmentId', {
          params: {
            apartmentId,
            month: currentMonth.getMonth() + 1,
            year: currentMonth.getFullYear()
          }
        });

        setCalendar(response.data.calendar);
      } catch (error) {
        console.error('Error fetching calendar:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [currentMonth, apartmentId]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDayClick = (date: Date, isAvailable: boolean) => {
    if (!isAvailable) return;

    if (!selectedRange.start) {
      setSelectedRange({ start: date, end: null });
    } else if (!selectedRange.end) {
      if (date < selectedRange.start) {
        setSelectedRange({ start: date, end: selectedRange.start });
      } else if (date === selectedRange.start) {
        setSelectedRange({ start: null, end: null });
      } else {
        setSelectedRange({ start: selectedRange.start, end: date });
        onDateRangeSelect?.(selectedRange.start, date);
      }
    } else {
      setSelectedRange({ start: date, end: null });
    }
  };

  const monthName = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">📅 Availability Calendar</h3>

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-bold text-gray-900">{monthName}</h4>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-bold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin" size={24} />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before month starts */}
          {[...Array(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay())].map(
            (_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            )
          )}

          {/* Calendar days */}
          {calendar.map((day) => {
            const isSelected =
              (selectedRange.start &&
                day.date.toDateString() === selectedRange.start.toDateString()) ||
              (selectedRange.end &&
                day.date.toDateString() === selectedRange.end.toDateString());

            const isInRange =
              selectedRange.start &&
              selectedRange.end &&
              day.date > selectedRange.start &&
              day.date < selectedRange.end;

            return (
              <button
                key={day.day}
                onClick={() => handleDayClick(day.date, day.isAvailable)}
                disabled={!day.isAvailable}
                className={`
                  aspect-square rounded text-sm font-medium transition-colors
                  ${!day.isAvailable ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                  ${day.isBooked ? 'bg-red-100 text-red-600 cursor-not-allowed' : ''}
                  ${day.isBlocked ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : ''}
                  ${isSelected ? 'bg-blue-600 text-white' : ''}
                  ${isInRange ? 'bg-blue-100 text-blue-700' : ''}
                  ${
                    day.isAvailable &&
                    !isSelected &&
                    !isInRange &&
                    !day.isBooked &&
                    !day.isBlocked
                      ? 'bg-white border border-gray-300 hover:bg-blue-50'
                      : ''
                  }
                `}
              >
                {day.day}
              </button>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-300 rounded" />
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded" />
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 rounded" />
          <span className="text-gray-600">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded" />
          <span className="text-gray-600">Blocked</span>
        </div>
      </div>

      {/* Selected Range Display */}
      {selectedRange.start && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-bold">Check-in:</span>{' '}
            {selectedRange.start.toLocaleDateString()}
            {selectedRange.end && (
              <>
                <br />
                <span className="font-bold">Check-out:</span>{' '}
                {selectedRange.end.toLocaleDateString()}
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
