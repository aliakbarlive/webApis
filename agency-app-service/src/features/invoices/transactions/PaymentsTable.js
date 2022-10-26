import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ZohoTable from 'components/Table/ZohoTable';
import useQuery from 'hooks/useQuery';

const PaymentsTable = ({ history, tableColumns, params, setParams }) => {
  let query = useQuery();
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await axios
        .get(`/agency/invoicing/payments`, { params: params })
        .then((res) => {
          setPayments(res.data.data);
          setLoading(false);
        });
    };

    if (params.page > 0) {
      load();
    }
  }, [params]);

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <ZohoTable
            data={payments}
            keyField="payment_id"
            tableColumns={tableColumns}
            loading={loading}
            localParams={params}
            setLocalParams={setParams}
            history={history}
            currentUrlParams={query}
          />
        </div>
      </div>
    </div>
  );
};
export default PaymentsTable;
