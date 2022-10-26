import React from 'react';

const Radio = ({
  name,
  label,
  value,
  size = 4,
  color = 'red',
  classes,
  defaultChecked,
  onChange,
  checked,
}) => {
  return (
    <label className="relative pt-2 flex items-center cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        className={`h-${size} w-${size} mt-0.5 cursor-pointer text-${color}-600 border-gray-300 focus:ring-${color}-500 ${
          classes ?? ''
        }`}
        defaultChecked={defaultChecked}
        onChange={onChange}
        checked={checked}
      />
      <span className="text-sm ml-2">{label}</span>
    </label>
  );
};
export default Radio;
