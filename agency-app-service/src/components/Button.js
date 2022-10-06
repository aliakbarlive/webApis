import React from 'react';
import SpinnerGrow from './SpinnerGrow';

const Button = ({
  children,
  classes,
  onClick,
  loading = false,
  color = 'red',
  showLoading = false,
  textColor = 'white',
  hoverColor = '',
  bgColor = '',
  spinnerColor = 'white',
  textSize = 'sm',
  roundedSize = 'md',
  px = 4,
  py = 2,
  fontWeight = 'medium',
  disabled,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      className={`${disabled ? 'disabled cursor-not-allowed' : ''} ${
        loading ? 'pointer-events-none' : ''
      } inline-flex items-center px-${px} py-${py} border border-transparent rounded-${roundedSize} shadow-sm text-${textSize} font-${fontWeight} text-${textColor} ${
        bgColor === '' ? `bg-${color}-600` : `bg-${bgColor}`
      }  ${
        hoverColor === '' ? `hover:bg-${color}-700` : `hover:bg-${hoverColor}`
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500 ${
        classes ?? ''
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {showLoading && loading ? (
        <>
          &nbsp;
          <SpinnerGrow color={spinnerColor} />
        </>
      ) : (
        ''
      )}
    </button>
  );
};

export default Button;
