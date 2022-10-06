import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ChevronDownIcon } from '@heroicons/react/outline';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';

import { Table } from 'components';
import ChangeLogExpandRow from './ChangeLogExpandRow';
import classNames from 'utils/classNames';

const ChangeLogs = ({ accountId, marketplace, campaignType }) => {
  const { t } = useTranslation();
  const selectedDates = useSelector(selectCurrentDateRange);
  const [list, setList] = useState({ rows: [] });

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    sort: 'timestamp:desc',
  });

  useEffect(() => {
    try {
      axios
        .get('/advertising/history/grouped', {
          params: {
            ...params,
            accountId,
            marketplace,
            campaignType,
            ...selectedDates,
          },
        })
        .then((response) => {
          setList(response.data.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, [accountId, marketplace, campaignType, params, selectedDates]);

  const columns = [
    {
      dataField: 'timestamp',
      text: t('Advertising.ChangeLogs.Date'),
      sort: true,
      headerClasses:
        'w-80 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase',
      formatter: (cell) =>
        moment.unix(cell / 1000).format('MMMM Do YYYY, h:mm:ss a'),
    },
    {
      dataField: 'user',
      text: 'User',
      headerClasses:
        'w-80 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase',
      formatter: (cell) =>
        cell ? `${cell.firstName} ${cell.lastName}` : 'Amazon Console',
    },
    {
      dataField: 'campaign',
      text: 'Campaign',
      headerClasses:
        'w-70 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase',
      formatter: (cell, row) => `${cell.name} - (${row.count} logs)`,
    },
  ];

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    if (type === 'sort' && params.sort === `${sortField}:${sortOrder}`) return;

    let newParams = { ...params, page, pageSize: sizePerPage };
    delete newParams.sort;

    if (sortField && sortOrder) {
      newParams.sort = `${sortField}:${sortOrder}`;
    }

    setParams(newParams);
  };

  const expandRow = {
    renderer: (row) => (
      <ChangeLogExpandRow
        accountId={accountId}
        marketplace={marketplace}
        advCampaignId={row.advCampaignId}
        timestamp={row.timestamp}
      />
    ),
    onlyOneExpanding: false,
    showExpandColumn: true,
    expandHeaderColumnRenderer: () => {
      return '';
    },
    expandColumnRenderer: ({ expanded }) => {
      return (
        <span className="pl-4 flex items-center w-10">
          <ChevronDownIcon
            className={classNames(
              expanded ? '-rotate-180' : 'rotate-0',
              'h-6 w-6 transform'
            )}
            aria-hidden="true"
          />
        </span>
      );
    },
  };

  return (
    <div className="mt-4">
      <Table
        keyField="timestamp"
        columns={columns}
        data={list}
        onTableChange={onTableChange}
        params={params}
        defaultSorted={[{ dataField: 'activityDate', order: 'desc' }]}
        expandRow={expandRow}
      />
    </div>
  );
};

export default ChangeLogs;
