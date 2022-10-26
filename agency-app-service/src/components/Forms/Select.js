import React from 'react';

const Select = ({
  children,
  id,
  name = '',
  value,
  onChange,
  className,
  disabled,
  ...rest
}) => {
  return (
    <select
      {...(id && { id })}
      name={id ?? name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm rounded-md disabled:bg-gray-100 ${
        className ?? ''
      }`}
      {...rest}
    >
      {children}
    </select>
  );
};

export default Select;
