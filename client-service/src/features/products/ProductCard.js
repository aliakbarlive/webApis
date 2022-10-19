import React from 'react';

import { Link } from 'react-router-dom';

import { Col, Row, Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';
import { Check, X } from 'react-feather';

const ProductCard = ({ product }) => {
  const { title, asin, sellerSku, listingImages, price } = product;

  return (
    <Col xl="4" md="6">
      <Card className="product-card py-2">
        <CardBody>
          <Row className="align-items-center">
            <Col xs="auto">
              <img
                src={listingImages[0].link}
                className="avatar-small rounded"
              />
            </Col>
            <Col className="text-overflow">
              <Link className="text-primary mb-2 h5" to={`/products/${asin}`}>
                {title}
              </Link>
              <p className="text-muted">ASIN: {asin}</p>
            </Col>
          </Row>

          <hr />

          <Row className="align-items-center text-center">
            <Col>
              <h6 className="text-muted text-uppercase">Sales</h6>
              <h4>$xx,xxx.xx</h4>
            </Col>
            <Col>
              <h6 className="text-muted text-uppercase">Net Profit</h6>
              <h4>$xx,xxx.xx</h4>
            </Col>
          </Row>

          <hr className="mb-0" />

          <Row>
            <Col>
              <ListGroup flush>
                <ListGroupItem className="d-flex justify-content-between">
                  <span>Orders / Units</span>
                  <span>xxx / xxx</span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between">
                  <span>Advertising Orders</span>
                  <span>xxx</span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between">
                  <span>Promo / Coupons</span>
                  <span>xxx / xxx</span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between">
                  <span>Refunds</span>
                  <span>xxx</span>
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </CardBody>
        {/* <a href="#">
          <CardImg
            top
            className="px-3"
            src={listingImages[0].link}
            alt="Card image cap"
          />
        </a>
        <CardHeader className="px-4 pt-1">
          <CardTitle tag="h5" className="mb-1">
            <a href="#" className="product-title">
              {title}
            </a>
          </CardTitle>

          {/* <CardTitle tag="p" className="mb-2 product-category">
            {category}
          </CardTitle> */}

        {/* <CardTitle tag="p" className="mb-0 product-price">
            ${price}
          </CardTitle>
        </CardHeader>{' '}
        */}
        {/* <CardBody className="px-4 pt-0"> */}
        {/* <ul className="product-summary pl-0">
            <li>
              {shippable ? (
                <>
                  <Check color="#7dbf42" size="18" /> Available to ship
                </>
              ) : (
                <>
                  <X color="#a3b1bd" size="18" /> Sold out
                </>
              )}
            </li>
            <li>
              {nearbyStores ? (
                <>
                  <Check color="#7dbf42" size="18" /> Available at nearby stores
                </>
              ) : (
                <>
                  <X color="#a3b1bd" size="18" /> Not available at nearby stores
                </>
              )}
            </li>
          </ul> */}

        {/* <Button block>Save</Button> */}
        {/* </CardBody> */}
      </Card>
    </Col>
  );
};

export default ProductCard;
