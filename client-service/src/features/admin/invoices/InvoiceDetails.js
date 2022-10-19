import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchInvoice } from './invoicesSlice';
import { Row, Col, Container } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import classnames from 'classnames';

const InvoiceDetails = ({ history }) => {
  const { invoice } = useSelector((state) => state.invoices);
  const { invoiceId } = useParams();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const tableColumns = [
    {
      dataField: 'description',
      text: 'Item & Description',
      headerClasses: 'bg-dark text-white py-1',
      headerStyle: {
        width: '100px',
      },
      formatter: (cell, row) => {
        return (
          <div>
            <span className="font-weight-bold">{row.name}</span>
            <p className="text-muted mb-0">{row.description}</p>
          </div>
        );
      },
    },
    {
      dataField: 'quantity',
      text: 'Qty',
      headerClasses: 'bg-dark text-white text-right py-1',
      headerStyle: {
        width: '20px',
      },
      classes: 'text-right',
    },
    {
      dataField: 'price',
      text: 'Rate',
      headerClasses: 'bg-dark text-white text-right py-1',
      headerStyle: {
        width: '20px',
      },
      classes: 'text-right',
    },
    {
      dataField: 'item_total',
      text: 'Total',
      headerClasses: 'bg-dark text-white text-right py-1',
      headerStyle: {
        width: '20px',
      },
      classes: 'text-right',
    },
  ];

  useEffect(() => {
    setLoading(true);
    dispatch(fetchInvoice(invoiceId)).then(() => {
      setLoading(false);
    });
  }, [invoiceId]);

  return invoice ? (
    <Container fluid className="p-0">
      <div className="container invoice-layout bg-white shadow-sm mx-auto my-0 p-4 position-relative">
        <div className="ribbon">
          <div
            className={classnames('ribbon-inner', {
              'alert-success': invoice.status === 'paid',
              'alert-warning': invoice.status === 'pending',
              'alert-danger': invoice.status === 'overdue',
            })}
          >
            <span>{invoice.status}</span>
          </div>
        </div>
        <Row className="py-3">
          <Col lg={6} className="align-self-end">
            Bill To
            <p className="mb-0 text-primary">{invoice.customer_name}</p>
          </Col>
          <Col lg={6} className="text-right">
            <Row className="mb-2">
              <Col xs={12}>
                <h4>{invoice.invoice_number}</h4>
              </Col>
            </Row>
            <Row className="py-1">
              <Col lg={8}>Invoice Date:</Col>
              <Col lg={4}>{invoice.invoice_date}</Col>
            </Row>
            <Row className="py-1">
              <Col lg={8}>Due Date:</Col>
              <Col lg={4}>{invoice.due_date}</Col>
            </Row>
            <Row className="py-1">
              <Col lg={8}>Reference #:</Col>
              <Col lg={4} style={{ fontSize: '10px' }}>
                {invoice.reference_id}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <BootstrapTable
              bootstrap4
              hover
              bordered={false}
              keyField="item_id"
              wrapperClasses="table-responsive border-bottom"
              classes="mb-0"
              data={invoice.invoice_items ?? []}
              columns={tableColumns}
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col lg={6}>&nbsp;</Col>
          <Col lg={6} className="text-right">
            <Row className="py-2 my-1">
              <Col lg={8}>Sub Total</Col>
              <Col lg={4}>{invoice.sub_total}</Col>
            </Row>
            <Row className="py-2 my-1 font-weight-bold">
              <Col lg={8}>Total</Col>
              <Col lg={4}>
                {invoice.currency_symbol}
                {invoice.total}
              </Col>
            </Row>
            <Row className="py-2 my-1 font-weight-bold bg-light">
              <Col lg={8}>Balance Due</Col>
              <Col lg={4}>
                {invoice.currency_symbol}
                {invoice.balance}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Container>
  ) : (
    ''
  );
};
export default InvoiceDetails;
