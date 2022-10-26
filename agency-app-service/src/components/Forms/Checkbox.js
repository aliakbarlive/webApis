import React from 'react';

const Checkbox = ({ id, checked, classes, onChange, ...rest }) => {
  return (
    <input
      id={id}
      type="checkbox"
      className={`form-checkbox text-red-600 focus:border-red-500 focus:ring-red-500 ${
        classes ?? ''
      }`}
      checked={checked}
      onChange={onChange}
      {...rest}
    />
  );
};

export default Checkbox;
