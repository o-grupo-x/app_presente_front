// components/CalendarView/CalendarView.jsx
import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styles from './CalendarView.module.css';

export default function CalendarView({ selectedDate, onDateSelect, viewMode, onViewModeChange }) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  // Generate calendar days when currentDate or viewMode changes
  useEffect(() => {
    let days = [];
    
    if (viewMode === 'month') {
      // For month view, generate a calendar grid
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const startDate = startOfWeek(monthStart);
      const endDate = endOfWeek(monthEnd);
      
      days = eachDayOfInterval({ start: startDate, end: endDate });
    } else {
      // For week view, just get the current week
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      
      days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    }
    
    setCalendarDays(days);
  }, [currentDate, viewMode]);

  // Navigate to previous month/week
  const handlePrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(prevDate => {
        const newDate = new Date(prevDate);
        newDate.setDate(newDate.getDate() - 7);
        return newDate;
      });
    }
  };

  // Navigate to next month/week
  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(prevDate => {
        const newDate = new Date(prevDate);
        newDate.setDate(newDate.getDate() + 7);
        return newDate;
      });
    }
  };

  // Go to today
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Handle date selection
  const handleDateClick = (day) => {
    if (onDateSelect) {
      onDateSelect(day);
    }
  };

  // Determine if a day is the selected day
  const isSelectedDay = (day) => {
    return selectedDate && 
           day.getDate() === selectedDate.getDate() &&
           day.getMonth() === selectedDate.getMonth() &&
           day.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <button onClick={handlePrevious} className={styles.navButton}>&lt;</button>
        <h2 className={styles.calendarTitle}>
          {viewMode === 'month' 
            ? format(currentDate, 'MMMM yyyy', { locale: ptBR })
            : `${format(calendarDays[0] || currentDate, 'dd MMM', { locale: ptBR })} - ${format(calendarDays[6] || currentDate, 'dd MMM yyyy', { locale: ptBR })}`
          }
        </h2>
        <button onClick={handleNext} className={styles.navButton}>&gt;</button>
      </div>
      
      <div className={styles.viewControls}>
        <button 
          className={`${styles.viewButton} ${viewMode === 'month' ? styles.activeView : ''}`}
          onClick={() => onViewModeChange('month')}
        >
          Mês
        </button>
        <button 
          className={`${styles.viewButton} ${viewMode === 'week' ? styles.activeView : ''}`}
          onClick={() => onViewModeChange('week')}
        >
          Semana
        </button>
        <button className={styles.todayButton} onClick={handleToday}>
          Hoje
        </button>
      </div>
      
      <div className={styles.calendarGrid}>
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
          <div key={day} className={styles.dayHeader}>
            {day}
          </div>
        ))}
        
        {viewMode === 'month' && calendarDays.map((day, index) => (
          <div 
            key={day.toString()}
            className={`
              ${styles.calendarDay} 
              ${!isSameMonth(day, currentDate) ? styles.otherMonth : ''}
              ${isSelectedDay(day) ? styles.selectedDay : ''}
            `}
            onClick={() => handleDateClick(day)}
          >
            {day.getDate()}
          </div>
        ))}
        
        {viewMode === 'week' && calendarDays.map((day, index) => (
          <div 
            key={day.toString()}
            className={`
              ${styles.weekDay} 
              ${isSelectedDay(day) ? styles.selectedDay : ''}
            `}
            onClick={() => handleDateClick(day)}
          >
            <div className={styles.weekDayNumber}>{day.getDate()}</div>
            <div className={styles.weekDayName}>{format(day, 'EEE', { locale: ptBR })}</div>
          </div>
        ))}
      </div>
    </div>
  );
}