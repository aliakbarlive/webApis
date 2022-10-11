import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'react-moment';
import moment from 'moment-timezone';
import _ from 'lodash';
import { ChevronDownIcon, ChartBarIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';

import DateOptionModal from './components/DateOptionModal';
import PerformanceGraphModal from './components/PerformanceGraphModal';
import { getSnapshotAsync } from './snapshotSlice';
import { setRange } from '../../datePicker/datePickerSlice';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from '../../accounts/accountsSlice';

const Snapshots = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const marketplace = useSelector(selectCurrentMarketplace);
  const account = useSelector(selectCurrentAccount);
  const [dateModal, setDateModal] = useState(false);
  const [graphModal, setGraphModal] = useState(false);
  const [column, setColumn] = useState(0);
  const [mount, setMount] = useState(false);
  const [snapshots, setSnapshots] = useState([
    {
      column: 0,
      title: t('Snapshots.Today'),
      value: {
        endDate: moment().format('YYYY-MM-DD'),
        startDate: moment().format('YYYY-MM-DD'),
      },
      data: {},
    },
    {
      column: 1,
      title: t('Snapshots.Yesterday'),
      value: {
        endDate: moment().subtract(1, 'd').format('YYYY-MM-DD'),
        startDate: moment().subtract(1, 'd').format('YYYY-MM-DD'),
      },
      data: {},
    },
    {
      column: 2,
      title: t('Snapshots.Last7Days'),
      value: {
        endDate: moment().format('YYYY-MM-DD'),
        startDate: moment().subtract(7, 'd').format('YYYY-MM-DD'),
      },
      data: {},
    },
  ]);

  const setSnapshotDetails = useCallback(
    (snapshot) => {
      const newSnapshots = snapshots.map((s) => {
        if (s.column === snapshot.column) {
          return snapshot;
        } else {
          return s;
        }
      });
      setSnapshots([...newSnapshots]);
    },
    [snapshots]
  );

  const loadSnapshots = useCallback(() => {
    snapshots.map((item) => {
      let snapshot = item;
      dispatch(getSnapshotAsync(snapshot.value)).then((data) => {
        snapshot.data = data;
        setSnapshotDetails({ ...snapshot });
      });
      return snapshot;
    });
  }, [dispatch, snapshots, setSnapshotDetails]);

  useEffect(() => {
    setMount(false);
  }, [marketplace]);

  useEffect(() => {
    if (!mount) {
      setMount(true);
      loadSnapshots();
    }
  }, [account, marketplace, loadSnapshots, mount]);

  const dateDisplay = (value) => {
    let display = '';

    if (value.startDate === value.endDate) {
      display = (
        <Moment
          format="LL"
          className="text-xs font-bold text-gray-800 uppercase dark:text-gray-100"
        >
          {value.startDate}
        </Moment>
      );
    } else {
      display = (
        <>
          <Moment
            format="LL"
            className="text-xs font-bold text-gray-800 uppercase dark:text-gray-100"
          >
            {value.startDate}
          </Moment>{' '}
          -{' '}
          <Moment
            format="LL"
            className="text-xs font-bold text-gray-800 uppercase dark:text-gray-100"
          >
            {value.endDate}
          </Moment>
        </>
      );
    }
    return display;
  };

  const onChangeDate = (column) => {
    setDateModal(!dateModal);
    setColumn(column);
  };

  const onViewGraph = (value) => {
    dispatch(setRange(value));
    setGraphModal(!graphModal);
  };

  const onSelectDate = ({ column, title, value }) => {
    const newSnapshots = snapshots.map((snapshot) => {
      if (snapshot.column === column) {
        return {
          column,
          title,
          value,
        };
      } else {
        return snapshot;
      }
    });
    newSnapshots.map((item) => {
      let snapshot = item;
      const { data } = snapshot;
      if (data === undefined) {
        dispatch(getSnapshotAsync(snapshot.value)).then((data) => {
          snapshot.data = data;
          setSnapshotDetails(snapshot);
        });
      }
      return snapshot;
    });
  };

  const formatCamelCaseName = (name) => {
    return _.startCase(name);
  };

  return (
    <>
      <DateOptionModal
        open={dateModal}
        setOpen={setDateModal}
        column={column}
        onSelectDate={onSelectDate}
      />
      <PerformanceGraphModal open={graphModal} setOpen={setGraphModal} />

      <div className="bg-white dark:bg-gray-800">
        <div className="container px-1 py-1 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-8 lg:-mx-4 lg:flex-row lg:items-stretch lg:space-y-0 text-base">
            {snapshots ? (
              snapshots.map((s) => (
                <div
                  key={s.column}
                  className="flex flex-col w-full max-w-lg p-8 space-y-0 bg-white border-2 border-gray-200 rounded-lg lg:mx-4 dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="flex-shrink-0 space-between">
                    <h2 className="inline-flex items-center justify-center font-semibold tracking-tight text-blue-400 uppercase rounded-lg bg-gray-50 dark:bg-gray-700 float-left text-base">
                      {s.title}
                      <ChevronDownIcon
                        className="ml-2 h-5 w-5 cursor-pointer"
                        onClick={() => onChangeDate(s.column)}
                      />
                    </h2>
                    <ChartBarIcon
                      className="float-right h-5 w-5 cursor-pointer"
                      onClick={() => onViewGraph(s.value)}
                    />
                  </div>
                  <div className="flex-shrink-0 pt-5 pb-5">
                    {dateDisplay(s.value)}
                  </div>
                  <hr />
                  {_.isEmpty(s.data) === false ? (
                    <>
                      <ul className="flex-shrink-0 pt-4 pb-4">
                        <li className="text-gray-500 dark:text-gray-400 text-base clear-both mb-5">
                          <span className="float-left font-bold">
                            {t('Snapshots.UnitsSold')}
                          </span>
                          <b className="float-right">{s.data.units}</b>
                        </li>
                        <li className="text-gray-500 dark:text-gray-400 text-base clear-both">
                          <span className="float-left font-bold">
                            {t('Snapshots.Orders')}
                          </span>
                          <b className="float-right">{s.data.orders}</b>
                        </li>
                      </ul>
                      <hr />
                      <ul className="flex-shrink-0 pt-4 pb-4">
                        <li className="text-gray-500 dark:text-gray-400 text-base clear-both">
                          <span className="float-left font-bold">
                            {t('Snapshots.Revenues')}
                          </span>
                          <b className="float-right"></b>
                          <ul className="flex-shrink-0 pt-2 pb-2 ml-4">
                            {s.data.revenue ? (
                              s.data.revenue.map((rev) => (
                                <li
                                  key={rev.type}
                                  className="text-gray-500 dark:text-gray-400 text-base clear-both pb-5"
                                >
                                  <span className="float-left">
                                    {formatCamelCaseName(rev.type)}
                                  </span>
                                  <span className="float-right">
                                    ${rev.amount.toFixed(2)}
                                  </span>
                                </li>
                              ))
                            ) : (
                              <li className="text-gray-500 dark:text-gray-400 text-base clear-both pb-5">
                                <span className="float-left">
                                  {t('Snapshots.None')}
                                </span>
                                <span className="float-right">0</span>
                              </li>
                            )}
                          </ul>
                        </li>
                        <li className="text-gray-500 dark:text-gray-400 text-base clear-both">
                          <span className="float-left font-bold">
                            {t('Snapshots.Costs')}
                          </span>
                          <b className="float-right"></b>
                          <ul className="flex-shrink-0 pt-2 pb-2 ml-4">
                            {s.data.fees ? (
                              s.data.fees.map((fee) => (
                                <li
                                  key={fee.type}
                                  className="text-gray-500 dark:text-gray-400 text-base clear-both pb-5"
                                >
                                  <span className="float-left">
                                    {formatCamelCaseName(fee.type)}
                                  </span>
                                  <span className="float-right">
                                    ${fee.amount.toFixed(2)}
                                  </span>
                                </li>
                              ))
                            ) : (
                              <li className="text-gray-500 dark:text-gray-400 text-base clear-both pb-5">
                                <span className="float-left">
                                  {t('Snapshots.NoFees')}
                                </span>
                                <span className="float-right">0</span>
                              </li>
                            )}
                          </ul>
                        </li>
                        <li className="text-gray-500 dark:text-gray-400 text-base clear-both">
                          <span className="float-left font-bold">
                            {t('Snapshots.Returns')}
                          </span>
                          <b className="float-right"></b>
                          <ul className="flex-shrink-0 pt-2 pb-2 ml-4">
                            {s.data.returns ? (
                              s.data.returns.map((ret) => (
                                <li
                                  key={ret.type}
                                  className="text-gray-500 dark:text-gray-400 text-base clear-both pb-5"
                                >
                                  <span className="float-left">
                                    {formatCamelCaseName(ret.type)}
                                  </span>
                                  <span className="float-right">
                                    ${ret.amount.toFixed(2)}
                                  </span>
                                </li>
                              ))
                            ) : (
                              <li className="text-gray-500 dark:text-gray-400 text-base clear-both pb-5">
                                <span className="float-left">
                                  {t('Snapshots.NoReturns')}
                                </span>
                                <span className="float-right">0</span>
                              </li>
                            )}
                          </ul>
                        </li>
                        <li className="text-gray-500 dark:text-gray-400 text-base clear-both">
                          <span className="float-left font-bold">
                            {t('Snapshots.Advertising')}
                          </span>
                          <b className="float-right"></b>
                          <ul className="flex-shrink-0 pt-2 pb-2 ml-4">
                            {s.data.advertising ? (
                              s.data.advertising.map((adv) => (
                                <li
                                  key={adv.type}
                                  className="text-gray-500 dark:text-gray-400 text-base clear-both pb-5"
                                >
                                  <span className="float-left">
                                    {formatCamelCaseName(adv.type)}
                                  </span>
                                  <span className="float-right">
                                    ${adv.amount && adv.amount.toFixed(2)}
                                  </span>
                                </li>
                              ))
                            ) : (
                              <li className="text-gray-500 dark:text-gray-400 text-base clear-both pb-5">
                                <span className="float-left">
                                  {t('Snapshots.NoAdvertising')}
                                </span>
                                <span className="float-right">0</span>
                              </li>
                            )}
                          </ul>
                        </li>
                      </ul>
                      <hr />
                      <ul className="flex-shrink-0 pt-4 pb-4">
                        <li className="text-gray-500 dark:text-gray-400 text-base clear-both pb-5">
                          <span className="float-left font-bold">
                            {t('Snapshots.ROI')}
                          </span>
                          <b className="float-right">
                            ${s.data.roi && parseFloat(s.data.roi).toFixed(2)}
                          </b>
                        </li>
                        <li className="text-gray-500 dark:text-gray-400 text-base clear-both pb-5">
                          <span className="float-left font-bold">
                            {t('Snapshots.COGS')}
                          </span>
                          <b className="float-right">
                            ${s.data.cogs && parseFloat(s.data.cogs).toFixed(2)}
                          </b>
                        </li>
                        <li className="text-gray-500 dark:text-gray-400 text-base clear-both pb-5">
                          <span className="float-left font-bold">
                            {t('Snapshots.NetProfit')}
                          </span>
                          <b className="float-right">
                            $
                            {s.data.netProfit &&
                              parseFloat(s.data.netProfit).toFixed(2)}
                          </b>
                        </li>
                        <li className="text-gray-500 dark:text-gray-400 text-base clear-both">
                          <span className="float-left font-bold">
                            {t('Snapshots.Margins')}
                          </span>
                          <b className="float-right">
                            {s.data.margin && (s.data.margin * 100).toFixed(2)}%
                          </b>
                        </li>
                      </ul>{' '}
                    </>
                  ) : (
                    <strong>{t('Loading')}</strong>
                  )}
                </div>
              ))
            ) : (
              <strong>{t('Loading')}</strong>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Snapshots;
