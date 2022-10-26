import Button from 'components/Button';
import Input from 'components/Forms/Input';
import Label from 'components/Forms/Label';
import RequiredAsterisk from 'components/Forms/RequiredAsterisk';
import Textarea from 'components/Forms/Textarea';
import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import { useEffect, useState } from 'react';

const EmailInvoiceModal = ({
  subscription,
  subscriptionRecord,
  invoice,
  open,
  setOpen,
  onEmailSend,
  loading,
}) => {
  const [formData, setFormData] = useState({
    to: '',
    cc: '',
    subject: '',
    body: '',
  });

  useEffect(() => {
    if (invoice && open) {
      console.log(subscriptionRecord, 'sss');

      const body = setFormData({
        ...formData,
        to: invoice.contactpersons[0].email,
        subject: `Invoice from Seller Interactive (Invoice#: ${invoice.number})`,
        body: `Dear ${invoice.customer_name},
        Please review this invoice and let us know if you have any questions or concerns. ${
          subscriptionRecord?.isOffline === true
            ? `
          You can pay for the invoice from the link below. You can also view, print or download the invoice from the link.
          
          ${invoice.invoice_url}
          `
            : 'We will charge the credit card on file in 4 days.'
        }

        Thanks for your business,
        Seller Interactive`,
      });
    }
  }, [invoice, subscriptionRecord, open]);

  const onInputChange = (e) => {
    const { target } = e;
    setFormData({ ...formData, [target.name]: target.value });
  };

  const onSubmit = () => {
    onEmailSend(formData);
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
        <ModalHeader title="Email Invoice" setOpen={setOpen} />

        <form method="POST" onSubmit={onSubmit}>
          <div className="py-4 px-6">
            <div className="">
              <div className="flex justify-between">
                <Label htmlFor="to" classes="text-left">
                  To <RequiredAsterisk />
                </Label>
                <span className="text-xs text-gray-500">
                  separate emails by comma
                </span>
              </div>

              <Input
                id="to"
                type="text"
                value={formData.to}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mt-2">
              <Label htmlFor="cc" classes="text-left">
                Cc
              </Label>
              <Input
                id="cc"
                type="text"
                value={formData.cc}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mt-2">
              <Label htmlFor="subject" classes="text-left">
                Subject <RequiredAsterisk />
              </Label>
              <Input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mt-2">
              <Label htmlFor="body" classes="text-left">
                Body <RequiredAsterisk />
              </Label>
              <Textarea
                id="body"
                onChange={onInputChange}
                value={formData.body}
                rows={8}
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

export default EmailInvoiceModal;
