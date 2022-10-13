import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { startCase } from 'lodash';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import { stateFormatter } from 'utils/formatter';

import SearchBar from './SearchBar';
import SelectFilter from './SelectFilter';
import Table from 'components/Table';

const NegativeKeywords = ({ url, keyField }) => {
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const [negativeKeywords, setNegativeKeywords] = useState({});

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    axios
      .get(url, {
        params: {
          ...params,
          accountId: account.accountId,
          marketplace: marketplace.details.countryCode,
        },
      })
      .then((res) => {
        setNegativeKeywords(res.data.data);
      });
  }, [account, marketplace, url, params]);

  const columns = [
    {
      dataField: 'keywordText',
      text: 'Text',
      sort: true,
    },
    {
      dataField: 'matchType',
      text: 'Match Type',
      sort: true,
      formatter: (cell) => startCase(cell),
    },
    {
      dataField: 'state',
      text: 'Status',
      sort: true,
      formatter: (cell) => stateFormatter(cell),
    },
  ];

  // Handle table change.
  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = { ...params, page, pageSize: sizePerPage };
    delete newParams.sort;

    if (sortField && sortOrder) {
      newParams.sort = `${sortField}:${sortOrder}`;
    }

    setParams(newParams);
  };

  return (
    <div className="my-4">
      <div className="mb-4 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="col-span-3">
          <SearchBar
            params={params}
            onApplyFilter={setParams}
            placeholder="Search keyword"
          />
        </div>

        <SelectFilter
          name="matchType"
          placeholder="All Match Type"
          onApplyFilter={setParams}
          params={params}
          options={[
            { value: 'negativePhrase', display: 'Negative Phrase' },
            { value: 'negativeExact', display: 'Negative Exact' },
          ]}
        />

        <SelectFilter
          name="state"
          placeholder="All Status"
          onApplyFilter={setParams}
          params={params}
          options={[
            { value: 'enabled', display: 'Enabled' },
            { value: 'paused', display: 'Paused' },
            { value: 'archived', display: 'Archived' },
          ]}
        />
      </div>

      <Table
        keyField={keyField}
        columns={columns}
        data={negativeKeywords}
        onTableChange={onTableChange}
        page={params.page}
        pageSize={params.pageSize}
      />
    </div>
  );
};

export default NegativeKeywords;
