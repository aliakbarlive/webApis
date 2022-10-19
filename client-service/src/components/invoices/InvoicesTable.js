import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
} from 'react-bootstrap-table2-paginator';
import { fetchInvoices } from 'features/admin/invoices/invoicesSlice';
import Loading from 'components/Loading';
import _ from 'lodash';

const InvoicesTable = ({ tableColumns, params }) => {
  const { invoices } = useSelector((state) => state.invoices);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [localParams, setLocalParams] = useState({
    page: 0,
    per_page: 0,
    sizePerPage: 10,
    subscriptionId: null,
    status: null,
  });

  useEffect(() => {
    let newParams = { ...localParams, ...params };
    setLocalParams(newParams);
  }, [params]);

  useEffect(() => {
    if (localParams.page > 0) {
      load();
    }
  }, [localParams]);

  const load = () => {
    setLoading(true);
    dispatch(fetchInvoices(localParams)).then(() => {
      setLoading(false);
    });
  };

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = { ...localParams, page };
    setLocalParams(newParams);
  };

  const options = {
    custom: true,
    page: localParams.page,
    totalSize: 0,
  };

  const handleNextPage =
    ({ page, onPageChange }) =>
    () => {
      if (invoices.has_more_page) {
        onPageChange(page + 1);
      }
    };

  const handlePrevPage =
    ({ page, onPageChange }) =>
    () => {
      if (page > 1) {
        onPageChange(page - 1);
      }
    };

  return (
    <PaginationProvider pagination={paginationFactory(options)}>
      {({ paginationProps, paginationTableProps }) => (
        <div className={loading ? 'loading-overlay' : ''}>
          <BootstrapTable
            remote
            bootstrap4
            hover
            striped
            bordered={false}
            keyField="invoice_id"
            wrapperClasses="table-responsive"
            data={invoices.rows ?? []}
            columns={tableColumns}
            {...paginationTableProps}
            onTableChange={onTableChange}
          />
          <div className="d-flex align-items-center">
            <div>
              <span className="text-muted">Page {paginationProps.page}</span>
            </div>

            <div className="btn-group ml-3" role="group">
              <button
                className="btn btn-link"
                onClick={handlePrevPage(paginationProps)}
                disabled={paginationProps.page <= 1}
              >
                &lt; Prev
              </button>

              <button
                className="btn btn-link"
                onClick={handleNextPage(paginationProps)}
                disabled={!invoices.has_more_page}
              >
                Next &gt;
              </button>
            </div>

            <div>{loading ? <Loading /> : ''}</div>
          </div>
        </div>
      )}
    </PaginationProvider>
  );
};
export default InvoicesTable;
