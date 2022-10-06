import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import { dateFormatter } from 'utils/formatters';

const CancelImmediatelyModal = ({
  open,
  setOpen,
  pendingInvoices,
  onChange,
  loading,
}) => {
  const hasPendingInvoices =
    pendingInvoices.invoices && pendingInvoices.invoices.length > 0;

  let total = 0;
  if (hasPendingInvoices) {
    total =
      pendingInvoices.invoices.length >= 1
        ? pendingInvoices.invoices.reduce((a, b) => a + b.balance, 0)
        : pendingInvoices.invoices[0].balance;
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
              Subscription will be canceled immediately and the customer will
              not be able to use the service from the moment its canceled.
            </p>
            <Button
              classes="mt-2"
              onClick={() => onChange(false)}
              loading={loading}
              showLoading={true}
            >
              Cancel Immediately
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CancelImmediatelyModal;
