import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { getCostManagerAsync, selectCostManager } from './costManagerSlice';
import { selectCurrentMarketplace } from '../auth/accountSlice';
import { Container, Card, CardBody, Row, Col, Spinner } from 'reactstrap';
import DatePicker from 'components/datePicker/DatePicker';

const CostManager = () => {
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const costManager = useSelector(selectCostManager);
  const currentMarketPlace = useSelector(selectCurrentMarketplace);
  const { cogs } = costManager;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCostManagerAsync({ page, sizePerPage, sortField, sortOrder }));
  }, [page, sizePerPage, sortField, sortOrder, currentMarketPlace]);

  return (
    <Container fluid className="p-0">
      <Card className="bg-gradient">
        <CardBody>
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0 text-white">Cost Manager</h3>
            </Col>
            <Col xs="auto">
              <DatePicker />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          {cogs.rows ? (
            <span>table here</span>
          ) : (
            <strong>
              <Spinner color="primary" className="d-flex mx-auto" />
            </strong>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default CostManager;
