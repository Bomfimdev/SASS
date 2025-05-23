import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({
  type = 'text',
  label = '',
  name,
  value,
  onChange,
  onBlur,
  placeholder = '',
  disabled = false,
  readOnly = false,
  error = null,
  helperText = null,
  required = false,
  className = '',
  containerClassName = '',
  startAdornment = null,
  endAdornment = null,
  fullWidth = true,
  size = 'md',
  ...props
}, ref) => {
  const sizesMap = {
    sm: 'py-1.5 px-2 text-sm',
    md: 'py-2 px-3 text-base',
    lg: 'py-2.5 px-4 text-lg',
  };
  
  const sizeClass = sizesMap[size] || sizesMap.md;
  const widthClass = fullWidth ? 'w-full' : '';
  const errorClass = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary';
  const disabledClass = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : '';
  
  return (
    <div className={`mb-4 ${containerClassName} ${widthClass}`}>
      {label && (
        <label 
          htmlFor={name} 
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {startAdornment && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {startAdornment}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`block rounded-md shadow-sm ${sizeClass} ${errorClass} ${disabledClass} 
            ${startAdornment ? 'pl-10' : ''} ${endAdornment ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {endAdornment}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  startAdornment: PropTypes.node,
  endAdornment: PropTypes.node,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

Input.displayName = 'Input';

export default Input;