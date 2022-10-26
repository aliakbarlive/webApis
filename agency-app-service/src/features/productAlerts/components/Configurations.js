import { useState, useEffect } from 'react';
import { isBoolean, startCase } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PencilAltIcon } from '@heroicons/react/outline';

import ProductPreview from 'components/ProductPreview';
import Checkbox from 'components/Forms/Checkbox';
import Toggle from 'components/Toggle';
import { Table } from 'components';

import {
  selectConfigurations,
  getConfigurationsAsync,
  selectConfigurationSummary,
  getConfigurationSummaryAsync,
  updateProductAlertConfigurationAsync,
  setSelectedConfiguration,
} from '../productAlertSlice';

import {
  ATTRIBUTES,
  CHECKBOX_TYPE,
  STATISTICS_ATTRIBUTES,
} from '../utils/constants';
import ConfigurationModal from './ConfigurationModal';

const Configurations = ({ accountId, marketplace }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const summary = useSelector(selectConfigurationSummary);
  const configurations = useSelector(selectConfigurations);

  const [modalVisibility, setModalVisibility] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    dispatch(getConfigurationsAsync(params));
    dispatch(getConfigurationSummaryAsync());
  }, [dispatch, accountId, marketplace, params]);

  const onEditConfig = (config) => {
    dispatch(setSelectedConfiguration(config));
    setModalVisibility(true);
  };

  const onChange = async (row, attribute, value = null) => {
    let data = { accountId, marketplace };
    ATTRIBUTES.map(({ key }) => {
      if (key !== attribute) {
        data[key] = row[key];

        return;
      }

      data[key] = isBoolean(row[key]) ? !row[key] : value;
    });

    await dispatch(
      updateProductAlertConfigurationAsync(
        row.listingAlertConfigurationId,
        data
      )
    );
    await dispatch(getConfigurationsAsync(params));
    await dispatch(getConfigurationSummaryAsync());
  };

  const columns = [
    {
      dataField: 'listing.title',
      text: t('ProductAlert.Configurations.Table.Product'),
      sort: true,
      headerStyle: {
        minWidth: '300px',
      },
      formatter: (cell, row) => (
        <ProductPreview
          asin={row.listing.asin}
          imageUrl={row.listing.thumbnail}
          productName={cell}
        />
      ),
    },
    {
      dataField: 'status',
      text: t('ProductAlert.Configurations.Table.Status'),
      classes: 'px-6 py-4 text-sm text-gray-500 text-center',
      formatter: (cell, row) => (
        <Toggle checked={cell} onChange={() => onChange(row, 'status')} />
      ),
    },
    ...ATTRIBUTES.filter((attr) => attr.type === CHECKBOX_TYPE).map(
      ({ key }) => {
        return {
          dataField: key,
          text: startCase(key),
          classes: 'px-6 py-4 text-sm text-gray-500 text-center',
          formatter: (cell, row) => (
            <Checkbox
              id={`${row.listingAlertConfigurationId}-${key}`}
              onChange={() => onChange(row, key)}
              checked={row[key]}
            />
          ),
        };
      }
    ),
    {
      dataField: 'listingAlertConfigurationId',
      text: t('ProductAlert.Configurations.Table.Action'),
      formatter: (cell, row) => (
        <div className="flex justify-center" onClick={() => onEditConfig(row)}>
          <PencilAltIcon className="h-5 w-5" />
        </div>
      ),
    },
  ];

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = { ...params, page, pageSize: sizePerPage };
    delete newParams.sort;

    if (sortField && sortOrder) {
      newParams.sort = `${sortField}:${sortOrder}`;
    }

    setParams(newParams);
  };

  return (
    <div>
      <ConfigurationModal
        open={modalVisibility}
        setOpen={setModalVisibility}
        onChange={onChange}
      />

      <div className="grid grid-cols-3 gap-5 mb-8">
        {STATISTICS_ATTRIBUTES.map((attribute) => {
          return (
            <div
              key={attribute}
              className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
            >
              <dt className="text-sm font-medium text-gray-500 truncate">
                {startCase(attribute)}
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {summary[attribute] ?? 0}
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
        params={params}
      />
    </div>
  );
};

export default Configurations;
