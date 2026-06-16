import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const CustomDatePicker = ({ value, onChange, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  
  // Parse YYYY-MM-DD as local date to avoid timezone shift bugs
  const parseLocalDate = (dateStr) => {
    if (!dateStr) return new Date();
    const [y, m, d] = dateStr.split('-');
    return new Date(y, m - 1, d);
  };
  
  const selectedDate = value ? parseLocalDate(value) : new Date();
  
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day) => {
    const yyyy = currentYear;
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange({ target: { name, value: `${yyyy}-${mm}-${dd}` } });
    setIsOpen(false);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const displayValue = value ? (() => {
    const d = parseLocalDate(value);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  })() : '';

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 14px 0 44px',
          height: '44px',
          backgroundColor: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '8px',
          cursor: 'pointer',
          color: '#ffffff',
          fontSize: '1rem'
        }}
      >
        <div style={{ position: 'absolute', left: '14px', display: 'flex', alignItems: 'center' }}>
          <CalendarIcon size={18} color="#ffffff" />
        </div>
        <span>{displayValue || 'Select Date'}</span>
        <ChevronDown size={18} color="#ffffff" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          backgroundColor: '#141414',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
          zIndex: 50,
          padding: '16px',
          width: '280px'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div 
              onClick={handlePrevMonth} 
              style={{ padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <ChevronLeft size={20} color="#ffffff" />
            </div>
            <span style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem' }}>
              {monthNames[currentMonth]} {currentYear}
            </span>
            <div 
              onClick={handleNextMonth} 
              style={{ padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <ChevronRight size={20} color="#ffffff" />
            </div>
          </div>

          {/* Days Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px', textAlign: 'center' }}>
            {dayNames.map(d => (
              <div key={d} style={{ color: 'var(--secondary-white)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>{d}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = value && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;
              const today = new Date();
              const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
              
              return (
                <div 
                  key={day}
                  onClick={() => handleDateClick(day)}
                  style={{
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: isSelected ? '#ffffff' : (isToday ? '#00aaff' : '#e0e0e0'),
                    backgroundColor: isSelected ? '#0056b3' : 'transparent',
                    fontWeight: isSelected || isToday ? 600 : 400,
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 10px rgba(0, 86, 179, 0.5)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
