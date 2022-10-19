import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { stateFormatter } from 'utils/formatters';

import { Container, Row, Col } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import SearchBar from 'components/filters/SearchBar';
import SelectFilter from 'components/filters/SelectFilter';

const NegativeTargets = ({ url, selectedDates }) => {
  const [negativeTargets, setNegativeTargets] = useState({});

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    ...selectedDates,
  });

  useEffect(() => {
    axios.get(url, { params }).then((res) => {
      setNegativeTargets(res.data.data);
    });
  }, [url, params]);

  const tableColumns = [
    {
      dataField: 'expressionText',
      text: 'Expression',
      sort: true,
    },
    {
      dataField: 'expressionType',
      text: 'Type',
      sort: true,
    },
    {
      dataField: 'state',
      text: 'Status',
      sort: true,
      formatter: (cell, row) => stateFormatter(cell),
    },
  ];

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = { ...params, page, pageSize: sizePerPage };

    Object.keys(newParams)
      .filter((key) => key.includes('sort'))
      .forEach((key) => {
        delete newParams[key];
      });

    if (sortField) {
      newParams[`sort[${sortField}]`] = sortOrder;
    }
    console.log(newParams);
    setParams(newParams);
  };

  return (
    <Container fluid className="p-0">
      <Row className="mb-2">
        <Col md="6">
          <SearchBar
            params={params}
            onApplyFilter={setParams}
            placeholder="Search keyword"
            name="keywordText"
          />
        </Col>
        <Col md="3">
          <SelectFilter
            name="expressionType"
            placeholder="All Type"
            onApplyFilter={setParams}
            params={params}
            options={[
              { value: 'auto', display: 'Auto' },
              { value: 'manual', display: 'Manual' },
            ]}
          ></SelectFilter>
        </Col>
        <Col md="3">
          <SelectFilter
            name="state"
            placeholder="All Status"
            onApplyFilter={setParams}
            params={params}
            options={[
              { value: 'enabled', display: 'Enabled' },
              { value: 'paused', display: 'Paused' },
              { value: 'archived', display: 'Archived' },
            ]}
          ></SelectFilter>
        </Col>
      </Row>

      <Row>
        <Container fluid>
          <BootstrapTable
            remote
            bootstrap4
            bordered={false}
            keyField="advNegativeTargetId"
            data={negativeTargets.rows ?? []}
            columns={tableColumns}
            pagination={paginationFactory({
              sizePerPage: negativeTargets.pageSize ?? 10,
              sizePerPageList: [10, 25, 50, 100],
              totalSize: negativeTargets.count ?? 0,
            })}
            noDataIndication="No data to display"
            onTableChange={onTableChange}
            wrapperClasses="table-responsive"
            hover
            striped
          />
        </Container>
      </Row>
    </Container>
  );
};

export default NegativeTargets;
