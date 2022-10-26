import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import logo from 'assets/logos/logo-white.png';

const Sidebar = ({ sidebarNavigation, location }) => {
  const { pathname } = location;

  return (
    <div className="hidden w-36 border-r border-gray-200 bg-white overflow-y-auto md:block">
      <div className="w-full py-6 flex flex-col items-center">
        <div className="flex-shrink-0 flex items-center">
          <img className="h-10 w-auto rounded-md" src={logo} alt="Workflow" />
        </div>
        <div className="flex-1 mt-6 w-full px-2 space-y-1">
          {sidebarNavigation.map((item) => (
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
