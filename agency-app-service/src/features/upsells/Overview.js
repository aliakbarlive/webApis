import { useEffect, useState } from 'react';
import axios from 'axios';
import classnames from 'classnames';
import { Table } from 'components';
import { Link } from 'react-router-dom';
import {
  setCurrentPage,
  setUpsellsPaginationParams,
  setSelectValue,
} from './upsellsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { dateFormatterUTC, nameFormatter } from 'utils/formatters';
import Badge from 'components/Badge';
import { ArrowSmRightIcon } from '@heroicons/react/outline';
import TabNav from 'components/TabNav';
import { capitalize, lowerCase } from 'lodash';

import SelectClient from 'components/SelectClient';
import PageHeader from 'components/PageHeader';
import usePermissions from 'hooks/usePermissions';
import useQueryParams from 'hooks/useQueryParams';
import UpsellDetailsSlideOver from './UpsellDetailsSlideOver';
import { PlusIcon } from '@heroicons/react/outline';
import Button from 'components/Button';
import ExpandRow from 'components/Table/ExpandRow';
import Label from 'components/Forms/Label';

const Overview = ({ tabs, client }) => {
  const dispatch = useDispatch();
  const { userCan } = usePermissions();
  const { selectValue: defaultValue, upsellsPaginationParams } = useSelector(
    (state) => state.upsells
  );
  const { params, updateParams, sortParam } = useQueryParams({
    ...upsellsPaginationParams,
    client: client ? client.agencyClientId : '',
  });
  const [loading, setLoading] = useState(false);
  const [upsells, setUpsells] = useState(null);
  const [clientReference, setClientReference] = useState(client);
  const [isOpenUpsellSlideOver, setIsOpenUpsellSlideOver] = useState(false);
  const [selectedUpsell, setSelectedUpsell] = useState({});

  const [navTabs, setNavTabs] = useState([
    //{ name: 'Draft', href: '#', count: '', current: false },
    { name: 'Pending', href: '#', count: '', current: true },
    { name: 'Approved', href: '#', count: '', current: false },
    { name: 'Rejected', href: '#', count: '', current: false },
  ]);

  const getUpsells = async () => {
    setLoading(true);
    await axios.get(`/agency/upsells`, { params }).then((res) => {
      dispatch(setUpsellsPaginationParams(params));
      setUpsells(res.data.data);
      let myTabs = [...navTabs];
      let currentTab = myTabs.find((t) => t.current === true);
      currentTab.current = false;
      let selectedTab = myTabs.find(
        (t) => t.name === capitalize(params.status)
      );
      if (selectedTab) {
        selectedTab.current = true;
        //selectedTab.count = res.data.data.count;
      }

      setNavTabs(myTabs);
    });
    setLoading(false);
  };

  useEffect(() => {
    dispatch(setCurrentPage(`Upsells`));
  }, []);

  useEffect(() => {
    async function getData() {
      await getUpsells();
    }

    if (!loading) {
      getData();
    }
  }, [params]);

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
                  to={`/clients/profile/${row.agencyClientId}`}
                  className="text-red-600"
                >
                  {row.agencyClient?.client}
                </Link>
              );
            },
          },
        ]
      : []),
    {
      dataField: 'requestedBy',
      text: 'Requested By',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      formatter: (cell, row) => {
        return (
          <span className="font-normal">
            {nameFormatter(row.requestedByUser)}
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
              gray: cell === 'draft',
              yellow: cell === 'pending',
              green: cell === 'approved',
              red: cell === 'rejected',
            })}
            classes="uppercase"
            rounded="md"
          >
            {cell}
          </Badge>
        );
      },
    },
    {
      dataField: 'createdAt',
      text: 'Created',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      formatter: (cell, row) => {
        return <span className="font-normal">{dateFormatterUTC(cell)}</span>;
      },
    },
    ...(params.status === 'approved'
      ? [
          {
            dataField: 'invoiceNumber',
            text: 'Invoice #',
            sort: false,
            headerStyle: {
              minWidth: '80px',
            },
            formatter: (cell, row) => {
              return userCan('upsells.invoice.view') ? (
                <Link
                  to={`/invoices/${row.invoiceId}`}
                  className="text-red-600"
                >
                  {cell}
                </Link>
              ) : (
                cell
              );
            },
          },
          {
            dataField: 'invoiceStatus',
            text: 'Invoice Status',
            sort: false,
            headerStyle: {
              minWidth: '80px',
            },
            formatter: (cell, row) => {
              return (
                <Badge
                  color={classnames({
                    green: cell === 'paid',
                    yellow: cell === 'pending',
                    red: cell === 'overdue',
                    blue: cell === 'sent',
                    gray: cell === 'void',
                  })}
                  classes="uppercase mr-2 my-1"
                  rounded="md"
                >
                  {cell}
                </Badge>
              );
            },
          },
        ]
      : []),
    ...(userCan('upsells.view')
      ? [
          {
            dataField: 'expand',
            text: 'Details',
            sort: false,
            headerStyle: {
              minWidth: '80px',
            },
            formatter: (cell, row) => {
              return (
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => showUpsellDetails(row)}
                >
                  <ArrowSmRightIcon className="transform -rotate-45 w-5 h-5 inline" />
                </button>
              );
            },
          },
        ]
      : []),
    ,
  ];

  const showUpsellDetails = async (row) => {
    if (
      !clientReference ||
      (clientReference && clientReference.agencyClientId !== row.agencyClientId)
    ) {
      const response = await axios.get(`/agency/client/${row.agencyClientId}`);
      setClientReference(response.data.data);
    }

    setSelectedUpsell(row);
    setIsOpenUpsellSlideOver(true);
  };

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    updateParams({
      page,
      pageSize: sizePerPage,
      sort: `${sortField}:${sortOrder}`,
    });
  };

  const onClientFilter = (e) => {
    dispatch(setSelectValue(e));
    updateParams({
      client: e ? e.value : '',
    });
  };

  const addUpsell = () => {
    setSelectedUpsell(null);
    setIsOpenUpsellSlideOver(true);
  };

  const renderer = (row) => {
    return row.details.length > 0 ? (
      <div className="bg-gray-50  divide-y divide-gray-200">
        {row.details.map((detail) => {
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
        title={client ? '' : 'Upsells'}
        tabs={tabs}
        containerClasses={''}
        left={
          client &&
          userCan('upsells.create') && (
            <Button classes={'mb-2'} onClick={addUpsell}>
              <PlusIcon className="h-4 w-4" /> Add Upsell
            </Button>
          )
        }
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
            status: lowerCase(e.target.value),
          })
        }
        onClick={(tab) =>
          updateParams({
            status: lowerCase(tab.name),
          })
        }
      />
      <Table
        columns={tableColumns}
        data={upsells}
        onTableChange={onTableChange}
        params={params}
        keyField="upsellId"
        defaultSorted={[
          {
            dataField: sortParam ? sortParam[0] : 'createdAt',
            order: sortParam ? sortParam[1] : 'asc',
          },
        ]}
        loading={loading}
        expandRow={ExpandRow({
          renderer,
          hideHeaderColumn: true,
          onlyOneExpanding: false,
        })}
      />
      <UpsellDetailsSlideOver
        open={isOpenUpsellSlideOver}
        setOpen={setIsOpenUpsellSlideOver}
        client={clientReference}
        upsell={selectedUpsell}
        getUpsells={getUpsells}
      />
    </>
  );
};

export default Overview;
