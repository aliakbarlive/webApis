import React from 'react';
import Password from './Password';
import Profile from './Profile';

const General = () => {
  return (
    <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
      <Profile />
      <Password />
    </div>
  );
};

export default General;
