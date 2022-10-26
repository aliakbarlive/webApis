import React, { useEffect, useState } from 'react';
import SlideOver from 'components/SlideOver';
import axios from 'axios';
import { dateFormatter, floatFormatter } from 'utils/formatters';
import { Link } from 'react-router-dom';
import Loading from 'components/Loading';
import classnames from 'classnames';

const PaymentDetailsSlideOver = ({ open, setOpen, payment }) => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (payment && open) {
      setLoading(true);
      axios
        .get(`/agency/invoicing/payments/${payment.payment_id}`)
        .then((res) => {
          setPaymentDetails(res.data.data.payment);
          setLoading(false);
        });
    }
  }, [payment, open]);

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
    payment && (
      <SlideOver
        open={open}
        setOpen={setOpen}
        title={``}
        titleClasses="capitalize"
        size="5xl"
      >
        {paymentDetails && !loading ? (
          <div className="overflow-auto">
            <div className="sm:grid sm:grid-cols-2 sm:gap-6">
              <div>
                <h4 className="border-b text-md pb-2 mb-4">
                  Payment Information
                </h4>
                <div className="grid sm:grid-cols-3 sm:gap-2 text-sm">
                  <span className="col-span-1 text-gray-500">
                    Customer Name
                  </span>
                  <span className="col-span-2 text-gray-900">
                    {paymentDetails.customer_name}
                  </span>
                  <span className="col-span-1 text-gray-500">Email</span>
                  <span className="col-span-2 text-gray-900">
                    {paymentDetails.email}
                  </span>
                  <span className="col-span-1 text-gray-500">Mode</span>
                  <span className="col-span-2 text-gray-900 uppercase">
                    {paymentDetails.payment_mode}
                  </span>
                  <span className="col-span-1 text-gray-500">Amount</span>
                  <span className="col-span-2 text-gray-900">
                    {`${paymentDetails.currency_symbol}${floatFormatter(
                      paymentDetails.amount
                    )}`}
                  </span>
                  <span className="col-span-1 text-gray-500">Date</span>
                  <span className="col-span-2 text-gray-900">
                    {dateFormatter(paymentDetails.date)}
                  </span>
                  <span className="col-span-1 text-gray-500">Status</span>
                  <span
                    className={`col-span-2 capitalize ${classnames({
                      'text-green-500': paymentDetails.status === 'success',
                      'text-red-500': paymentDetails.status === 'failure',
                    })}`}
                  >
                    {paymentDetails.status}
                  </span>
                  <span className="col-span-1 text-gray-500">Reference #</span>
                  <span className="col-span-2 text-gray-900">
                    {paymentDetails.reference_number}
                  </span>
                  <span className="col-span-1 text-gray-500">Description</span>
                  <span className="col-span-2 text-gray-900">
                    {paymentDetails.description}
                  </span>
                </div>
              </div>
              {paymentDetails.autotransaction && (
                <div>
                  <h4 className="border-b text-md pb-2 mt-5 sm:mt-0 mb-4">
                    Transaction Information
                  </h4>
                  <div className="grid sm:grid-cols-4 sm:gap-2 text-sm">
                    <span className="col-span-2 text-gray-500">
                      Auto Transaction ID
                    </span>
                    <span className="col-span-2 text-gray-900">
                      {paymentDetails.autotransaction.autotransaction_id}
                    </span>
                    {paymentDetails.autotransaction.last_four_digits && (
                      <>
                        <span className="col-span-2 text-gray-500">
                          Card Processed
                        </span>
                        <span className="col-span-2 text-gray-500">
                          XXXXXXXXXXXX
                          {paymentDetails.autotransaction.last_four_digits}
                        </span>
                      </>
                    )}
                    <span className="col-span-2 text-gray-500">Gateway</span>
                    <span className="col-span-2 text-gray-900 uppercase">
                      {paymentDetails.autotransaction.payment_gateway}
                    </span>
                    {paymentDetails.autotransaction.gateway_transaction_id && (
                      <>
                        <span className="col-span-2 text-gray-500">
                          Gateway Transaction ID
                        </span>
                        <span className="col-span-2 text-gray-900">
                          {
                            paymentDetails.autotransaction
                              .gateway_transaction_id
                          }
                        </span>
                      </>
                    )}
                    {paymentDetails.autotransaction.gateway_error_code && (
                      <>
                        <span className="col-span-2 text-gray-500">
                          Gateway Error Code
                        </span>
                        <span className="col-span-2 text-gray-900 text-red-800">
                          {paymentDetails.autotransaction.gateway_error_code}
                        </span>
                      </>
                    )}
                    {paymentDetails.autotransaction.gateway_error_message && (
                      <>
                        <span className="col-span-2 text-gray-500">
                          Gateway Error Message
                        </span>
                        <span className="col-span-2 text-gray-900 text-red-800">
                          {paymentDetails.autotransaction.gateway_error_message}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            {paymentDetails.invoices && (
              <div className="mt-5">
                <div className="overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200 table-fixed w-1024px">
                    <thead className="bg-gray-100">
                      <tr>
                        {Th(`Date`, 'text-left w-1/5')}
                        {Th('Invoice#', 'text-left w-1/5')}
                        {Th(
                          `Invoice Amount (${paymentDetails.currency_code})`,
                          'text-right w-1/5'
                        )}
                        {Th(
                          `Payment Applied (${paymentDetails.currency_code})`,
                          'text-right w-1/5'
                        )}
                        {Th(
                          `Balance (${paymentDetails.currency_code})`,
                          'text-right w-1/5'
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {paymentDetails.invoices.map((invoice, index) => {
                        return (
                          <tr className="bg-white border-b" key={index}>
                            {Td(dateFormatter(invoice.date))}
                            {Td(
                              <Link
                                className="text-red-500"
                                to={`/invoices/${invoice.invoice_id}`}
                              >
                                {invoice.invoice_number}
                              </Link>
                            )}
                            {Td(invoice.invoice_amount, 'text-right')}
                            {Td(invoice.amount_applied, 'text-right')}
                            {Td(invoice.balance_amount, 'text-right')}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Loading />
        )}
      </SlideOver>
    )
  );
};
export default PaymentDetailsSlideOver;
