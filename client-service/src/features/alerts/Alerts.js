import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { selectAlerts, getAlertsAsync } from './alertsSlice';

import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Spinner,
} from 'reactstrap';
import AlertModal from './AlertModal';

const Alerts = () => {
  const alerts = useSelector(selectAlerts);
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    dispatch(getAlertsAsync());
  }, []);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const onAlertClick = (alert) => {
    setAlert(alert);
    toggleModal();
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
          <a href={`https://www.amazon.com/dp/${asin}`}>{asin}</a>. Please
          review your listing to make sure you get the BuyBox back!
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

  return (
    <Container fluid className="p-0">
      {alert && (
        <AlertModal isOpen={modalVisible} toggle={toggleModal} alert={alert} />
      )}

      <Card className="bg-gradient">
        <CardBody>
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0 text-white">Alerts</h3>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          {alerts.length > 0 ? (
            <ListGroup>
              {alerts.map((alert) => (
                <ListGroupItem
                  tag="button"
                  action
                  onClick={() => onAlertClick(alert)}
                >
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
              ))}
            </ListGroup>
          ) : (
            <Spinner color="primary" className="d-flex mx-auto" />
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default Alerts;
