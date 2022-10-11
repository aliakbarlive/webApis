import React from 'react';
import { withRouter, NavLink, useHistory } from 'react-router-dom';

const PageHeader = ({ tabs, title, location }) => {
  const { pathname } = location;
  const history = useHistory();
  const onChangeTab = (e) => {
    history.push(e.target.value);
  };

  return (
    <div className="mb-6">
      {tabs && (
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
            defaultValue={tabs.find((tab) => pathname.includes(tab.href)).name}
            onChange={onChangeTab}
          >
            {tabs.map((tab) => (
              <option value={tab.href} key={tab.name}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="hidden sm:block">
        <div className="flex items-stretch justify-between items-center border-b border-gray-200">
          <h2 className="text-lg font-bold leading-3 text-gray-900 sm:text-2xl sm:truncate py-5 border-b-2 border-transparent">
            {title}
          </h2>

          {tabs && (
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.name}
                  to={tab.href}
                  exact={tab.exact}
                  className="flex items-center whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  activeClassName="border-red-500 text-red-600"
                  aria-current={
                    pathname.includes(tab.href) ? 'page' : undefined
                  }
                >
                  {tab.name}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default withRouter(PageHeader);
