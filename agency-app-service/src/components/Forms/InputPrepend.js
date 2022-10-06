import React from 'react';

const InputPrepend = ({
  id,
  name = '',
  type = 'text',
  value,
  onChange,
  disabled,
  prependText = '',
  ...rest
}) => {
  return (
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-500 sm:text-sm">{prependText}</span>
      </div>
      <input
        type={type}
        {...(id && { id })}
        name={id ?? name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="focus:ring-red-500 focus:border-red-500 block w-full pl-8 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
        {...rest}
      />
    </div>
  );
};

export default InputPrepend;
