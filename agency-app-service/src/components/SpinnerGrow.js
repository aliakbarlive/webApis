import React from 'react';

const SpinnerGrow = ({ size = 4, color = 'red-500' }) => {
  return (
    <div
      className={`animate-spinner-grow bg-${color} w-${size} h-${size} rounded-lg mr-1`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
export default SpinnerGrow;
