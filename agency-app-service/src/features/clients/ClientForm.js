import React, { useEffect, useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  createAgencyClient,
  updateAgencyClient,
  getInitialSubscriptionFormData,
  setErrors,
} from './clientsSlice';
import { createOfflineSubscription } from './subscriptionsSlice';

import { setAlert } from '../alerts/alertsSlice';
import axios from 'axios';
import { useParams } from 'react-router';
import DetailsForm from 'features/clients/Form/DetailsForm';
import SubscriptionForm from './Form/SubscriptionForm';
import PageHeader from 'components/PageHeader';
import { DocumentAddIcon, AnnotationIcon } from '@heroicons/react/outline';
import ConfirmationModal from 'components/ConfirmationModal';
import Toggle from 'components/Toggle';
import useQuery from 'hooks/useQuery';

const ClientForm = ({ history }) => {
  const { t } = useTranslation();
  const { operation, id } = useParams();
  const { dataLoaded, defaultMarketplaceId, errors } = useSelector(
    (state) => state.clients
  );
  const query = useQuery();
  const leadId = query.get('leadId');
  const [formData, setFormData] = useState({
    client: '',
    address: '',
    phone: '',
    serviceAgreementLink: '',
    siEmail: '',
    website: '',
    aboutUs: '',
    overview: '',
    painPoints: '',
    goals: '',
    productCategories: '',
    amazonPageUrl: '',
    asinsToOptimize: '',
    categoryList: [],
    asinList: [],
    otherNotes: '',
    email: '',
    pricebook_id: '',
    currency_code: 'USD',
    name: '',
    plan_code: process.env.REACT_APP_PLAN_CODE,
    plan_description: '',
    price: 0,
    convert_retainer_cycle: '',
    retainer_after_convert: '',
    billing_cycles: '',
    mailInvite: 1,
    reference_id: '',
    addons: [],
    type: 'gross',
    rate: 0,
    marketplaceId: defaultMarketplaceId,
    defaultMarketplace: 'A2EUQ1WTGCTBG2',
    monthThreshold: 0,
    preContractAvgBenchmark: 0,
    commence: true,
    rules: null,
    zohoId: null,
    charge_admin_fee: 'no',
    managedAsins: [],
    salesPerson: '',
    noCommission: false,
    noCommissionReason: '',
  });
  const [status, setStatus] = useState('');
  const [hasDefaultContact, setHasDefaultContact] = useState(false);
  const [invite, setInvite] = useState(null);
  const [isOpenOffline, setIsOpenOffline] = useState(false);
  const [offlineSaving, setIsOfflineSaving] = useState(false);
  const [chargeAdminFee, setChargeAdminFee] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!dataLoaded) {
      dispatch(getInitialSubscriptionFormData());
    }
    if (operation === 'edit') {
      axios.get(`/agency/client/${id}`).then((res) => {
        loadAgencyClient(res.data.data);
      });
    } else {
      if (leadId) {
        axios.get(`/agency/leads/${leadId}`).then((res) => {
          const lead = res.data.data;
          const {
            phoneNumber: phone,
            email,
            address,
            website,
            aboutUs,
            messageOverview: overview,
          } = lead;
          updateFormData({
            email,
            phone,
            address,
            website,
            aboutUs,
            overview,
            leadId,
          });
        });
      }
    }
    dispatch(setErrors(null));
  }, [operation, id]);

  function loadAgencyClient(agencyClient) {
    const {
      account,
      status,
      client,
      serviceAgreementLink,
      address,
      phone,
      siEmail,
      website,
      aboutUs,
      overview,
      painPoints,
      goals,
      productCategories,
      amazonPageUrl,
      asinsToOptimize,
      categoryList,
      asinList,
      otherNotes,
      hostedpageDetails: {
        email,
        price,
        addons,
        name,
        plan_code,
        plan_description,
        currency_code,
        convert_retainer_cycle,
        retainer_after_convert,
        billing_cycles,
        pricebook_id,
        reference_id,
        salesperson_id,
      },
      draftCommission,
      zohoId,
      draftMarketplace: defaultMarketplace,
      noCommission,
      noCommissionReason,
    } = agencyClient;

    account && setInvite(account.invites[0]);

    setStatus(status);
    setHasDefaultContact(agencyClient.defaultContactId ? true : false);

    let checkCommissionValue = (key) => {
      if (account && account.commissions[0]) {
        if (key === 'commence') {
          return account.commissions[0].commencedAt ? true : false;
        }
        return account.commissions[0][key];
      }

      if (draftCommission) {
        return draftCommission[key];
      }

      return null;
    };

    setFormData({
      ...formData,
      client,
      serviceAgreementLink,
      address,
      phone,
      siEmail,
      website,
      aboutUs,
      overview,
      painPoints,
      goals,
      productCategories,
      amazonPageUrl,
      asinsToOptimize,
      categoryList,
      asinList,
      otherNotes,
      email,
      pricebook_id,
      currency_code,
      name,
      plan_code,
      plan_description,
      price,
      convert_retainer_cycle,
      retainer_after_convert,
      billing_cycles,
      addons,
      reference_id,
      type: checkCommissionValue('type') ?? 'gross',
      rate: checkCommissionValue('rate') ?? 0,
      marketplaceId:
        checkCommissionValue('marketplaceId') ?? defaultMarketplaceId,
      monthThreshold: checkCommissionValue('monthThreshold') ?? 0,
      preContractAvgBenchmark:
        checkCommissionValue('preContractAvgBenchmark') ?? 0,
      commence: checkCommissionValue('commence') ?? false,
      rules: checkCommissionValue('rules') ?? null,
      managedAsins: checkCommissionValue('managedAsins') ?? [],
      zohoId,
      salesPerson: salesperson_id,
      defaultMarketplace: !defaultMarketplace
        ? 'A2EUQ1WTGCTBG2'
        : defaultMarketplace,
      noCommission,
      noCommissionReason,
    });
  }

  function updateFormData(data) {
    setFormData({ ...formData, ...data });
  }

  // * Applies to creating new clients and editing draft clients
  const onCreate = (e) => {
    e.preventDefault();
    if (operation === 'edit') {
      dispatch(updateAgencyClient(id, formData, 'created', history));
    } else {
      dispatch(createAgencyClient(formData, 'created', history));
    }
  };

  // * Applies to creating new clients and editing draft clients
  const onSaveDraft = (e) => {
    e.preventDefault();
    if (operation === 'edit') {
      dispatch(updateAgencyClient(id, formData, 'draft', history));
    } else {
      dispatch(createAgencyClient(formData, 'draft', history));
    }
  };

  // * Applies to updating invited clients
  const onUpdate = (e) => {
    e.preventDefault();
    dispatch(updateAgencyClient(id, formData, status, history));
  };

  const onResendInvite = async (e) => {
    e.preventDefault();

    await axios.get(`agency/invite/${invite.inviteId}/resend`);

    dispatch(
      setAlert('success', `Successfully resent invite to ${formData.email}`)
    );
  };

  const onChargeAdminFee = () => {
    let state = !chargeAdminFee;
    setChargeAdminFee(state);
    let charge_admin_fee = state === true ? 'yes' : 'no';
    setFormData({ ...formData, charge_admin_fee });
  };

  const onCreateOfflineSubscription = () => {
    setIsOfflineSaving(true);
    dispatch(createOfflineSubscription(formData, history)).then(() => {
      setIsOfflineSaving(false);
    });
  };

  return (
    <Fragment>
      <PageHeader
        title={
          status
            ? `Update ${status} Client: ${formData.client}`
            : 'Create Client'
        }
      />
      <form method="POST">
        <div>
          <SubscriptionForm
            operation={operation}
            formData={formData}
            onDataChange={updateFormData}
          />
        </div>
        <div>
          <div className="hidden sm:block" aria-hidden="true">
            <div className="py-5">
              <div className="border-t border-gray-200"></div>
            </div>
          </div>
          <DetailsForm
            formData={formData}
            onDataChange={updateFormData}
            errors={errors}
          />
        </div>

        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1"></div>
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-6 shadow rounded-b-lg bg-gray-50 overflow-hidden">
                <div
                  className={`lg:flex text-left justify-${
                    status === 'invited' ||
                    status === 'subscribed' ||
                    status === 'registered'
                      ? 'between'
                      : 'end'
                  } pt-0 md:pt-4 pb-4 sm:px-6 text-right`}
                >
                  {(status === 'invited' || status === 'registered') &&
                    (hasDefaultContact ? (
                      <button
                        type="button"
                        className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center"
                        onClick={() => setIsOpenOffline(true)}
                      >
                        <DocumentAddIcon className="w-5 h-5 inline mr-1" />
                        Create Offline Subscription
                      </button>
                    ) : (
                      <span>
                        <AnnotationIcon className="w-5 h-5 inline text-gray-500" />
                        <em className="text-xs text-red-500 ml-1">
                          To create an offline subscription, please have the
                          client sign up first
                        </em>
                      </span>
                    ))}

                  <div className="text-center md:text-right mt-4 md:mt-0">
                    <button
                      type="button"
                      className="mr-2 py-2 px-4 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      onClick={() => history.goBack()}
                    >
                      Cancel
                    </button>

                    {(status === '' || status === 'draft') && (
                      <>
                        <button
                          type="submit"
                          className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={onSaveDraft}
                        >
                          Save Draft
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={onCreate}
                        >
                          Invite Client
                        </button>
                      </>
                    )}

                    {status === 'invited' && (
                      <button
                        className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={onResendInvite}
                      >
                        Resend Invite
                      </button>
                    )}

                    {(status === 'invited' || status === 'registered') && (
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={onUpdate}
                      >
                        Update Client
                      </button>
                    )}

                    {status === 'subscribed' && (
                      <>
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={onUpdate}
                        >
                          Update Client
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ConfirmationModal
          title={t('NewSubscription.Offline.Title')}
          content={
            <div>
              <span>{t('NewSubscription.Offline.Description')}</span>
              <label className="text-xs mt-4 mx-5 flex justify-center items-center">
                <Toggle onChange={onChargeAdminFee} checked={chargeAdminFee} />
                <span className="ml-2 text-red-700 text-left">
                  {t('NewSubscription.Offline.Charge')}
                </span>
              </label>
            </div>
          }
          open={isOpenOffline}
          setOpen={setIsOpenOffline}
          onOkClick={onCreateOfflineSubscription}
          onCancelClick={() => setIsOpenOffline(false)}
          okLoading={offlineSaving}
          showOkLoading={true}
        />
      </form>
    </Fragment>
  );
};

export default ClientForm;
