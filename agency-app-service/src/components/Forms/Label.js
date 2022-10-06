import React from 'react';

const Label = ({ htmlFor, children, classes, textSize = 'sm' }) => {
  return (
    <label
      htmlFor={htmlFor ?? ''}
      className={`text-${textSize} font-medium text-gray-500 ${classes ?? ''}`}
    >
      {children}
    </label>
  );
};

export default Label;
