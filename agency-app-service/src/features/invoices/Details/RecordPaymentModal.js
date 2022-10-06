import Button from 'components/Button';
import Input from 'components/Forms/Input';
import Label from 'components/Forms/Label';
import RequiredAsterisk from 'components/Forms/RequiredAsterisk';
import Select from 'components/Forms/Select';
import Textarea from 'components/Forms/Textarea';
import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import { useEffect, useState } from 'react';

const RecordPaymentModal = ({
  invoice,
  open,
  setOpen,
  onRecordPayment,
  loading,
}) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    amount: '',
    date: '',
    payment_mode: '',
    description: '',
    reference_number: '',
  });

  useEffect(() => {
    if (invoice && open) {
      setFormData({
        ...formData,
        customer_id: invoice.customer_id,
      });
    }
  }, [invoice, open]);

  const onInputChange = (e) => {
    const { target } = e;
    setFormData({ ...formData, [target.name]: target.value });
  };

  const onSubmit = () => {
    onRecordPayment(formData);
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
        <ModalHeader
          title={`Payment for ${invoice.invoice_number}`}
          setOpen={setOpen}
        />

        <form method="POST" onSubmit={onSubmit}>
          <div className="py-4 px-6">
            <div className="">
              <div className="flex justify-between">
                <Label htmlFor="amount" classes="text-left">
                  Amount <RequiredAsterisk />
                </Label>
              </div>

              <Input
                id="amount"
                type="text"
                value={formData.amount}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mt-2">
              <div className="flex justify-between">
                <Label htmlFor="date" classes="text-left">
                  Payment Date <RequiredAsterisk />
                </Label>
                <span className="text-gray-400 text-xs">
                  Format: YYYY-MM-DD
                </span>
              </div>
              <Input
                id="date"
                type="text"
                value={formData.date}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mt-2">
              <Label htmlFor="payment_mode" classes="text-left">
                Mode of Payment <RequiredAsterisk />
              </Label>
              <Select
                name="payment_mode"
                onChange={onInputChange}
                value={formData.payment_mode}
                required
              >
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="creditcard">Credit Card</option>
                <option value="banktransfer">Bank Transfer</option>
                <option value="bankremittance">Bank Remittance</option>
                <option value="other">Others</option>
              </Select>
            </div>
            <div className="mt-2">
              <Label htmlFor="reference_number" classes="text-left">
                Reference #
              </Label>
              <Input
                id="reference_number"
                type="text"
                value={formData.reference_number}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mt-2">
              <Label htmlFor="notes" classes="text-left">
                Notes
              </Label>
              <Textarea
                id="description"
                onChange={onInputChange}
                value={formData.description}
                rows={3}
                required
              />
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

export default RecordPaymentModal;
