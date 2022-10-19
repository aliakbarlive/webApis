import React, { useState } from 'react';
import {
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { currencyFormatter, dateFormatter } from 'utils/formatters';
import classnames from 'classnames';
import InvoicesTable from 'components/invoices/InvoicesTable';
import { ChevronDown } from 'react-feather';
import { useSelector } from 'react-redux';

const Invoices = () => {
  const { paginationParams } = useSelector((state) => state.invoices);
  const [dropdownOpen, setDropdownOpen] = useState(false);    
  const [params, setParams] = useState({
    page:paginationParams.page,
    per_page: paginationParams.per_page,
    subscriptionId: null,
    status: paginationParams.status,
  });

  const toggle = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const updateStatus = (status) => {    
    let newParams = { ...params, status, page:1 };
    setParams(newParams);    
    toggle();
  };

  const invoiceStatuses = [
    'All',
    'Sent',
    'Draft',
    'OverDue',
    'Paid',
    'PartiallyPaid',
    'Void',
    'Unpaid',
  ];

  const tableColumns = [
    {
      dataField: 'invoice_date',
      text: 'Date',
      headerStyle: {
        width: '80px',
      },
      formatter: (cell, row) => {
        return <span>{dateFormatter(cell)}</span>;
      },
    },
    {
      dataField: 'invoice_id',
      text: 'Invoice #',
      headerStyle: {
        width: '130px',
      },
      formatter: (cell, row) => {
        return <Link to={`/invoices/${row.invoice_id}`}>{cell}</Link>;
      },
    },
    {
      dataField: 'customer_name',
      text: 'Customer Name',
      headerStyle: {
        width: '130px',
      },
    },
    {
      dataField: 'email',
      text: 'Email',
      headerStyle: {
        width: '180px',
      },
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: false,
      headerStyle: {
        width: '80px',
      },
      formatter: (cell, row) => {
        return (
          <span
            className={classnames('text-uppercase', {
              'text-success': cell === 'paid',
              'text-warning': cell === 'pending',
            })}
          >
            {cell}
          </span>
        );
      },
    },
    {
      dataField: 'due_date',
      text: 'Due Date',
      sort: false,
      headerStyle: {
        width: '150px',
      },
      formatter: (cell, row) => {
        return <span>{dateFormatter(cell)}</span>;
      },
    },
    {
      dataField: 'total',
      text: 'Amount',
      sort: false,
      headerStyle: {
        width: '150px',
      },
      formatter: (cell, row) => currencyFormatter(cell),
    },
  ];

  return (
    <Container fluid className="p-0">
      <Card className="bg-gradient">
        <CardBody>
          <Row className="align-items-center">
            <Col>
              <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle
                  tag="h3"
                  className="mb-0 text-white"
                  data-toggle="dropdown"
                  aria-expanded={dropdownOpen}
                >
                  {params.status} Invoices <ChevronDown size={16} />
                </DropdownToggle>
                <DropdownMenu className="mt-4 p-3">
                  {invoiceStatuses.map((invoiceStatus, index) => (
                    <div
                      onClick={() => updateStatus(invoiceStatus)}
                      key={index}
                    >
                      {invoiceStatus}
                    </div>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <InvoicesTable
            tableColumns={tableColumns}
            params={params}            
          />
        </CardBody>
      </Card>
    </Container>
  );
};
export default Invoices;
