import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import isURL from 'validator/lib/isURL';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { startCase } from 'lodash';
import prependHttp from 'prepend-http';

import { setAlert } from 'features/alerts/alertsSlice';
import EmailSignature from './components/EmailSignature';

import { addLogs, emailSend } from '../../clientChecklistsSlice';

const UrlAction = ({ data, agencyClientId, setOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [copiesUrl, setCopiesUrl] = useState('');
  const [listingImageUrl, setListingImageUrl] = useState('');
  const [aPlusContentUrl, setAPlusContentUrl] = useState('');
  const [brandPageUrl, setBrandPageUrl] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [client, setClient] = useState(null);

  const { clientChecklist, defaultValue } = data;
  const { clientChecklistId } = clientChecklist[0];
  const [ccList, setCCList] = useState(null);

  const signature = EmailSignature();

  // * Populate the URLs
  const populateUrls = (data) => {
    if (data !== null) {
      const { copiesUrl, listingImageUrl, aPlusContentUrl, brandPageUrl } =
        data;
      setCopiesUrl(copiesUrl);
      setListingImageUrl(listingImageUrl);
      setAPlusContentUrl(aPlusContentUrl);
      setBrandPageUrl(brandPageUrl);
    }
  };

  // Get Client
  useEffect(() => {
    axios.get(`/agency/client/${agencyClientId}`).then((res) => {
      setClient(res.data.data);
    });
  }, []);

  // * Get the details of a client checklist
  useEffect(() => {
    if (clientChecklistId !== null) {
      axios
        .get(`/agency/client/checklists/${clientChecklistId}`)
        .then((res) => {
          setCCList(res.data.data);
          populateUrls(res.data.data.value);
        });
    }
  }, [dispatch, refresh, clientChecklistId]);

  // * Update the value of the checklist
  const updateClientChecklist = (body) => {
    axios
      .post(`/agency/client/${agencyClientId}/checklists`, body)
      .then((res) => {
        dispatch(
          setAlert('success', t('Clients.ClientChecklists.UpdateChecklist'))
        );
        setRefresh(!refresh);
      });
  };

  const onChange = (e, type) => {
    switch (type) {
      case 'copies':
        setCopiesUrl(e.target.value);
        break;
      case 'listing':
        setListingImageUrl(e.target.value);
        break;
      case 'aplus':
        setAPlusContentUrl(e.target.value);
        break;
      case 'brand':
        setBrandPageUrl(e.target.value);
        break;
      default:
        dispatch(
          setAlert(
            'error',
            t('Clients.ClientChecklists.Url.SomethingWentWrong')
          )
        );
        break;
    }
  };

  const validateUrl = (value, key, url, setter) => {
    if (isURL(url)) {
      value[key] = url;
    } else {
      if (url !== '') {
        dispatch(
          setAlert(
            'error',
            `${t('Clients.ClientChecklists.Url.InvalidValue')} ${startCase(
              key
            )}`
          )
        );
        setter('');
      }
    }
    return value;
  };

  const onSave = () => {
    let value = {
      copiesUrl: '',
      listingImageUrl: '',
      aPlusContentUrl: '',
      brandPageUrl: '',
    };

    value = validateUrl(value, 'copiesUrl', copiesUrl, setCopiesUrl);
    value = validateUrl(
      value,
      'listingImageUrl',
      listingImageUrl,
      setListingImageUrl
    );
    value = validateUrl(
      value,
      'aPlusContentUrl',
      aPlusContentUrl,
      setAPlusContentUrl
    );
    value = validateUrl(value, 'brandPageUrl', brandPageUrl, setBrandPageUrl);

    const body = {
      value,
      checklistId: ccList.checklistId,
    };

    const keys = Object.keys(value);

    let logs = [];
    keys.forEach((key, index) => {
      if (value[key] !== '') {
        logs.push(startCase(key));
      }
    });

    updateClientChecklist(body);
    dispatch(
      addLogs(
        clientChecklistId,
        `${t('Clients.ClientChecklists.Url.AddedData')} ${logs.join(', ')}`
      )
    );
  };

  const onClickLink = (url) => {
    if (url !== '') {
      window.open(prependHttp(url));
    }
  };

  const replaceJSX = (str, find, replace) => {
    const parts = str.split(find);
    const result = [];
    for (let i = 0; i < parts.length; i++) {
      result.push(parts[i]);
      if (i < parts.length - 1) result.push(replace);
    }
    return result.join('');
  };

  const onSendToClient = (type) => {
    let body = '';
    let subject = '';
    // * Setup Email Templates
    if (defaultValue !== null && client !== null) {
      const {
        copiesUrl: cHtml,
        listingImageUrl: lHtml,
        aPlusContentUrl: aHtml,
        brandPageUrl: bHtml,
      } = defaultValue;

      switch (type) {
        case 'copies':
          if (copiesUrl !== '') {
            subject = 'Copies URL';
            body = replaceJSX(cHtml, '{{name}}', client.client);
            body = replaceJSX(body, '{{copiesUrl}}', prependHttp(copiesUrl));
          }
          break;
        case 'listing':
          if (listingImageUrl !== '') {
            subject = 'Listing Image URL';
            body = replaceJSX(lHtml, '{{name}}', client.client);
            body = replaceJSX(
              body,
              '{{listingImageUrl}}',
              prependHttp(listingImageUrl)
            );
          }
          break;
        case 'aplus':
          if (aPlusContentUrl !== '') {
            subject = 'A+ Content URL';
            body = replaceJSX(aHtml, '{{name}}', client.client);
            body = replaceJSX(
              body,
              '{{aPlusContentUrl}}',
              prependHttp(aPlusContentUrl)
            );
          }
          break;
        case 'brand':
          if (brandPageUrl !== '') {
            subject = 'Brand Page URL';
            body = replaceJSX(bHtml, '{{name}}', client.client);
            body = replaceJSX(
              body,
              '{{brandPageUrl}}',
              prependHttp(brandPageUrl)
            );
          }
          break;
        default:
          dispatch(
            setAlert(
              'error',
              t('Clients.ClientChecklists.Url.SomethingWentWrong')
            )
          );
          break;
      }
    }

    if (body !== '') {
      const formData = {
        message: body + `<br/> ${signature}`,
        to: client.defaultContact.email,
        cc: '',
        subject,
        defaultTo: '',
        defaultCc: '',
      };

      dispatch(emailSend(agencyClientId, formData));
    } else {
      dispatch(
        setAlert('error', t('Clients.ClientChecklists.Url.NoUrlToSend'))
      );
    }
  };

  return (
    <>
      <p className="block mb-5">
        <input
          type="text"
          value={copiesUrl}
          placeholder={t('Profile.Checklist.CopiesUrl')}
          className="w-9/12 float-left"
          onChange={(e) => onChange(e, 'copies')}
        />
        <ExternalLinkIcon
          onClick={() => onClickLink(copiesUrl)}
          className="w-10 ml-3 mr-3 p-1 cursor-pointer border border-solid border-gray-600 float-left"
        />
        <button
          onClick={() => onSendToClient('copies')}
          className="text-sm mr-2 inline-flex items-center p-2.5 border border-transparent rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {t('Clients.ClientChecklists.Url.SendToClient')}
        </button>
      </p>
      <p className="block mb-5">
        <input
          type="text"
          value={listingImageUrl}
          placeholder={t('Profile.Checklist.ListingImageUrl')}
          className="w-9/12 float-left"
          onChange={(e) => onChange(e, 'listing')}
        />
        <ExternalLinkIcon
          onClick={() => onClickLink(listingImageUrl)}
          className="w-10 ml-3 mr-3 p-1 cursor-pointer border border-solid border-gray-600 float-left"
        />
        <button
          onClick={() => onSendToClient('listing')}
          className="text-sm mr-2 inline-flex items-center p-2.5 border border-transparent rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {t('Clients.ClientChecklists.Url.SendToClient')}
        </button>
      </p>
      <p className="block mb-5">
        <input
          type="text"
          value={aPlusContentUrl}
          placeholder={t('Profile.Checklist.APlusContentUrl')}
          className="w-9/12 float-left"
          onChange={(e) => onChange(e, 'aplus')}
        />
        <ExternalLinkIcon
          onClick={() => onClickLink(aPlusContentUrl)}
          className="w-10 ml-3 mr-3 p-1 cursor-pointer border border-solid border-gray-600 float-left"
        />
        <button
          onClick={() => onSendToClient('aplus')}
          className="text-sm mr-2 inline-flex items-center p-2.5 border border-transparent rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {t('Clients.ClientChecklists.Url.SendToClient')}
        </button>
      </p>
      <p className="block mb-5">
        <input
          type="text"
          value={brandPageUrl}
          placeholder={t('Profile.Checklist.BrandPageUrl')}
          className="w-9/12 float-left"
          onChange={(e) => onChange(e, 'brand')}
        />
        <ExternalLinkIcon
          onClick={() => onClickLink(brandPageUrl)}
          className="w-10 ml-3 mr-3 p-1 cursor-pointer border border-solid border-gray-600 float-left"
        />
        <button
          onClick={() => onSendToClient('brand')}
          className="text-sm mr-2 inline-flex items-center p-2.5 border border-transparent rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {t('Clients.ClientChecklists.Url.SendToClient')}
        </button>
      </p>

      <p>
        <button
          onClick={() => onSave()}
          className="float-left w-32 text-center text-sm items-center p-2.5 mb-4 border border-transparent rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {t('Save')}
        </button>
      </p>
    </>
  );
};

export default UrlAction;
