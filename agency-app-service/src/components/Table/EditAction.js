import React from 'react';
import { PencilIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';

const EditAction = ({ to, size = 4 }) => {
  return (
    <Link className="text-red-600" to={to}>
      <PencilIcon className={`h-${size} w-${size}`} aria-hidden="true" />
    </Link>
  );
};
export default EditAction;
