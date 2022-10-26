import React from 'react';
import _ from 'lodash';
import { Disclosure } from '@headlessui/react';
import { Card } from 'components';
import { currencyFormatter } from 'utils/formatters';
import classNames from 'utils/classNames';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';

const Breakdown = ({ breakdown, metric }) => {
  const { t } = useTranslation();
  return (
    <Card>
      <h3 className="text-xl font-medium">
        {metric} {t('Profit.Breakdown')}
      </h3>

      <dl className="mt-5 space-y-2">
        {breakdown &&
          Object.keys(breakdown).map((item) => {
            if (breakdown[item].breakdown) {
              return (
                <Disclosure as="div" key={item} className="">
                  {({ open }) => (
                    <>
                      <dt className="text-base">
                        <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-900">
                          <div className="flex items-center">
                            <span className="h-7 flex items-center">
                              <ChevronDownIcon
                                className={classNames(
                                  open ? '-rotate-180' : 'rotate-0',
                                  'h-3 w-3 transform'
                                )}
                                aria-hidden="true"
                              />
                            </span>
                            <span className="ml-2 text-gray-900">
                              {_.startCase(item)}
                            </span>
                          </div>

                          <span>
                            {currencyFormatter(breakdown[item].total)}
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as="dd">
                        <dl className="mt-2 space-y-2">
                          {breakdown[item].breakdown.map(({ type, amount }) => (
                            <dt
                              key={`breakdown-${type}`}
                              className="flex justify-between text-gray-400"
                            >
                              <span className="ml-8">{_.startCase(type)}</span>
                              <span>{currencyFormatter(amount)}</span>
                            </dt>
                          ))}
                        </dl>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              );
            } else {
              return (
                <dt className="flex justify-between" key={item}>
                  <span className="ml-2 font-base text-gray-900">
                    {_.startCase(item)}
                  </span>
                  <span>{currencyFormatter(breakdown[item].total)}</span>
                </dt>
              );
            }
          })}

        <div className="border-b" />
        <div className="border-b" />

        <div className="flex justify-between">
          <span className="ml-2 font-medium text-gray-900">{metric}</span>
          <span className="font-medium">
            {breakdown &&
              currencyFormatter(
                _.sum(Object.values(breakdown).map(({ total }) => total))
              )}
          </span>
        </div>
      </dl>
    </Card>
  );
};

export default Breakdown;
