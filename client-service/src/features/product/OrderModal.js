import React from 'react';

import {
  Modal,
  ModalHeader,
  ModalBody,
  ListGroup,
  ListGroupItem,
  Badge,
  Table,
} from 'reactstrap';
import Moment from 'react-moment';

const OrderModal = ({ isOpen, toggle, order }) => {
  const {
    amazonOrderId,
    purchaseDate,
    orderStatus,
    salesChannel,
    shipServiceLevel,
    shipCity,
    shipState,
    shipPostalCode,
    shipCountry,
    itemPrice,
    itemTax,
    quantity,
    productName,
  } = order;

  const OrderStatus = (status) => {
    let className;
    if (status === 'Shipped') {
      className = 'badge-soft-success';
    } else if (status === 'Pending') {
      className = 'badge-soft-warning';
    } else if (status === 'Canceled') {
      className = 'badge-soft-secondary';
    }

    return <Badge className={className}>{status}</Badge>;
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md" centered>
      <ModalHeader toggle={toggle}>
        <h6 class="text-uppercase text-muted mb-2">Order Id</h6>
        <h3 class="mb-0">{amazonOrderId}</h3>
      </ModalHeader>
      <ModalBody>
        <h6 class="text-uppercase text-muted mb-3">Summary</h6>
        <ListGroup className="mb-4">
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            <span>Sales Channel</span>
            <span>{salesChannel}</span>
          </ListGroupItem>
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            <span>Status</span>
            <span>{OrderStatus(orderStatus)}</span>
          </ListGroupItem>
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            <span>Delivery Type</span>
            <span>{shipServiceLevel}</span>
          </ListGroupItem>
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            <span>Order Date</span>
            <span>
              <Moment format="lll">{purchaseDate}</Moment>
            </span>
          </ListGroupItem>
        </ListGroup>

        <>
          <h6 class="text-uppercase text-muted mb-3">Shipment</h6>
          <ListGroup className="mb-4">
            <ListGroupItem className="d-flex justify-content-between align-items-center">
              <span>City</span>
              <span>{shipCity}</span>
            </ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between align-items-center">
              <span>State</span>
              <span>{shipState}</span>
            </ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between align-items-center">
              <span>Postal Code</span>
              <span>{shipPostalCode}</span>
            </ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between align-items-center">
              <span>Country</span>
              <span>{shipCountry}</span>
            </ListGroupItem>
          </ListGroup>
        </>

        <h6 class="text-uppercase text-muted mb-3">Products</h6>
        <Table>
          <thead className="bg-light">
            <tr>
              <th>Products</th>
              <th>Status</th>
              <th>Quantity</th>
              <th>Tax</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">{productName}</th>
              <td> {OrderStatus(orderStatus)}</td>
              <td>{quantity}</td>
              <td>{itemTax}</td>
              <td>{itemPrice}</td>
            </tr>
            <tr>
              <th scope="row">
                <strong>Total:</strong>
              </th>
              <td></td>
              <td>
                <strong>{quantity}</strong>
              </td>
              <td>
                <strong>{itemTax}</strong>
              </td>
              <td>
                <strong>{itemPrice}</strong>
              </td>
            </tr>
          </tbody>
        </Table>
      </ModalBody>
    </Modal>
  );
};

export default OrderModal;
