import React from 'react';

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
    orderTotal,
    numberOfItemsShipped,
    numberOfItemsUnshipped,
    OrderAddresses,
    OrderItems,
  } = order;

  let address;
  if (OrderAddresses) {
    address = OrderAddresses[0];
  }

  let product;
  if (OrderItems) {
    product = OrderItems[0];
  }

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

        {address ? (
          <>
            <h6 class="text-uppercase text-muted mb-3">Shipment</h6>
            <ListGroup className="mb-4">
              <ListGroupItem className="d-flex justify-content-between align-items-center">
                <span>City</span>
                <span>{address ? address.city : null}</span>
              </ListGroupItem>
              <ListGroupItem className="d-flex justify-content-between align-items-center">
                <span>State</span>
                <span>{address ? address.stateOrRegion : null}</span>
              </ListGroupItem>
              <ListGroupItem className="d-flex justify-content-between align-items-center">
                <span>Postal Code</span>
                <span>{address ? address.postalCode : null}</span>
              </ListGroupItem>
              <ListGroupItem className="d-flex justify-content-between align-items-center">
                <span>Country</span>
                <span>{address ? address.countryCode : null}</span>
              </ListGroupItem>
            </ListGroup>
          </>
        ) : null}

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
              <th scope="row">{product ? product.title : null}</th>
              <td>
                {product && product.quantityShipped > 0
                  ? OrderStatus('Shipped')
                  : product &&
                    product.quantityShipped === 0 &&
                    orderStatus === 'Pending'
                  ? OrderStatus('Pending')
                  : OrderStatus('Canceled')}
              </td>
              <td>{product ? product.quantityOrdered : null}</td>
              <td>
                {product && product.itemTax !== null
                  ? product.itemTax.Amount
                  : product && product.itemTax === null
                  ? 0
                  : null}
              </td>
              <td>
                {product && Object.keys(product.itemPrice).length !== 0
                  ? product.itemPrice.Amount
                  : 0}
              </td>
            </tr>
            <tr>
              <th scope="row">
                <strong>Total:</strong>
              </th>
              <td></td>
              <td>
                <strong>{numberOfItemsShipped + numberOfItemsUnshipped}</strong>
              </td>
              <td>
                <strong>
                  {product && product.itemTax !== null
                    ? product.itemTax.Amount
                    : product && product.itemTax === null
                    ? 0
                    : null}
                </strong>
              </td>
              <td>
                <strong>
                  {product && Object.keys(product.itemPrice).length !== 0
                    ? product.itemPrice.Amount
                    : 0}
                </strong>
              </td>
            </tr>
          </tbody>
        </Table>
      </ModalBody>
      {/* <ModalFooter>
        <Button color="primary" onClick={toggle}>
          Do Something
        </Button>{' '}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter> */}
    </Modal>
  );
};

export default OrderModal;
