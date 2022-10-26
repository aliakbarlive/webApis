import { NavLink } from 'react-router-dom';

const Navigation = ({ accountId, query, title }) => {
  return (
    <div>
      <div>
        <h4 className="text-gray-700 font-bold text-lg">{title}</h4>
        <p className="text-gray-500 text-xs font-medium">Advertising Trends</p>
      </div>

      <div className="hidden sm:block mt-8">
        <div className="flex justify-between items-center border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <NavLink
              to={`/accounts/${accountId}/advertising/trends/snapshot${query}`}
              className="flex items-center whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              activeClassName="border-red-500 text-red-600"
            >
              Snapshot
            </NavLink>
            <NavLink
              to={`/accounts/${accountId}/advertising/trends/breakdown${query}`}
              className="flex items-center whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              activeClassName="border-red-500 text-red-600"
            >
              Breakdown
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
