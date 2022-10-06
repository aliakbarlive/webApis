import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Table } from 'components';
import SearchBar from './filters/SearchBar';
import StatusFilter from './filters/StatusFilter';

import { stateFormatter } from '../utils/formatters';

const NegativeTargets = ({ accountId, marketplace, campaignType }) => {
  const { t } = useTranslation();
  const [negativeTargets, setNegativeTargets] = useState({ rows: [] });

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    include: ['adGroup'],
  });

  useEffect(() => {
    axios
      .get('/advertising/negative-targets', {
        params: { accountId, marketplace, campaignType, ...params },
      })
      .then((response) => setNegativeTargets(response.data.data));
  }, [accountId, marketplace, campaignType, params]);

  const columns = [
    {
      dataField: 'targetingText',
      text: t('Advertising.Target.Expression'),
      sort: true,
      formatter: (cell, row) => {
        return (
          <>
            <p>{cell}</p>

            <div className="flex flex-col">
              <span className="text-gray-400 text-xs">
                {t('Advertising.Campaign')}: {row.AdvAdGroup.AdvCampaign.name}
              </span>

              <span className="text-gray-400 text-xs">
                {t('Advertising.AdGroup')}: {row.AdvAdGroup.name}
              </span>
            </div>
          </>
        );
      },
    },
    {
      dataField: 'state',
      text: t('Advertising.Common.Status'),
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
      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <SearchBar
          params={params}
          className="lg:col-span-6"
          onApplyFilter={setParams}
        />

        <StatusFilter
          params={params}
          setParams={setParams}
          className="lg:col-span-6"
        />
      </div>
      <Table
        keyField="advNegativeTargetId"
        columns={columns}
        data={negativeTargets}
        onTableChange={onTableChange}
        params={params}
      />
    </div>
  );
};

export default NegativeTargets;
