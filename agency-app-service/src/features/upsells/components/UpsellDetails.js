import axios from 'axios';
import {
  currencyFormatter,
  dateFormatterUTC,
  joiAlertErrorsStringify,
  nameFormatter,
} from 'utils/formatters';
import Label from 'components/Forms/Label';
import Badge from 'components/Badge';
import classnames from 'classnames';
import Button from 'components/Button';
import usePermissions from 'hooks/usePermissions';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAlert } from 'features/alerts/alertsSlice';
import { upperCase } from 'lodash';
import DeleteUpsell from './DeleteUpsell';

const UpsellDetails = ({ upsell, setOpen, getUpsells }) => {
  const dispatch = useDispatch();
  const { userCan } = usePermissions();
  const [checking, setChecking] = useState(false);

  const onCheckPaymentStatus = async () => {
    setChecking(true);
    try {
      await axios
        .post(`/agency/upsells/${upsell.upsellId}/invoice/check`)
        .then((res) => {
          dispatch(
            setAlert('success', `Invoice Status: ${res.data.output.message}`)
          );
          setOpen(false);
          getUpsells();
        });
    } catch (error) {
      console.log(error);
      dispatch(setAlert('error', 'Check failed'));
    }

    setChecking(false);
  };

  const onReopen = async () => {
    try {
      const out = await axios.patch(`/agency/upsells/${upsell.upsellId}`, {
        status: 'pending',
      });

      if (out.data.success === true) {
        dispatch(setAlert('success', `Upsell Saved`, 'Moved to pending'));
        setOpen(false);
        getUpsells();
      } else {
        console.log('err');
        dispatch(setAlert('error', 'An error occurred. Upsell was not saved'));
      }
    } catch (error) {
      const errorMessages = joiAlertErrorsStringify(error);
      dispatch(setAlert('error', error.response.data.message, errorMessages));
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <Label>Client</Label>
        <span className="text-sm">{upsell.agencyClient?.client}</span>
      </div>
      <div className="flex flex-col mt-3">
        <Label>Requested By</Label>
        <span className="text-sm">{nameFormatter(upsell.requestedByUser)}</span>
      </div>
      <div className="sm:flex flex-row mt-3">
        <div className="w-1/2 sm:flex flex-col">
          <Label>Date Created</Label>
          <span className="text-sm">{dateFormatterUTC(upsell.createdAt)}</span>
        </div>
        <div className="w-1/2 sm:flex flex-col">
          <Label>Status</Label>
          <span>
            <Badge
              color={classnames({
                gray: upsell.status === 'draft',
                green: upsell.status === 'approved',
                red: upsell.status === 'rejected',
                yellow: upsell.status === 'pending',
              })}
              classes="uppercase"
              rounded="md"
            >
              {upsell.status}
            </Badge>
          </span>
        </div>
      </div>
      {upsell.status === 'approved' && (
        <div className="sm:flex flex-row mt-3">
          <div className="w-1/2 sm:flex flex-col">
            <Label>Date Approved</Label>
            <span className="text-sm">
              {dateFormatterUTC(upsell.approvedAt)}
            </span>
          </div>
          <div className="w-1/2 sm:flex flex-col">
            <Label>Approved By</Label>
            <span>{nameFormatter(upsell.approvedByUser)}</span>
          </div>
        </div>
      )}
      <div className="sm:flex flex-row mt-3">
        <div className="w-1/2 sm:flex flex-col">
          <Label>Sold By</Label>
          <span>
            {upsell.soldBy ? nameFormatter(upsell.soldByUser) : 'Not assigned'}
          </span>
        </div>
        <div className="w-1/2 sm:flex flex-col">
          <Label>Commission Amount</Label>
          <span className="text-sm">
            {upsell.commissionAmount
              ? currencyFormatter(upsell.commissionAmount)
              : 'N/A'}
          </span>
        </div>
      </div>
      <div className="flex flex-col mt-3">
        <Label>Details</Label>

        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className=" pl-4 pr-3 text-left text-sm font-medium text-gray-500 sm:pl-6 md:pl-0"
              >
                Item
              </th>
              <th
                scope="col"
                className="px-3 text-left text-sm font-medium text-gray-500"
              >
                Qty
              </th>
              <th
                scope="col"
                className="px-3 text-left text-sm font-medium text-gray-500"
              >
                Price
              </th>
              <th
                scope="col"
                className="relative  pl-3 pr-4 sm:pr-6 md:pr-0 text-right"
              >
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {upsell.details?.map((detail) => (
              <tr key={detail.upsellItemId}>
                <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6 md:pl-0">
                  <span className="text-gray-900">{detail.name}</span>
                  <p className="whitespace-pre-wrap">{detail.description}</p>
                </td>
                <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-500">
                  {detail.qty}
                </td>
                <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-500">
                  {detail.price}
                </td>
                <td className="whitespace-nowrap py-2 px-3 text-sm text-gray-500 text-right">
                  &nbsp;
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {upsell.status === 'approved' && (
        <div className="sm:flex flex-row mt-5">
          <div className="w-1/3 sm:flex flex-col">
            <Label>Invoice #</Label>
            {userCan('upsells.invoice.view') && (
              <Link
                to={`/invoices/${upsell.invoiceId}`}
                className="text-red-600 mr-2 text-sm"
              >
                {upsell.invoiceNumber}
              </Link>
            )}
          </div>

          <div className="w-1/3 sm:flex flex-col">
            <Label>Invoice Status</Label>
            <span>
              <Badge
                color={classnames({
                  green: upsell.invoiceStatus === 'paid',
                  yellow: upsell.invoiceStatus === 'pending',
                  red: upsell.invoiceStatus === 'overdue',
                  blue: upsell.invoiceStatus === 'sent',
                  gray: upsell.invoiceStatus === 'void',
                })}
                classes="uppercase"
                rounded="md"
              >
                {upsell.invoiceStatus}
              </Badge>
            </span>
          </div>
          <div className="w-1/3 sm:flex flex-col">
            <Label>Invoice Date</Label>
            <span className="text-sm">
              {dateFormatterUTC(upsell.invoiceDate)}
            </span>
          </div>
        </div>
      )}
      <div className="flex justify-between mt-3">
        <div>
          {upsell.status === 'rejected' && userCan('upsells.delete') && (
            <DeleteUpsell
              upsell={upsell}
              getUpsells={getUpsells}
              closeSlideOver={() => setOpen(false)}
            />
          )}
        </div>
        <div className="text-right">
          <Button
            classes="mt-2 mr-2"
            color="gray"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
          {upsell.status === 'rejected' && userCan('upsells.update') && (
            <Button
              classes="mt-2 mr-2"
              bgColor="yellow-300"
              hoverColor="yellow-400"
              textColor="gray-700"
              onClick={onReopen}
              loading={checking}
              showLoading={true}
            >
              Reopen
            </Button>
          )}
          {upsell.status === 'approved' &&
            upsell.invoiceId &&
            upsell.invoiceStatus !== 'paid' && (
              <Button
                classes="mt-2 mr-2"
                color="red"
                onClick={onCheckPaymentStatus}
                loading={checking}
                showLoading={true}
              >
                Check Payment Status
              </Button>
            )}
          {upsell.status === 'approved' && upsell.invoiceStatus === 'paid' && (
            <Link
              className="btn-green"
              to={`/upsells/orders/details/${upsell.order?.upsellOrderId}`}
            >
              View Order
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default UpsellDetails;
