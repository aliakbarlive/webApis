import React, { useState, useEffect } from 'react';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import { Badge } from 'reactstrap';

import { useDispatch, useSelector } from 'react-redux';
import { selectShipment, getShipmentsAsync, getSku } from './shipmentSlice';
import SearchBar from './SearchBar';

const InboundShipments = () => {
  const result = useSelector(selectShipment);
  const sku = useSelector(getSku);

  const { data: shipments, total } = result;

  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('inboundFBAShipmentName');
  const [sortOrder, setSortOrder] = useState('asc');

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    setSortField(sortField);
    setSortOrder(sortOrder);
    setPageSize(sizePerPage);
    setPage(page);
  };

  useEffect(() => {
    dispatch(
      getShipmentsAsync({
        sku,
        page,
        pageSize,
        searchTerm,
        sortField,
        sortOrder,
      })
    );
  }, [sku, page, pageSize, searchTerm, sortField, sortOrder]);

  const statusFormatter = (cell, row) => {
    let className;
    if (cell === 'CLOSED') {
      className = 'badge-soft-success';
    } else if (cell === 'WORKING') {
      className = 'badge-soft-secondary';
    }

    return <Badge className={className}>{cell}</Badge>;
  };

  const onSearch = (e) => {
    setSearchTerm(e.target.value);

    if (page !== 1) {
      setPage(1);
    }
  };

  const tableColumns = [
    {
      dataField: 'inboundFBAShipmentName',
      text: 'Name',
      sort: true,
      headerStyle: {
        width: '400px',
      },
    },
    {
      dataField: 'ShipmentItem.quantityShipped',
      text: 'Shipped',
      headerStyle: {
        width: '150px',
      },
      sort: false,
    },
    {
      dataField: 'ShipmentItem.quantityReceived',
      text: 'Received',
      headerStyle: {
        width: '150px',
      },
      sort: false,
    },
    {
      dataField: 'ShipmentItem.quantityInCase',
      text: 'In Case',
      headerStyle: {
        width: '150px',
      },
      sort: false,
    },
    {
      dataField: 'inboundFBAShipmentStatus',
      text: 'Status',
      sort: true,
      formatter: statusFormatter,
    },
    {
      dataField: 'destinationFulfillmentCenterId',
      text: 'Fulfill',
      sort: true,
    },
    {
      dataField: 'inboundFBAShipmentId',
      text: 'Shipment Id',
      sort: true,
    },
  ];

  const defaultSorted = [
    {
      dataField: 'inboundFBAShipmentName',
      order: 'asc',
    },
  ];

  return (
    <>
      <SearchBar onSearch={onSearch} />
      {shipments && (
        <BootstrapTable
          remote
          bootstrap4
          wrapperClasses="table-responsive"
          hover
          striped
          bordered={false}
          keyField="shipmentId"
          data={shipments}
          columns={tableColumns}
          pagination={paginationFactory({
            page,
            sizePerPage: pageSize,
            totalSize: total,
          })}
          defaultSorted={defaultSorted}
          onTableChange={onTableChange}
        />
      )}
    </>
  );
};

export default InboundShipments;
