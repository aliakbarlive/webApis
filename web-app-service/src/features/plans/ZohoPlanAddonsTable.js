import React, { Fragment } from 'react';
import { currencyFormatter } from 'utils/formatter';

const ZohoPlanAddonsTable = ({ subscription }) => {
  const Th = (label, classes) => {
    return (
      <th
        scope="col"
        className={`px-4 py-2 text-xs font-normal uppercase text-gray-500 tracking-wider ${
          classes ?? ''
        }`}
      >
        {label}
      </th>
    );
  };

  const Td = (value, classes, colspan = '') => {
    return (
      <td
        colSpan={colspan ?? ''}
        className={`p-4 text-sm text-gray-900 ${classes ?? ''}`}
      >
        {value}
      </td>
    );
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full divide-y divide-gray-200 table-fixed w-1024px">
        <thead className="bg-gray-100">
          <tr>
            {Th(`Plan & Addon Details`, 'text-left w-5/12')}
            {Th('Qty', 'text-right w-1/12')}
            {Th('Rate', 'text-right w-2/12')}
            {Th('Tax', 'text-right w-2/12')}
            {Th('Amount', 'text-right w-3/12')}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white">
            {Td(
              <Fragment>
                {subscription.plan.name}
                <br />
                <span className="text-xs">{subscription.plan.description}</span>
              </Fragment>
            )}
            {Td(subscription.plan.quantity, 'text-right')}
            {Td(
              currencyFormatter(
                subscription.plan.price,
                subscription.currency_code
              ),
              'text-right'
            )}
            {Td(
              subscription.plan.tax_percentage &&
                subscription.plan.tax_percentage > 0
                ? subscription.plan.tax_percentage
                : '-',
              'text-right'
            )}
            {Td(
              currencyFormatter(
                subscription.plan.total,
                subscription.currency_code
              ),
              'text-right'
            )}
          </tr>
          {subscription.addons &&
            subscription.addons.map((addon, index) => {
              return (
                <tr className="bg-white" key={index}>
                  {Td(
                    <Fragment>
                      {addon.name}
                      <br />
                      <span className="text-xs">{addon.description}</span>
                    </Fragment>
                  )}
                  {Td(addon.quantity, 'text-right')}
                  {Td(
                    currencyFormatter(addon.price, subscription.currency_code),
                    'text-right'
                  )}
                  {Td(
                    addon.tax_percentage && addon.tax_percentage > 0
                      ? addon.tax_percentage
                      : '-',
                    'text-right'
                  )}
                  {Td(
                    currencyFormatter(addon.total, subscription.currency_code),
                    'text-right'
                  )}
                </tr>
              );
            })}
          <tr className="bg-white border-t pt-4">
            {Td('Sub Total', 'text-right', 4)}
            {Td(
              currencyFormatter(
                subscription.sub_total,
                subscription.currency_code
              ),
              'text-right',
              1
            )}
          </tr>

          {subscription.taxes &&
            subscription.taxes.map((tax, i) => {
              return (
                <tr className="bg-white">
                  {Td(tax.tax_name, 'text-right', 4)}
                  {Td(
                    currencyFormatter(
                      tax.tax_amount,
                      subscription.currency_code
                    ),
                    'text-right',
                    1
                  )}
                </tr>
              );
            })}
          <tr className="border-t bg-gray-100 border-t border-b">
            <td
              colSpan={4}
              className="px-4 py-1 text-right text-xs font-normal uppercase text-gray-500"
            >
              Total ({subscription.currency_code})
            </td>
            <td
              colSpan={1}
              className="px-4 py-1 text-right text-sm font-normal uppercase"
            >
              {currencyFormatter(
                subscription.amount,
                subscription.currency_code
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ZohoPlanAddonsTable;
