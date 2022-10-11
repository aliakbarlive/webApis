import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isBoolean, startCase } from 'lodash';
import { PencilAltIcon } from '@heroicons/react/outline';

import {
  setSelectedConfiguration,
  selectConfigurationSummary,
  selectAlertConfigurations,
  selectAlertConfigurationAttributes,
  selectAlertConfigurationToggledAttributes,
  getConfigurationSummaryAsync,
  getConfigurationsAsync,
  updateConfigurationAsync,
} from './alertsSlice';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import { Table, Checkbox, Toggle } from 'components';
import ConfigurationModal from './components/ConfigutationModal';
import { productNameFormatter } from 'utils/table';

const Configuration = () => {
  const summary = useSelector(selectConfigurationSummary);
  const configurations = useSelector(selectAlertConfigurations);
  const attributes = [
    'title',
    'description',
    'price',
    'featureBullets',
    'listingImages',
    'buyboxWinner',
    'categories',
    'reviews',
    'lowStock',
    'rating',
    'lowStockThreshold',
    'ratingCondition',
  ];
  const toggledAttributes = useSelector(
    selectAlertConfigurationToggledAttributes
  );
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const dispatch = useDispatch();

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    sort: 'createdAt',
  });

  const [modalVisibility, setModalVisibility] = useState(false);

  const statistics = ['monitoredProducts', 'maximumProducts', 'enabledAlerts'];

  useEffect(() => {
    dispatch(getConfigurationsAsync(params));
    dispatch(getConfigurationSummaryAsync());
  }, [dispatch, account, marketplace, params]);

  const onChange = async (row, attribute, value = null) => {
    let data = {
      accountId: account.accountId,
      marketplace: marketplace.details.countryCode,
    };
    Object.keys(row)
      .filter((attr) => attributes.includes(attr) || attr === 'status')
      .forEach((attr) => {
        if (attr === attribute) {
          data[attr] = isBoolean(row[attr]) ? !row[attr] : value;
        } else {
          data[attr] = row[attr];
        }
      });

    await dispatch(
      updateConfigurationAsync(row.listingAlertConfigurationId, data)
    );
    await dispatch(getConfigurationsAsync(params));
    await dispatch(getConfigurationSummaryAsync());
  };

  const onEditConfig = (row) => {
    dispatch(setSelectedConfiguration(row));
    setModalVisibility(true);
  };

  const columns = [
    {
      dataField: 'listing.title',
      text: 'Product',
      sort: true,
      headerStyle: {
        minWidth: '300px',
      },
      formatter: (cell, row) =>
        productNameFormatter(cell, {
          ...row.listing,
          productName: row.listing.title,
        }),
    },
    {
      dataField: 'status',
      text: 'Status',
      classes: 'px-6 py-4 text-sm text-gray-500 text-center',
      formatter: (cell, row) => (
        <Toggle checked={cell} onChange={() => onChange(row, 'status')} />
      ),
    },
    ...toggledAttributes.map((attr) => {
      return {
        dataField: attr,
        text: startCase(attr),
        classes: 'px-6 py-4 text-sm text-gray-500 text-center',
        formatter: (cell, row) => (
          <Checkbox
            id={`${row.listingAlertConfigurationId}-${attr}`}
            onChange={() => onChange(row, attr)}
            checked={row[attr]}
          />
        ),
      };
    }),
    {
      dataField: 'listingAlertConfigurationId',
      text: 'Action',
      formatter: (cell, row) => (
        <div className="flex justify-center" onClick={() => onEditConfig(row)}>
          <PencilAltIcon className="h-5 w-5" />
        </div>
      ),
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
    <div className="mb-5">
      <ConfigurationModal
        attributes={toggledAttributes}
        open={modalVisibility}
        setOpen={setModalVisibility}
        onChange={onChange}
      />

      <div className="grid grid-cols-3 gap-5 mb-8">
        {statistics.map((stat) => {
          return (
            <div
              key={stat}
              className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
            >
              <dt className="text-sm font-medium text-gray-500 truncate">
                {startCase(stat)}
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {stat === 'maximumProducts' ? 50 : summary[stat] ?? 0}
              </dd>
            </div>
          );
        })}
      </div>

      <Table
        keyField="listingAlertConfigurationId"
        columns={columns}
        data={configurations}
        onTableChange={onTableChange}
        page={params.page}
        pageSize={params.pageSize}
      />
    </div>
  );
};

export default Configuration;
