import React from 'react';
import { useTranslation } from 'react-i18next';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
} from 'react-bootstrap-table2-paginator';
import overlayFactory from 'react-bootstrap-table2-overlay';
import { columnClasses, headerClasses } from 'utils/table';
import Pagination from './Table/Pagination';
import SortCaret from './Table/SortCaret';
import Loading from 'components/Loading';

const Table = ({
  columns,
  data,
  onTableChange,
  keyField,
  params,
  defaultSorted,
  loading,
  cellEdit,
  select,
  selectType = 'checkbox',
  expandRow,
  selectRow,
  noDataDisplay,
}) => {
  const { t } = useTranslation();
  const getColumns = () => {
    return columns.map((column) => ({
      headerClasses: column.headerClasses ?? headerClasses,
      classes: column.classes ?? columnClasses,
      ...(column.sort && { sortCaret: SortCaret }),
      ...column,
    }));
  };

  const tableProps = {
    remote: true,
    keyField,
    data: data && data.rows ? data.rows : [],
    columns: getColumns(),
    defaultSorted: defaultSorted,
    classes: 'min-w-full divide-y divide-gray-200',
    headerWrapperClasses: 'bg-gray-50',
    bodyClasses: 'bg-white divide-y divide-gray-200',
    wrapperClasses: 'overflow-x-auto',
    onTableChange,
    loading,
    cellEdit,
    expandRow,
    selectRow,
  };

  if (select) {
    tableProps.selectRow = {
      mode: selectType,
    };
  }

  return (
    <div className="flex flex-col">
      <div className="-my-2 sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg bg-white">
            <PaginationProvider
              pagination={paginationFactory({
                custom: true,
                page: params.page,
                sizePerPage: params.pageSize,
                sizePerPageList: [10, 30, 50, 100, 200],
                totalSize: data?.count ?? 0,
              })}
            >
              {({ paginationProps, paginationTableProps }) => (
                <>
                  <BootstrapTable
                    {...tableProps}
                    overlay={overlayFactory({
                      spinner: <Loading />,
                      styles: {
                        overlay: (base) => ({
                          ...base,
                          background: 'rgba(255, 255, 255, 0.5)',
                        }),
                      },
                    })}
                    noDataIndication={() => {
                      return (
                        <span className="my-4 text-sm block text-gray-500 text-center">
                          {noDataDisplay ?? t('Table.NoDataDisplay')}
                        </span>
                      );
                    }}
                    {...paginationTableProps}
                  />

                  <Pagination {...paginationProps}></Pagination>
                </>
              )}
            </PaginationProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
