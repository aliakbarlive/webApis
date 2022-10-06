import React from 'react';
import { withRouter } from 'react-router-dom';
import Notifications from './Notifications';
import ProfileMenu from './ProfileMenu';
import MobileMenuButton from './MobileMenuButton';
import { useSelector } from 'react-redux';
import { selectAuthenticatedUser } from 'features/auth/authSlice';
import MarketplacePicker from './MarketplacePicker';
import logo from 'assets/logos/logo-orange.png';

const Header = ({
  setMobileMenuOpen,
  userNavigation,
  history,
  isOnboarding = false,
}) => {
  const user = useSelector(selectAuthenticatedUser);
  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
      {isOnboarding && (
        <div className="text-left pl-2 flex items-center">
          <img className="h-10 w-auto inline" src={logo} alt="Workflow" />
        </div>
      )}

      {!isOnboarding && (
        <MobileMenuButton setMobileMenuOpen={setMobileMenuOpen} />
      )}

      <div className="flex-1 px-4 flex justify-end">
        {/* <div className="flex-1 flex">
          <form className="w-full flex md:ml-0" action="#" method="GET">
            <label htmlFor="search_field" className="sr-only">
              Search
            </label>
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                id="search_field"
                className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                placeholder="Search"
                type="search"
                name="search"
              />
            </div>
          </form>
        </div> */}
        <div className="ml-2 flex items-center">
          {user.role.level === 'application' && !isOnboarding && (
            <MarketplacePicker history={history} />
          )}
          {!isOnboarding && <Notifications />}

          <ProfileMenu
            userNavigation={userNavigation}
            history={history}
            isOnboarding={isOnboarding}
          />
        </div>
      </div>
    </div>
  );
};

export default withRouter(Header);
