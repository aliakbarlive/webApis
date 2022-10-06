import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import moment from 'moment';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
  currencyFormatter,
  dateFormatter,
  floatFormatter,
  strUnderscoreToSpace,
} from 'utils/formatters';
import './Ribbon.css';
import Loading from 'components/Loading';
import Input from 'components/Forms/Input';
import Textarea from 'components/Forms/Textarea';
import ButtonLink from 'components/ButtonLink';
import { computeCommissions } from 'features/clients/commissionsSlice';
import { setAlert } from 'features/alerts/alertsSlice';
import EmailInvoiceModal from './Details/EmailInvoiceModal';
import RecordPaymentModal from './Details/RecordPaymentModal';
import RecentActivitiesSlideOver from './Details/RecentActivitiesSlideOver';
import DetailsMenu from './Details/DetailsMenu';
import AutoOptionEmail from './Details/AutoOptionEmail';
import AutoOptionCollect from './Details/AutoOptionCollect';
import { PlusIcon, CheckIcon } from '@heroicons/react/outline';
import {
  TrashIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/solid';
import { fetchMarketplaces } from 'features/clients/clientsSlice';
import Button from 'components/Button';
import { ConfirmationModal } from 'components';
import { setCurrentPage } from './invoicesSlice';
import usePermissions from 'hooks/usePermissions';
import useInvoice from 'hooks/useInvoice';
import ReasonForUpdateModal from './Details/ReasonForUpdateModal';

const InvoiceDetails = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { userCan, isAgencySuperUser } = usePermissions();
  const { invoiceId } = useParams();
  const { marketplaces } = useSelector((state) => state.clients);
  const [invoice, setInvoice] = useState(null);
  const status = useInvoice(invoice);
  const [invoiceSubscription, setInvoiceSubscription] = useState(null);
  const [invoiceSubscriptionRecord, setInvoiceSubscriptionRecord] =
    useState(null);
  const [invoiceCommission, setInvoiceCommission] = useState(null);
  const [commissionErrors, setCommissionErrors] = useState(null);
  const [commissionData, setCommissionData] = useState(null);
  const [initLoading, setInitLoading] = useState(false);
  const [deletingItem, setDeletingItem] = useState(false);
  const [savingItem, setSavingItem] = useState(false);
  const [loadComputed, setLoadComputed] = useState(false);
  const [isOpenEmailModal, setIsOpenEmailModal] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [recordingPayment, setRecordingPayment] = useState(false);
  const [isOpenPaymentModal, setIsOpenPaymentModal] = useState(false);
  const [isOpenRecentActivities, setIsOpenRecentActivities] = useState(false);
  const [isOpenVoid, setIsOpenVoid] = useState(false);
  const [isOpenConvertToOpen, setIsOpenConvertToOpen] = useState(false);
  const [isOpenCancelWriteOff, setIsOpenCancelWriteOff] = useState(false);
  const [isOpenWriteOff, setIsOpenWriteOff] = useState(false);
  const [isOpenCollect, setIsOpenCollect] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [lineItems, setLineItems] = useState([]);
  const [paymentsExpanded, setPaymentsExpanded] = useState(false);
  const [creditsExpanded, setCreditsExpanded] = useState(false);
  const [isOpenReasonModal, setIsOpenReasonModal] = useState(false);
  const [reasonPayload, setReasonPayload] = useState({
    action: '',
    payload: null,
  });
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const fetchInvoice = async () => {
    await axios.get(`/agency/invoice/${invoiceId}`).then((res) => {
      dispatch(setCurrentPage(res.data.output.invoice.invoice_number));
      setInvoice(res.data.output.invoice);
      setInvoiceSubscription(res.data.subscription);
      setInvoiceSubscriptionRecord(res.data.subscriptionRecord);
      setInvoiceCommission(res.data.commission);
      setCommissionErrors(res.data.commissionErrors);
      setCommissionData(res.data.commissionData);
    });
  };

  useEffect(() => {
    const getInvoice = async () => {
      setInitLoading(true);
      await fetchInvoice();
      setInitLoading(false);
    };

    getInvoice();
    if (marketplaces.length <= 0) {
      dispatch(fetchMarketplaces());
    }
  }, [invoiceId, setInitLoading]);

  const site = (marketplaceId) => {
    let { countryCode } = marketplaces.find(
      (marketplace) => marketplace.marketplaceId === marketplaceId
    );

    switch (countryCode) {
      case 'CA':
        return '.CA';
      case 'US':
        return '.COM';
      default:
        return countryCode;
    }
  };

  const computeMyCommissions = () => {
    const accountId = invoice.reference_id;

    setLoadComputed(true);
    dispatch(
      computeCommissions({ accountId, invoiceDate: invoice.invoice_date })
    ).then((res) => {
      const data = res.payload.output;

      if (data) {
        let lineItemsData = data.map((c) => {
          let { commission, computed, prevMonthSales, data: commisionData } = c;

          if (computed) {
            const billPrevMonth = moment(invoice.invoice_date)
              .clone()
              .subtract(1, 'month')
              .format('MMM');

            let hasBenchmarkAvg =
              commission.type === 'benchmark'
                ? ` \n Baseline: ${currencyFormatter(
                    commission.preContractAvgBenchmark,
                    invoice.currency_code
                  )} `
                : '';

            let managedAsins = '';

            if (commission.managedAsins && commission.managedAsins.length > 0) {
              const { currency_code } = invoice;

              managedAsins = prevMonthSales.managedAsinsSales
                .map((ma) => {
                  return `${ma.asin}: ${currencyFormatter(
                    ma.sales.totalSales.amount,
                    invoice.currency_code
                  )}`;
                })
                .join('\n ');

              if (commission.type === 'yearlySalesImprovement') {
                managedAsins = commisionData.managedAsins
                  .map((m) => {
                    const difference = currencyFormatter(
                      m.totalSalesDifference,
                      currency_code
                    );
                    const prev = currencyFormatter(
                      m.totalPreviousYearSales,
                      currency_code
                    );
                    const now = currencyFormatter(
                      m.totalCurrentYearSales,
                      currency_code
                    );
                    return m.totalSalesDifference > 0
                      ? `${m.asin}: ${difference} (${prev} to ${now})`
                      : m.asin;
                  })
                  .join('\n ');
              }

              if (commission.type === 'benchmark') {
                const benchmarks = commission.managedAsins
                  .map((ma) => {
                    return `${ma.asin}: ${currencyFormatter(
                      ma.baseline,
                      invoice.currency_code
                    )}`;
                  })
                  .join('\n ');

                let totalBenchmarkAvg = commission.managedAsins.reduce(
                  (a, b) => a + b.baseline,
                  0
                );

                hasBenchmarkAvg = ` \n Baseline:\n ${benchmarks} \nTotal Baseline: ${currencyFormatter(
                  totalBenchmarkAvg,
                  invoice.currency_code
                )}\n `;
              }
            }

            let description = `${managedAsins}\n ${billPrevMonth} ${t(
              'Gross Sales'
            )}: ${currencyFormatter(
              computed.grossSales,
              invoice.currency_code
            )}${hasBenchmarkAvg}\n ${t(
              'Invoice.Commissionable'
            )}: ${currencyFormatter(
              computed.averageTotal,
              invoice.currency_code
            )} @ ${computed.rate}%`;

            if (commission.type === 'yearlySalesImprovement') {
              const { totalSalesDifference } = commisionData;
              if (totalSalesDifference > 0) {
                description = `${description}\n Sales difference from last year ${currencyFormatter(
                  totalSalesDifference,
                  invoice.currency_code
                )}`;
              }
            }

            return {
              name: `${t('Invoice.OngoingSalesCommission')} ${site(
                commission.marketplaceId
              )}`,
              description,
              price: computed.rateTotal,
              quantity: 1,
            };
          }
        });

        setLineItems([...lineItems, ...lineItemsData]);

        setLoadComputed(false);
      }
    });
  };

  const addCommissionLineItem = () => {
    let lineItemsData = commissionData.map((c) => {
      return {
        name: `${t('Invoice.OngoingSalesCommission')} ${site(c.marketplaceId)}`,
        description: `Type: ${c.type}\nRate: ${c.rate}%`,
        price: 0,
        quantity: 1,
      };
    });
    setLineItems([...lineItems, ...lineItemsData]);
  };

  const addItem = () => {
    setLineItems([
      ...lineItems,
      {
        name: '',
        description: '',
        price: 0,
        quantity: 1,
      },
    ]);
  };

  const onInputChange = (e, index) => {
    let myLineItems = lineItems.slice();
    const { name, value } = e.target;
    myLineItems[index] = { ...myLineItems[index], [name]: value };

    setLineItems(myLineItems);
  };

  const removeLineItem = (e, index) => {
    let myLineItems = [...lineItems]; // make a separate copy of the array
    myLineItems.splice(index, 1);
    setLineItems(myLineItems);
  };

  const deleteInvoiceItem = async (invoiceItem, reason = '') => {
    setDeletingItem(true);

    let action = invoiceItem.name.includes('Ongoing Sales Commission')
      ? 'commission'
      : '';

    const data = { reason };

    const res = await axios.patch(
      `agency/invoice/${invoiceId}/lineitems${action}/${invoiceItem.item_id}`,
      data
    );

    if (res.data.output.code === 0) {
      await fetchInvoice();
      dispatch(setAlert('success', res.data.output.message));
    } else {
      dispatch(setAlert('error', res.data.output.message));
    }
    setDeletingItem(false);
  };

  const onAddReason = async (reason) => {
    setIsOpenReasonModal(false);
    const { action, payload } = reasonPayload;
    switch (action) {
      case 'add':
        return await saveLineItems(reason);
      case 'delete':
        return await deleteInvoiceItem(payload, reason);
    }
  };

  const saveLineItems = async (reason = '') => {
    setSavingItem(true);

    const data =
      reason !== ''
        ? { invoice_items: lineItems, reason }
        : { invoice_items: lineItems };

    const res = await axios.post(`agency/invoice/${invoiceId}/lineitems`, data);

    if (res.data.output.code === 0) {
      await fetchInvoice();
      dispatch(setAlert('success', res.data.output.message));
      setLineItems([]);
    } else {
      dispatch(setAlert('error', res.data.output.message));
    }
    setSavingItem(false);
  };

  const onCollectCharge = async () => {
    try {
      setSavingStatus(true);

      if (lineItems && lineItems.length > 0) {
        dispatch(
          setAlert('error', t('Invoice.Details.Error.UnsavedLineItems'))
        );
      } else {
        const res = await axios.post(`agency/invoice/${invoiceId}/collect`);

        if (res.data.output.code === 0) {
          await fetchInvoice();
          dispatch(setAlert('success', res.data.output.message));
        } else {
          dispatch(setAlert('error', res.data.output.message));
        }
      }
    } catch (error) {
      dispatch(setAlert('error', error.response.data.message));
    }

    setIsOpenCollect(false);
    setSavingStatus(false);
  };

  const onRecordPayment = async (payload) => {
    setRecordingPayment(true);
    const res = await axios.post(
      `agency/invoice/${invoiceId}/payments`,
      JSON.stringify(payload),
      config
    );

    if (res.data.output.code === 0) {
      await fetchInvoice();
      dispatch(setAlert('success', res.data.output.message));
    } else {
      dispatch(setAlert('error', res.data.output.message));
    }
    setRecordingPayment(false);
  };

  const onDowloadPdf = async () => {
    dispatch(setAlert('info', 'Generating PDF...please wait', '', 3000));

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
    dispatch(setAlert('info', 'Generating PDF...please wait', '', 3000));

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

  const onEmailInvoice = async (payload) => {
    const to = payload.to.split(',').map((a) => a.trim());
    const cc = payload.cc ? payload.cc.split(',').map((a) => a.trim()) : [];
    payload = { ...payload, to, cc };

    setEmailSending(true);

    const res = await axios.post(
      `agency/invoice/${invoiceId}/email`,
      JSON.stringify(payload),
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (res.data.output.code === 0) {
      dispatch(setAlert('success', res.data.output.message));
    } else {
      dispatch(setAlert('error', res.data.output.message));
    }
    setIsOpenEmailModal(false);
    setEmailSending(false);
  };

  const updateCustomField = async (payload) => {
    setSaving(true);

    const res = await axios.post(
      `agency/invoice/${invoiceId}/customfields`,
      JSON.stringify(payload),
      config
    );

    if (res.data.output.code === 0) {
      await fetchInvoice();
      dispatch(setAlert('success', res.data.output.message));
    } else {
      dispatch(setAlert('error', res.data.output.message));
    }
    setSaving(false);
  };

  const onChangePauseEmail = async () => {
    const payload = {
      label: 'pause email',
      value:
        invoice.custom_field_hash.cf_pause_email == null
          ? true
          : !invoice.custom_field_hash.cf_pause_email_unformatted,
    };
    await updateCustomField(payload);
  };

  const onChangePauseCollect = async () => {
    const payload = {
      label: 'pause collect',
      value:
        invoice.custom_field_hash.cf_pause_collect == null
          ? true
          : !invoice.custom_field_hash.cf_pause_collect_unformatted,
    };
    await updateCustomField(payload);
  };

  const cannotDelete = (code) => {
    if (invoiceSubscription.plan.plan_code === code) {
      return true;
    }
    if (invoiceSubscription.addons.find((a) => a.addon_code === code)) {
      return true;
    }
    return false;
  };

  const onResolveCommissionError = async () => {
    const res = await axios.put(
      `agency/invoice/errors/${commissionErrors.invoiceErrorId}`,
      { status: 'resolved' }
    );

    if (res.data.success === true) {
      setCommissionErrors(null);
      //await fetchInvoice();
      dispatch(setAlert('success', 'Commission error resolved'));
    } else {
      dispatch(setAlert('error', 'operation encountered an error'));
    }
    setSaving(false);
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

  const voidInvoice = async () => {
    setSavingStatus(true);
    const res = await axios.post(`agency/invoice/${invoiceId}/void`);

    if (res.data.output.code === 0) {
      await fetchInvoice();
      dispatch(setAlert('success', res.data.output.message));
    } else {
      dispatch(setAlert('error', res.data.output.message));
    }
    setIsOpenVoid(false);
    setSavingStatus(false);
  };

  const convertToOpenInvoice = async () => {
    setSavingStatus(true);
    const res = await axios.post(`agency/invoice/${invoiceId}/converttoopen`);

    if (res.data.output.code === 0) {
      await fetchInvoice();
      dispatch(setAlert('success', res.data.output.message));
    } else {
      dispatch(setAlert('error', res.data.output.message));
    }
    setIsOpenConvertToOpen(false);
    setSavingStatus(false);
  };

  const writeOffInvoice = async () => {
    setSavingStatus(true);
    const res = await axios.post(`agency/invoice/${invoiceId}/writeoff`);

    if (res.data.output.code === 0) {
      await fetchInvoice();
      dispatch(setAlert('success', res.data.output.message));
    } else {
      dispatch(setAlert('error', res.data.output.message));
    }
    setIsOpenWriteOff(false);
    setSavingStatus(false);
  };

  const cancelWriteOffInvoice = async () => {
    setSavingStatus(true);
    const res = await axios.post(`agency/invoice/${invoiceId}/cancelwriteoff`);

    if (res.data.output.code === 0) {
      await fetchInvoice();
      dispatch(setAlert('success', res.data.output.message));
    } else {
      dispatch(setAlert('error', res.data.output.message));
    }
    setIsOpenCancelWriteOff(false);
    setSavingStatus(false);
  };

  return !initLoading && invoice ? (
    <div className="">
      <DetailsMenu
        invoice={invoice}
        setIsOpenEmailModal={setIsOpenEmailModal}
        onPrintPdf={onPrintPdf}
        onDowloadPdf={onDowloadPdf}
        setIsOpenCollect={setIsOpenCollect}
        setIsOpenPaymentModal={setIsOpenPaymentModal}
        setIsOpenRecentActivities={setIsOpenRecentActivities}
        setIsOpenVoid={setIsOpenVoid}
        setIsOpenConvertToOpen={setIsOpenConvertToOpen}
        setIsOpenWriteOff={setIsOpenWriteOff}
        setIsOpenCancelWriteOff={setIsOpenCancelWriteOff}
      />
      {commissionErrors &&
        status.isEditable(invoice.status) &&
        userCan('invoices.commissionerror.resolve') && (
          <div className="max-w-7xl mx-auto mb-5">
            <div className="max-w-4xl mx-auto  bg-yellow-50 sm:rounded-lg">
              <div className="px-5 py-4">
                <h3 className="text-md leading-6 font-medium text-yellow-900">
                  Please add commissions
                </h3>
                <div className="mt-2 sm:flex sm:items-start sm:justify-between">
                  <div className="max-w-xl text-xs text-yellow-500">
                    <p>
                      Commissions for this invoice were not auto-added.
                      Reason:&nbsp;
                      <span className="text-red-700">
                        {commissionErrors.description}
                      </span>
                      .<br />
                      You can add them manually by clicking on the add
                      commission button below.
                    </p>
                  </div>
                  <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
                    <Button color="green" onClick={onResolveCommissionError}>
                      Mark As Resolved
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {invoice.payment_made > 0 && (
        <div className="max-w-7xl mx-auto ">
          <div className="max-w-4xl mx-auto border border-gray-200 py-2 px-4 bg-white">
            <div
              className="text-sm cursor-pointer flex justify-between"
              onClick={() => setPaymentsExpanded(!paymentsExpanded)}
            >
              <div>
                <span className=" font-bold">Payments Received</span>
                <span className="ml-2 bg-gray-100 rounded-lg px-1 text-blue-500 text-xs font-normal">
                  {invoice.payments.length}
                </span>
              </div>
              <span>
                {paymentsExpanded ? (
                  <ChevronDownIcon className="w-5 h-5 inline text-gray-500" />
                ) : (
                  <ChevronRightIcon className="w-5 h-5 inline text-gray-500" />
                )}
              </span>
            </div>
            <div
              className={
                paymentsExpanded ? 'border-t mt-2' : 'h-0 overflow-hidden'
              }
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="">
                  <tr>
                    <th
                      scope="col"
                      className="py-1 pl-4 pr-3 text-left text-sm font-medium text-gray-500 sm:pl-6"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-1 text-left text-sm font-medium text-gray-500 "
                    >
                      Payment #
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-1 text-left text-sm font-medium text-gray-500 "
                    >
                      Reference #
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-1 text-left text-sm font-medium text-gray-500 "
                    >
                      Payment Mode
                    </th>
                    <th
                      scope="col"
                      className="relative py-1 pl-3 pr-4 text-left text-sm font-medium text-gray-500 sm:pr-6"
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {invoice.payments.map((payment) => (
                    <tr key={payment.payment_id}>
                      <td className="whitespace-nowrap py-1.5 pl-4 pr-3 text-sm text-gray-700 sm:pl-6">
                        {dateFormatter(payment.date)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-1.5 text-sm text-gray-500">
                        {payment.invoice_payment_id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-1.5 text-sm text-gray-500">
                        {payment.reference_number}
                      </td>
                      <td className="whitespace-nowrap px-3 py-1.5 text-sm capitalize text-gray-500">
                        {payment.payment_mode}
                      </td>
                      <td className="relative whitespace-nowrap py-1.5 pl-3 pr-4 text-sm text-gray-700 sm:pr-6">
                        {currencyFormatter(
                          payment.amount,
                          invoice.currency_code
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {invoice.credits_applied > 0 && (
        <div className="mt-1 max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto  border border-gray-200 py-2 px-4 bg-white">
            <div
              className="text-sm cursor-pointer flex justify-between"
              onClick={() => setCreditsExpanded(!creditsExpanded)}
            >
              <div>
                <span className=" font-bold">Credits Applied</span>
                <span className="ml-2 bg-gray-100 rounded-lg px-1 text-blue-500 text-xs font-normal">
                  {invoice.credits.length}
                </span>
              </div>
              <span>
                {creditsExpanded ? (
                  <ChevronDownIcon className="w-5 h-5 inline text-gray-500" />
                ) : (
                  <ChevronRightIcon className="w-5 h-5 inline text-gray-500" />
                )}
              </span>
            </div>
            <div
              className={
                creditsExpanded ? 'border-t mt-2' : 'h-0 overflow-hidden'
              }
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="">
                  <tr>
                    <th
                      scope="col"
                      className="py-1 pl-4 pr-3 text-left text-sm font-medium text-gray-500 sm:pl-6"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-1 text-left text-sm font-medium text-gray-500 "
                    >
                      Credit Note #
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-1 text-left text-sm font-medium text-gray-500 "
                    >
                      Credits Applied
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {invoice.credits.map((credit) => (
                    <tr key={credit.creditnote_id}>
                      <td className="whitespace-nowrap py-1.5 pl-4 pr-3 text-sm text-gray-700 sm:pl-6">
                        {dateFormatter(credit.credited_date)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-1.5 text-sm text-gray-500">
                        {credit.creditnotes_number}
                      </td>
                      <td className="whitespace-nowrap px-3 py-1.5 text-sm text-gray-500">
                        {currencyFormatter(
                          credit.credited_amount,
                          invoice.currency_code
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="mt-1 text-sm">&nbsp;</div>

      {status.pending() && userCan('invoices.queue.email') && (
        <AutoOptionEmail
          invoice={invoice}
          saving={saving}
          onChangePauseEmail={onChangePauseEmail}
        />
      )}

      {(status.sent() || status.overdue()) &&
        userCan('invoices.queue.collect') && (
          <AutoOptionCollect
            invoice={invoice}
            saving={saving}
            onChangePauseCollect={onChangePauseCollect}
          />
        )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-sm p-5 relative">
          <div className="ribbon">
            <div
              className={classnames('ribbon-inner', {
                'bg-green-500': status.paid() || status.partiallyPaid(),
                'bg-blue-500': status.sent(),
                'bg-yellow-500': status.pending(),
                'bg-red-500': status.overdue(),
                'bg-gray-500': status.voided(),
              })}
            >
              <span>{strUnderscoreToSpace(invoice.status)}</span>
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-4 sm:gap-3">
            <div className="self-end text-sm col-span-2 text-right sm:text-left mb-3 sm:mb-0">
              <span className="text-gray-500">Bill To</span>

              <p className="mt-2 mb-0 text-red-600">
                <Link to={`/clients/account/${invoice.reference_id}`}>
                  {invoice.customer_name}
                </Link>
              </p>
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
              <h2 className="col-span-2 text-3xl font-bold mb-2">
                {invoice.invoice_number}
              </h2>
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
                  {status.isEditable(invoice.status) &&
                    Th('', 'text-right w-1/12')}
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
                            <span className="text-gray-500 text-xs whitespace-pre-wrap">
                              {invoiceItem.description}
                            </span>
                          </>
                        )}
                        {Td(invoiceItem.quantity, 'text-right')}
                        {Td(floatFormatter(invoiceItem.price), 'text-right')}
                        {Td(
                          floatFormatter(invoiceItem.item_total),
                          'text-right'
                        )}
                        {status.isEditable(invoice.status) && (
                          <td className="text-right">
                            {!cannotDelete(invoiceItem.code) &&
                              userCan('invoices.lineitem.delete') && (
                                <ButtonLink
                                  color="red"
                                  spinnerColor="red-500"
                                  loading={deletingItem}
                                  onClick={
                                    status.needReasonForUpdate()
                                      ? () => {
                                          setIsOpenReasonModal(true);
                                          setReasonPayload({
                                            action: 'delete',
                                            payload: invoiceItem,
                                          });
                                        }
                                      : (e) =>
                                          deleteInvoiceItem(invoiceItem, '')
                                  }
                                  title="delete"
                                >
                                  <TrashIcon className="w-5 h-5 text-red-500" />
                                </ButtonLink>
                              )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                {lineItems &&
                  lineItems.map((lineItem, index) => {
                    return (
                      <tr className="bg-white border-b" key={index}>
                        {Td(
                          <>
                            <Input
                              type="text"
                              name="name"
                              value={lineItem.name}
                              onChange={(e) => onInputChange(e, index)}
                              placeholder="Name"
                            />
                            <Textarea
                              name="description"
                              value={lineItem.description}
                              onChange={(e) => onInputChange(e, index)}
                              rows={3}
                              placeholder="Description"
                            />
                          </>
                        )}
                        {Td(
                          <Input
                            type="number"
                            name="quantity"
                            value={lineItem.quantity}
                            onChange={(e) => onInputChange(e, index)}
                            placeholder="qty"
                          />
                        )}
                        {Td(
                          <Input
                            type="number"
                            name="price"
                            value={lineItem.price}
                            onChange={(e) => onInputChange(e, index)}
                            placeholder="price"
                          />
                        )}
                        {Td(
                          floatFormatter(lineItem.price * lineItem.quantity),
                          'text-right'
                        )}

                        <td className="text-right">
                          <ButtonLink
                            color="red"
                            spinnerColor="red-500"
                            onClick={(e) => removeLineItem(e, index)}
                            title="delete"
                          >
                            <TrashIcon className="w-5 h-5 text-red-500" />
                          </ButtonLink>
                        </td>
                      </tr>
                    );
                  })}

                {/* {loading && (
                  <tr className="bg-white border-b">
                    <td colSpan={5} className="p-4 text-sm text-center">
                      <Loading />
                    </td>
                  </tr>
                )} */}

                {lineItems && lineItems.length > 0 && (
                  <tr className="bg-white border-b">
                    <td colSpan={5} className="p-4 text-sm text-center">
                      <ButtonLink
                        color="green"
                        spinnerColor="red-500"
                        loading={savingItem}
                        showLoading={true}
                        onClick={
                          status.needReasonForUpdate()
                            ? () => {
                                setIsOpenReasonModal(true);
                                setReasonPayload({
                                  action: 'add',
                                  payload: null,
                                });
                              }
                            : () => saveLineItems('')
                        }
                      >
                        <CheckIcon className="w-4 h-4 inline" />
                        &nbsp;Save Line Items
                      </ButtonLink>
                    </td>
                  </tr>
                )}
                {status.isEditable(invoice.status) && (
                  <tr className="bg-white border-b">
                    <td colSpan={5} className="p-4 text-sm text-center">
                      {userCan('invoices.lineitem.add') && (
                        <ButtonLink
                          color="gray"
                          classes="border py-1 px-3 bg-white rounded-md"
                          onClick={addItem}
                        >
                          <PlusIcon className="w-4 h-4 inline" /> Line Item
                        </ButtonLink>
                      )}

                      {invoiceCommission &&
                        userCan('invoices.lineitem.commission.add') && (
                          <ButtonLink
                            color="red"
                            spinnerColor="red-500"
                            loading={loadComputed}
                            showLoading={true}
                            onClick={computeMyCommissions}
                            classes="ml-2 border py-1 px-3 bg-white rounded-md"
                          >
                            <PlusIcon className="w-4 h-4 inline" /> Compute
                            Commission
                          </ButtonLink>
                        )}
                      {commissionData.length > 0 &&
                        !invoiceCommission &&
                        userCan('invoices.lineitem.commission.add') && (
                          <ButtonLink
                            color="red"
                            spinnerColor="red-500"
                            loading={loadComputed}
                            showLoading={true}
                            onClick={addCommissionLineItem}
                            classes="ml-2 border py-1 px-3 bg-white rounded-md"
                          >
                            <PlusIcon className="w-4 h-4 inline" /> Commission
                          </ButtonLink>
                        )}
                    </td>
                  </tr>
                )}
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
                  {floatFormatter(invoice.sub_total)}
                </div>

                {invoice.taxes &&
                  invoice.taxes.map((tax, i) => {
                    return (
                      <Fragment key={i}>
                        <div className="col-span-2 sm:col-span-3 text-gray-500">
                          {tax.tax_name}
                        </div>
                        <div className="col-span-2 sm:col-span-1 pr-4">
                          {currencyFormatter(
                            tax.tax_amount,
                            invoice.currency_code
                          )}
                        </div>
                      </Fragment>
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
                      (-) {floatFormatter(invoice.payment_made)}
                    </div>
                  </>
                )}
                {invoice.credits_applied > 0 && (
                  <>
                    <div className="col-span-2 sm:col-span-3 text-gray-500">
                      Credits Applied
                    </div>
                    <div className="col-span-2 sm:col-span-1 text-red-500 pr-4">
                      (-) {floatFormatter(invoice.credits_applied)}
                    </div>
                  </>
                )}
                {invoice.write_off_amount > 0 && (
                  <>
                    <div className="col-span-2 sm:col-span-3 text-gray-500">
                      Write Off Amount
                    </div>
                    <div className="col-span-2 sm:col-span-1 text-red-500 pr-4">
                      (-) {floatFormatter(invoice.write_off_amount)}
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

      {isAgencySuperUser() && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto p-5 relative  text-sm">
            <div className="flex flex-col">
              <h4 className="underline mb-1">Custom Fields</h4>
              <span className="text-xs">
                Pause Email:&nbsp;&nbsp;
                <b>{invoice.custom_field_hash.cf_pause_email}</b>
              </span>
              <span className="text-xs">
                Pause Collect:&nbsp;&nbsp;
                <b>{invoice.custom_field_hash.cf_pause_collect}</b>
              </span>
              <span className="text-xs">
                Charge Admin Fee:&nbsp;&nbsp;
                <b>{invoice.custom_field_hash.cf_charge_admin_fee ?? 'no'}</b>
              </span>
              <span className="text-xs">
                Commission Added:&nbsp;&nbsp;
                <b>{invoice.custom_field_hash.cf_commission_added}</b>
              </span>
              <span className="text-xs">
                Account Id:&nbsp;&nbsp;
                <b>{invoice.custom_field_hash.cf_bs_account_id}</b>
              </span>
              <span className="text-xs">
                For Upsell:&nbsp;&nbsp;
                <b>{invoice.custom_field_hash.cf_upsell}</b>
              </span>
            </div>
          </div>
        </div>
      )}

      <EmailInvoiceModal
        subscription={invoiceSubscription}
        subscriptionRecord={invoiceSubscriptionRecord}
        invoice={invoice}
        open={isOpenEmailModal}
        setOpen={setIsOpenEmailModal}
        onEmailSend={onEmailInvoice}
        loading={emailSending}
      />
      <RecordPaymentModal
        invoice={invoice}
        open={isOpenPaymentModal}
        setOpen={setIsOpenPaymentModal}
        onRecordPayment={onRecordPayment}
        loading={recordingPayment}
      />
      <RecentActivitiesSlideOver
        open={isOpenRecentActivities}
        setOpen={setIsOpenRecentActivities}
        invoice={invoice}
      />
      <ConfirmationModal
        title="Charge customer"
        content="Are you sure you want to charge payment for this invoice?"
        open={isOpenCollect}
        setOpen={setIsOpenCollect}
        onOkClick={onCollectCharge}
        onCancelClick={() => setIsOpenCollect(false)}
        okLoading={savingStatus}
        showOkLoading={true}
      />
      <ConfirmationModal
        title="Void Invoice"
        content="Are you sure you want to void this invoice?"
        open={isOpenVoid}
        setOpen={setIsOpenVoid}
        onOkClick={voidInvoice}
        onCancelClick={() => setIsOpenVoid(false)}
        okLoading={savingStatus}
        showOkLoading={true}
      />
      <ConfirmationModal
        title="Convert To Open Invoice"
        content="Are you sure you want to undo void for this invoice?"
        open={isOpenConvertToOpen}
        setOpen={setIsOpenConvertToOpen}
        onOkClick={convertToOpenInvoice}
        onCancelClick={() => setIsOpenConvertToOpen(false)}
        okLoading={savingStatus}
        showOkLoading={true}
      />
      <ConfirmationModal
        title="Write Off Invoice"
        content="Are you sure you want to write off this invoice?"
        open={isOpenWriteOff}
        setOpen={setIsOpenWriteOff}
        onOkClick={writeOffInvoice}
        onCancelClick={() => setIsOpenWriteOff(false)}
        okLoading={savingStatus}
        showOkLoading={true}
      />
      <ConfirmationModal
        title="Cancel Write Off Invoice"
        content="Are you sure you want to cancel write off for this invoice?"
        open={isOpenCancelWriteOff}
        setOpen={setIsOpenCancelWriteOff}
        onOkClick={cancelWriteOffInvoice}
        onCancelClick={() => setIsOpenCancelWriteOff(false)}
        okLoading={savingStatus}
        showOkLoading={true}
      />
      <ReasonForUpdateModal
        invoice={invoice}
        open={isOpenReasonModal}
        setOpen={setIsOpenReasonModal}
        onAddReason={onAddReason}
      />
    </div>
  ) : (
    <div className="mt-6">
      <Loading />
    </div>
  );
};
export default InvoiceDetails;
