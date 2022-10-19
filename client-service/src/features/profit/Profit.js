import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  getProfitSummaryAsync,
  getProductsAsync,
  getSalesTrendAsync,
  selectProfitBreakdown,
  selectKeyMetrics,
  selectTrendAnalysis,
  selectProducts,
} from './profitSlice';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from '../auth/accountSlice';

import { selectCurrentDateRange } from '../../components/datePicker/dateSlice';

import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import moment from 'moment';

import DatePicker from 'components/datePicker/DatePicker';
import KeyMetrics from './KeyMetrics';
import ProfitBreakdown from './ProfitBreakdown';
import Products from './Products';
import TrendAnalysis from './TrendAnalysis';

const Profit = () => {
  const dispatch = useDispatch();

  const trendAnalysis = useSelector(selectTrendAnalysis);
  const currentMarketplace = useSelector(selectCurrentMarketplace);
  const currentAccount = useSelector(selectCurrentAccount);
  const keyMetrics = useSelector(selectKeyMetrics);
  const profitBreakdown = useSelector(selectProfitBreakdown);
  const products = useSelector(selectProducts);
  const selectedDates = useSelector(selectCurrentDateRange);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('productName');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    dispatch(getProfitSummaryAsync(selectedDates));
    dispatch(getSalesTrendAsync(selectedDates));
  }, [currentAccount, currentMarketplace, selectedDates]);

  useEffect(() => {
    dispatch(
      getProductsAsync({ pageSize, page, sortField, sortOrder, selectedDates })
    );
  }, [
    currentAccount,
    currentMarketplace,
    page,
    sortField,
    sortOrder,
    selectedDates,
  ]);

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    setSortField(sortField);
    setSortOrder(sortOrder);
    setPageSize(sizePerPage);
    setPage(page);
  };

  return (
    <Container fluid className="p-0">
      <Card className="bg-gradient">
        <CardBody>
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0 text-white">Profit</h3>
            </Col>
            <Col xs="auto">
              <DatePicker />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <ProfitBreakdown profitBreakdown={profitBreakdown} />

      <KeyMetrics keyMetrics={keyMetrics} />

      <TrendAnalysis trendAnalysis={trendAnalysis} />

      <Products products={products} onTableChange={onTableChange} />
    </Container>
  );
};

export default Profit;
