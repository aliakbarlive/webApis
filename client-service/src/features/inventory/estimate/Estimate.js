import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  selectInventorySummary,
  getInventoryAsync,
  getInventorySummaryAsync,
  selectEstimate,
} from '../inventorySlice';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from '../../auth/accountSlice';

import { Container, Spinner } from 'reactstrap';

import SearchBar from './SearchBar';
import Table from './Table';
import Header from './Header';
import Statistics from './Statistics';

const Estimate = () => {
  const currentMarketplace = useSelector(selectCurrentMarketplace);
  const currentAccount = useSelector(selectCurrentAccount);
  const inventorySummary = useSelector(selectInventorySummary);
  const estimate = useSelector(selectEstimate);
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('productName');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    dispatch(
      getInventoryAsync({
        pageSize,
        page,
        searchTerm,
        sortField,
        sortOrder,
        queryType: 'estimate',
      })
    );
  }, [
    page,
    pageSize,
    searchTerm,
    sortField,
    sortOrder,
    currentAccount,
    currentMarketplace,
  ]);

  useEffect(() => {
    dispatch(getInventorySummaryAsync());
  }, [estimate, currentAccount, currentMarketplace]);

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    setSortField(sortField);
    setSortOrder(sortOrder);
    setPageSize(sizePerPage);
    setPage(page);
  };

  const onSearch = (e) => {
    setSearchTerm(e.target.value);

    if (page !== 1) {
      setPage(1);
    }
  };

  return (
    <Container fluid className="p-0">
      <Header title="Inventory Estimate" />

      <Statistics summary={inventorySummary} />

      <SearchBar onSearch={onSearch} />

      {estimate.rows.length > 0 ? (
        <Table
          rows={estimate.rows}
          count={estimate.count}
          page={page}
          onTableChange={onTableChange}
        />
      ) : (
        <span>
          <Spinner color="primary" className="d-flex mx-auto" />
        </span>
      )}
    </Container>
  );
};

export default Estimate;
