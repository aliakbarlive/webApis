import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
} from 'react-bootstrap-table2-paginator';
import Pagination from './Pagination';
import SortCaret from './SortCaret';
import { headerClasses, columnClasses } from 'utils/table';

const Table = ({
  keyField,
  columns,
  data,
  onTableChange,
  page,
  pageSize,
  select,
  selectType = 'checkbox',
  expandRow,
}) => {
  const getColumns = () => {
    return columns.map((column) =>
      column.sort
        ? {
            headerClasses: headerClasses,
            classes: columnClasses,
            sortCaret: SortCaret,
            ...column,
          }
        : { headerClasses: headerClasses, classes: columnClasses, ...column }
    );
  };

  const noDataIndication = () => (
    <span className="my-4 text-sm block text-gray-500 text-center">
      No data to display
    </span>
  );

  const tableProps = {
    remote: true,
    keyField,
    data: data && data.rows ? data.rows : [],
    columns: getColumns(),
    classes: 'min-w-full divide-y divide-gray-200',
    wrapperClasses: 'overflow-x-auto',
    headerWrapperClasses: 'bg-gray-50',
    bodyClasses: 'bg-white divide-y divide-gray-200',
    noDataIndication,
    onTableChange,
    expandRow,
  };

  if (select) {
    tableProps.selectRow = {
      mode: selectType,
    };
  }

  return (
    <div className="-my-2 sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg bg-white">
          <PaginationProvider
            pagination={paginationFactory({
              custom: true,
              page,
              sizePerPage: pageSize,
              totalSize: data.count,
            })}
          >
            {({ paginationProps, paginationTableProps }) => (
              <>
                <BootstrapTable {...paginationTableProps} {...tableProps} />
                <Pagination {...paginationProps} />
              </>
            )}
          </PaginationProvider>
        </div>
      </div>
    </div>
  );
};

export default Table;
