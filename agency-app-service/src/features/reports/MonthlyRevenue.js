import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';

import { Table } from 'components';
import { currencyFormatter } from 'utils/formatters';
import { pick } from 'lodash';
import Button from 'components/Button';

const MonthlyRevenue = () => {
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [clients, setClients] = useState({ rows: [] });

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    startDate: '2021-09-01',
    endDate: moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
  });

  useEffect(() => {
    setLoading(true);
    let monthsArray = [];
    let dateRef = moment(params.startDate);

    while (dateRef.isSameOrBefore(moment(params.endDate).endOf('month'))) {
      monthsArray.push(dateRef.clone().format('MM-YYYY'));
      dateRef = dateRef.add(1, 'month').startOf('month');
    }

    setMonths(monthsArray);

    axios
      .get('/agency/reports/clients-monthly-sales', { params })
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
    const response = await axios.get(
      '/agency/reports/clients-monthly-sales/export',
      {
        params: pick(params, ['startDate', 'endDate']),
      }
    );

    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
      encoding: 'UTF-8',
    });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'monthly-revenue.csv';
    link.click();
    setExporting(false);
  };

  const columns = [
    {
      dataField: 'client',
      text: 'Client',
      headerStyle: { minWidth: '200px' },
    },
    {
      dataField: 'service',
      text: 'Service',
      headerStyle: { minWidth: '100px' },
    },
    {
      dataField: 'account',
      text: 'SP-API',
      headerStyle: { minWidth: '100px' },
      formatter: (cell) => (cell && cell.spApiAuthorized ? 'Yes' : 'No'),
    },
    {
      dataField: 'account',
      text: 'ADV-API',
      headerStyle: { minWidth: '100px' },
      formatter: (cell) => (cell && cell.advApiAuthorized ? 'Yes' : 'No'),
    },
    {
      dataField: 'account',
      text: 'Status',
      headerStyle: { minWidth: '100px' },
      formatter: (account) =>
        account && account.subscription
          ? account.subscription.status
          : 'Not-subscribed',
    },
    {
      dataField: 'account',
      text: 'activated At',
      headerStyle: { minWidth: '150px' },
      formatter: (account) =>
        account && account.subscription
          ? moment(account.subscription.activatedAt).format('YYYY-MM-DD')
          : 'N/A',
    },
    ...months.map((month) => {
      return {
        dataField: month,
        text: month,
        headerStyle: { minWidth: '100px' },
        formatter: (cell) => currencyFormatter(cell),
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
      <Button
        classes="mb-4"
        loading={exporting}
        disabled={exporting}
        onClick={onExport}
        showLoading
      >
        Export
      </Button>

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

export default MonthlyRevenue;
