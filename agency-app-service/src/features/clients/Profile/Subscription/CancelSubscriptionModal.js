import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import { dateFormatter } from 'utils/formatters';

const CancelSubscriptionModal = ({
  open,
  setOpen,
  subscription,
  pendingInvoices,
  onChange,
  loading,
}) => {
  const hasPendingInvoices =
    pendingInvoices.invoices && pendingInvoices.invoices.length > 0;

  let total = 0;
  if (hasPendingInvoices) {
    if (pendingInvoices.invoices.length >= 1) {
      total = pendingInvoices.invoices.reduce((a, b) => a + b.balance, 0);
    } else {
      total = pendingInvoices.invoices[0].balance;
    }

    // let t =
    // invoices.length >= 1
    //   ? invoices.reduce((a, b) => a + b.balance, 0)
    //   : 0;
  }

  return (
    <Modal open={open} setOpen={setOpen} align="top" as={'div'}>
      <div className="inline-block w-full max-w-xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
        <ModalHeader title="Cancel Subscription" setOpen={setOpen} />
        <div className="p-4">
          {hasPendingInvoices && (
            <p className="bg-yellow-50 text-gray-900 text-sm p-3 mb-3">
              Upon cancellation, Zoho Subscriptions will not charge the customer
              for any open invoices. Currently there are
              <b>&nbsp;{pendingInvoices.invoices.length}&nbsp;</b> open invoices
              amounting
              <b>&nbsp;${total}&nbsp;</b>
              due for payment. You can collect offline payment and mark the
              invoices as closed or in the event of non-payment, mark it as void
              or write off.
            </p>
          )}

          <div className="p-3 mb-3">
            <p className="text-gray-600 text-sm mt-1">
              Customer can use the service till the end of current term and the
              subscription will be canceled on&nbsp;
              <span className="font-medium text-black">
                {dateFormatter(subscription.next_billing_at)}
              </span>
            </p>
            <Button
              classes="mt-2"
              onClick={() => onChange(true)}
              loading={loading}
              showLoading={true}
            >
              Cancel on Next Renewal
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CancelSubscriptionModal;
