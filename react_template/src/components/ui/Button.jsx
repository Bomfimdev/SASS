import React from 'react';
import PropTypes from 'prop-types';

const buttonVariants = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  success: 'bg-green-500 text-white hover:bg-green-600',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
  info: 'bg-blue-400 text-white hover:bg-blue-500',
  outline: 'bg-transparent border border-primary text-primary hover:bg-primary/10',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100'
};

const buttonSizes = {
  xs: 'py-1 px-2 text-xs',
  sm: 'py-1.5 px-3 text-sm',
  md: 'py-2 px-4 text-base',
  lg: 'py-2.5 px-5 text-lg',
  xl: 'py-3 px-6 text-xl'
};

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  isLoading = false,
  startIcon = null,
  endIcon = null,
  rounded = 'md',
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed';
  const variantClasses = buttonVariants[variant] || buttonVariants.primary;
  const sizeClasses = buttonSizes[size] || buttonSizes.md;
  const roundedClass = `rounded-${rounded}`;
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${roundedClass} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {startIcon && !isLoading && (
        <span className="mr-2">{startIcon}</span>
      )}
      
      {children}
      
      {endIcon && (
        <span className="ml-2">{endIcon}</span>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  variant: PropTypes.oneOf(Object.keys(buttonVariants)),
  size: PropTypes.oneOf(Object.keys(buttonSizes)),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  rounded: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default Button;