import React, { useEffect, useState } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import './submenu.scss';

const MobileSubmenu = ({ item, mobile, location }) => {
  const { pathname } = location;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let isCurrent = item.children.some((c) => c.href.includes(pathname));
    if (isCurrent) {
      setOpen(true);
    }
  }, [pathname]);

  return (
    <div className="relative">
      <div
        className={`${
          mobile
            ? 'flex-row text-red-100  hover:text-white text-sm rounded-md'
            : 'flex-col text-gray-400 hover:bg-gray-50 hover:text-gray-900'
        } flex relative cursor-pointer w-full px-4 py-2 text-xs font-medium items-center  focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75`}
        onClick={() => setOpen(!open)}
      >
        <item.icon
          className={`h-6 w-6 ${mobile ? 'mr-3' : ''}`}
          aria-hidden="true"
        />
        <span
          className={`mt-2 flex items-center before-arrow ${
            mobile && 'mobile'
          } ${open ? 'expand' : ''}`}
        >
          {item.name}
        </span>
      </div>
      <div
        className={
          open ? 'border-t border-b border-dotted' : 'h-0 overflow-hidden'
        }
      >
        {item.children.map((c) => {
          return (
            <NavLink
              key={c.name}
              to={`${c.href}`}
              className={`${
                mobile
                  ? 'text-red-100 hover:bg-red-800 hover:text-white group py-2 px-3 rounded-md flex items-center text-sm font-medium'
                  : 'group w-full px-3 py-2 rounded-md flex flex-col items-center text-xs font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-900'
              } `}
              activeClassName={`${
                mobile ? 'bg-red-800 text-white' : 'bg-red-50 text-red-600'
              }`}
              aria-current={pathname.includes(c.href) ? 'page' : undefined}
            >
              <c.icon
                className={mobile ? 'mr-3 h-6 w-6 ' : 'h-5 w-5'}
                aria-hidden="true"
              />
              <span className={mobile ? 'mt-2' : 'mt-1'}>{c.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default withRouter(MobileSubmenu);
