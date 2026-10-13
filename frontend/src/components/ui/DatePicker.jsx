import React from 'react';

const DatePicker = ({
  label,
  id,
  value,
  onChange,
  min,
  max,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  icon = 'calendar_month',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-[11px] uppercase tracking-wider text-text-secondary font-bold flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-accent text-[17px]">
            {icon}
          </span>
          <span>{label}</span>
          {required && <span className="text-danger-custom">*</span>}
        </label>
      )}
      <div
        className={`relative flex items-center bg-white border rounded-xl transition-all duration-200 ${
          error
            ? 'border-danger-custom ring-1 ring-danger-custom/30'
            : 'border-border-custom hover:border-accent/60 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20'
        } ${disabled ? 'opacity-60 bg-surface-alt/40 cursor-not-allowed' : ''}`}
      >
        <input
          type="date"
          id={id}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          required={required}
          disabled={disabled}
          className="w-full bg-transparent px-3.5 py-2.5 text-sm text-text-primary font-medium focus:outline-none focus:ring-0 border-0 cursor-pointer"
          {...props}
        />
      </div>
      {error ? (
        <span className="text-[11px] text-danger-custom flex items-center gap-1 mt-0.5 font-medium">
          <span className="material-symbols-outlined text-[14px]">error</span>
          <span>{error}</span>
        </span>
      ) : helperText ? (
        <span className="text-[10px] text-text-secondary mt-0.5">{helperText}</span>
      ) : null}
    </div>
  );
};

export default DatePicker;
