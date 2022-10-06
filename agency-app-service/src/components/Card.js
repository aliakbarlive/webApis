import React from 'react';
import classNames from 'utils/classNames';

const Card = ({
  children,
  className,
  bg = 'white',
  flex,
  shadow = true,
  overflowHidden = true,
}) => {
  return (
    <div
      className={`bg-${bg} ${overflowHidden && 'overflow-hidden'} ${
        shadow ? 'shadow' : ''
      } rounded-lg ${className ?? ''}`}
    >
      <div className={classNames(flex && 'flex', 'px-4 py-5 sm:p-6')}>
        {children}
      </div>
    </div>
  );
};

export default Card;
