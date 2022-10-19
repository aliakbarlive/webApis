import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectCategoryRankingItems,
  getCategoryRankingsAsync,
} from './categorySlice';
import SearchBar from './SearchBar.js';

import { selectCurrentMarketplace } from '../../auth/accountSlice';

import { Container, Card, CardBody } from 'reactstrap';

import Table from './Table';
const KeywordRankings = () => {
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  const currentMarketPlace = useSelector(selectCurrentMarketplace);
  const categoryRankingItems = useSelector(selectCategoryRankingItems);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getCategoryRankingsAsync({
        page,
        sizePerPage,
        searchTerm,
        sortField,
        sortOrder,
      })
    );
  }, [page, sizePerPage, searchTerm, sortField, sortOrder, currentMarketPlace]);

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    setSortField(sortField);
    setSortOrder(sortOrder);
    setSizePerPage(sizePerPage);
    setPage(page);
  };

  const onSearch = (e) => {
    setSearchTerm(e.target.value);
    if (page !== 1) {
      setPage(1);
    }
  };

  return (
    <>
      <Card>
        <CardBody>
          <SearchBar onSearch={onSearch} />
        </CardBody>
      </Card>

      {categoryRankingItems.rows.length > 0 ? (
        <Card>
          <CardBody>
            <Table
              sizePerPage={sizePerPage}
              count={categoryRankingItems.count}
              rows={categoryRankingItems.rows}
              page={page}
              onTableChange={onTableChange}
            />
          </CardBody>
        </Card>
      ) : (
        <span>...</span>
      )}
    </>
  );
};

export default KeywordRankings;
