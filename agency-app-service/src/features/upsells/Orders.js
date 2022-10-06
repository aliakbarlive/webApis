import { useEffect, useState } from 'react';
import axios from 'axios';
import classnames from 'classnames';
import PageHeader from 'components/PageHeader';
import useQueryParams from 'hooks/useQueryParams';
import TabNav from 'components/TabNav';
import { capitalize, lowerCase, toLower } from 'lodash';
import SelectClient from 'components/SelectClient';
import { setOrdersPaginationParams, setSelectValue } from './upsellsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'components';
import { dateFormatterUTC, nameFormatter } from 'utils/formatters';
import { ArrowSmRightIcon } from '@heroicons/react/outline';
import Badge from 'components/Badge';
import usePermissions from 'hooks/usePermissions';
import { Link } from 'react-router-dom';
import Label from 'components/Forms/Label';
import ExpandRow from 'components/Table/ExpandRow';

const Orders = ({ tabs, client }) => {
  const dispatch = useDispatch();
  const { userCan } = usePermissions();
  const { ordersPaginationParams } = useSelector((state) => state.upsells);
  const { params, updateParams, sortParam } = useQueryParams({
    ...ordersPaginationParams,
    client: client ? { client: client.agencyClientId } : '',
  });

  const [loading, setLoading] = useState(false);
  const { selectValue: defaultValue } = useSelector((state) => state.upsells);
  const [upsellOrders, setUpsellOrders] = useState(null);

  const [navTabs, setNavTabs] = useState([
    { name: 'Pending', href: '#', count: '', current: true },
    { name: 'In-progress', href: '#', count: '', current: false },
    { name: 'Completed', href: '#', count: '', current: false },
  ]);

  const tableColumns = [
    ...(!client
      ? [
          {
            dataField: 'agencyClientId',
            text: 'Client',
            sort: true,
            headerStyle: {
              minWidth: '180px',
            },
            formatter: (cell, row) => {
              return (
                <Link
                  to={`/clients/profile/${row.upsell.agencyClientId}`}
                  className="text-red-600"
                >
                  {row.upsell.agencyClient?.client}
                </Link>
              );
            },
          },
        ]
      : []),
    {
      dataField: 'createdAt',
      text: 'Created',
      sort: true,
      headerStyle: {
        minWidth: '80px',
      },
      formatter: (cell, row) => {
        return <span className="font-normal">{dateFormatterUTC(cell)}</span>;
      },
    },
    {
      dataField: 'assignedTo',
      text: 'Assigned To',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      formatter: (cell, row) => {
        return (
          <span className="font-normal">
            {nameFormatter(row.assignedToUser)}
          </span>
        );
      },
    },
    {
      dataField: 'eta',
      text: 'ETA',
      sort: true,
      headerStyle: {
        minWidth: '80px',
      },
      formatter: (cell, row) => {
        return (
          <span className="font-normal">
            {cell ? dateFormatterUTC(cell) : ''}
          </span>
        );
      },
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: false,
      headerStyle: {
        minWidth: '180px',
      },
      formatter: (cell, row) => {
        return (
          <Badge
            color={classnames({
              yellow: cell === 'pending',
              green: cell === 'completed',
              blue: cell === 'in-progress',
            })}
            classes="uppercase"
            rounded="md"
          >
            {cell}
          </Badge>
        );
      },
    },
    ...(userCan('upsells.orders.view')
      ? [
          {
            dataField: 'expand',
            text: 'Details',
            sort: false,
            headerStyle: {
              minWidth: '80px',
            },
            formatter: (cell, row) => {
              const prefixUrl = client
                ? `/clients/profile/${row.upsell.agencyClientId}`
                : '';

              return (
                <Link
                  to={`${prefixUrl}/upsells/orders/details/${row.upsellOrderId}`}
                  className="text-red-600"
                >
                  <ArrowSmRightIcon className="transform -rotate-45 w-5 h-5 inline" />
                </Link>
              );
            },
          },
        ]
      : []),
    ,
  ];

  const getUpsellOrders = async () => {
    setLoading(true);
    await axios.get(`/agency/upsells/order`, { params }).then((res) => {
      dispatch(setOrdersPaginationParams(params));
      setUpsellOrders(res.data.data);
      let myTabs = [...navTabs];
      let currentTab = myTabs.find((t) => t.current === true);
      currentTab.current = false;
      let selectedTab = myTabs.find(
        (t) => t.name === capitalize(params.status)
      );
      selectedTab.current = true;
      setNavTabs(myTabs);
    });
    setLoading(false);
  };

  useEffect(() => {
    async function getData() {
      await getUpsellOrders();
    }

    if (!loading) {
      getData();
    }
  }, [params]);

  const onClientFilter = (e) => {
    dispatch(setSelectValue(e));
    updateParams({
      client: e ? e.value : '',
    });
  };

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    updateParams({
      page,
      pageSize: sizePerPage,
      sort: `${sortField}:${sortOrder}`,
    });
  };

  const renderer = (row) => {
    return row.upsell.details.length > 0 ? (
      <div className="bg-gray-50  divide-y divide-gray-200">
        {row.upsell.details.map((detail) => {
          return (
            <div className="px-6 py-1 text-sm">
              <Label classes="ml-1 pr-1" textSize="xs">
                Item:
              </Label>
              <Badge color="yellow" rounded="md">
                {detail.name}
                <span className="ml-1 text-gray-700">x{detail.qty}</span>
              </Badge>
              <span className="ml-2 text-xs">{detail.description}</span>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="bg-gray-50 text-sm px-6 py-1 text-gray-400">
        No details
      </div>
    );
  };

  return (
    <>
      <PageHeader
        title={client ? '' : 'Upsell Orders'}
        tabs={tabs}
        containerClasses={''}
      />
      {!client && (
        <div className="sm:grid sm:grid-cols-3 gap-4 mt-4 items-center">
          <div className="sm:col-span-1 text-sm">
            <SelectClient
              onChange={onClientFilter}
              defaultValue={defaultValue}
            />
          </div>
        </div>
      )}
      <TabNav
        tabs={navTabs}
        setTabs={setNavTabs}
        onSelectChange={(e) =>
          updateParams({
            status: toLower(e.target.value),
          })
        }
        onClick={(tab) => {
          updateParams({
            status: toLower(tab.name),
          });
        }}
      />
      <Table
        columns={tableColumns}
        data={upsellOrders}
        onTableChange={onTableChange}
        params={params}
        keyField="upsellOrderId"
        defaultSorted={[{ dataField: sortParam[0], order: sortParam[1] }]}
        loading={loading}
        expandRow={ExpandRow({
          renderer,
          hideHeaderColumn: true,
          onlyOneExpanding: false,
        })}
      />
    </>
  );
};

export default Orders;
