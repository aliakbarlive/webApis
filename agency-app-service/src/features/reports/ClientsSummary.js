import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';

import { Table } from 'components';
import { currencyFormatter, dateFormatter } from 'utils/formatters';
import { pick } from 'lodash';
import Button from 'components/Button';

const ClientsSummary = () => {
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [clients, setClients] = useState({ rows: [] });

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get('/agency/reports/clients-summary', { params })
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
    const response = await axios.get('/agency/reports/clients-summary/export', {
      params: pick(params, ['startDate', 'endDate']),
    });

    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
      encoding: 'UTF-8',
    });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'clients-summary.csv';
    link.click();
    setExporting(false);
  };

  const columns = [
    {
      dataField: 'contractSigned',
      text: 'contract signed',
      headerStyle: { minWidth: '100px' },
      formatter: (cell) => (cell ? dateFormatter(cell) : '-'),
    },
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
      dataField: 'accountStatus',
      text: 'Account Status',
      headerStyle: { minWidth: '100px' },
    },
    {
      dataField: 'status',
      text: 'Status',
      headerStyle: { minWidth: '100px' },
    },
    {
      dataField: 'subscription',
      text: 'subscription',
      headerStyle: { minWidth: '100px' },
    },
    {
      dataField: 'activatedAt',
      text: 'activated At',
      headerStyle: { minWidth: '150px' },
      formatter: (cell) => (cell ? dateFormatter(cell) : '-'),
    },
    {
      dataField: 'createdAt',
      text: 'created At',
      headerStyle: { minWidth: '150px' },
      formatter: (cell) => (cell ? dateFormatter(cell) : '-'),
    },
    {
      dataField: 'isOffline',
      text: 'offline',
      headerStyle: { minWidth: '100px' },
    },
    {
      dataField: 'spApi',
      text: 'SP-API',
      headerStyle: { minWidth: '100px' },
    },
    {
      dataField: 'advApi',
      text: 'ADV-API',
      headerStyle: { minWidth: '100px' },
    },
    {
      dataField: 'defaultMarketplace',
      text: 'default Marketplace',
      headerStyle: { minWidth: '100px' },
    },
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

export default ClientsSummary;
