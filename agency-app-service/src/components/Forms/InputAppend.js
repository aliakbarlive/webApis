import React from 'react';

const InputAppend = ({
  id,
  name = '',
  type = 'text',
  value,
  onChange,
  required = false,
  disabled,
  classes,
  containerClasses,
  appendText,
  ...rest
}) => {
  return (
    <div className={`relative rounded-md shadow-sm ${containerClasses ?? ''}`}>
      <input
        type={type}
        {...(id && { id })}
        name={id ?? name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        {...rest}
        className={`focus:ring-red-500 focus:border-red-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100 ${
          classes ?? ''
        }`}
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span className="text-gray-500 sm:text-sm">{appendText}</span>
      </div>
    </div>
  );
};

export default InputAppend;
