import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'components';
import Input from 'components/aron/Input';
import Select from 'components/Select';

const Overview = () => {
  const { t } = useTranslation();
  const stats = [
    { name: 'Units Sold', stat: '212' },
    { name: 'Orders', stat: '202' },
    { name: 'Refunds', stat: '3' },
    { name: 'Revenue', stat: '$7,392.29' },
  ];

  return (
    <>
      <Card className="mb-4">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-4 xl:col-span-2">
            <Input label={t('Products.Label.Search')} type="text" />
          </div>

          <div className="col-span-12 sm:col-span-4 xl:col-span-2">
            <Select label={t('Products.Label.SortBy')} />
          </div>

          <div className="col-span-12 sm:col-span-4 xl:col-span-2">
            <Select label={t('Products.Label.SortDirection')} />
          </div>

          <div className="col-span-12 sm:col-span-4 xl:col-span-2">
            <Input label={t('Products.Label.Filters')} type="text" />
          </div>

          <div className="col-span-12 sm:col-span-4 xl:col-span-2">
            <Input label={t('Products.Label.DateRange')} type="text" />
          </div>
        </div>
      </Card>

      <div className="mb-5  ">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.name}
              className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
            >
              <dt className="text-sm font-medium text-gray-500 truncate">
                {item.name}
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {item.stat}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <Card>Table goes here</Card>
    </>
  );
};

export default Overview;
