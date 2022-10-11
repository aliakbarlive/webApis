import React from 'react';
import Loader from 'react-loader-spinner';

const Spinner = ({
  color = 'primary',
  height = 20,
  width = 20,
  classNames = '',
}) => {
  return (
    <Loader
      type="Oval"
      color={
        color === 'primary' ? '#EF4444' : color === 'white' ? '#fff' : '#000'
      }
      height={height}
      width={width}
      classNames={classNames}
    />
  );
};

export default Spinner;
