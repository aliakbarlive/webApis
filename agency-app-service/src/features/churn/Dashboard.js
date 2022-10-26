import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from './churnSlice';
import TabNav from 'components/TabNav';
import classNames from 'utils/classNames';
import { PlusIcon, MinusIcon } from '@heroicons/react/solid';
import Button from 'components/Button';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [report, setReport] = useState(null);
  const [tabs, setTabs] = useState([
    { name: 'Summary', href: '#', count: '', current: true },
    { name: 'Table View', href: '#', count: '', current: false },
  ]);
  const [currentTab, setCurrentTab] = useState('Summary');
  const [range, setRange] = useState('monthly');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function getData() {
      await axios.get(`/agency/reports/churn/${range}`).then((res) => {
        setReport(res.data.output);
        dispatch(setCurrentPage(`${res.data.output.currentYear} Churn Report`));
      });
    }
    getData();
  }, [range]);

  const onSelectChange = (e) => {
    setCurrentTab(e.target.value);
  };

  const onClick = (selectedTab) => {
    setCurrentTab(selectedTab.name);
  };

  const onChangeRange = () => {
    setRange(range === 'monthly' ? 'quarterly' : 'monthly');
  };

  const convertCsv = async () => {
    setExporting(true);
    const response = await axios.get(`/agency/reports/churn/${range}/export`);

    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
      encoding: 'UTF-8',
    });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `churn-report-${range}.csv`;
    link.click();
    setExporting(false);
  };

  return (
    <div className="">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900 capitalize">
            {range} Reports
          </h1>
          <TabNav
            tabs={tabs}
            setTabs={setTabs}
            onSelectChange={onSelectChange}
            onClick={onClick}
          />
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex-auto">
          <Button
            classes="mr-2"
            onClick={convertCsv}
            loading={exporting}
            showLoading={true}
          >
            Export
          </Button>
          <Button classes={`capitalize`} onClick={onChangeRange}>
            Switch to {range === 'monthly' ? 'Quarterly' : 'Monthly'} View
          </Button>
        </div>
      </div>

      {currentTab === 'Summary' && (
        <div>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {report?.out.map((item) => (
              <div
                key={item.month}
                className="px-6 py-4 bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="flex items-baseline text-xl font-semibold text-gray-600">
                  {item.month}
                </div>
                <div className="flex justify-between">
                  <p className="text-md font-medium text-gray-500 truncate">
                    Churn Rate
                  </p>
                  <p
                    className={classNames(
                      parseFloat(item.data.churnRate) >= 0
                        ? 'text-green-600'
                        : 'text-red-600',
                      'text-xl font-semibold'
                    )}
                  >
                    {item.data.churnRate}%
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    Active Subscriptions
                  </p>
                  <p className="text-sm text-gray-900">{item.data.active}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    New Subscriptions
                  </p>
                  <p className="text-sm text-gray-900">{item.data.new}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    Cancelled Subscriptions
                  </p>
                  <p className="text-sm text-gray-900">{item.data.cancelled}</p>
                </div>
                <div className="flex justify-between border-t mt-2 pt-2">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    Total Active Clients month end
                  </p>
                  <p className="text-lg text-gray-900 flex items-baseline">
                    {item.data.totalActiveEnd}
                    <span
                      className={classNames(
                        parseFloat(item.data.activePercentage) >= 0
                          ? 'text-green-600'
                          : 'text-red-600',
                        'ml-2 flex items-baseline text-sm font-semibold'
                      )}
                    >
                      {parseFloat(item.data.activePercentage) >= 0 ? (
                        <PlusIcon
                          className="self-center flex-shrink-0 h-4 w-4 text-green-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <MinusIcon
                          className="self-center flex-shrink-0 h-4 w-4 text-red-500"
                          aria-hidden="true"
                        />
                      )}{' '}
                      {item.data.activePercentage}%
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </dl>
        </div>
      )}

      {currentTab === 'Table View' && (
        <div className=" flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                    >
                      Month
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Active
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      New
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Cancelled
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Churn Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {report?.out.map((monthReport) => (
                    <tr key={monthReport.month}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                        {monthReport.month}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                        {monthReport.data.active}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                        {monthReport.data.new}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                        {monthReport.data.cancelled}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                        {monthReport.data.churnRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
