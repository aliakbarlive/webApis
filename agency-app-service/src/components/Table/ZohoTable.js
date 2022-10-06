import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
} from 'react-bootstrap-table2-paginator';
import overlayFactory from 'react-bootstrap-table2-overlay';
import Loading from 'components/Loading';
import ZohoTablePagination from './ZohoTablePagination';

const ZohoTable = ({
  data,
  keyField,
  tableColumns,
  selectRow,
  loading,
  currentUrlParams,
  localParams,
  setLocalParams,
  history,
}) => {
  const options = {
    custom: true,
    page: localParams.page,
    sizePerPage: localParams.sizePerPage,
    totalSize: 0,
  };

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = { ...localParams, page, sizePerPage };
    setLocalParams(newParams);
    currentUrlParams.set('page', page);
    currentUrlParams.set('sizePerPage', sizePerPage);
    history.push(window.location.pathname + '?' + currentUrlParams.toString());
  };

  const handleSizePerPage = ({ page, onSizePerPageChange }, newSizePerPage) => {
    onSizePerPageChange(newSizePerPage, page);
  };

  const handleNextPage =
    ({ page, onPageChange }) =>
    () => {
      if (data.has_more_page) {
        onPageChange(parseInt(page) + 1);
      }
    };

  const handlePrevPage =
    ({ page, onPageChange }) =>
    () => {
      if (page > 1) {
        onPageChange(parseInt(page) - 1);
      }
    };

  return (
    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
      <PaginationProvider pagination={paginationFactory(options)}>
        {({ paginationProps, paginationTableProps }) => (
          <div>
            <BootstrapTable
              remote
              keyField={keyField}
              data={data.rows ?? []}
              columns={tableColumns}
              selectRow={selectRow}
              {...paginationTableProps}
              onTableChange={onTableChange}
              classes="min-w-full divide-y divide-gray-200"
              headerWrapperClasses="bg-gray-50"
              bodyClasses="bg-white divide-y divide-gray-200"
              loading={loading}
              overlay={overlayFactory({
                spinner: <Loading />,
                styles: {
                  overlay: (base) => ({
                    ...base,
                    background: 'rgba(255, 255, 255, 0.5)',
                  }),
                },
              })}
              noDataIndication={() => (
                <span className="text-center text-sm w-full block py-2 text-red-600">
                  No results found :(
                </span>
              )}
            />
            <ZohoTablePagination
              paginationProps={paginationProps}
              handleNextPage={handleNextPage}
              handlePrevPage={handlePrevPage}
              handleSizePerPage={handleSizePerPage}
              data={data}
            />
          </div>
        )}
      </PaginationProvider>
    </div>
  );
};
export default ZohoTable;
