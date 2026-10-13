import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-accent text-primary hover:bg-accent-hover active:translate-y-0.5 shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30 font-bold border border-accent/20',
    secondary:
      'bg-primary text-text-on-dark hover:bg-primary-dark active:translate-y-0.5 shadow-md shadow-primary/20 hover:shadow-lg font-semibold border border-primary/20',
    outline:
      'bg-transparent text-primary hover:bg-surface-alt active:translate-y-0.5 border border-border-custom hover:border-accent font-semibold',
    outlineGold:
      'bg-transparent text-accent hover:bg-accent/10 active:translate-y-0.5 border border-accent font-semibold',
    ghost:
      'bg-transparent text-text-secondary hover:text-primary hover:bg-surface-alt font-medium border border-transparent',
    danger:
      'bg-danger-custom text-white hover:bg-rose-800 active:translate-y-0.5 shadow-md shadow-danger-custom/20 font-semibold border border-transparent',
    white:
      'bg-white text-primary hover:bg-surface-alt shadow-md hover:shadow-lg font-bold border border-border-custom',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 min-h-[34px]',
    md: 'text-sm px-5 py-2.5 rounded-lg gap-2 min-h-[44px]',
    lg: 'text-base px-6 py-3.5 rounded-xl gap-2.5 min-h-[52px]',
  };

  const disabledStyles = isDisabled || isLoading
    ? 'opacity-50 cursor-not-allowed pointer-events-none hover:shadow-none hover:translate-y-0'
    : 'cursor-pointer';

  return (
    <button
      type={type}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all duration-200 select-none ${
        variantStyles[variant] || variantStyles.primary
      } ${sizeStyles[size] || sizeStyles.md} ${disabledStyles} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Đang xử lý...</span>
        </>
      ) : (
        <>
          {iconLeft && (
            <span className="material-symbols-outlined text-[19px] shrink-0">
              {iconLeft}
            </span>
          )}
          <span>{children}</span>
          {iconRight && (
            <span className="material-symbols-outlined text-[19px] shrink-0">
              {iconRight}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
