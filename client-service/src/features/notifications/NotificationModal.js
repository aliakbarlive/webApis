import React, { useState, useEffect } from 'react';

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
} from 'reactstrap';
import { startCase, camelCase } from 'lodash';
import axios from 'axios';

import ListingChanged from './details/listingChanged';
import ProductReview from './details/productReview';

const AlertModal = ({ isOpen, toggle, notification }) => {
  const [isResolved, setIsResolved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsResolved(!!notification.resolvedAt);
    }
  }, [notification]);

  if (notification) {
    let DetailsComponent = null;
    if (
      notification.type.includes('listing') &&
      notification.type.includes('Changed')
    ) {
      DetailsComponent = ListingChanged;
    }

    if (notification.type == 'ProductReview') {
      DetailsComponent = ProductReview;
    }

    const onClick = () => {
      setLoading(true);
      const action = isResolved ? 'unresolve' : 'resolve';
      axios
        .post(`/notifications/${notification.notificationId}/${action}`)
        .then(() => setIsResolved(!isResolved))
        .finally(() => setLoading(false));
    };

    return (
      <Modal isOpen={isOpen} toggle={toggle} size="md" centered>
        <ModalHeader tag="div" toggle={toggle}>
          <Row>
            <Col xs="auto" className="d-flex align-items-center">
              <img
                src={notification.data.thumbnail}
                className="avatar rounded"
              />
            </Col>
            <Col>
              <h4 className="text-primary">
                {startCase(camelCase(notification.type))}
              </h4>
              <h6 className="text-dark">{notification.title}</h6>
            </Col>
          </Row>
        </ModalHeader>
        <ModalBody>
          {DetailsComponent ? (
            <DetailsComponent notification={notification} />
          ) : (
            'Whoops!! Failed to render details.'
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onClick} disabled={loading}>
            {isResolved ? 'Unresolve' : 'Resolve'}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
  return '';
};

export default AlertModal;
