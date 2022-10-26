import React from 'react';

const Input = ({
  id,
  name = '',
  type,
  value,
  onChange,
  classes,
  hasError,
  errorClasses = 'border-red-400',
  ...rest
}) => {
  return (
    <input
      type={type}
      {...(id && { id })}
      name={id ?? name}
      className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md ${
        hasError && errorClasses
      } ${classes ?? ''}`}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};

export default Input;
