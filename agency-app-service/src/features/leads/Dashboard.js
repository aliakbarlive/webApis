import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from 'components/PageHeader';
import { selectAuthenticatedUser } from 'features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'features/datePicker/DatePicker';
import BootstrapTable from 'react-bootstrap-table-next';
import useQueryParams from 'hooks/useQueryParams';
import useQuery from 'hooks/useQuery';
import { Table } from 'components';
import { Line } from 'react-chartjs-2';
import usePermissions from 'hooks/usePermissions';
import { UserCircleIcon, ArrowCircleLeftIcon } from '@heroicons/react/outline';
import {
  selectCurrentDateRange,
  setRange,
} from 'features/datePicker/datePickerSlice';
import axios from 'axios';
import Loading from 'components/Loading';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

const Dashboard = () => {
  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const dispatch = useDispatch();
  const me = useSelector(selectAuthenticatedUser);
  const selectedDates = useSelector(selectCurrentDateRange);
  let query = useQuery();
  const startDate = query.get('startDate') ?? '';
  const endDate = query.get('endDate') ?? '';
  const dateRange =
    startDate !== '' && endDate !== '' ? { startDate, endDate } : false;
  const { params, updateParams, sortParam } = useQueryParams(selectedDates);
  const [repGroup, setRepGroup] = useState([]);
  const { userCan, isAgencySuperUser } = usePermissions();
  const [totalRep, setTotalRep] = useState(0);
  const [bookedCallRate, setBookedCallRate] = useState(0);
  const [numOfBookedCalls, setNumOfBookedCalls] = useState(0);
  const [numOfPositiveResponses, setNumOfPositiveResponses] = useState(0);
  const [responseRate, setResponseRate] = useState(0);
  const [totalPitches, setTotalPitches] = useState(0);
  const [totalPitchesSent, setTotalPitchesSent] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [graphLabel, setGraphLabel] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [showRepPage, setShowRepPage] = useState(false);

  const assignMetrics = (teamMetrics, repCount) => {
    setBookedCallRate(teamMetrics.bookedCallRate);
    setNumOfBookedCalls(teamMetrics.numOfBookedCalls);
    setNumOfPositiveResponses(teamMetrics.numOfPositiveResponses);
    setResponseRate(teamMetrics.responseRate);
    setTotalPitches(teamMetrics.totalPitches);
    setTotalPitchesSent(teamMetrics.totalPitchesSent);
    setTotalRep(repCount);
  };

  const getGroupMetrics = async () => {
    setIsLoading(true);
    await axios.get(`/agency/leads/group`, { params }).then((res) => {
      const { group, teamMetrics } = res.data.data.find(
        (r) => me.memberId.podId === r.podId
      );
      const repCount = group?.length;
      setRepGroup(group);
      assignMetrics(teamMetrics, repCount);
    });
    setIsLoading(false);
  };

  const getGraphMetrics = async () => {
    setIsLoading(true);
    await axios
      .get(`/agency/leads/graph`, {
        params: { ...params, podId: me.memberId.podId },
      })
      .then((res) => {
        const group = res.data.data;
        const labels = group.map((g) => {
          return g.week;
        });
        setGraphLabel(labels);
        const data = group.map((g) => {
          return g.count;
        });
        setGraphData(data);
      });
    setIsLoading(false);
  };

  useEffect(() => {
    if (initialLoad === true) {
      updateParams(selectedDates);
    } else if (dateRange !== false && initialLoad === false) {
      dispatch(setRange(dateRange));
      updateParams(dateRange);
      setInitialLoad(true);
    }
  }, [selectedDates]);

  useEffect(() => {
    async function getData() {
      await getGroupMetrics();
      await getGraphMetrics();
    }

    if (!isLoading) {
      getData();
    }
  }, [params]);

  const rowStyle = () => {
    return {
      color: `rgba(107, 114, 128, var(--tw-text-opacity))`,
      fontSize: `0.875rem`,
      lineHeight: `1.25rem`,
      paddingLeft: `0.75rem`,
      paddingTop: `1rem`,
      paddingBottom: `1rem`,
      whiteSpace: `nowrap`,
      textAlign: `center`,
      curser: `pointer`,
    };
  };

  const sourceColumns = [
    {
      dataField: 'source',
      text: 'Source',
      style: rowStyle,
    },
    {
      dataField: 'bookedCalls',
      text: 'Booked Calls',
      style: rowStyle,
    },
    {
      dataField: 'noShow',
      text: 'No Show',
      style: rowStyle,
    },
  ];

  const bookedCallsColums = [
    {
      dataField: 'bookedCalls',
      text: 'Booked Calls',
      sort: true,
      headerStyle: {
        textAlign: 'center',
        minWidth: '180px',
      },
    },
    {
      dataField: 'presentation',
      text: 'Call Presentation Completed',
      sort: true,
      headerStyle: {
        textAlign: 'center',
        minWidth: '180px',
      },
    },
    {
      dataField: 'noShow',
      text: 'No Show',
      sort: true,
      headerStyle: {
        textAlign: 'center',
        minWidth: '180px',
      },
    },
  ];

  const sourceData = [
    {
      source: 'Facebook',
      bookedCalls: 0,
      noShow: 0,
    },
    {
      source: 'LinkeIn',
      bookedCalls: 0,
      noShow: 0,
    },
    {
      source: 'Website',
      bookedCalls: 0,
      noShow: 0,
    },
    {
      source: 'Google Ads',
      bookedCalls: 0,
      noShow: 0,
    },
  ];

  const bookedCallsData = [
    {
      bookedCalls: '1st Call',
      presentation: 5,
      noShow: 1,
    },
    {
      bookedCalls: '2st Call',
      presentation: 5,
      noShow: 1,
    },
    {
      bookedCalls: '3st Call',
      presentation: 5,
      noShow: 1,
    },
    {
      bookedCalls: '4st Call',
      presentation: 5,
      noShow: 1,
    },
  ];

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    updateParams({
      page,
      pageSize: sizePerPage,
      sort: `${sortField}:${sortOrder}`,
    });
  };

  const tableRow = (row) => {
    return row.map((g, index) => (
      <tr key={g.userId}>
        <td className=" whitespace-nowrap text-left py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
          {g.name}
        </td>
        <td className=" whitespace-nowrap text-right py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
          N/A
        </td>
        <td className=" whitespace-nowrap text-right py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
          N/A
        </td>
        <td className=" whitespace-nowrap text-right py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
          N/A
        </td>
        <td className=" whitespace-nowrap text-right py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
          <Link href={`/leads-dashboard/${g.userId}`}>
            <button
              onClick={() => setShowRepPage(!showRepPage)}
              data-tip="Profile"
            >
              <UserCircleIcon className="m-1 h-5 w-5" color="green" />
            </button>
          </Link>
        </td>
      </tr>
    ));
  };
  return (
    <div>
      <div className="flex justify-between items-center">
        <PageHeader title="Profile" containerClasses={''} />
        {showRepPage && (
          <Link href={`/leads-dashboard`}>
            <button
              onClick={() => setShowRepPage(!showRepPage)}
              data-tip="Profile"
            >
              <span className="flex">
                <ArrowCircleLeftIcon className="m-1 h-5 w-5" />
                Back
              </span>
            </button>
          </Link>
        )}
      </div>
      <div className="flex xl:grid-cols-12 gap-5 mb-4 bg-white shadow p-4">
        <div className="ml-4 col-span-12 sm:col-span-4 xl:col-span-3">
          <DatePicker position="left" />
        </div>
      </div>
      {(me.role.groupLevel === 'cell' ||
        (me.role.groupLevel === 'pod' &&
          showRepPage &&
          userCan('leads.profile.rep')) ||
        isAgencySuperUser()) && (
        <>
          <div className="flex flex-col">
            <span>
              Overall calls booked in your calendar (includes canceled):
              {numOfBookedCalls}
            </span>
            <span>Cancelled: N/A</span>
            <span>Quotes sent: N/A</span>
            <span>Service agreement sent: {totalPitchesSent}</span>
            <span>sa signed: N/A</span>
            <span>sa conversion rate: N/A</span>
            <span>#of invoice sent: N/A</span>
            <span>#of invoice paid: N/A</span>
            <span>invoice conversion rate: N/A</span>
            <span>number of full account management deals: N/A</span>
            <span>down-sell deal: N/A</span>
          </div>
          <div className="mt-8 flex flex-col mb-4">
            <div className="-my-2 sm:-mx-6 lg:-mx-8">
              <div className="py-6 align-middle sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg bg-white">
                  <BootstrapTable
                    keyField="podId"
                    data={sourceData}
                    classes="min-w-full divide-y divide-gray-200"
                    headerWrapperClasses="bg-gray-50"
                    bodyClasses="bg-white divide-y divide-gray-200"
                    wrapperClasses="overflow-x-auto"
                    columns={sourceColumns}
                  />
                </div>
              </div>
            </div>
          </div>
          <Table
            keyField="leadId"
            columns={bookedCallsColums}
            data={bookedCallsData}
            params={params}
            defaultSorted={[
              {
                dataField: sortParam ? sortParam[0] : 'updatedAt',
                order: sortParam ? sortParam[1] : 'asc',
              },
            ]}
            onTableChange={onTableChange}
          />
        </>
      )}

      {isAgencySuperUser() ||
        (me.role.groupLevel === 'pod' && !showRepPage && (
          <>
            <div className="flex bg-white shadow p-4 items-left justify-left">
              <div className="w-3/4 justify-between">
                {!isLoading ? (
                  <Line
                    height={'300%'}
                    datasetIdKey="podId"
                    data={{
                      labels: graphLabel,
                      datasets: [
                        {
                          id: 1,
                          label: 'Booked Calls',
                          data: graphData,
                          fill: true,
                          backgroundColor: 'rgba(75,192,192,0.2)',
                          borderColor: 'rgba(75,192,192,1)',
                        },
                      ],
                    }}
                    options={{ maintainAspectRatio: false }}
                  />
                ) : (
                  <Loading className="justify-center py-10" />
                )}
              </div>
              <div className="w-1/4 justify-between">
                {!isLoading ? (
                  <table className="min-w-full divide-y divide-gray-300">
                    <tr>
                      <th>Overall</th>
                    </tr>
                    <tr>
                      <td>Total Rep: </td>
                      <td className="text-right">{totalRep}</td>
                    </tr>
                    <tr>
                      <td>Total Pitches: </td>
                      <td className="text-right">{totalPitches}</td>
                    </tr>
                    <tr>
                      <td>Total Sent Pitches: </td>
                      <td className="text-right">{totalPitchesSent}</td>
                    </tr>
                    <tr>
                      <td>Total Positive Responses: </td>
                      <td className="text-right">{numOfPositiveResponses}</td>
                    </tr>
                    <tr>
                      <td>Response Rate %: </td>
                      <td className="text-right">{responseRate}%</td>
                    </tr>
                    <tr>
                      <td>Booked Call Rate %: </td>
                      <td className="text-right">{bookedCallRate}%</td>
                    </tr>
                    <tr>
                      <td>Total Booked Calls: </td>
                      <td className="text-right">{numOfBookedCalls}</td>
                    </tr>
                  </table>
                ) : (
                  <Loading className="justify-center py-10" />
                )}
              </div>
            </div>

            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg bg-white mt-6">
              <table className="min-w-full divide-y divide-gray-300 col-span-12">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Names of Sales Rep
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                    >
                      # Of First Call Presentations
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                    >
                      Total Closed Deals
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                    >
                      Conversion Rate
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                    >
                      Profile
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {repGroup.length > 0 ? (
                    tableRow(repGroup)
                  ) : (
                    <p className="p-10">Nothing to display here!</p>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ))}
    </div>
  );
};

export default Dashboard;
