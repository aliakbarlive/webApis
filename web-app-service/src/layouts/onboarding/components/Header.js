import ProfileDropdown from 'components/layout/ProfileDropdown';
import React from 'react';
import AccountPicker from './AccountPicker';
import logo from 'assets/logos/square-logo.png';

const Header = () => {
  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <div className="flex-1 px-4 flex justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <img className="h-10 w-auto rounded-md" src={logo} alt="Workflow" />
        </div>

        <div className="ml-4 flex items-center md:ml-6">
          {/* Account Picker */}
          <AccountPicker />

          {/* Profile dropdown */}
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
};

export default Header;
