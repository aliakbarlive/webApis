import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Label from 'components/Forms/Label';
import Input from 'components/Forms/Input';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import { setAlert } from 'features/alerts/alertsSlice';
import isEmail from 'validator/lib/isEmail';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const InvoiceEmailModal = ({ open, setOpen, client, setClient }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [invoiceEmail, setInvoiceEmail] = useState('');
  const onChange = (e) => {
    setInvoiceEmail(e.target.value);
  };
  const saveInvoiceEmail = () => {
    if (isEmail(invoiceEmail)) {
      const { agencyClientId, invoiceEmails } = client;
      let emails = invoiceEmails;
      if (invoiceEmails === null) {
        emails = [];
      }
      if (emails.includes(invoiceEmail)) {
        dispatch(
          setAlert('error', t('Profile.Details.InvoiceEmailAlreadyAdded'))
        ).then(() => {
          setInvoiceEmail('');
        });
      } else {
        emails.push(invoiceEmail);
        const body = {
          invoiceEmails: emails,
        };
        axios
          .post(`/agency/client/${agencyClientId}/invoice-emails`, body)
          .then((res) => {
            dispatch(
              setAlert('success', t('Profile.Details.InvoiceEmailAdded'))
            ).then(() => {
              setInvoiceEmail('');
              setOpen(false);
              setClient({
                ...client,
                invoiceEmails: [...emails],
                account: {
                  ...client.account,
                },
              });
            });
          });
      }
    } else {
      dispatch(
        setAlert('error', t('Profile.Details.InvoiceEmailInvalidEmail'))
      ).then(() => {
        setInvoiceEmail('');
      });
    }
  };
  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left transition-all transform bg-white shadow-xl rounded-xl">
        <ModalHeader
          title={t('Profile.Details.InvoiceEmailTitle')}
          setOpen={setOpen}
          titleClasses="capitalize"
        />
        <div>
          <div className="flex flex-col space-y-2 text-left bg-gray-50 p-3 rounded-lg shadow-sm">
            <div className="col-span-2">
              <Label htmlFor="email" classes="text-left">
                {t('Profile.Details.InvoiceEmail')}
              </Label>
              <div>
                <Input
                  id="email"
                  type="text"
                  value={invoiceEmail}
                  onChange={onChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="px-2 py-3 text-right bg-gray-50 border-t">
          <div>
            <Button color="gray" onClick={() => setOpen(false)}>
              {t('Profile.Details.InvoiceEmailCancel')}
            </Button>
            &nbsp;
            <Button onClick={saveInvoiceEmail}>
              {t('Profile.Details.InvoiceEmailSave')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceEmailModal;
