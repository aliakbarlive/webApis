import React from 'react';

const Error = ({
  htmlFor,
  children,
  classes,
  textSize = 'xs',
  color = 'red-500',
}) => {
  return (
    <span
      htmlFor={htmlFor ?? ''}
      className={`text-${textSize} font-medium text-${color} ${classes ?? ''}`}
    >
      {children}
    </span>
  );
};

export default Error;
