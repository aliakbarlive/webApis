import React from 'react';
import classNames from 'utils/classNames';

const Divider = ({ className }) => {
  return (
    <div className={classNames(className, 'relative')}>
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
    </div>
  );
};

export default Divider;
