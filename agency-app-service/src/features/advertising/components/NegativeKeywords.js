import axios from 'axios';
import { startCase } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Table } from 'components';
import Select from 'components/Forms/Select';
import SearchBar from './filters/SearchBar';
import SelectFilter from './filters/SelectFilter';
import StatusFilter from './filters/StatusFilter';

import {
  AD_GROUPS,
  CAMPAIGNS,
  NEGATIVE_EXACT,
  NEGATIVE_PHRASE,
} from '../utils/constants';

import { stateFormatter } from '../utils/formatters';

const NegativeKeywords = ({ accountId, marketplace, campaignType }) => {
  const { t } = useTranslation();
  const [negativeKeywords, setNegativeKeywords] = useState({ rows: [] });

  const [level, setLevel] = useState(AD_GROUPS);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    const payload = {
      accountId,
      marketplace,
      campaignType,
      ...params,
      include: [level === CAMPAIGNS ? 'campaign' : 'adGroup'],
    };

    const url =
      level === CAMPAIGNS ? 'campaign-negative-keywords' : 'negative-keywords';

    axios
      .get(`/advertising/${url}`, { params: payload })
      .then((response) => setNegativeKeywords(response.data.data));
  }, [accountId, marketplace, campaignType, level, params]);

  const columns = [
    {
      dataField: 'keywordText',
      text: t('Advertising.NegKeyword.Text'),
      sort: true,
      formatter: (cell, row) => {
        return (
          <>
            <p>{startCase(cell)}</p>
            {row.AdvCampaign && (
              <span className="text-gray-400 text-xs">
                {t('Advertising.Campaign')}: {row.AdvCampaign.name}
              </span>
            )}

            {row.AdvAdGroup && (
              <div className="flex flex-col">
                <span className="text-gray-400 text-xs">
                  {t('Advertising.Campaign')}: {row.AdvAdGroup.AdvCampaign.name}
                </span>

                <span className="text-gray-400 text-xs">
                  {t('Advertising.AdGroup')}: {row.AdvAdGroup.name}
                </span>
              </div>
            )}
          </>
        );
      },
    },
    {
      dataField: 'matchType',
      text: t('Advertising.NegKeyword.MatchType'),
      sort: true,
      formatter: (cell) => startCase(cell),
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
        <Select
          className="appearance-none px-3 py-2 border shadow-sm placeholder-gray-400 focus:ring-red-500 focus:border-red-500 lg:col-span-3"
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value={AD_GROUPS}>
            {t('Advertising.NegKeyword.Filter.Level.AdGroup')}
          </option>
          <option value={CAMPAIGNS}>
            {t('Advertising.NegKeyword.Filter.Level.Campaign')}
          </option>
        </Select>

        <SearchBar
          params={params}
          className="lg:col-span-3"
          onApplyFilter={setParams}
        />

        <StatusFilter
          params={params}
          setParams={setParams}
          className="lg:col-span-3"
        />

        <SelectFilter
          name="matchType"
          onApplyFilter={setParams}
          params={params}
          className="lg:col-span-3"
          placeholder={t('Advertising.NegKeyword.Filter.MatchType')}
          options={[
            {
              value: NEGATIVE_EXACT,
              display: t(
                'Advertising.NegKeyword.Filter.MatchType.NegativeExact'
              ),
            },
            {
              value: NEGATIVE_PHRASE,
              display: t(
                'Advertising.NegKeyword.Filter.MatchType.NegativePhrase'
              ),
            },
          ]}
        />
      </div>
      <Table
        keyField={
          level === CAMPAIGNS
            ? 'advCampaignNegativeKeywordId'
            : 'advNegativeKeywordId'
        }
        columns={columns}
        data={negativeKeywords}
        onTableChange={onTableChange}
        params={params}
      />
    </div>
  );
};

export default NegativeKeywords;
