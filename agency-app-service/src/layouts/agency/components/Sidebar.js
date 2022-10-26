import React, { useEffect, useState } from 'react';
import { NavLink, Redirect, useHistory, withRouter } from 'react-router-dom';
import logo from 'assets/logos/logo-white.png';
import { isEmpty } from 'lodash';
import SidebarSubmenuLink from './SidebarSubmenuLink';
import SidebarSubmenu from './SidebarSubmenu';

const Sidebar = ({ sidebarNavigation, location }) => {
  const { pathname } = location;
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const parent = sidebarNavigation.find((item) => {
      const pathParent = pathname.split('/');
      return item.children
        ? item.children.some(
            (c) => c.href.includes(pathname) || c.href.includes(pathParent[1])
          )
        : null;
    });

    if (!isEmpty(parent)) {
      setOpen(true);
      setCurrentItem(parent);
    } else {
      setOpen(false);
      setCurrentItem(null);
    }
  }, [pathname, sidebarNavigation]);

  const onOpen = (item) => {
    if (currentItem === item) {
      setOpen(!open);
    } else {
      setCurrentItem(item);
      setOpen(currentItem === item ? !open : true);
      history.push(item.children[0].href);
    }
  };

  return (
    <>
      <div className="hidden w-36 bg-red-500 overflow-y-auto md:block relative">
        <div className="w-full py-6 flex flex-col items-center">
          <div className="flex-shrink-0 flex items-center">
            <img className="h-10 w-auto" src={logo} alt="Workflow" />
          </div>
          <div className="flex-1 mt-6 w-full px-3 space-y-3 relative">
            {sidebarNavigation.map((item) => {
              return item.children && item.children.length > 0 ? (
                <SidebarSubmenuLink
                  key={item.name}
                  onOpen={onOpen}
                  open={open}
                  currentItem={currentItem}
                  item={item}
                />
              ) : (
                <NavLink
                  key={item.name}
                  to={`${item.href}`}
                  className="group w-full p-3 rounded-md flex flex-col items-center text-xs text-white hover:bg-white hover:text-red-500"
                  activeClassName="bg-white text-red-500"
                  aria-current={
                    pathname.includes(item.href) ? 'page' : undefined
                  }
                >
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                  <span className="mt-1">{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
        <div
          className={`italic text-white text-xs text-center bottom-0 w-full p-2 ${
            sidebarNavigation.length > 6 ? 'relative' : 'absolute'
          }`}
        >
          {process.env.REACT_APP_NODE_ENV} v{process.env.REACT_APP_VERSION}
        </div>
      </div>

      <SidebarSubmenu
        currentItem={currentItem}
        open={open}
        pathname={pathname}
      />
    </>
  );
};

export default withRouter(Sidebar);
