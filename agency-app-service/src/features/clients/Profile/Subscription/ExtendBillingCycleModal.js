import Button from 'components/Button';
import Checkbox from 'components/Forms/Checkbox';
import InputAppend from 'components/Forms/InputAppend';
import Label from 'components/Forms/Label';
import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import { useEffect, useState } from 'react';

const ExtendBillingCycleModal = ({
  subscription,
  open,
  setOpen,
  onExtend,
  loading,
}) => {
  const [billingCycles, setBillingCycles] = useState('');
  const [noExpiry, setNoExpiry] = useState(true);

  useEffect(() => {
    if (subscription && open) {
      if (subscription.remaining_billing_cycles > 0) {
        setBillingCycles(subscription.remaining_billing_cycles);
        setNoExpiry(false);
      } else {
        setBillingCycles(0);
        setNoExpiry(true);
      }
    }
  }, [subscription, open]);

  const onExpiryChange = (e) => {
    setNoExpiry(e.target.checked);
    setBillingCycles(
      e.target.checked ? -1 : subscription.remaining_billing_cycles
    );
  };

  const onSubmit = () => {
    onExtend(billingCycles);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      align="top"
      as={'div'}
      noOverlayClick={true}
    >
      <div className="inline-block w-full max-w-xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
        <ModalHeader title="Extend Billing Cycle" setOpen={setOpen} />

        <form method="POST" onSubmit={onSubmit}>
          <div className="py-4 px-6">
            <p className="text-sm text-gray-600 mb-5">
              Change the number of renewals remaining for this subscription by
              editing the no of billing cycles left.
            </p>

            <Label htmlFor="billing_cycles">No of billing cycles left</Label>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-1">
                <InputAppend
                  type="text"
                  name="billing_cycles"
                  id="billing_cycles"
                  value={billingCycles}
                  onChange={(e) => setBillingCycles(e.target.value)}
                  required={!noExpiry}
                  disabled={noExpiry}
                  appendText="cycles"
                />
              </div>
              <div className="col-span-2 flex items-start pt-3">
                <Checkbox
                  id="no-expiry"
                  checked={noExpiry}
                  classes="rounded"
                  onChange={onExpiryChange}
                />
                <Label htmlFor="no-expiry" classes="ml-2 text-sm">
                  Never Expires
                  <br />
                  <sup className="text-gray-400">
                    The subscription will renew forever until you cancel it
                    manually.
                  </sup>
                </Label>
              </div>
            </div>
          </div>
          <div className="text-right mt-4 p-4 border-t">
            <Button
              color="gray"
              onClick={() => setOpen(false)}
              classes="mr-2"
              loading={loading}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={onSubmit}
              loading={loading}
              showLoading={true}
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ExtendBillingCycleModal;
