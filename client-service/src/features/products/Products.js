import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { selectProducts, getProductsAsync } from './productsSlice';
import { selectCurrentMarketplace } from '../auth/accountSlice';

import { Row, Col, Card, CardBody, Container, Spinner } from 'reactstrap';
import moment from 'moment';

import DatePicker from 'components/datePicker/DatePicker';
import ProductCard from './ProductCard';

const Products = () => {
  const currentMarketPlace = useSelector(selectCurrentMarketplace);
  const products = useSelector(selectProducts);
  const dispatch = useDispatch();

  const [selectedDates, setSelectedDates] = useState({
    startDate: new Date(moment().subtract(7, 'd').startOf('day').utc()),
    endDate: new Date(moment().endOf('day').utc()),
  });

  useEffect(() => {
    dispatch(getProductsAsync());
  }, [currentMarketPlace]);

  const onDateRangeSelect = (dateRange) => {
    setSelectedDates(dateRange);
  };

  return (
    <Container fluid className="p-0">
      <Card className="bg-gradient">
        <CardBody>
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0 text-white">Products</h3>
            </Col>
            {/* <Col xs="auto">
              <DatePicker
                onDateRangeSelect={onDateRangeSelect}
                initialDateRange={selectedDates}
              />
            </Col> */}
          </Row>
        </CardBody>
      </Card>

      {products.length > 0 ? (
        <Row>
          <Col xl="12">
            <Row>
              {products.map((product) => (
                <ProductCard product={product} />
              ))}
            </Row>
          </Col>
        </Row>
      ) : (
        <strong>
          <Spinner color="primary" className="d-flex mx-auto" />
        </strong>
      )}
    </Container>
  );
};

export default Products;
