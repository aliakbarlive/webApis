import React from 'react';

const ExpiredInvite = ({ onResendInvite }) => {
  return (
    <>
      <p className="text-center text-sm text-gray-600">
        Invitations are only valid for 48 hours. Click the button bellow to
        request a new one to be sent to your email.
      </p>

      <div className="mt-6">
        <button
          type="button"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={onResendInvite}
        >
          Request New Invite
        </button>
      </div>
    </>
  );
};

export default ExpiredInvite;
