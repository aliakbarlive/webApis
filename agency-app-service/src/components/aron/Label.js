import React from 'react';

const Label = ({ htmlFor, children }) => {
  return (
    <label
      htmlFor="first-name"
      className="block text-sm font-medium text-gray-700"
    >
      {children}
    </label>
  );
};

export default Label;
