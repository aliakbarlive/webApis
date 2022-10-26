import React from 'react';
import SpinnerGrow from './SpinnerGrow';

const Loading = ({ className = '' }) => {
  return (
    <span className={`flex ${className}`}>
      <SpinnerGrow />
      <SpinnerGrow />
      <SpinnerGrow />
    </span>
  );
};
export default Loading;
