import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import Button from 'components/Button';
import { MailIcon } from '@heroicons/react/solid';
import EmailOnboardingForm from './components/EmailOnboardingForm';

import {
  updateClientChecklist,
  emailSend,
  fetchClientChecklists,
} from '../../clientChecklistsSlice';
import FormData from './components/FormData';

const FormAction = ({ data, agencyClientId, setOpen }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const asinDefaultData = {
    isParent: false,
    childrenAsin: '',
    asinName: '',
    isAmazonListed: true,
    amazonLink: '',
    competitors: '',
    keywords: '',
    audience: '',
    featuresAndBenefits: '',
    instructional: '',
    restrictedKeywords: '',
    priority: false,
    runPpc: false,
    productSku: '',
    productMargin: '',
  };

  const defaultFormData = {
    accountManager: '',
    startDate: '',
    accountName: '',
    isExistingBrand: true,
    brandStrokeLink: '',
    websiteLink: '',
    linkToClientAssets: '',
    brandGuide: '',
    brandInfo: '',
    designWork: [
      { label: 'Listing Images', key: 'listingImages', value: true },
      { label: 'A+ Content', key: 'aPlusContent', value: false },
      { label: 'Brand Store', key: 'brandStore', value: false },
    ],
    writtenWork: [
      { label: 'Listing Copy', key: 'listingCopy', value: true },
      { label: 'A+ Copy', key: 'aPlusCopy', value: false },
    ],
    organicSales3Mos: '0',
    ppcSales3Mos: '0',
    acos3Mos: '0',
    targetAcos: '0',
    targetBudget: '0',
    ppcGoal: '',
    asins: [],
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [client, setClient] = useState({});

  useEffect(() => {
    if (
      data.clientChecklist &&
      data.clientChecklist.length > 0 &&
      data.clientChecklist[0].value
    ) {
      setFormData(data.clientChecklist[0].value[0]);
    } else {
      setFormData({ ...formData, asins: [asinDefaultData] });
    }
    axios.get(`/agency/client/${agencyClientId}`).then((res) => {
      setClient(res.data.data);
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const name = e.nativeEvent.submitter.name;
    if (name === 'send') {
      const htmlFormData = ReactDOMServer.renderToString(
        EmailOnboardingForm(formData)
      );

      const body = {
        to: client.defaultContact.email,
        subject: `Brand Onboarding Form: ${formData.accountName}`,
        message: htmlFormData,
      };
      await dispatch(emailSend(agencyClientId, body));
    }

    const params = {
      checklistId: data.checklistId,
      value: [formData],
      status:
        data.clientChecklist.find((e) => data.checklistId === e.checklistId) &&
        data.clientChecklist.find((e) => data.checklistId === e.checklistId)
          .status
          ? data.clientChecklist.find((e) => data.checklistId === e.checklistId)
              .status
          : 'incomplete',
    };
    await dispatch(updateClientChecklist(agencyClientId, params));
    await dispatch(fetchClientChecklists(agencyClientId));
    setOpen(false);
  };

  return (
    <>
      <form className="space-y-6" action="#" method="POST" onSubmit={onSubmit}>
        <FormData
          formData={formData}
          setFormData={setFormData}
          data={data}
          asinDefaultData={asinDefaultData}
        />

        <div className="flex justify-between">
          <div>
            <Button onClick={() => setOpen(false)} color="red" classes="h-8">
              {t('Close')}
            </Button>
          </div>
          <div className="flex">
            <div className="px-4">
              <button
                type="submit"
                className="py-1 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                name="send"
              >
                {t(
                  'Clients.ClientChecklists.BrandOnboarding.SubmitAndSendMail'
                )}
              </button>
            </div>
            <div>
              <button
                type="submit"
                className="py-1 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                name="save"
              >
                {t('Save')}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default FormAction;
