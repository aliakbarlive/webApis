import React from 'react';

const InputPrice = ({
  id,
  name = '',
  type,
  value,
  onChange,
  disabled,
  currencySymbol = '$',
  currencyCode,
  ...rest
}) => {
  return (
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-500 sm:text-sm">{currencySymbol}</span>
      </div>
      <input
        type="number"
        {...(id && { id })}
        name={id ?? name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="focus:ring-red-500 focus:border-red-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
        {...rest}
      />
      <div className="absolute inset-y-0 right-0 flex items-center">
        <label htmlFor="price" className="sr-only">
          Currency
        </label>
        <span className="focus:ring-red-500 focus:border-red-500 py-0 pl-2 pr-5 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md">
          {currencyCode}
        </span>
      </div>
    </div>
  );
};

export default InputPrice;
