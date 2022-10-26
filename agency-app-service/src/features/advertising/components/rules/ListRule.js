import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { startCase } from 'lodash';
import { PencilIcon } from '@heroicons/react/outline';

import {
  getRulesAsync,
  selectRules,
} from 'features/advertising/advertisingSlice';
import { selectAuthenticatedUser } from 'features/auth/authSlice';

import { filterToReadableText } from 'features/advertising/utils/formatters';

import ActionDisplay from 'features/advertising/components/optimizations/actions/ActionDisplay';
import { Table } from 'components';
import { NavLink, withRouter } from 'react-router-dom';
import { userCan } from 'utils/permission';

const ListRule = ({ history, accountId, campaignType, marketplace }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(selectAuthenticatedUser);
  const rules = useSelector(selectRules);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    dispatch(
      getRulesAsync({ ...params, accountId, marketplace, campaignType })
    );
  }, [dispatch, accountId, campaignType, marketplace, params]);

  const columns = [
    {
      dataField: 'name',
      sort: true,
      text: t('Advertising.Rule.Name'),
      headerStyle: { minWidth: '275px' },
    },
    {
      dataField: 'recordType',
      sort: true,
      text: t('Advertising.Rule.RecordType'),
      headerStyle: { minWidth: '175px' },
      formatter: (cell) => startCase(cell),
    },
    {
      dataField: 'filters',
      text: t('Advertising.Rule.Conditions'),
      headerStyle: { minWidth: '275px' },
      formatter: (filters, rule) => {
        return (
          <div id={rule.advRuleId}>
            {filters.map((filter, idx) => {
              return (
                <div key={`${rule.advRuleId}-${filter.attribute}-${idx}`}>
                  <span className="text-xs">
                    {filterToReadableText(filter)}
                  </span>
                  <br />
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      dataField: 'action.name',
      text: t('Advertising.Rule.Action'),
      headerStyle: { minWidth: '275px' },
      formatter: (cell, row) => {
        return <ActionDisplay action={row.action} options={row.actionData} />;
      },
    },
    {
      dataField: 'advRuleId',
      text: '',
      headerClasses: userCan(user, 'ppc.rule.update')
        ? 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
        : 'hidden',
      classes: userCan(user, 'ppc.rule.update')
        ? 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500'
        : 'hidden',
      formatter: (cell, row) => {
        const { predefined } = row;
        const redirectToEditPage = () => {
          if (predefined) return;
          history.push(
            `/accounts/${accountId}/advertising/products/rules/${cell}/edit?marketplace=${marketplace}`
          );
        };
        return (
          <div className={predefined ? 'cursor-not-allowed' : 'cursor-pointer'}>
            <PencilIcon onClick={redirectToEditPage} className="h-5 w-5" />
          </div>
        );
      },
    },
  ];

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = { ...params, page, pageSize: sizePerPage };
    delete newParams.sort;

    if (sortField && sortOrder) newParams.sort = `${sortField}:${sortOrder}`;

    setParams(newParams);
  };

  return (
    <div className="my-4">
      {userCan(user, 'ppc.rule.create') && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 mb-4">
          <NavLink
            to={`/accounts/${accountId}/advertising/products/rules/create?marketplace=${marketplace}`}
            className="col-start-4 disabled:opacity-75 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Create new rule
          </NavLink>
        </div>
      )}
      <Table
        data={rules}
        params={params}
        columns={columns}
        keyField="advRuleId"
        onTableChange={onTableChange}
      />
    </div>
  );
};
export default withRouter(ListRule);
