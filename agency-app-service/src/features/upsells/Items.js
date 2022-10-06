import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import LinesEllipsis from 'react-lines-ellipsis';
import { setCurrentPage } from './upsellsSlice';
import PageHeader from 'components/PageHeader';
import useQueryParams from 'hooks/useQueryParams';
import ItemsTable from './components/ItemsTable';
import usePermissions from 'hooks/usePermissions';
import { columnClasses, headerClasses } from 'utils/table';
import { currencyFormatter } from 'utils/formatters';

const Items = ({ tabs }) => {
  const dispatch = useDispatch();
  const { userCan } = usePermissions();

  const { params, updateParams } = useQueryParams({
    page: 1,
    sizePerPage: 50,
    status: 'ONETIME',
  });

  useEffect(() => {
    dispatch(setCurrentPage(`Upsell Items`));
  }, []);

  const tableColumns = [
    {
      dataField: 'name',
      text: 'Name',
      sort: false,
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '80px',
      },
    },
    {
      dataField: 'description',
      text: 'Description',
      sort: false,
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '200px',
        maxWidth: '400px',
      },
      formatter: (cell, row) => {
        return (
          <LinesEllipsis
            text={cell}
            maxLine="2"
            ellipsis="..."
            trimRight
            basedOn="letters"
          />
        );
      },
    },
    {
      dataField: 'addon_code',
      text: 'Code',
      sort: false,
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '30px',
      },
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: false,
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '30px',
      },
    },
    {
      dataField: 'price_brackets[0].price',
      text: 'Price',
      sort: false,
      headerClasses,
      classes: `${columnClasses} text-right`,
      headerStyle: {
        minWidth: '30px',
      },
      formatter: (cell, row) => {
        return <span>{currencyFormatter(cell)}</span>;
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="Upsell Items"
        containerClasses={''}
        tabs={tabs}
        left={
          <span className="text-xs text-yellow-500">
            items (addons) can be added in zoho admin
          </span>
        }
      />
      {userCan('upsells.items.list') ? (
        <ItemsTable
          tableColumns={tableColumns}
          params={params}
          setParams={updateParams}
        />
      ) : (
        <>
          <p className="mt-5">No permission to view the upsell items!</p>
        </>
      )}
    </>
  );
};

export default Items;
