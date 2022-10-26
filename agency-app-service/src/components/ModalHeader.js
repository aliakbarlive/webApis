import React from 'react';
import { XIcon } from '@heroicons/react/outline';

const ModalHeader = ({
  title,
  setOpen,
  classes,
  titleClasses,
  showCloseButton = true,
}) => {
  return (
    <div
      className={`px-4 md:px-6 border-b-2 py-3 flex justify-between ${
        classes ?? ''
      }`}
    >
      <h3
        className={`text-md leading-6 font-medium text-gray-800 ${
          titleClasses ?? ''
        }`}
      >
        {title}
      </h3>
      {showCloseButton && (
        <button
          type="button"
          className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
          onClick={() => setOpen(false)}
        >
          <span className="sr-only">Close</span>
          <XIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
export default ModalHeader;
