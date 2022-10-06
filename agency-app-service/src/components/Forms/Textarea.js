import React from 'react';

const Textarea = ({
  id,
  name = '',
  value,
  onChange,
  rows = 3,
  classes,
  textSize = 'sm',
  ...rest
}) => {
  return (
    <textarea
      {...(id && { id })}
      name={id ?? name}
      onChange={onChange}
      value={value}
      rows={rows}
      className={`shadow-sm focus:ring-red-500 focus:border-red-500 block w-full text-${textSize} border-gray-300 rounded-md ${
        classes ?? ''
      }`}
      {...rest}
    ></textarea>
  );
};

export default Textarea;
