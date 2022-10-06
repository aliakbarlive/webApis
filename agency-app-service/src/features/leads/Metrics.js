import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
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
import { Line } from 'react-chartjs-2';
import axios from 'axios';

import DatePicker from 'features/datePicker/DatePicker';
import {
  selectCurrentDateRange,
  setRange,
} from '../datePicker/datePickerSlice';
import PageHeader from 'components/PageHeader';
import usePermissions from 'hooks/usePermissions';
import useQueryParams from 'hooks/useQueryParams';
import useQuery from 'hooks/useQuery';
import Loading from 'components/Loading';
import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import { UserCircleIcon } from '@heroicons/react/outline';
import LeadsOfRepTable from './components/LeadsOfRepTable';
import TabNav from 'components/TabNav';
import LeadSourcesTable from './components/LeadSourcesTable';

const Metrics = () => {
  const { userCan } = usePermissions();
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

  const selectedDates = useSelector(selectCurrentDateRange);

  let query = useQuery();
  const startDate = query.get('startDate') ?? '';
  const endDate = query.get('endDate') ?? '';
  const dateRange =
    startDate !== '' && endDate !== '' ? { startDate, endDate } : false;
  const { params, updateParams } = useQueryParams(selectedDates);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [open, setOpen] = useState(false);
  const [leadsRep, setLeadsRep] = useState('');

  // Overall Metrics
  const [totalRep, setTotalRep] = useState(0);
  const [totalPitches, setTotalPitches] = useState(0);
  const [totalSentPitches, setTotalSentPitches] = useState(0);
  const [totalResponses, setTotalResponses] = useState(0);

  const [responseRate, setResponseRate] = useState(0);
  const [bookedCallRate, setBookedCallRate] = useState(0);
  const [totalBookedCalls, setTotalBookedCalls] = useState(0);

  // Graph Metrics
  const [graphLabel, setGraphLabel] = useState([]);
  const [graphData, setGraphData] = useState([]);

  // Group Metrics
  const [reps, setReps] = useState([]);

  //Selecting Tab
  const [navTabs, setNavTabs] = useState([
    {
      name: 'Lead Rep',
      href: '#',
      count: '',
      options: ['Lead Rep'],
      current: true,
      visible: userCan('leads.list'),
    },
    {
      name: 'Pitcher',
      href: '#',
      count: '',
      options: ['Pitcher'],
      current: false,
      visible: userCan('leads.list'),
    },
    {
      name: 'Sources',
      href: '#',
      count: '',
      options: ['Sources'],
      current: false,
      visible: userCan('leads.list'),
    },
  ]);

  const getOverallMetrics = async () => {
    setLoading(true);

    await axios.get(`/agency/leads/overall`, { params }).then((res) => {
      const {
        totalRep,
        totalPitches,
        totalSentPitches,
        totalResponses,
        responseRate,
        bookedCallRate,
        totalBookedCalls,
      } = res.data.data;
      setTotalRep(totalRep);
      setTotalPitches(totalPitches);
      setTotalSentPitches(totalSentPitches);
      setTotalResponses(totalResponses);
      setResponseRate(responseRate);
      setBookedCallRate(bookedCallRate);
      setTotalBookedCalls(totalBookedCalls);
      dispatch(setRange(selectedDates));
      if (initialLoad) {
        updateParams(selectedDates);
      } else {
        setInitialLoad(true);
      }
    });
    setLoading(false);
  };

  const getGraphMetrics = async () => {
    setLoading(true);
    await axios.get(`/agency/leads/graph`, { params }).then((res) => {
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
    setLoading(false);
  };

  const getGroupMetrics = async () => {
    setLoading(true);
    await axios.get(`/agency/leads/group`, { params }).then((res) => {
      setReps(res.data.data);
    });
    setLoading(false);
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
      await getOverallMetrics();
      await getGraphMetrics();
      await getGroupMetrics();
    }

    if (!loading) {
      getData();
    }
  }, [params]);

  const setupModal = (userId) => {
    setLeadsRep(userId);
    setOpen(true);
  };

  const expandRow = (reps) => {
    return reps.length > 0 ? (
      <>
        <table className="min-w-full divide-y divide-gray-300 col-span-12">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                {navTabs[0].current ? 'LEAD REP' : 'Pitcher'}
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-left"
                data-sortable="true"
              >
                {navTabs[0].current ? 'APPROVED PITCHES' : 'Pitches Sent'}
              </th>
            </tr>
          </thead>

          {navTabs[0].current ? (
            <tbody>
              {reps.map((r, rIdx) =>
                r.name === 'Lead Generation Representative - New Leads' ||
                r.name === 'Lead Generation Representative - Old Leads' ? (
                  r.group.map((g, gIdx) => {
                    return (
                      <tr key={g.userId}>
                        <td className=" whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {g.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-left">
                          {g.totalPitches > 0 ? (
                            <button
                              type="button"
                              className="underline text-purple-700"
                              onClick={() => setupModal(g.userId)}
                            >
                              {g.totalPitches}
                            </button>
                          ) : (
                            <span>{g.totalPitches}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <></>
                )
              )}
            </tbody>
          ) : (
            <tbody>
              {' '}
              {reps.map((r, rIdx) =>
                r.name === 'Lead Generation Representative - Pitcher'? (
                  r.group.map((g, gIdx) => {
                    return (
                      <tr key={g.userId}>
                        <td className=" whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {g.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-left">
                          {g.totalPitches > 0 ? (
                            <button
                              type="button"
                              className="underline text-purple-700"
                              onClick={() => setupModal(g.userId)}
                            >
                              {g.totalPitches}
                            </button>
                          ) : (
                            <span>{g.totalPitches}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <></>
                )
              )}{' '}
            </tbody>
          )}
        </table>
      </>
    ) : (
      <p className="p-10">Nothing to display here!</p>
    );
    // },
  };

  const onTabChange = (tab) => {};

  return (
    <>
      <PageHeader title="Lead Metrics" containerClasses={''} />

      {(userCan('leads.metrics.overall.metrics') ||
        userCan('leads.metrics.graph.metrics') ||
        userCan('leads.metrics.group.metrics')) && (
        <div className="flex xl:grid-cols-12 gap-5 mb-4 bg-white shadow p-4">
          <div className="ml-4 col-span-12 sm:col-span-4 xl:col-span-3">
            <DatePicker position="left" />
          </div>
        </div>
      )}

      {(userCan('leads.metrics.overall.metrics') ||
        userCan('leads.metrics.graph.metrics')) && (
        <div className="flex bg-white shadow p-4 items-left justify-left">
          {/* Graph Here */}
          {userCan('leads.metrics.graph.metrics') && (
            <div className="w-3/4 justify-between">
              {!loading ? (
                <Line
                  height={'300%'}
                  datasetIdKey="id"
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
          )}

          {/* Overall Metrics Here */}
          {userCan('leads.metrics.overall.metrics') && (
            <div className="w-1/4 justify-between">
              {!loading ? (
                <table className="min-w-full divide-y divide-gray-300">
                  <tr>
                    <th>Overall</th>
                  </tr>
                  <tr>
                    <td>Total Rep: </td>
                    <td className="text-right">{totalRep}</td>
                  </tr>
                  <tr>
                    <td>Total Approved Pitches: </td>
                    <td className="text-right">{totalPitches}</td>
                  </tr>
                  <tr>
                    <td>Total Responses: </td>
                    <td className="text-right">{totalResponses}</td>
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
                    <td className="text-right">{totalBookedCalls}</td>
                  </tr>
                </table>
              ) : (
                <Loading className="justify-center py-10" />
              )}
            </div>
          )}
        </div>
      )}

      {/* Metrics Here */}
      {userCan('leads.metrics.group.metrics') && (
        <div className="mt-8 flex flex-col">
          <div className="-my-2 sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle sm:px-6 lg:px-8">
              <TabNav
                tabs={navTabs}
                setTabs={setNavTabs}
                onClick={(tab) => onTabChange(tab)}
              />
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg bg-white">
                {!loading ? (
                  navTabs[0].current || navTabs[1].current ? (
                    expandRow(reps)
                  ) : (
                    <LeadSourcesTable selectedDates={selectedDates} />
                  )
                ) : (
                  <Loading className="place-content-center py-10" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="h-4/5 overscroll-auto">
        <Modal open={open} setOpen={setOpen} as={'div'} align="top">
          <div className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
            <ModalHeader title="Leads list" setOpen={setOpen} />
            <LeadsOfRepTable
              selectedDates={selectedDates}
              leadsRep={leadsRep}
            />
          </div>
        </Modal>
      </div>
    </>
  );
};

export default withRouter(Metrics);
