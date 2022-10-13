import React from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/outline';

const NoProfileFound = () => {
  return (
    <div className="flex flex-col items-center pt-8 sm:pt-24">
      <QuestionMarkCircleIcon className="h-16 w-16 sm:h-24 sm:w-24 text-gray-400" />
      <h5 className="text-gray-700 mt-8 text-md sm:text-lg font-medium text-center">
        No Advertising Profile found in this marketplace
      </h5>
    </div>
  );
};

export default NoProfileFound;
