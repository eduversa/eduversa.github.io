import React from 'react';
import { BookOpen, Users, Clock, DoorOpen } from 'lucide-react';
// import '../styles/periodCell.scss';

export function PeriodCell({
  periodIndex,
  day,
  dayLower,
  register,
  errors,
  availableTeachers,
  availableRooms,
  subjects,
  timeSlots,
}) {
  const getFieldError = (field) => {
    return errors?.periods?.[periodIndex]?.[dayLower]?.[field];
  };

  const renderSelect = (icon, field, options, color) => {
    const Icon = icon;
    const error = getFieldError(field);
    
    return (
      <div className={`select-container ${error ? 'has-error' : ''}`}>
        <Icon size={16} className={`icon ${color}`} />
        <select
          {...register(`periods.${periodIndex}.${dayLower}.${field}`, {
            required: 'This field is required'
          })}
          className={`select-field ${color}`}
        >
          <option value="">Select {field}</option>
          {options.map((option) => (
            <option key={option} value={option} >{option}</option>
          ))}
        </select>
        {/* {error && <span className="error-message">{error.message}</span>} */}
      </div>
    );
  };

  return (
    <td className="period-cell">
      <div className="cell-content">
        {renderSelect(BookOpen, 'subject', subjects, 'blue')}
        {renderSelect(Users, 'teacher', availableTeachers, 'green')}
        {renderSelect(Clock, 'time', timeSlots, 'amber')}
        {renderSelect(DoorOpen, 'room', availableRooms, 'purple')}

        {(availableTeachers.length === 0 || availableRooms.length === 0) && (
          <div className="warning-message">
            Some resources are not available for the selected time slot
          </div>
        )}
      </div>
    </td>
  );
}
