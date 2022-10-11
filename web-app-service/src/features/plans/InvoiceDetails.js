import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Ribbon.css';
import classnames from 'classnames';
import Spinner from 'components/Spinner';
import { PrinterIcon, DownloadIcon } from '@heroicons/react/outline';
import {
  currencyFormatter,
  dateFormatter,
  decimalFormatter,
} from 'utils/formatter';
import { useDispatch } from 'react-redux';
import { setAppNotification } from 'features/appNotifications/appNotificationSlice';

const InvoiceDetails = ({ history }) => {
  const { invoiceId, accountId } = useParams();
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    axios.get(`/accounts/${accountId}/invoices/${invoiceId}`).then((res) => {
      setInvoice(res.data.output.invoice);
      setLoading(false);
    });
  }, [invoiceId, accountId]);

  const onDowloadPdf = async () => {
    dispatch(
      setAppNotification('info', 'Generating PDF...please wait', '', 3000)
    );

    await axios
      .get(`agency/invoice/${invoiceId}/pdf`, {
        responseType: 'arraybuffer',
      })
      .then((response) => {
        const blob = new Blob([response.data], { type: 'text/pdf' });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${invoice.number}.pdf`;
        link.click();
      });
  };

  const onPrintPdf = async () => {
    dispatch(
      setAppNotification('info', 'Generating PDF...please wait', '', 3000)
    );

    await axios
      .get(`agency/invoice/${invoiceId}/pdf`, {
        responseType: 'blob',
      })
      .then((response) => {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(blob);
        const newWindow = window.open(fileURL, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
      });
  };

  const Th = (label, classes) => {
    return (
      <th
        scope="col"
        className={`px-4 py-2 text-sm font-normal capitalize text-white tracking-wider ${
          classes ?? ''
        }`}
      >
        {label}
      </th>
    );
  };

  const Td = (value, classes) => {
    return (
      <td className={`p-2 sm:p-4 text-sm text-gray-900 ${classes ?? ''}`}>
        {value}
      </td>
    );
  };

  return !loading && invoice ? (
    <>
      {/* <PageHeader title={invoice.number}></PageHeader> */}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative">
          <div className="pb-8 flex justify-between">
            <span className="text-3xl font-medium text-gray-600">
              {invoice.number}
            </span>
            <div className="flex">
              <button
                className="border p-2 bg-white hover:bg-gray-100 flex text-sm"
                title="Preview PDF/Print"
                onClick={onPrintPdf}
              >
                <PrinterIcon className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline">Preview</span>
              </button>
              <button
                className="border p-2 bg-white hover:bg-gray-100 flex text-sm"
                title="Download PDF"
                onClick={onDowloadPdf}
              >
                <DownloadIcon className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-sm p-5 relative">
          <div className="ribbon">
            <div
              className={classnames('ribbon-inner', {
                'bg-green-500': invoice.status === 'paid',
                'bg-blue-500': invoice.status === 'sent',
                'bg-yellow-500': invoice.status === 'pending',
                'bg-red-500': invoice.status === 'overdue',
              })}
            >
              <span>{invoice.status}</span>
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-4 sm:gap-3">
            <div className="self-end text-sm col-span-2 text-right sm:text-left mb-3 sm:mb-0">
              <span className="text-gray-500">Bill To</span>
              <p className="mt-2 mb-0 text-red-600">{invoice.customer_name}</p>
              {invoice.billing_address && (
                <>
                  <p className="mb-0 text-gray-900">
                    {invoice.billing_address.street}
                  </p>
                  <p className="mb-0 text-gray-900">
                    {invoice.billing_address.street2}
                  </p>
                  <p className="mb-0 text-gray-900">
                    {[
                      invoice.billing_address.city,
                      invoice.billing_address.state,
                      invoice.billing_address.zip,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  <p className="mb-0 text-gray-900">
                    {invoice.billing_address.country}
                  </p>
                </>
              )}
            </div>
            <div className=" col-span-2 grid grid-cols-2 gap-3 text-sm text-right">
              <h3 className="col-span-2 text-xl mb-2">
                {invoice.invoice_number}
              </h3>
              <span className="col-span-1 text-gray-500">Invoice Date:</span>
              <span className="col-span-1">
                {dateFormatter(invoice.invoice_date)}
              </span>
              <span className="col-span-1 text-gray-500">Terms:</span>
              <span className="col-span-1">{invoice.payment_terms_label}</span>
              <span className="col-span-1 text-gray-500">Due Date:</span>
              <span className="col-span-1">
                {dateFormatter(invoice.due_date)}
              </span>
              <span className="col-span-1 text-gray-500">Reference #:</span>
              <span className="col-span-1 text-xs">{invoice.reference_id}</span>
            </div>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed w-1024px mt-3">
              <thead className="bg-gray-700">
                <tr>
                  {Th(`Item & Description`, 'text-left w-6/12')}
                  {Th('Qty', 'text-right w-2/12')}
                  {Th('Rate', 'text-right w-2/12')}
                  {Th('Amount', 'text-right w-1/12')}
                </tr>
              </thead>
              <tbody>
                {invoice.invoice_items &&
                  invoice.invoice_items.map((invoiceItem, index) => {
                    return (
                      <tr className="bg-white border-b" key={index}>
                        {Td(
                          <>
                            {invoiceItem.name}
                            <br />
                            <span className="text-gray-500 text-xs">
                              {invoiceItem.description}
                            </span>
                          </>
                        )}
                        {Td(invoiceItem.quantity, 'text-right')}
                        {Td(decimalFormatter(invoiceItem.price), 'text-right')}
                        {Td(
                          decimalFormatter(invoiceItem.item_total),
                          'text-right'
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="mt-2 sm:grid sm:grid-cols-4 sm:gap-3">
            <div className="col-span-2">&nbsp;</div>
            <div className="col-span-2">
              <div className="grid grid-cols-4 gap-y-5 text-sm text-right">
                <div className="col-span-2 sm:col-span-3 text-gray-500">
                  Sub Total
                </div>
                <div className="col-span-2 sm:col-span-1 pr-4">
                  {decimalFormatter(invoice.sub_total)}
                </div>

                {invoice.taxes &&
                  invoice.taxes.map((tax, i) => {
                    return (
                      <>
                        <div className="col-span-2 sm:col-span-3 text-gray-500">
                          {tax.tax_name}
                        </div>
                        <div className="col-span-2 sm:col-span-1 pr-4">
                          {currencyFormatter(
                            tax.tax_amount,
                            invoice.currency_code
                          )}
                        </div>
                      </>
                    );
                  })}

                <div className="col-span-2 sm:col-span-3 text-gray-500 font-bold">
                  Total
                </div>
                <div className="col-span-2 sm:col-span-1 font-medium pr-4">
                  {currencyFormatter(invoice.total, invoice.currency_code)}
                </div>
                {invoice.payment_made > 0 && (
                  <>
                    <div className="col-span-2 sm:col-span-3 text-gray-500">
                      Payment Made
                    </div>
                    <div className="col-span-2 sm:col-span-1 text-red-500 pr-4">
                      (-) {decimalFormatter(invoice.payment_made)}
                    </div>
                  </>
                )}
                <div className="col-span-4 bg-gray-100 grid grid-cols-4 py-2">
                  <div className="col-span-2 sm:col-span-3 text-gray-500">
                    Balance Due
                  </div>
                  <div className="col-span-2 sm:col-span-1  pr-4">
                    {currencyFormatter(invoice.balance, invoice.currency_code)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <Spinner />
      {/* <PageHeader
        title={
          <>
            Loading invoice
            <Loader />
          </>
        }
      ></PageHeader> */}
    </>
  );
};
export default InvoiceDetails;
