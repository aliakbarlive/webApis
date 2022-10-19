import React from 'react';

import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Card,
  CardBody,
} from 'reactstrap';
import Moment from 'react-moment';

const alertType = ({
  ProductTitleRecord,
  ProductDescriptionRecord,
  ProductBuyboxWinnerRecord,
  ProductCategoriesRecord,
  ProductFeatureBulletsRecord,
  ProductListingImagesRecord,
}) => {
  if (ProductTitleRecord !== null) {
    return ProductTitleRecord;
  } else if (ProductDescriptionRecord !== null) {
    return ProductDescriptionRecord;
  } else if (ProductBuyboxWinnerRecord !== null) {
    return ProductBuyboxWinnerRecord;
  } else if (ProductCategoriesRecord !== null) {
    return ProductCategoriesRecord;
  } else if (ProductFeatureBulletsRecord !== null) {
    return ProductFeatureBulletsRecord;
  } else if (ProductListingImagesRecord !== null) {
    return ProductListingImagesRecord;
  }
};

const getAlertTitle = ({
  ProductTitleRecord,
  ProductDescriptionRecord,
  ProductBuyboxWinnerRecord,
  ProductCategoriesRecord,
  ProductFeatureBulletsRecord,
  ProductListingImagesRecord,
}) => {
  if (ProductTitleRecord !== null) {
    return 'Title Changed';
  } else if (ProductDescriptionRecord !== null) {
    return 'Description Changed';
  } else if (ProductBuyboxWinnerRecord !== null) {
    return 'BuyBox Lost';
  } else if (ProductCategoriesRecord !== null) {
    return 'Categories Changed';
  } else if (ProductFeatureBulletsRecord !== null) {
    return 'Bullets Changed';
  } else if (ProductListingImagesRecord !== null) {
    return 'Image Changed';
  }
};

const getAlertDescription = ({
  ProductTitleRecord,
  ProductDescriptionRecord,
  ProductBuyboxWinnerRecord,
  ProductCategoriesRecord,
  ProductFeatureBulletsRecord,
  ProductListingImagesRecord,
  asin,
}) => {
  if (ProductTitleRecord !== null) {
    return (
      <span>
        Your title on listing{' '}
        <a href={`https://www.amazon.com/dp/${asin}`}>{asin}</a> has been
        changed. If this was you ignore this message, otherwise please review
        your listing!
      </span>
    );
  } else if (ProductDescriptionRecord !== null) {
    return (
      <span>
        Your description on listing{' '}
        <a href={`https://www.amazon.com/dp/${asin}`}>{asin}</a> has been
        changed. If this was you ignore this message, otherwise please review
        your listing!
      </span>
    );
  } else if (ProductBuyboxWinnerRecord !== null) {
    return (
      <span>
        Your lost the buy box on listing{' '}
        <a href={`https://www.amazon.com/dp/${asin}`}>{asin}</a>. Please review
        your listing to make sure you get the BuyBox back!
      </span>
    );
  } else if (ProductCategoriesRecord !== null) {
    return 'Categories Changed';
  } else if (ProductFeatureBulletsRecord !== null) {
    return (
      <span>
        Your bullet points on listing{' '}
        <a href={`https://www.amazon.com/dp/${asin}`}>{asin}</a> has been
        changed. If this was you ignore this message, otherwise please review
        your listing!
      </span>
    );
  } else if (ProductListingImagesRecord !== null) {
    return 'Image Changed';
  }
};

const AlertModal = ({ isOpen, toggle, alert }) => {
  console.log(alert);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md" centered>
      <ModalHeader toggle={toggle}>
        <h6 class="text-uppercase text-muted mb-2">Alert</h6>
      </ModalHeader>
      <ModalBody>
        <Row className="mb-4">
          <Col>
            <ListGroup>
              <ListGroupItem>
                <Row>
                  <Col xs="auto" className="d-flex align-items-center">
                    <img
                      src={alertType(alert).Product.listingImages[0].link}
                      className="avatar rounded"
                    />
                  </Col>
                  <Col>
                    <ListGroupItemHeading>
                      {getAlertTitle(alert)}
                    </ListGroupItemHeading>
                    <ListGroupItemText>
                      {getAlertDescription(alert)}
                    </ListGroupItemText>
                  </Col>
                </Row>
              </ListGroupItem>
            </ListGroup>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="shadow-none border">
              <CardBody>
                <h5 className="text-center mb-3">Before</h5>
                {!Array.isArray(alertType(alert).Product.before)
                  ? alertType(alert).Product.before
                  : alertType(alert).Product.before.map((item) => (
                      <li>{item}</li>
                    ))}
              </CardBody>
            </Card>
          </Col>
          <Col>
            <Card className="shadow-none border">
              <CardBody>
                <h5 className="text-center mb-3">After</h5>
                {!Array.isArray(alertType(alert).after)
                  ? alertType(alert).after
                  : alertType(alert).after.map((item) => <li>{item}</li>)}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default AlertModal;
