import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  icon = null,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-surface-alt text-text-secondary border-border-custom',
    primary: 'bg-primary text-text-on-dark border-primary',
    gold: 'bg-accent/15 text-primary border-accent/40 font-bold',
    goldSolid: 'bg-accent text-primary font-bold shadow-sm',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    danger: 'bg-rose-50 text-rose-800 border-rose-300',
    warning: 'bg-amber-50 text-amber-900 border-amber-300',
    navy: 'bg-primary-dark/90 text-text-on-dark backdrop-blur-sm border-white/10',
    outline: 'bg-transparent text-text-primary border-border-custom',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 rounded gap-1',
    md: 'text-xs px-2.5 py-1 rounded-md gap-1.5',
    lg: 'text-sm px-3 py-1.5 rounded-lg gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium border uppercase tracking-wider transition-colors ${
        variantStyles[variant] || variantStyles.default
      } ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            variant === 'success'
              ? 'bg-emerald-500'
              : variant === 'danger'
              ? 'bg-rose-500'
              : variant === 'warning'
              ? 'bg-amber-500'
              : variant === 'gold' || variant === 'goldSolid'
              ? 'bg-amber-600'
              : 'bg-accent'
          }`}
        />
      )}
      {icon && (
        <span className="material-symbols-outlined text-[15px] shrink-0">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
