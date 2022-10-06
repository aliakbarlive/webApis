import React, { useState } from 'react';
import Loading from 'components/Loading';
import Button from 'components/Button';
import {
  PencilIcon,
  PlusIcon,
  MailIcon,
  LinkIcon,
  CloudIcon,
  TrashIcon,
  StopIcon,
} from '@heroicons/react/outline';
import moment from 'moment';
import {
  dateFormatter,
  dateFormatterUTC,
  strUnderscoreToSpace,
} from 'utils/formatters';
import { Card, ConfirmationModal } from 'components';
import DetailsForm from 'features/clients/Form/DetailsForm';
import { useDispatch, useSelector } from 'react-redux';
import CommissionItem from '../CommissionItem';
import CommissionItemModal from '../CommissionItemModal';
import InvoiceEmailModal from '../InvoiceEmailModal';
import ChangeDefaultContactModal from '../ChangeDefaultContactModal';
import IntegrationList from './IntegrationList';
import AssignedCells from './AssignedCells';
import { setAlert } from 'features/alerts/alertsSlice';
import axios from 'axios';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import prependHttp from 'prepend-http';
import Badge from 'components/Badge';
import TerminationSlideOver from 'features/churn/components/TerminationSlideOver';
import usePermissions from 'hooks/usePermissions';
import ResetPassword from './ResetPassword';
import EditReason from './EditReason';

const Details = ({ client, setClient }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { userCan, isAgencySuperUser } = usePermissions();

  const { marketplaces, defaultMarketplaceId } = useSelector(
    (state) => state.clients
  );
  const [errors, setErrors] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [commissionModal, setCommissionModal] = useState(false);
  const [invoiceEmailModal, setInvoiceEmailModal] = useState(false);
  const [changeDefaultContactModal, setChangeDefaultContactModal] =
    useState(false);
  const [action, setAction] = useState('');
  const [commission, setCommission] = useState({
    type: 'gross',
    rate: 0,
    marketplaceId: defaultMarketplaceId,
    monthThreshold: 0,
    commence: false,
    rules: null,
    preContractAvgBenchmark: 0,
    commissionId: 0,
    accountId: 0,
    managedAsins: [],
  });
  const [isOpenTerminate, setIsOpenTerminate] = useState(false);

  const initialData = {
    client: client.client,
    serviceAgreementLink: client.serviceAgreementLink,
    address: client.address,
    phone: client.phone ?? '',
    siEmail: client.siEmail,
    contractSigned: client.contractSigned,
    contactName: client.contactName,
    contactName2: client.contactName2,
    primaryEmail: client.primaryEmail,
    secondaryEmail: client.secondaryEmail,
    thirdEmail: client.thirdEmail,
    service: client.service,
    accountStatus: client.accountStatus,
    website: client.website,
    aboutUs: client.aboutUs,
    overview: client.overview,
    painPoints: client.painPoints,
    goals: client.goals,
    categoryList: client.categoryList,
    amazonPageUrl: client.amazonPageUrl,
    asinList: client.asinList,
    otherNotes: client.otherNotes,
  };
  const [formData, setFormData] = useState(initialData);
  const [selectedInvoiceEmail, setSelectedInvoiceEmail] = useState('');
  const [confirmDeleteInvoiceEmail, setConfirmDeleteInvoiceEmail] =
    useState(false);

  const currentMarketplace = (marketplaceId) => {
    return marketplaces.find(
      (marketplace) => marketplace.marketplaceId === marketplaceId
    );
  };

  const updateFormData = (data) => {
    setFormData({ ...formData, ...data });
  };

  const onSubmit = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify(formData);
    await axios
      .patch(`agency/client/${client.agencyClientId}`, body, config)
      .then((res) => {
        setClient(res.data.client);
        setErrors(null);
        setEditProfile(false);
        dispatch(setAlert('success', 'Successfully updated client details'));
      })
      .catch((error) => {
        setErrors(error.response.data.errors);
        const errorMessages = Object.keys(error.response.data.errors)
          .map((key) => {
            return `- ${error.response.data.errors[key]}`;
          })
          .join('\n');
        dispatch(setAlert('error', error.response.data.message, errorMessages));
      });
  };

  const onEditDetails = () => {
    setFormData(initialData);
    setEditProfile(true);
  };

  const showCommissionModal = (commission, action) => {
    let payload =
      action === 'add'
        ? {
            type: 'gross',
            rate: 0,
            marketplaceId: defaultMarketplaceId,
            monthThreshold: 0,
            commence: false,
            rules: null,
            preContractAvgBenchmark: 0,
            commissionId: 0,
            accountId: client.accountId,
            managedAsins: [],
          }
        : {
            type: commission.type,
            rate: commission.rate,
            marketplaceId: commission.marketplaceId,
            monthThreshold: commission.monthThreshold,
            commence: commission.commencedAt ? true : false,
            rules: commission.rules,
            preContractAvgBenchmark: commission.preContractAvgBenchmark,
            commissionId: commission.commissionId,
            accountId: client.accountId,
            managedAsins: commission.managedAsins,
          };

    setCommission(payload);
    setAction(action);
    setCommissionModal(true);
  };

  const onUpdate = ({ data, action, noCommission, noCommissionReason }) => {
    let c = client.account.commissions.slice();

    if (action === 'add') {
      c.push(data);
    } else if (action === 'edit') {
      const idx = c.findIndex(
        (commission) => commission.commissionId === data.commissionId
      );

      c[idx] = data;
    } else if (action === 'delete') {
      const idx = c.findIndex((commission) => commission.commissionId === data);
      c.splice(idx, 1);
    }

    if (noCommission) {
      setClient({
        ...client,
        account: {
          ...client.account,
          commissions: c,
        },
        noCommission,
        noCommissionReason,
      });
    } else {
      setClient({
        ...client,
        account: {
          ...client.account,
          commissions: c,
        },
      });
    }

    setCommissionModal(false);
  };

  const updateTerminationDetails = (newDetails) => {
    setClient({
      ...client,
      termination: newDetails,
    });
  };

  const updateClientCell = (payload) => {
    if (payload.success) {
      const { cells } = payload.output;
      setClient({
        ...client,
        cells,
      });
    }
  };

  const updateClientData = (newDetails) => {
    setClient({
      ...client,
      ...newDetails,
    });
  };

  const row = (label, value) => {
    return (
      <div className="py-4 sm:grid sm:grid-cols-6 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500 sm:col-span-1">
          {label}
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-5">
          {value}
        </dd>
      </div>
    );
  };

  const Pre = (value) => {
    return <pre className="font-sans whitespace-pre-wrap">{value}</pre>;
  };

  const A = (value) => {
    return (
      <a
        href={`${value}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-red-500"
      >
        {value}
      </a>
    );
  };

  const showInvoiceEmailModal = () => {
    setInvoiceEmailModal(true);
  };

  const showChangeDefaultContactModal = () => {
    setChangeDefaultContactModal(true);
  };

  const removeInvoiceEmail = () => {
    const { agencyClientId, invoiceEmails } = client;
    const newInvoiceEmails = invoiceEmails.filter((ie) => {
      return ie !== selectedInvoiceEmail;
    });

    const body = {
      invoiceEmails: newInvoiceEmails,
    };
    axios
      .post(`/agency/client/${agencyClientId}/invoice-emails`, body)
      .then((res) => {
        dispatch(
          setAlert('success', t('Profile.Details.InvoiceEmailRemoved'))
        ).then(() => {
          setClient({
            ...client,
            invoiceEmails: [...newInvoiceEmails],
            account: {
              ...client.account,
            },
          });
        });
      });
  };

  const onSelectInvoiceEmail = (invoiceEmail) => {
    setSelectedInvoiceEmail(invoiceEmail);
    setConfirmDeleteInvoiceEmail(true);
  };

  const IE = (value) => {
    return (
      <div className="justify-center bg-gray-50 rounded-lg p-3 clear-both float-left">
        <div className="sm:col-span-1 flex items-center border border-dashed hover:bg-red-50 rounded-lg w-28 mb-2">
          <button
            type="button"
            className="w-full h-full"
            onClick={() => showInvoiceEmailModal()}
          >
            <PlusIcon className="w-4 h-4 inline" />
            &nbsp;Add
          </button>
        </div>
        {value &&
          value.map((ie) => (
            <p>
              <MailIcon className="w-5 float-left mr-1" />
              {ie}
              <TrashIcon
                className="w-5 float-right ml-5 cursor-pointer"
                onClick={() => onSelectInvoiceEmail(ie)}
              />
            </p>
          ))}
      </div>
    );
  };

  const Join = (value, key) => {
    if (!value) return '';
    return value.map((el) => el[key]).join(', ');
  };

  if (Object.entries(client).length === 0) {
    return <Loading />;
  }

  // * if the file is S3 it will generate a unique url and get the file
  // * if the file is a link, it will open on a new tab
  const onViewLink = (e, file) => {
    e.preventDefault();
    const { agencyClientId } = client;
    const folder = `agency/clients/${agencyClientId}/assets`;
    if (file.type === 's3') {
      axios
        .get('/s3/files', {
          params: {
            path: `${folder}/${file.fileName}`,
          },
        })
        .then((res) => {
          const { success, data: url } = res.data;
          if (success) {
            window.open(prependHttp(url, { https: false }));
          }
        });
    } else {
      window.open(prependHttp(file.originalName, { https: false }));
    }
  };

  const getAssets = () => {
    const { ClientChecklists } = client;
    const clientAssets = ClientChecklists.filter((cc) => {
      return cc.checklistId === 3;
    });

    if (clientAssets.length > 0) {
      const { value } = clientAssets[0];
      return (
        <ul className="-mb-8 grid grid-cols-1 2xl:grid-cols-2 gap-1">
          {value &&
            value.map((file) => (
              <li key={file.fileName} class="mb-3">
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-red-500">
                      {file.type === 's3' ? (
                        <CloudIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      ) : (
                        <LinkIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        <a
                          href="/"
                          className="underline"
                          onClick={(e) => onViewLink(e, file)}
                        >
                          {file.originalName}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      );
    }
  };

  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-5 lg:col-span-4">
        <h3 className="mb-4 text-xl font-bold">Profile</h3>
        {editProfile ? (
          <>
            <h1>{editProfile}</h1>
            <div>
              <DetailsForm
                formData={formData}
                onDataChange={updateFormData}
                errors={errors}
                editProfile={1}
              />
            </div>
            <div>
              <div className="text-center md:text-right mt-4">
                <Button
                  onClick={() => setEditProfile(false)}
                  color="gray"
                  classes="mr-2"
                >
                  Cancel
                </Button>
                <Button onClick={onSubmit}>Save</Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <CommissionItemModal
              open={commissionModal}
              setOpen={setCommissionModal}
              commission={commission}
              account={client.account}
              marketplaces={marketplaces}
              action={action}
              onUpdate={onUpdate}
              client={client}
            />
            <InvoiceEmailModal
              open={invoiceEmailModal}
              setOpen={setInvoiceEmailModal}
              client={client}
              setClient={setClient}
            />
            <ChangeDefaultContactModal
              open={changeDefaultContactModal}
              setOpen={setChangeDefaultContactModal}
              client={client}
              setClient={setClient}
            />
            <ConfirmationModal
              title={t('Profile.Details.InvoiceEmailConfirm')}
              content={t('Profile.Details.InvoiceEmailConfirmMessage')}
              open={confirmDeleteInvoiceEmail}
              setOpen={setConfirmDeleteInvoiceEmail}
              onOkClick={removeInvoiceEmail}
              onCancelClick={() => setConfirmDeleteInvoiceEmail(false)}
            />
            <Card>
              <div className="flex justify-between">
                <div className="flex">
                  {userCan('clients.profile.edit') && (
                    <Button onClick={onEditDetails}>
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Edit Details
                    </Button>
                  )}
                  {userCan('clients.profile.edit') && (
                    <div className="ml-5">
                      <Button
                        onClick={showChangeDefaultContactModal}
                        bgColor={'green-100'}
                        hoverColor={'green-300'}
                        textColor="green-900"
                      >
                        <PencilIcon className="w-4 h-4" />
                        Change Default Contact
                      </Button>
                    </div>
                  )}
                </div>
                {client.cells &&
                  client.cells.length > 0 &&
                  userCan(
                    'termination.create|termination.edit|termination.view'
                  ) && (
                    <Button
                      onClick={() => setIsOpenTerminate(true)}
                      bgColor={'gray-100'}
                      hoverColor={'gray-300'}
                      textColor="gray-900"
                      classes={`ml-1 float-right`}
                    >
                      {client.termination &&
                      (client.termination.status === 'pending' ||
                        client.termination.status === 'approved') ? (
                        <>
                          Termination Status:
                          <Badge
                            color={classnames({
                              yellow: client.termination.status === 'pending',
                              red: client.termination.status === 'approved',
                              gray: client.termination.status === 'cancelled',
                            })}
                            classes="uppercase ml-2"
                            rounded="md"
                          >
                            {client.termination.status}
                          </Badge>
                        </>
                      ) : (
                        <>
                          <StopIcon className="w-4 h-4 mr-1" />
                          Terminate
                        </>
                      )}
                    </Button>
                  )}
              </div>

              <div className="mt-5 border-t border-gray-200">
                <dl className="sm:divide-y sm:divide-gray-200">
                  {row(
                    <span className="flex flex-col">
                      <label>Commission Rate</label>
                      {userCan('clients.commission.create') && (
                        <div>
                          <button
                            type="button"
                            onClick={() =>
                              showCommissionModal(commission, 'add')
                            }
                            className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1 rounded-md text-white"
                          >
                            <PlusIcon className="w-4 h-4 inline" />
                            &nbsp;Add
                          </button>
                        </div>
                      )}
                    </span>,
                    <div className="sm:grid sm:grid-cols-4 sm:gap-4">
                      {client.noCommission &&
                        client.account?.commissions.length <= 0 && (
                          <div className="col-span-1 bg-gray-50 p-3 rounded-lg">
                            <span className="font-medium">No Commission</span>
                            <p className="whitespace-pre-wrap italic">
                              {client.noCommissionReason}
                            </p>
                            <EditReason
                              client={client}
                              reason={client.noCommissionReason}
                              updateClientData={updateClientData}
                            />
                          </div>
                        )}
                      {client.account?.commissions &&
                        client.account?.commissions.length > 0 &&
                        client.account.commissions.map((commission, i) => {
                          return (
                            <CommissionItem
                              commission={commission}
                              key={i}
                              marketplaces={marketplaces}
                              marketplace={currentMarketplace(
                                commission.marketplaceId
                              )}
                              showCommissionModal={showCommissionModal}
                            />
                          );
                        })}
                    </div>
                  )}
                  {row(
                    'Service Agreement Link',
                    A(client.serviceAgreementLink)
                  )}
                  {row('Address', client.address)}
                  {row('Phone', client.phone)}
                  {row('SI Email', client.siEmail)}
                  {row(
                    'Contract Signed',
                    client.contractSigned &&
                      dateFormatterUTC(client.contractSigned)
                  )}
                  {row('Contact Name', client.contactName)}
                  {row('Contact Name 2', client.contactName2)}
                  {/* {row('Primary Email', client.primaryEmail)} */}
                  {row('Secondary Email', client.secondaryEmail)}
                  {row('Third Email', client.thirdEmail)}
                  {row('Service', client.service)}
                  {row('Account Status', client.accountStatus)}
                  {row('Additional Contacts', IE(client.invoiceEmails))}
                  {row('Website', A(client.website))}
                  {row('About Us', Pre(client.aboutUs))}
                  {row('Overview', Pre(client.overview))}
                  {row('Pain Points', Pre(client.painPoints))}
                  {row('Goals', Pre(client.goals))}
                  {row(
                    'Product Categories',
                    Join(client.categoryList, 'category')
                  )}
                  {row('Amazon Page URL', A(client.amazonPageUrl))}
                  {row('ASINS to optimize', Join(client.asinList, 'asin'))}
                  {row('Other Notes', Pre(client.otherNotes))}
                  {row('Assets', getAssets())}
                </dl>
              </div>
            </Card>
          </>
        )}
      </div>

      <div className="col-span-5 lg:col-span-1">
        <IntegrationList account={client.account} />
        {userCan('clients.profile.resetpassword') && (
          <ResetPassword userId={client.defaultContactId} type="client" />
        )}
        <AssignedCells client={client} updateDetails={updateClientCell} />
      </div>

      {client.cells &&
        client.cells.length > 0 &&
        userCan('termination.view') && (
          <TerminationSlideOver
            open={isOpenTerminate}
            setOpen={setIsOpenTerminate}
            termination={client.termination}
            client={client}
            updateDetails={updateTerminationDetails}
          />
        )}
    </div>
  );
};
export default Details;
