import React, { Fragment } from 'react';
import { Card } from 'components';
import Input from 'components/aron/Input';
import Select from 'components/Select';

const Profit = () => {
  const stats = [
    { name: 'Units Sold', stat: '212' },
    { name: 'Total Promotions', stat: '202' },
    { name: 'Refunds', stat: '3' },
    { name: 'Revenue', stat: '$7,392.29' },
    { name: 'Cost of Goods', stat: '$7,392.29' },
    { name: 'Amazon Fees', stat: '$7,392.29' },
    { name: 'Advertising (PPC)', stat: '$7,392.29' },
    { name: 'Net Profit', stat: '$7,392.29' },
  ];

  return (
    <Fragment>
      <Card className="mb-4">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-4 xl:col-span-2">
            <Input label="Search" type="text" name="firstName" id="firstName" />
          </div>

          <div className="col-span-12 sm:col-span-4 xl:col-span-2">
            <Select label="Sort By" />
          </div>

          <div className="col-span-12 sm:col-span-4 xl:col-span-2">
            <Select label="Sort Direction" />
          </div>

          <div className="col-span-12 sm:col-span-4 xl:col-span-2">
            <Input
              label="Filters"
              type="text"
              name="firstName"
              id="firstName"
            />
          </div>

          <div className="col-span-12 sm:col-span-4 xl:col-span-2">
            <Input
              label="Date Range"
              type="text"
              name="firstName"
              id="firstName"
            />
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
    </Fragment>
  );
};

export default Profit;
