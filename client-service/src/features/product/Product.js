import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';
import Moment from 'react-moment';
import moment from 'moment';

import {
  Container,
  Row,
  Col,
  Table,
  TabContent,
  TabPane,
  Nav,
  NavLink,
  NavItem,
  Card,
  CardBody,
  Spinner,
} from 'reactstrap';

import Header from './Header';
import MapChart from './MapChart';
import ReactTooltip from 'react-tooltip';
import {
  setRange,
  selectCurrentDateRange,
} from '../../components/datePicker/dateSlice';

import './styles.css';

import { useDispatch, useSelector } from 'react-redux';
import { selectProduct, getProductAsync } from './productSlice';
import { setSku } from './shipmentSlice';

import Orders from './Orders';
import Profit from './components/Profit';
import InboundShipments from './InboundShipments';
import Keywords from './Keywords';

const Product = () => {
  let totalOrders = 0;
  const [content, setContent] = useState('');
  const { asin } = useParams();
  const dispatch = useDispatch();
  const selectedDates = useSelector(selectCurrentDateRange);

  const res = useSelector(selectProduct);
  let product = {};
  let states = {};

  if (!(Object.entries(res).length === 0)) {
    product = res.product;
    states = res.states;
    totalOrders = 0;
    if (states != null) {
      for (let i = 0; i < states.length; i++) {
        totalOrders += parseInt(states[i].stateCount);
      }
    }
  }

  useEffect(() => {
    dispatch(getProductAsync(asin, selectedDates));

    if ('sellerSku' in product) dispatch(setSku(product.sellerSku));
  }, [asin, selectedDates]);

  const [activeTab, setActiveTab] = useState('1');

  let pTitle = '';
  let pListingImages = [];
  if (product) {
    const { title, listingImages } = product;
    pTitle = title;
    pListingImages = listingImages;
  }

  return (
    <>
      <Container fluid className="p-0">
        <Header title="Product" />
        <Card>
          <CardBody>
            {pListingImages && pTitle && product.asin ? (
              <Row className="align-items-center">
                <Col xs="auto">
                  <img
                    src={pListingImages && pListingImages[0].link}
                    className="avatar-large rounded"
                  />
                </Col>
                <Col>
                  <h3 className="text-primary mb-2">{pTitle}</h3>
                  <p className="text-muted">ASIN: {product.asin}</p>
                </Col>
              </Row>
            ) : (
              <Spinner color="primary" className="d-flex mx-auto" />
            )}
          </CardBody>
        </Card>

        <div className="tab">
          <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === '1' && 'active'}
                onClick={() => {
                  setActiveTab('1');
                }}
              >
                Overview
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === '2' && 'active'}
                onClick={() => {
                  setActiveTab('2');
                }}
              >
                Orders
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === '3' && 'active'}
                onClick={() => {
                  setActiveTab('3');
                }}
              >
                Shipments
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === '4' && 'active'}
                onClick={() => {
                  setActiveTab('4');
                }}
              >
                Keywords
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Profit asin={asin} selectedDates={selectedDates} />
            </TabPane>
            <TabPane tabId="2">
              <Card>
                <CardBody>
                  <div className="w-50 mx-auto">
                    <MapChart
                      setTooltipContent={setContent}
                      states={states}
                      totalOrders={totalOrders}
                    />
                    <ReactTooltip html={true}>{content}</ReactTooltip>
                  </div>
                </CardBody>
              </Card>

              {product.Orders && (
                <Card>
                  <CardBody>
                    <Orders orders={product.Orders} />
                  </CardBody>
                </Card>
              )}
            </TabPane>
            <TabPane tabId="3">
              <Card>
                <CardBody>
                  {product.sellerSku && (
                    <InboundShipments sku={product.sellerSku} />
                  )}
                </CardBody>
              </Card>
            </TabPane>
            <TabPane tabId="4">
              <Card>
                <CardBody>
                  {product.asin && <Keywords asin={product.asin} />}
                </CardBody>
              </Card>
            </TabPane>
          </TabContent>
        </div>
      </Container>
    </>
  );
};

export default Product;
