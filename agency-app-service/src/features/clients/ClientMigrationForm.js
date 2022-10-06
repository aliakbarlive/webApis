import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getInitialSubscriptionFormData } from './clientsSlice';

import { setAlert } from '../alerts/alertsSlice';
import axios from 'axios';
import { useParams } from 'react-router';
import DetailsForm from './Migration/DetailsForm';
import PageHeader from 'components/PageHeader';
import { DocumentAddIcon, AnnotationIcon } from '@heroicons/react/outline';
import ConfirmationModal from 'components/ConfirmationModal';
import SubscriptionForm from './Migration/SubscriptionForm';
import Badge from 'components/Badge';
import { ExternalLinkIcon } from '@heroicons/react/outline';

const ClientMigrationForm = ({ history }) => {
  const { operation, id } = useParams();
  const [formData, setFormData] = useState({
    client: '',
    address: '',
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
    marketplaceId: 'ATVPDKIKX0DER',
    monthThreshold: 0,
    commence: false,
  });
  const [status, setStatus] = useState('');
  const [hasDefaultContact, setHasDefaultContact] = useState(false);
  const [invite, setInvite] = useState(null);
  const [isOpenOffline, setIsOpenOffline] = useState(false);
  const [offlineSaving, setIsOfflineSaving] = useState(false);
  const [migrationData, setMigrationData] = useState(null);

  const { dataLoaded } = useSelector((state) => state.clients);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!dataLoaded) {
      dispatch(getInitialSubscriptionFormData());
    }

    axios.get(`/agency/client/${id}`).then((res) => {
      loadAgencyClient(res.data.data);
    });
  }, [operation, id]);

  function loadAgencyClient(agencyClient) {
    const {
      account,
      status,
      client,
      serviceAgreementLink,
      address,
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
      ClientMigration: {
        email,
        price,
        clientName: name,
        plan: plan_code,
        description: plan_description,
        accountId: reference_id,
        firstName,
        lastName,
        zohoId,
        baseline,
        grossUs,
        grossCa,
        amEmail,
        pmEmail,
        commissionCa,
        commissionUs,
      },
    } = agencyClient;

    setMigrationData(agencyClient.ClientMigration);

    account && setInvite(account.invites[0]);

    setStatus(status);
    setHasDefaultContact(agencyClient.defaultContactId ? true : false);

    setFormData({
      ...formData,
      client,
      serviceAgreementLink,
      address,
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
      name,
      plan_code,
      plan_description,
      price,
      reference_id,
      firstName,
      lastName,
      zohoId,
      baseline,
      grossUs,
      grossCa,
      amEmail,
      pmEmail,
      commissionCa,
      commissionUs,
    });
  }

  function updateFormData(data) {
    setFormData({ ...formData, ...data });
  }

  // * Applies to updating invited clients
  const onUpdate = async (e) => {
    e.preventDefault();

    const body = JSON.stringify(formData);
    await axios
      .post(`client-migration/${migrationData.id}/update`, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        dispatch(
          setAlert(
            'success',
            'Successfully updated migration and agencyClient details'
          )
        );

        history.goBack();
      });
  };

  const onResendInvite = async (e) => {
    e.preventDefault();

    await axios.get(`client-migration/${migrationData.id}/resend`);

    dispatch(
      setAlert('success', `Successfully resent email to ${migrationData.email}`)
    );
  };

  const onCreateOfflineSubscription = async () => {
    setIsOfflineSaving(true);
    await axios
      .post(`client-migration/${migrationData.id}/offline`)
      .then(() => {
        setIsOfflineSaving(false);
        dispatch(setAlert('success', `Offline subscription created`));
        history.push('/clients');
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
        left={
          <Link
            className="text-underline text-red-500"
            to={`/client-migration/${migrationData?.accountId}`}
            target="_blank"
          >
            <Badge color="yellow" rounded="lg">
              Migration Link
              <ExternalLinkIcon className="ml-2 w-4 h-4 inline" />
            </Badge>
          </Link>
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
          <DetailsForm formData={formData} onDataChange={updateFormData} />
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

                    <button
                      className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      onClick={onResendInvite}
                    >
                      Resend Mail
                    </button>

                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      onClick={onUpdate}
                    >
                      Update Migration
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ConfirmationModal
          title="Create an offline subscription?"
          content="This will let the client skip credit card billing, but you will have to manually record payments for invoices."
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

export default ClientMigrationForm;
