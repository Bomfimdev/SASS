import React from 'react';
import PropTypes from 'prop-types';

const cardVariants = {
  default: 'bg-white',
  elevated: 'bg-white shadow-lg',
  bordered: 'bg-white border border-gray-200',
  flat: 'bg-gray-50'
};

const Card = ({
  children,
  variant = 'default',
  className = '',
  title = null,
  subtitle = null,
  footer = null,
  headerAction = null,
  noPadding = false,
  ...props
}) => {
  const baseClasses = 'rounded-lg overflow-hidden';
  const variantClasses = cardVariants[variant] || cardVariants.default;
  const paddingClass = noPadding ? '' : 'p-6';
  
  return (
    <div
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
          <div>
            {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {headerAction && (
            <div>{headerAction}</div>
          )}
        </div>
      )}
      
      <div className={`${paddingClass}`}>
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(Object.keys(cardVariants)),
  className: PropTypes.string,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  footer: PropTypes.node,
  headerAction: PropTypes.node,
  noPadding: PropTypes.bool
};

export default Card;