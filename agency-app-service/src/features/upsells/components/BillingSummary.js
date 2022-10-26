import { useEffect, useState } from 'react';
import { sum } from 'lodash';

const BillingSummary = ({ upsell, subscription }) => {
  const [subTotal, setSubTotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (subscription) {
      const detailsTotal = sum(
        upsell.details.map((detail) => {
          return parseFloat(detail.price) * parseInt(detail.qty);
        })
      );
      setSubTotal(detailsTotal);
      const taxes =
        detailsTotal * (parseFloat(subscription.tax_percentage ?? 0) / 100);
      setTaxes(taxes);
      setTotal(detailsTotal + taxes);
    }
  }, [subscription]);

  return (
    <>
      <span className="text-gray-500">Billing Summary</span>
      <ul className="text-sm font-medium text-gray-900 border-t mt-1 border-gray-200 divide-y divide-gray-200">
        {upsell.details.map((detail) => (
          <li
            key={detail.upsellDetailId}
            className="flex justify-between py-2 space-x-4"
          >
            <div className="flex-col space-y-2">
              <div className="flex items-center">
                <h3>{detail.name}</h3>
              </div>
              <p className="text-gray-500">
                Unit Price:&nbsp;
                <span className="text-gray-700 mr-5">${detail.price}</span>
                Qty:&nbsp;
                <span className="text-gray-700">{detail.qty}</span>
              </p>
              <p className="text-gray-500 whitespace-pre-wrap">
                {detail.description}
              </p>
            </div>
            <p className="flex-none text-base font-medium">
              ${(parseFloat(detail.price) * parseInt(detail.qty)).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
      <dl className="text-sm font-medium text-gray-500 space-y-2 mt-3">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="text-gray-900">${subTotal.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>
            Taxes: {subscription.tax_name ?? subscription.tax_exemption_code} (%
            {subscription.tax_percentage ?? 0})
          </dt>
          <dd className="text-gray-900">
            {taxes > 0 ? `$${taxes.toFixed(2)}` : '-'}
          </dd>
        </div>
        <div className="flex justify-between border-t border-gray-200 text-gray-900 pt-6">
          <dt className="text-base">Total</dt>
          <dd className="text-base">${total.toFixed(2)}</dd>
        </div>
      </dl>
    </>
  );
};

export default BillingSummary;
