import classNames from 'utils/classNames';

const TabNav = ({ tabs, setTabs, onSelectChange, onClick }) => {
  const onClickFilter = (e, tab) => {
    e.preventDefault();
    let myTabs = [...tabs];
    let currentTab = myTabs.find((t) => t.current === true);
    currentTab.current = false;
    let selectedTab = myTabs.find((t) => t === tab);
    selectedTab.current = true;
    setTabs(myTabs);

    onClick(selectedTab);
  };

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
          defaultValue={tabs.find((tab) => tab.current).name}
          onChange={onSelectChange}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                type="button"
                className={classNames(
                  tab.current
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                  'whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm'
                )}
                aria-current={tab.current ? 'page' : undefined}
                onClick={(e) => onClickFilter(e, tab)}
              >
                {tab.name}
                {tab.count ? (
                  <span
                    className={classNames(
                      tab.current || tab.countRed
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-900',
                      'hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block'
                    )}
                  >
                    {tab.count}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TabNav;
