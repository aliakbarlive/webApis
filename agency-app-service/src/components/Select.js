import React from 'react';

const Select = ({ label, options, selected, onSelect, className }) => {
  const name = label.split(' ').join('');
  return (
    <div className={`${className}`}>
      {label && (
        <label
          htmlFor={name && name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <select
        id={name && name}
        name={name && name}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm rounded-md"
        onChange={(e) => onSelect && onSelect(e.target.value)}
      >
        {options &&
          options.map((option) => {
            return (
              <option key={option} selected={option === selected}>
                {option}
              </option>
            );
          })}
      </select>
    </div>
  );
};

export default Select;
