import React from 'react';
import SpinnerGrow from './SpinnerGrow';

const ButtonLink = ({
  children,
  classes,
  onClick,
  loading = false,
  color = 'red',
  spinnerColor = 'white',
  showLoading = false,
  textSize = 'sm',
}) => {
  return (
    <button
      type="button"
      className={`${
        loading ? 'pointer-events-none opacity-50' : ''
      } inline-flex items-center text-${textSize} ${
        color === 'white' ? `text-${color}` : `text-${color}-500`
      } hover:text-${color}-900 ${classes ?? ''}`}
      onClick={onClick}
    >
      {children}
      &nbsp;{showLoading && loading ? <SpinnerGrow color={spinnerColor} /> : ''}
    </button>
  );
};

export default ButtonLink;
