import React from 'react';
import PropTypes from 'prop-types';

const badgeVariants = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-primary-100 text-primary-800',
  secondary: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-800'
};

const badgeSizes = {
  xs: 'text-xs px-1.5 py-0.5',
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-0.5',
  lg: 'text-base px-3 py-1'
};

const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  rounded = 'full',
  className = '',
  ...props
}) => {
  const variantClasses = badgeVariants[variant] || badgeVariants.default;
  const sizeClasses = badgeSizes[size] || badgeSizes.sm;
  const roundedClass = `rounded-${rounded}`;

  return (
    <span
      className={`inline-flex items-center font-medium ${variantClasses} ${sizeClasses} ${roundedClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(Object.keys(badgeVariants)),
  size: PropTypes.oneOf(Object.keys(badgeSizes)),
  rounded: PropTypes.string,
  className: PropTypes.string
};

export default Badge;