import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import logo from 'assets/logos/square-logo.png';

import { selectAuthenticatedUser } from 'features/auth/authSlice';
import { selectCurrentAccount } from 'features/accounts/accountsSlice';
import { hasAccessTo } from 'utils/access';

const Sidebar = ({ sidebarNavigation, location }) => {
  const { pathname } = location;
  const user = useSelector(selectAuthenticatedUser);
  const account = useSelector(selectCurrentAccount);

  return (
    <div className="hidden w-28 border-r border-gray-200 bg-white overflow-y-auto md:block">
      <div className="w-full py-6 flex flex-col items-center">
        <div className="flex-shrink-0 flex items-center">
          <img className="h-10 w-auto rounded-md" src={logo} alt="Workflow" />
        </div>
        <div className="flex-1 mt-6 w-full px-2 space-y-1">
          {sidebarNavigation
            .filter((item) => hasAccessTo(user, account, item.module))
            .map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className="group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                activeClassName="bg-red-50 text-red-600"
                aria-current={pathname.includes(item.href) ? 'page' : undefined}
              >
                <item.icon className="h-6 w-6" aria-hidden="true" />
                <span className="mt-2">{item.name}</span>
              </NavLink>
            ))}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Sidebar);
