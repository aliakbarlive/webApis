import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Badge,
  UncontrolledTooltip,
  Button,
} from 'reactstrap';

import { X, CheckSquare, Edit3 } from 'react-feather';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import {
  getConfigurationsAsync,
  selectConfigurationList,
} from './notificationSlice';

import ConfigurationModal from './ConfigurationModal';

const Configuration = () => {
  const dispatch = useDispatch();
  const configurations = useSelector(selectConfigurationList);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    'sort[createdAt]': 'DESC',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkCount, setBulkCount] = useState(0);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    fetchList();
  }, [params]);

  const fetchList = () => {
    dispatch(getConfigurationsAsync(params));
  };

  const resetSelection = () => {
    setSelectedConfig({});
    setSelectedIds([]);
    setBulkCount(0);
    fetchList();
  };

  const cellFormatter = (cell, row) =>
    cell ? (
      <CheckSquare className="text-muted" width="18" />
    ) : (
      <X className="text-muted" width="18" />
    );

  const tableColumns = [
    {
      dataField: 'listing.title',
      text: 'Product',
      sort: true,
      headerStyle: {
        width: '400px',
      },
      formatter: (cell, row) => {
        const { asin, title, listingImages } = row.listing;
        return (
          <Row className="align-items-center">
            <Col xs="2">
              <img
                src={listingImages[0].link}
                className="avatar-small rounded"
              />
            </Col>
            <Col xs="10">
              <div id={`product-title-tooltip-${asin}`} className="mb-1">
                <a href={`/products/${asin}`} target="_blank">
                  {title.length > 45 ? `${title.substr(0, 45)}...` : title}
                </a>
              </div>

              <div>
                <UncontrolledTooltip
                  placement="top"
                  target={`product-title-tooltip-${asin}`}
                >
                  {title}
                </UncontrolledTooltip>
                <Badge className="badge-soft-secondary">
                  <a
                    className="text-muted"
                    target="_blank"
                    href={`https://www.amazon.com/gp/product/${asin}`}
                  >
                    {asin}
                  </a>
                </Badge>
              </div>
            </Col>
          </Row>
        );
      },
    },
    {
      dataField: 'title',
      text: 'Title',
      formatter: cellFormatter,
    },
    {
      dataField: 'description',
      text: 'Description',
      formatter: cellFormatter,
    },
    {
      dataField: 'price',
      text: 'Price',
      formatter: cellFormatter,
    },
    {
      dataField: 'featureBullets',
      text: 'Feature Bullets',
      formatter: cellFormatter,
    },
    {
      dataField: 'listingImages',
      text: 'Images',
      formatter: cellFormatter,
    },
    {
      dataField: 'buyboxWinner',
      text: 'Buybox Winner',
      formatter: cellFormatter,
    },
    {
      dataField: 'categories',
      text: 'Categories',
      formatter: cellFormatter,
    },
    {
      dataField: 'reviews',
      text: 'Reviews',
      formatter: cellFormatter,
    },
    {
      dataField: 'listingAlertConfigurationId',
      text: 'Action',
      formatter: (cell, row) => (
        <Edit3 className="text-muted" width="18" onClick={() => onEdit(row)} />
      ),
    },
  ];

  const onEdit = (config) => {
    setSelectedConfig(config);
    toggleModal();
  };

  const onUpdateAll = () => {
    setBulkCount(configurations.count);
    setSelectedIds([]);
    setSelectedConfig('*');
    toggleModal();
  };

  const onUpdateSelected = () => {
    setBulkCount(selectedIds.length);
    setSelectedConfig(selectedIds);
    toggleModal();
  };

  const handleSelect = (row, isSelect) => {
    isSelect
      ? setSelectedIds([...selectedIds, row.listingAlertConfigurationId])
      : setSelectedIds(
          [...selectedIds].filter((id) => id != row.listingAlertConfigurationId)
        );
  };

  const handleSelectAll = (isSelect, rows) => {
    const sIds = rows.map((r) => r.listingAlertConfigurationId);
    isSelect
      ? setSelectedIds([
          ...selectedIds,
          ...sIds.filter((id) => !selectedIds.includes(id)),
        ])
      : setSelectedIds(selectedIds.filter((id) => !sIds.includes(id)));
  };

  const selectRow = {
    mode: 'checkbox',
    selected: selectedIds,
    onSelect: handleSelect,
    onSelectAll: handleSelectAll,
  };

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = { ...params, page, pageSize: sizePerPage };

    if (sortField) {
      Object.keys(newParams)
        .filter((key) => key.includes('sort'))
        .forEach((key) => {
          delete newParams[key];
        });

      newParams[`sort[${sortField}]`] = sortOrder;
    }

    setParams(newParams);
  };

  return (
    <Container fluid className="p-0">
      <ConfigurationModal
        isOpen={modalVisible}
        toggle={toggleModal}
        config={selectedConfig}
        onUpdate={resetSelection}
        count={bulkCount}
      />

      <Row>
        <Container fluid>
          <Card>
            <CardBody>
              <div className="mb-2">
                <Button
                  color="primary"
                  disabled={selectedIds.length == 0}
                  onClick={onUpdateSelected}
                >
                  {`Update ${selectedIds.length} Selected`}
                </Button>
                <Button color="primary" className="ml-2" onClick={onUpdateAll}>
                  Update All
                </Button>
              </div>
              <BootstrapTable
                remote
                bootstrap4
                bordered={false}
                keyField="listingAlertConfigurationId"
                data={configurations.rows ?? []}
                columns={tableColumns}
                pagination={paginationFactory({
                  sizePerPage: configurations.pageSize ?? 10,
                  sizePerPageList: [10, 25, 50, 100],
                  totalSize: configurations.count ?? 0,
                })}
                onTableChange={onTableChange}
                wrapperClasses="table-responsive"
                selectRow={selectRow}
                hover
                striped
              />
            </CardBody>
          </Card>
        </Container>
      </Row>
    </Container>
  );
};

export default Configuration;
