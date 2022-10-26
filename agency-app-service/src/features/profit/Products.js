import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';
import _ from 'lodash';

import { productNameFormatter } from 'utils/table';
import { currencyFormatter } from 'utils/formatters';
import { InformationCircleIcon } from '@heroicons/react/solid';

import DatePicker from 'features/datePicker/DatePicker';
import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';
import {
  getProductMetricsAsync,
  getFeeBreakdownAsync,
  selectProductMetrics,
  selectFeeBreakdown,
} from './productSlice';

import { Table, Input } from 'components';

const Products = ({ account, marketplace }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const productMetrics = useSelector(selectProductMetrics);
  const feeBreakdown = useSelector(selectFeeBreakdown);
  const selectedDates = useSelector(selectCurrentDateRange);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    sortField: 'units',
    sortOrder: 'desc',
    searchQuery: '',
    ...selectedDates,
  });

  useEffect(() => {
    dispatch(getFeeBreakdownAsync(selectedDates));
  }, [dispatch, params, account, marketplace]);

  useEffect(() => {
    setLoading(true);
    dispatch(getProductMetricsAsync(params)).then(() => {
      setLoading(false);
    });
  }, [dispatch, params, account, marketplace]);

  useEffect(() => {
    setParams({ ...params, ...selectedDates });
  }, [selectedDates]);

  const valWithTooltipFormatter = (cell, asin) => {
    const tipId = `${asin}-current`;
    const index = feeBreakdown
      ? feeBreakdown.findIndex((e) => e.asin === asin)
      : -1;
    const breakdown = index !== -1 ? feeBreakdown[index] : false;

    return (
      <div className="flex">
        {currencyFormatter(cell)}
        <button data-tip data-for={tipId}>
          <InformationCircleIcon className="ml-2 mt-1 h-4 w-4" />
        </button>
        <ReactTooltip
          id={tipId}
          place="bottom"
          effect="solid"
          className="w-96 text-black"
          backgroundColor="rgba(229, 231, 235, var(--tw-bg-opacity))"
          textColor="rgba(17, 24, 39, var(--tw-text-opacity))"
        >
          <table>
            {breakdown &&
              breakdown.types.map((t) => {
                const percent = ((t.amount / cell) * 100).toFixed(2);
                return (
                  <tr key={t.type}>
                    <td>
                      <span className="">{_.startCase(t.type)}</span>
                    </td>
                    <td className="align-middle">
                      <span className="pt-1">
                        <span className="w-28 overflow-hidden h-2 mr-4 text-xs flex rounded bg-red-200">
                          <span
                            style={{ width: `${percent}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                          ></span>
                        </span>
                      </span>
                    </td>
                    <td>
                      <span>{currencyFormatter(t.amount)}</span>
                    </td>
                  </tr>
                );
              })}
          </table>
        </ReactTooltip>
      </div>
    );
  };
  const onSearch = (searchQuery) => {
    if (searchQuery.length > 2) {
      const newParams = { ...params, page: 1, searchQuery };
      setParams(newParams);
    }
  };

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    const newParams = {
      ...params,
      page,
      pageSize: sizePerPage,
    };
    if (sortField && sortOrder) {
      delete newParams.sortField;
      delete newParams.sortOrder;

      newParams.sortField = sortField;
      newParams.sortOrder = sortOrder;
    }
    setParams(newParams);
  };

  const columns = [
    {
      dataField: 'productName',
      text: t('Profit.Product'),
      sort: true,
      headerStyle: {
        minWidth: '390px',
      },
      formatter: (cell, row) => {
        return productNameFormatter(cell, {
          productName: cell,
          asin: row.asin,
          sellerSku: row.sellerSku,
          thumbnail: row.thumbnail,
        });
      },
    },
    {
      dataField: 'units',
      text: t('Profit.TotalUnits'),
      sort: true,
      headerStyle: {
        minWidth: '170px',
      },
    },
    {
      dataField: 'refunds',
      text: t('Profit.TotalRefunds'),
      sort: true,
      headerStyle: {
        minWidth: '170px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },
    {
      dataField: 'promotions',
      text: t('Profit.Promotions'),
      sort: true,
      headerStyle: {
        minWidth: '170px',
      },
    },
    {
      dataField: 'revenue',
      text: t('Profit.Revenue'),
      sort: true,
      headerStyle: {
        minWidth: '170px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },
    {
      dataField: 'costs',
      text: t('Profit.Cost'),
      sort: true,
      headerStyle: {
        minWidth: '170px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },
    {
      dataField: 'fees',
      text: t('Profit.Fees'),
      sort: true,
      headerStyle: {
        minWidth: '170px',
      },
      formatter: (cell, row) => valWithTooltipFormatter(cell, row.asin),
    },
    {
      dataField: 'ppcSpend',
      text: t('Profit.TotalPPCSpend'),
      sort: true,
      headerStyle: {
        minWidth: '170px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },
    {
      dataField: 'profit',
      text: t('Profit.Profit'),
      sort: true,
      headerStyle: {
        minWidth: '170px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },
  ];

  return (
    <>
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="flex px-4 py-5 sm:p-6">
          <div className="col-span-12 sm:col-span-4 xl:col-span-3">
            <Input
              label={t('Profit.Search')}
              placeholder={t('Profit.SearchPlaceHolder')}
              onChangeInput={onSearch}
              className="ml-4"
            />
          </div>
          <div className="col-span-12 sm:col-span-4 xl:col-span-3">
            <DatePicker position="left" />
          </div>
        </div>
      </div>
      {productMetrics ? (
        <Table
          columns={columns}
          data={productMetrics}
          loading={loading}
          onTableChange={onTableChange}
          params={params}
          keyField="asin"
        />
      ) : (
        <p>{t('Loading')}</p>
      )}
    </>
  );
};

export default Products;
