import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ZohoTable from 'components/Table/ZohoTable';

const InvoicesTable = ({ history, tableColumns, params, accountId }) => {
  let currentUrlParams = new URLSearchParams(window.location.search);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localParams, setLocalParams] = useState({
    page: currentUrlParams.get('page') ?? params.page,
    sizePerPage: currentUrlParams.get('sizePerPage') ?? params.sizePerPage,
    subscriptionId: null,
    status: null,
  });

  useEffect(() => {
    if (localParams.page > 0) {
      setLoading(true);
      axios
        .get(`/accounts/${accountId}/invoices`, { params: localParams })
        .then((res) => {
          setInvoices(res.data.data);
          setLoading(false);
        });
    }
  }, [accountId, params, localParams]);

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <ZohoTable
            data={invoices}
            keyField="invoice_id"
            tableColumns={tableColumns}
            loading={loading}
            localParams={localParams}
            setLocalParams={setLocalParams}
            history={history}
            currentUrlParams={currentUrlParams}
          />
        </div>
      </div>
    </div>
  );
};
export default InvoicesTable;
