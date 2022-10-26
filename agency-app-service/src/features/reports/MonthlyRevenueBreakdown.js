import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';

import { Table } from 'components';
import { currencyFormatter } from 'utils/formatters';
import { pick } from 'lodash';
import Button from 'components/Button';
import { columnClasses } from 'utils/table';
import classNames from 'utils/classNames';
import { Link } from 'react-router-dom';
import BsPopover from 'components/BsPopover';
import Label from 'components/Forms/Label';
import Toggle from 'components/Forms/Toggle';
import { useDispatch } from 'react-redux';
import { setAlert } from 'features/alerts/alertsSlice';

const MonthlyRevenueBreakdown = () => {
  const dispatch = useDispatch();
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [clients, setClients] = useState({ rows: [] });
  const [toggleBreakdown, setToggleBreakdown] = useState(false);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    startDate: '2022-01-01',
    endDate: moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
  });

  useEffect(() => {
    setLoading(true);
    let subcolumnsArray = ['mr', 'otf', 'com', 'wm', 'wc'];
    let monthsArray = [];
    let dateRef = moment(params.startDate);

    while (dateRef.isSameOrBefore(moment(params.endDate).endOf('month'))) {
      monthsArray.push(dateRef.clone().format('MM-YYYY'));
      dateRef = dateRef.add(1, 'month').startOf('month');
    }

    let breakdownColumns = [];
    monthsArray.map((m) => {
      subcolumnsArray.forEach((s) => {
        breakdownColumns.push(`${m}-${s}`);
      });
    });

    setMonths(breakdownColumns);

    axios
      .get('/agency/reports/clients-monthly-sales-breakdown', { params })
      .then((response) => {
        setClients(response.data.data);
      })
      .finally(() => setLoading(false));
  }, [params]);

  /**
   * Export data.
   */
  const onExport = async () => {
    setExporting(true);
    try {
      const response = await axios.get(
        '/agency/reports/clients-monthly-sales-breakdown/export',
        {
          params: {
            ...pick(params, ['startDate', 'endDate']),
            toggleBreakdown,
          },
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
        encoding: 'UTF-8',
      });

      const { 0: first, [months.length - 1]: last } = months;

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `monthly-revenue-breakdown-${first}-${last}.csv`;
      link.click();
      dispatch(setAlert('success', 'export successful'));
    } catch (error) {
      dispatch(setAlert('error', 'An error occurred while exporting the data'));
    }

    setExporting(false);
  };

  const breakdownElement = (b, isPopover = false) => {
    return (
      <div className="text-xs grid grid-cols-4 space-x-1 py-1">
        <label className="col-span-1 text-yellow-700">{b.invoiceNumber}</label>
        <span className="col-span-2 flex flex-col">
          {b.name}
          {b.code !== '' ? b.code !== b.name ? <sub>({b.code})</sub> : '' : ''}
        </span>
        <label className="col-span-1 text-right text-gray-900">
          {currencyFormatter(b.total)}
        </label>
      </div>
    );
  };

  const columns = [
    {
      dataField: 'row.client',
      text: 'Client',
      headerStyle: {
        minWidth: '300px',
        whiteSpace: 'normal',
        backgroundColor: '#fff',
        position: 'sticky',
        left: 0,
        zIndex: 1,
      },
      style: {
        whiteSpace: 'normal',
        backgroundColor: '#fff',
        position: 'sticky',
        left: 0,
        zIndex: 1,
      },
      formatter: (cell, row) => {
        return (
          <Link
            to={`/clients/profile/${row.row.agencyClientId}`}
            className="text-red-600"
          >
            {cell}
          </Link>
        );
      },
    },
    ...months.map((month) => {
      return {
        dataField: month,
        text: (
          <div class="flex flex-col space-y-1">
            <span>
              {month.split('-')[2] === 'mr' ? (
                <label className="bg-red-100 p-1 rounded-sm text-red-900">
                  {month.split('-').slice(0, 2).join('-')}
                </label>
              ) : (
                <label>&nbsp;</label>
              )}
            </span>
            <span>{month.split('-')[2]}</span>
          </div>
        ),
        classes: classNames(
          columnClasses,
          parseInt(month.split('-')[0]) % 2 === 1 ? 'bg-blue-50' : ''
        ),
        headerStyle: toggleBreakdown
          ? { minWidth: '320px' }
          : { minWidth: '90px' },
        formatter: (cell, row) => {
          const breakdown = row.breakdown?.filter((b) => b.type === month);

          return cell ? (
            <div className="relative">
              {toggleBreakdown ? (
                <div className="divide-y-2">
                  {breakdown.map((b) => {
                    return breakdownElement(b);
                  })}
                </div>
              ) : (
                <BsPopover title={currencyFormatter(cell)}>
                  <div className="absolute bg-gray-50 border p-2 rounded-lg w-80 divide-y-2 z-10">
                    {breakdown.map((b) => {
                      return breakdownElement(b);
                    })}
                  </div>
                </BsPopover>
              )}
            </div>
          ) : (
            '-'
          );
        },
      };
    }),
  ];

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = { ...params, page, pageSize: sizePerPage };
    delete newParams.sort;

    if (sortField && sortOrder) {
      newParams.sort = `${sortField}:${sortOrder}`;
    }

    setParams(newParams);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-8 mb-4">
        <Button
          loading={exporting}
          disabled={exporting}
          onClick={onExport}
          showLoading
        >
          {exporting ? 'Generating..please wait...' : 'Export CSV'}
        </Button>
        <div className="flex justify-between items-center space-x-2">
          <Toggle
            checked={toggleBreakdown}
            onChange={() => setToggleBreakdown(!toggleBreakdown)}
          />
          <Label>Toggle Breakdown Details</Label>
        </div>
      </div>

      <Table
        columns={columns}
        data={clients}
        loading={loading}
        onTableChange={onTableChange}
        params={params}
        keyField="agencyClientId"
      />
    </div>
  );
};

export default MonthlyRevenueBreakdown;
