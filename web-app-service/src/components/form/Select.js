import React from 'react';
import { isObject } from 'lodash';

const Select = ({ id, name, value, options, onChange, className, ...rest }) => {
  return (
    <select
      id={id}
      name={name}
      value={value}
      className={`shadow-sm block pl-3 pr-10 py-2 w-full text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${className}`}
      onChange={onChange}
      {...rest}
    >
      {options.map((option) => {
        const value = isObject(option) ? option.value : option;
        return (
          <option key={value} value={value}>
            {isObject(option) ? option.label : option}
          </option>
        );
      })}
    </select>
  );
};

export default Select;
