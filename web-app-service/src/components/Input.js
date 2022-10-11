import React from 'react';

const Input = ({ label, placeholder, onChangeInput, className, disabled }) => {
  return (
    <div className={`mx-2 ${className}`}>
      <label
        htmlFor="label"
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div>
        <input
          type="text"
          name={label}
          id={label}
          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder={placeholder}
          onChange={(e) => onChangeInput(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default Input;
