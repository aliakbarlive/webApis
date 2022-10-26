import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { PRODUCT_ADS, SORT_BY_COST } from '../utils/constants';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';

import ProductPreview from 'components/ProductPreview';

import { metricColumns } from '../utils/columns';
import AdvertisingTable from '../components/AdvertisingTable';

const Products = ({ accountId, marketplace, campaignType }) => {
  const { t } = useTranslation();
  const [products, setProducts] = useState({ rows: [] });
  const selectedDates = useSelector(selectCurrentDateRange);
  const [visibleColumns, setVisibleColumns] = useState(
    localStorage.getItem('products-list-column') ?? 'listing,cost,sales,orders'
  );

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    campaignType,
    search: '',
    attributes:
      'asin,sku,impressions,clicks,ctr,cost,cpc,orders,sales,acos,attributedOrdersNewToBrandPercentage14d,attributedSalesNewToBrand14d,attributedSalesNewToBrandPercentage14d,cpm,cr,profit,roas',
    sort: SORT_BY_COST,
    include: ['previousData', 'listing'],
  });

  useEffect(() => {
    axios
      .get('/advertising/product-ads/products', {
        params: {
          ...params,
          ...selectedDates,
          accountId,
          marketplace,
        },
      })
      .then((response) => {
        setProducts(response.data.data);
      });
  }, [accountId, marketplace, selectedDates, params]);

  const columns = [
    {
      auto: true,
      default: true,
      category: 'settings',
      dataField: 'listing',
      text: t('Advertising.Product.Preview'),
      sort: true,
      headerStyle: { minWidth: '390px' },
      classes: 'px-6 py-4 text-sm text-gray-500',
      headerClasses:
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase',
      formatter: (cell, row) => (
        <ProductPreview
          sku={cell.sku ?? row.sku}
          asin={cell.asin ?? row.asin}
          productName={cell.title}
          imageUrl={cell.thumbnail}
        />
      ),
    },
    ...metricColumns(),
  ];

  const onUpdateParams = (params) => {
    setParams(params);
  };

  const onChangeVisibleColumns = (newColumns) => {
    localStorage.setItem('products-list-column', newColumns);
    setVisibleColumns(newColumns);
  };

  return (
    <div id={PRODUCT_ADS}>
      <AdvertisingTable
        params={params}
        list={products}
        columns={columns}
        accountId={accountId}
        recordType={PRODUCT_ADS}
        keyField="index"
        marketplace={marketplace}
        campaignType={campaignType}
        onChangeParams={onUpdateParams}
        searchClassName="lg:col-span-6"
        filtersClassName="lg:col-span-4"
        exportClassName="lg:col-span-2"
        searchPlaceholder={t('Advertising.Product.Filter.Product')}
        visibleColumns={visibleColumns}
        onChangeVisibleColumns={onChangeVisibleColumns}
      />
    </div>
  );
};

export default Products;
