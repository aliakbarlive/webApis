import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment-timezone';
import axios from 'axios';

import Editor from 'components/Editor';
import Input from 'components/Forms/Input';
import Checkbox from 'components/Forms/Checkbox';
import { setAlert } from '../../../alerts/alertsSlice';
import EmailSignature from './components/EmailSignature';

import usePermissions from 'hooks/usePermissions';
import { selectAuthenticatedUser } from 'features/auth/authSlice';

import {
  updateClientChecklist,
  updateClientDefaultValue,
  emailSend,
  fetchClientChecklists,
} from '../../clientChecklistsSlice';

const EmailAction = ({ data, agencyClientId, setOpen }) => {
  const { userCan, isAgencySuperUser } = usePermissions();
  const user = useSelector(selectAuthenticatedUser);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [client, setClient] = useState({});
  const [emailIndex, setEmailIndex] = useState(0);

  useEffect(() => {
    axios.get(`/agency/client/${agencyClientId}`).then((res) => {
      setClient(res.data.data);
    });
  }, []);

  const applyVariables = (value) => {
    let content = value;

    if (client.defaultContact) {
      // {{directContactName}}
      content = content.replaceAll(
        '{{directContactName}}',
        client.defaultContact.firstName + ' ' + client.defaultContact.lastName
      );
    }

    if (user.email) {
      // {{employeeEmail}}
      content = content.replaceAll('{{employeeEmail}}', user.email);
    }

    return content;
  };

  const signature = EmailSignature();
  const defaultValue = `${
    data.clientChecklist.find((e) => data.checklistId === e.checklistId) &&
    data.clientChecklist.find((e) => data.checklistId === e.checklistId).value
      ? data.clientChecklist.find((e) => data.checklistId === e.checklistId)
          .value[emailIndex].value
      : applyVariables(data.defaultValue[emailIndex].value) +
        `<br/> ${signature}`
  }`;

  const subjects = [
    { name: 'Introduction', value: t('Clients.ClientChecklists.Subject1') },
    {
      name: 'Get Amazon Sub User Access and MWS Token',
      value: t('Clients.ClientChecklists.Subject2'),
    },
    {
      name: 'Setup Manage By Stats',
      value: t('Clients.ClientChecklists.Subject5'),
    },
  ];

  const [formData, setFormData] = useState({
    message: defaultValue,
    to: '',
    cc: '',
    subject: subjects.find((el) => el.name === data.name).value,
    defaultTo: '',
    defaultCc: '',
  });

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onEditorChange = (val) => {
    setFormData({ ...formData, message: val });
  };

  const validateEmails = (string) => {
    var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    var result = string.replace(/\s/g, '').split(/,|;/);
    for (var i = 0; i < result.length; i++) {
      if (!regex.test(result[i])) {
        return false;
      }
    }
    return true;
  };

  const onChangeDefaultRecipient = (e, as) => {
    const { checked } = e.target;
    setFormData({
      ...formData,
      [`default${as}`]:
        checked && client && client.defaultContact
          ? client.defaultContact.email
          : '',
    });
  };

  const onSave = async (transactionDate) => {
    if (formData.message) {
      let value =
        data.clientChecklist.find((e) => data.checklistId === e.checklistId) &&
        data.clientChecklist.find((e) => data.checklistId === e.checklistId)
          .value
          ? JSON.parse(
              JSON.stringify(
                data.clientChecklist.find(
                  (e) => data.checklistId === e.checklistId
                ).value
              )
            )
          : JSON.parse(JSON.stringify(data.defaultValue));

      value[emailIndex].value = formData.message;

      if (
        data.defaultValue.length > 1 &&
        !!!data.clientChecklist.find(
          (e) => data.checklistId === e.checklistId
        ) &&
        emailIndex === 0
      ) {
        value[1].value = value[1].value + `<br/> ${signature}`;
      }

      const params = {
        checklistId: data.checklistId,
        value,
        status:
          data.clientChecklist.find(
            (e) => data.checklistId === e.checklistId
          ) &&
          data.clientChecklist.find((e) => data.checklistId === e.checklistId)
            .status
            ? data.clientChecklist.find(
                (e) => data.checklistId === e.checklistId
              ).status
            : 'incomplete',
      };

      if (transactionDate) {
        params.transactionDate = moment().format('YYYY-MM-DD');
      }
      await dispatch(updateClientChecklist(agencyClientId, params));
      await dispatch(fetchClientChecklists(agencyClientId));
      setOpen(false);
    } else {
      await dispatch(
        setAlert('error', t('Clients.ClientChecklists.ProvideEmailContent'))
      );
    }
  };

  const onSaveTemplate = async () => {
    // Get Email Template without the Signature
    let newTemplate = formData.message.substr(
      0,
      formData.message.indexOf(`<!-- signature -->`)
    );

    let newDefaultValue = JSON.parse(JSON.stringify(data.defaultValue));
    newDefaultValue[emailIndex].value = newTemplate;
    const params = {
      checklistId: data.checklistId,
      defaultValue: newDefaultValue,
    };
    await dispatch(updateClientDefaultValue(agencyClientId, params));
    await dispatch(fetchClientChecklists(agencyClientId));
  };

  const onSend = async () => {
    if (
      ((formData.to && validateEmails(formData.to)) || formData.defaultTo) &&
      (!formData.cc || validateEmails(formData.cc))
    ) {
      onSave(true);
      await dispatch(emailSend(agencyClientId, formData));
      await dispatch(fetchClientChecklists(agencyClientId));
    } else {
      dispatch(
        setAlert('error', t('Clients.ClientChecklists.CheckEmailRecipient'))
      );
    }
  };

  return (
    <>
      {/* Tabs if multiple email */}
      <div className="xl:w-full xl:mx-0 h-12 hidden sm:block bg-white shadow rounded">
        <ul className="flex border-b px-5">
          {data && data.defaultValue
            ? data.defaultValue.map((el, i) => {
                return (
                  <li
                    key={i}
                    onClick={() => setEmailIndex(i)}
                    className={
                      emailIndex == i
                        ? 'text-sm border-red-700 pt-3 rounded-t text-red-700 mr-12'
                        : 'text-sm text-gray-600 py-3 flex items-center mr-12 hover:text-red-700 cursor-pointer'
                    }
                  >
                    <div className="flex items-center mb-3">
                      <span className="ml-1 font-normal">{el.name}</span>
                    </div>
                    {emailIndex == i && (
                      <div className="w-full h-1 bg-red-700 rounded-t-md" />
                    )}
                  </li>
                );
              })
            : ''}
        </ul>
      </div>

      {/* Email content */}
      <div className="my-4">
        <Editor initialValue={defaultValue} onEditorChange={onEditorChange} />
      </div>

      {/* Email actions */}
      <div className="flex justify-between">
        <button
          onClick={() => onSave()}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {t('Save')}
        </button>
        <button
          onClick={() => onSaveTemplate()}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {t('Clients.ClientChecklists.SaveTemplate')}
        </button>
      </div>
      <div className="grid grid-cols-2 my-4">
        <div className="bg-gray-200">
          <div className="m-2">
            <div className="mb-2">
              <span>Mail To:</span>
              <Checkbox
                className="ml-4"
                onChange={(e) => onChangeDefaultRecipient(e, 'To')}
              />
              {client && client.defaultContact ? (
                <span className="ml-2 text-xs text-gray-500">
                  {client.defaultContact.firstName}{' '}
                  {client.defaultContact.lastName}
                </span>
              ) : (
                ''
              )}
            </div>
            <Input
              type="email"
              name="to"
              placeholder="Email addresses separated by comma"
              onChange={onInputChange}
              classes="appearance-none px-3 py-2 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>
        <div className="bg-gray-50">
          <div className="m-2">
            <div className="mb-2">
              <span>CC:</span>
              <Checkbox
                className="ml-4"
                onChange={(e) => onChangeDefaultRecipient(e, 'Cc')}
              />
              {client && client.defaultContact ? (
                <span className="ml-2 text-xs text-gray-500">
                  {client.defaultContact.firstName}{' '}
                  {client.defaultContact.lastName}
                </span>
              ) : (
                ''
              )}
            </div>
            <Input
              type="email"
              name="cc"
              placeholder="Email addresses separated by comma"
              onChange={onInputChange}
              classes="appearance-none px-3 py-2 placeholder-gray-400 focus:outline-none"
              required
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4">
        <div>
          <button
            onClick={() => onSend()}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {t('Clients.ClientChecklists.SendEmail')}
          </button>
        </div>
      </div>
    </>
  );
};

export default EmailAction;
