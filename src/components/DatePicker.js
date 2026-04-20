import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import './DatePicker.css';

function DatePicker({ value, onChange, placeholder, minDate, label }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    if (!date) return '';
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatDateValue = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isDateDisabled = (date) => {
    if (!minDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    }
    const min = new Date(minDate);
    min.setHours(0, 0, 0, 0);
    return date < min;
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isToday = (date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!isDateDisabled(newDate)) {
      setSelectedDate(newDate);
      onChange(formatDateValue(newDate));
      setShowCalendar(false);
    }
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const disabled = isDateDisabled(date);
      const selected = isSameDay(date, selectedDate);
      const today = isToday(date);

      days.push(
        <div
          key={day}
          className={`calendar-day ${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''} ${today ? 'today' : ''}`}
          onClick={() => !disabled && handleDateClick(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="date-picker" ref={wrapperRef}>
      <div className="date-input-wrapper" onClick={() => setShowCalendar(!showCalendar)}>
        <Calendar size={20} className="field-icon" />
        <input
          type="text"
          value={selectedDate ? formatDate(selectedDate) : ''}
          placeholder={placeholder || 'Select date'}
          readOnly
          className="date-input"
        />
      </div>

      {showCalendar && (
        <div className="calendar-dropdown">
          <div className="calendar-header">
            <button type="button" className="calendar-nav" onClick={previousMonth}>
              <ChevronLeft size={20} />
            </button>
            <div className="calendar-title">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button type="button" className="calendar-nav" onClick={nextMonth}>
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="calendar-weekdays">
            <div className="weekday">Sun</div>
            <div className="weekday">Mon</div>
            <div className="weekday">Tue</div>
            <div className="weekday">Wed</div>
            <div className="weekday">Thu</div>
            <div className="weekday">Fri</div>
            <div className="weekday">Sat</div>
          </div>

          <div className="calendar-grid">
            {renderCalendar()}
          </div>

          <div className="calendar-footer">
            <button
              type="button"
              className="clear-date-btn"
              onClick={() => {
                setSelectedDate(null);
                onChange('');
                setShowCalendar(false);
              }}
            >
              Clear
            </button>
            <button
              type="button"
              className="today-btn"
              onClick={() => {
                const today = new Date();
                if (!isDateDisabled(today)) {
                  setSelectedDate(today);
                  onChange(formatDateValue(today));
                  setCurrentMonth(today);
                  setShowCalendar(false);
                }
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePicker;
