import { NavLink, withRouter } from 'react-router-dom';

const SidebarSubmenu = ({ currentItem, open, pathname }) => {
  return (
    <div
      id="afterclass"
      className={`hidden w-40 shadow-sm bg-white overflow-y-auto ${
        open && 'md:block'
      }`}
    >
      {currentItem && open && (
        <>
          <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow"></div>
          <div className="">
            <div className="w-full px-4 pt-4 pb-2 mb-5 font-semibold text-xs text-gray-900 bg-gray-50">
              {currentItem.name}
            </div>
            {currentItem.children.map((c) => {
              return (
                <NavLink
                  key={c.name}
                  to={`${c.href}`}
                  className="group w-full pr-3 pl-6 py-2 flex items-center text-xs font-medium text-gray-400 hover:bg-gray-50 hover:text-red-500 relative"
                  activeClassName="bg-red-50 text-red-500 select-arrow"
                  aria-current={pathname.includes(c.href) ? 'page' : undefined}
                >
                  <c.icon className="h-5 w-5 inline mr-2" aria-hidden="true" />
                  <span className="mt-1">{c.name}</span>
                  <div className="arrow-left"></div>
                </NavLink>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
export default withRouter(SidebarSubmenu);
