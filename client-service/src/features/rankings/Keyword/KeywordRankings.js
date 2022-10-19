import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectKeywordRankingItems,
  getKeywordRankingsAsync,
  setKeywordRankingItems,
} from './keywordSlice';
import SearchBar from './SearchBar.js';

import axios from 'axios';

import { Container, Card, CardBody } from 'reactstrap';

import Table from './Table';
import { selectCurrentMarketplace } from '../../auth/accountSlice';

const KeywordRankings = () => {
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('keywordText');
  const [sortOrder, setSortOrder] = useState('asc');

  const currentMarketPlace = useSelector(selectCurrentMarketplace);
  const keywordRankingItems = useSelector(selectKeywordRankingItems);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getKeywordRankingsAsync({
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

  const onSwitch = async (oldStatus, index) => {
    const status = oldStatus === 'ACTIVE' ? 'IN-ACTIVE' : 'ACTIVE';
    const res = await axios.post('/keywords/status', {
      status,
      keywordId: keywordRankingItems[index].keywordId,
    });

    dispatch(
      setKeywordRankingItems(
        keywordRankingItems.map((rec, i) =>
          index === i ? { ...rec, status } : rec
        )
      )
    );
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

      <Card>
        <CardBody>
          <Table
            sizePerPage={sizePerPage}
            count={keywordRankingItems.count}
            rows={keywordRankingItems.rows}
            page={page}
            onTableChange={onTableChange}
            onSwitch={onSwitch}
          />
        </CardBody>
      </Card>
    </>
  );
};

export default KeywordRankings;
