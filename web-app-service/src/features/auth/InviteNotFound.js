import React from 'react';
import { Link } from 'react-router-dom';

const InviteNotFound = () => {
  return (
    <>
      <p className="text-center text-sm text-gray-600">
        We couldn't find your invitation. Please double check the link you
        entered. If the problem still persists, please contact support.
      </p>

      <div className="mt-6">
        <Link
          to="/sign-in"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Go To Login
        </Link>
      </div>
    </>
  );
};

export default InviteNotFound;
