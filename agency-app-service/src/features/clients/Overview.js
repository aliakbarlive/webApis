import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, fetchMarketplaces } from './clientsSlice';
import Table from 'components/Table';
import { Link } from 'react-router-dom';
import {
  dateFormatter,
  dateFormatterUTC,
  nameFormatter,
  strUnderscoreToSpace,
} from 'utils/formatters';
import {
  MinusCircleIcon,
  XCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/solid';

import Checkbox from 'components/Forms/Checkbox';
import { FileDrop } from 'react-file-drop';
import { S3_LIMIT_SIZE } from 'utils/constants';
import classnames from 'classnames';
import Badge from 'components/Badge';
import PageHeader from 'components/PageHeader';
import { PlusIcon } from '@heroicons/react/outline';
import _, { set, startCase } from 'lodash';
import Input from 'components/Forms/Input';
import Label from 'components/Forms/Label';
import Select from 'components/Forms/Select';
import { BadgeCheckIcon, TrashIcon } from '@heroicons/react/solid';
import BadgeOutline from 'components/BadgeOutline';
import { setAlert } from 'features/alerts/alertsSlice';
import { pick } from 'lodash';
import axios from 'axios';
import usePermissions from 'hooks/usePermissions';
import {
  CANCELLED,
  DUNNING,
  EXPIRED,
  LIVE,
  NON_RENEWING,
  PAUSED,
  UNPAID,
} from 'utils/subscriptions';
import useQuery from 'hooks/useQuery';
import useQueryParams from 'hooks/useQueryParams';
import ExpandRow from 'components/Table/ExpandRow';
import { ConfirmationModal } from 'components';
import { css } from 'styled-components';
import SlideOver from 'components/SlideOver';

const Overview = () => {
  const { t } = useTranslation();
  const { userCan, isAgencySuperUser } = usePermissions();
  let query = useQuery();
  const fileInputRef = useRef(null);
  const { agencyClients, paginationParams } = useSelector(
    (state) => state.clients
  );
  const { params, updateParams, sortParam } = useQueryParams(paginationParams);
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [clientForDelete, setClientForDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [openExportSlideOver, setOpenExportSlideOver] = useState(false);
  const handleExportSlideOver = () => {
    setOpenExportSlideOver(true);
  };
  const [search, setSearch] = useState(query.get('search') ?? '');
  const [migratedOnly, setMigratedOnly] = useState(
    query.get('migrateOnly')
      ? query.get('migrateOnly') === 'true'
        ? true
        : false
      : false
  );
  const [status, setStatus] = useState(query.get('status') ?? '');
  const clientSummaryProperties = {
    client: true,
    contractSigned: false,
    service: false,
    accountStatus: false,
    status: false,
    address: false,
    website: false,
    amazonPageUrl: false,
    phone: false,
    contactName: false,
    contactName2: false,
    primaryEmail: false,
    secondaryEmail: false,
    thirdEmail: false,
    subscription: false,
    activatedAt: false,
    isOffline: false,
    spApi: false,
    advApi: false,
    defaultMarketplace: false,
    firstName: false,
    lastName: false,
    email: false,
  };
  const [clientSummaryCheckbox, setClientSummaryCheckbox] = useState(
    clientSummaryProperties
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!updated) {
      updateParams({ page: 1, pageSize: '30', search: ''}, true);
      setUpdated(true);
    } else if (!loading) {
      setLoading(true);
      dispatch(fetchClients(params)).then(() => {
        setLoading(false);
      });
      dispatch(fetchMarketplaces());
    }
  }, [dispatch, params, refresh]);

  const tableColumns = [
    {
      dataField: 'contractSigned',
      text: 'Contract Signed',
      sort: true,
      headerStyle: {
        minWidth: '100px',
      },
      formatter: (cell, row) => {
        return (
          cell && <span className="font-normal">{dateFormatterUTC(cell)}</span>
        );
      },
    },
    {
      dataField: 'client',
      text: 'Brand Name',
      sort: true,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => {
        let operation =
          row.account && row.account.subscription ? 'profile' : 'edit';

        // check if client is from client migration
        if (row.status === 'registered' && row.ClientMigration) {
          operation = 'migration';
        }

        let to = `/clients/${operation}/${row.agencyClientId}`;
        let showLink = false;
        if (operation === 'edit' || operation === 'migration') {
          if (userCan('clients.edit')) {
            showLink = true;
          }
        } else if (operation === 'profile') {
          if (userCan('clients.profile.view')) {
            showLink = true;
          }
        }

        return showLink ? (
          <Link
            className={`font-normal ${
              row.termination &&
              (row.termination.status === 'pending' ||
                row.termination.status === 'approved')
                ? classnames({
                    'text-yellow-400': row.termination.status === 'pending',
                    'text-gray-400': row.termination.status === 'approved',
                  })
                : 'text-red-500'
            }`}
            to={to}
          >
            {cell}
          </Link>
        ) : (
          <span className="text-black">{cell}</span>
        );
      },
    },
    {
      dataField: 'service',
      text: 'Service',
      sort: false,
      headerStyle: {
        minWidth: '50px',
      },
    },
    {
      dataField: 'accountStatus',
      text: 'Account Status',
      sort: false,
      headerStyle: {
        minWidth: '50px',
      },
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: true,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => {
        return (
          <>
            {row.termination &&
            (row.termination.status === 'pending' ||
              row.termination.status === 'approved') ? (
              <BadgeOutline
                color={classnames({
                  yellow: row.termination.status === 'pending',
                  red: row.termination.status === 'approved',
                })}
                colorWeight={500}
                classes="uppercase"
                rounded="md"
              >
                {row.termination.status === 'pending' && 'Pending Termination'}
                {row.termination.status === 'approved' && 'Terminated'}
              </BadgeOutline>
            ) : (
              <Badge
                color={classnames({
                  green: cell === 'subscribed',
                  red: cell === 'registered',
                  yellow: cell === 'draft',
                  blue: cell === 'invited',
                  purple: cell === 'cancelled',
                })}
                classes="uppercase"
                rounded="md"
              >
                {cell}
              </Badge>
            )}
          </>
        );
      },
    },
    {
      dataField: 'subscription',
      text: 'Subscription',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      formatter: (cell, row) => {
        return row.account?.subscription ? (
          <>
            <Badge
              color={classnames({
                green: row.account.subscription.status === LIVE,
                gray: row.account.subscription.status === NON_RENEWING,
                yellow: row.account.subscription.status === CANCELLED,
                red: row.account.subscription.status === EXPIRED,
                blue: row.account.subscription.status === PAUSED,
                indigo:
                  row.account.subscription.status === UNPAID ||
                  row.account.subscription.status === DUNNING,
              })}
              classes="uppercase"
              rounded="md"
            >
              {strUnderscoreToSpace(row.account.subscription.status)}
            </Badge>
            {row.account.subscription.isOffline && (
              <Badge color="blue" classes="ml-1 uppercase" rounded="md">
                offline
              </Badge>
            )}
          </>
        ) : (
          <Badge color="red" classes="uppercase" rounded="md">
            Not subscribed
          </Badge>
        );
      },
    },
    {
      dataField: 'activated_at',
      text: 'Activated At',
      sort: true,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => {
        return (
          row.account?.subscription && (
            <span className="font-normal">
              {dateFormatterUTC(row.account.subscription.activatedAt)}
            </span>
          )
        );
      },
    },
    {
      dataField: 'createdAt',
      text: 'Created At',
      sort: true,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => {
        return (
          row.account && (
            <span className="font-normal">{dateFormatter(row.createdAt)}</span>
          )
        );
      },
    },
    {
      dataField: 'sp-api',
      text: 'SP-API',
      sort: false,
      headerStyle: {
        minWidth: '70px',
      },
      formatter: (cell, row) => {
        return row.account?.credentials.length > 0 &&
          row.account?.credentials.find((c) => c.service === 'spApi') ? (
          <span className="font-normal">
            <BadgeCheckIcon className="text-green-500 w-5 h-5 inline" />
          </span>
        ) : (
          ''
        );
      },
    },
    {
      dataField: 'adv-api',
      text: 'ADV-API',
      sort: false,
      headerStyle: {
        minWidth: '80px',
      },
      formatter: (cell, row) => {
        return row.account?.credentials.length > 0 &&
          row.account?.credentials.find((c) => c.service === 'advApi') ? (
          <span className="font-normal">
            <BadgeCheckIcon className="text-green-500 w-5 h-5 inline" />
          </span>
        ) : (
          ''
        );
      },
    },
    ...(userCan('clients.checklist.manage')
      ? [
          {
            dataField: 'Checklist Summary',
            text: 'CHECKLIST SUMMARY',
            sort: false,
            headerStyle: {
              minWidth: '100px',
            },
            formatter: (cell, row) => {
              return row.status === 'subscribed' ? (
                <span className="flex">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                  <p className="text-green-700 mr-1">{row.Complete}</p>
                  <MinusCircleIcon className="h-5 w-5 text-yellow-400" />
                  <p className="text-yellow-700 mr-1">{row.inProgress}</p>
                  <XCircleIcon className="h-5 w-5 text-red-400" />
                  <p className="text-red-700">
                    {13 - row.Complete - row.inProgress}
                  </p>
                </span>
              ) : (
                <div></div>
              );
            },
          },
        ]
      : []),
    ...(userCan('clients.delete')
      ? [
          {
            dataField: 'deletedAt',
            text: '',
            sort: false,
            headerStyle: {
              minWidth: '40px',
            },
            formatter: (cell, row) => {
              return (
                <button onClick={() => onDeleteClient(row)}>
                  <TrashIcon className="text-red-500 w-4 h-4 inline" />
                </button>
              );
            },
          },
        ]
      : []),
  ];

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    updateParams({
      page,
      pageSize: sizePerPage,
      sort: `${sortField}:${sortOrder}`,
    });
  };

  const updateParamsSearch = ({ search, params }) => {
    updateParams({ page: 1, search }, true);
  };

  const debouncedUpdateSearch = useCallback(
    _.debounce((value) => updateParamsSearch(value), 500),
    []
  );

  const onSearch = (e) => {
    setSearch(e.target.value);
    debouncedUpdateSearch({ search: e.target.value, params });
  };

  const onMigratedOnly = (e) => {
    setMigratedOnly(e.target.checked);

    updateParams({
      page: 1,
      migrateOnly: e.target.checked,
    });
  };

  const onChangeStatus = (e) => {
    setStatus(e.target.value);

    updateParams({
      page: 1,
      status: e.target.value,
    });
  };

  const onDeleteClient = (row) => {
    setClientForDelete(row);
    setIsOpenDelete(true);
  };

  const deleteClient = async () => {
    setDeleting(true);
    await axios
      .delete(`/agency/client/${clientForDelete.agencyClientId}`)
      .then((res) => {
        const { success } = res.data;
        if (success) {
          dispatch(setAlert('success', 'Client marked as deleted'));
          setLoading(true);
          dispatch(fetchClients(params)).then(() => {
            setLoading(false);
          });
        } else {
          dispatch(setAlert('error', 'Client cannot be deleted'));
        }
      });
    setIsOpenDelete(false);
    setDeleting(false);
  };

  const Join = (value, key) => {
    if (!value) return '';
    return value.map((el) => el[key]).join(', ');
  };

  //var picked = arr.find(o => o.city === 'Amsterdam');
  const getUserByRole = (users, roleId) => {
    if (users.length > 0) {
      const userFound = users.filter((u) => u.role.roleId === roleId);
      if (userFound.length > 0) {
        return userFound.map((u1) => {
          return `${u1.firstName} ${u1.lastName}`;
        });
      } else {
        return [''];
      }
    } else {
      return [''];
    }
  };

  const renderer = (row) => {
    const { cells } = row;
    let operationsManagers = [];
    let projectManagers = [];
    let seniorAccountManagers = [];
    let accountManagers = [];
    let accountCoordinators = [];
    let ppcTeamLeads = [];
    let ppcSpecialists = [];
    let juniorPpcSpecialists = [];
    cells.map((cell) => {
      const { pod, type } = cell;
      if (type === 'operations') {
        accountManagers = getUserByRole(cell.users, 14);
        accountCoordinators = getUserByRole(cell.users, 16);
        seniorAccountManagers = getUserByRole(pod.users, 12);
        projectManagers = getUserByRole(pod.squad.users, 11);
        operationsManagers = getUserByRole(pod.squad.users, 10);
      } else if (type === 'ppc') {
        ppcTeamLeads = getUserByRole(pod.users, 17);
        ppcSpecialists = getUserByRole(cell.users, 18);
        juniorPpcSpecialists = getUserByRole(cell.users, 19);
      }
    });

    const rowDl = (label, value) => {
      return (
        value && (
          <>
            <dt className="col-span-1 text-black font-medium">{label}</dt>
            <dd className="col-span-2 text-gray-500">{value}</dd>
          </>
        )
      );
    };

    const hasDetails = () => {
      return row.defaultContact || row.siEmail || row.phone;
    };
    const hasContacts = () => {
      return (
        row.contactName ||
        row.primaryEmail ||
        row.contactName2 ||
        row.secondaryEmail ||
        row.thirdEmail
      );
    };

    const hasCell = () => {
      return (
        operationsManagers.length > 0 ||
        projectManagers.length > 0 ||
        seniorAccountManagers.length > 0 ||
        accountManagers.length > 0 ||
        accountCoordinators.length > 0
      );
    };

    const hasPPC = () => {
      return (
        ppcTeamLeads.length > 0 ||
        ppcSpecialists.length > 0 ||
        juniorPpcSpecialists.length > 0
      );
    };

    return hasDetails() || hasContacts() || hasCell() || hasPPC() ? (
      <div className="px-16 text-xs sm:grid sm:grid-cols-4 gap-x-4 py-4 bg-gray-50">
        {hasDetails() && (
          <div className="col-span-1">
            <div className="font-medium border-b mb-1 w-full pb-1 hidden">
              Details
            </div>
            <dl className="sm:grid sm:grid-cols-3 gap-x-2 gap-y-1">
              {rowDl(
                'Default Contact',
                <div className="flex flex-col">
                  <span>{nameFormatter(row.defaultContact)}</span>
                  <span>{row.defaultContact?.email}</span>
                </div>
              )}
              {rowDl('Product Category', Join(row.categoryList, 'category'))}
              {rowDl('SI Email', row.siEmail)}
              {rowDl('Phone #', row.phone)}
            </dl>
          </div>
        )}
        {hasContacts() && (
          <div className="col-span-1">
            <div className="font-medium border-b mb-1 w-full pb-1 hidden">
              Contacts
            </div>
            <dl className="sm:grid sm:grid-cols-3 gap-x-2 gap-y-1">
              {rowDl('Contact Name', row.contactName)}
              {rowDl('Primary Email', row.primaryEmail)}
              {rowDl('Contact Name 2', row.contactName2)}
              {rowDl('Secondary Email', row.secondaryEmail)}
              {rowDl('Third Email', row.thirdEmail)}
            </dl>
          </div>
        )}

        {hasCell() && (
          <div className="col-span-1">
            <div className="font-medium border-b mb-1 w-full pb-1 hidden">
              Operations
            </div>
            <dl className="sm:grid sm:grid-cols-3  gap-x-2 gap-y-1">
              {rowDl(
                'Operations Manager',
                operationsManagers.map((name) => name).join(', ')
              )}
              {rowDl(
                'Project Manager',
                projectManagers.map((name) => name).join(', ')
              )}
              {rowDl(
                'Sr. Account Manager',
                seniorAccountManagers.map((name) => name).join(', ')
              )}
              {rowDl(
                'Account Manager',
                accountManagers.map((name) => name).join(', ')
              )}
              {rowDl(
                'Account Coordinator',
                accountCoordinators.map((name) => name).join(', ')
              )}
            </dl>
          </div>
        )}
        {hasPPC() && (
          <div className="col-span-1">
            <div className="font-medium border-b mb-1 w-full pb-1 hidden">
              PPC
            </div>
            <dl className="sm:grid sm:grid-cols-3  gap-x-2 gap-y-1">
              {rowDl(
                'PPC Team Lead',
                ppcTeamLeads.map((name) => name).join(', ')
              )}
              {rowDl(
                'PPC Specialist',
                ppcSpecialists.map((name) => name).join(', ')
              )}
              {rowDl(
                'Junior PPC Specialist',
                juniorPpcSpecialists.map((name) => name).join(', ')
              )}
            </dl>
          </div>
        )}
      </div>
    ) : (
      <div className="px-16 text-xs sm:grid sm:grid-cols-4 gap-x-4 py-4 bg-gray-50">
        No additional info
      </div>
    );
  };

  // * Upload CSV to bulk update the details
  const uploadFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size <= S3_LIMIT_SIZE) {
        const formData = new FormData();
        formData.append('file', file);
        axios.post(`/agency/client/file`, formData).then((res) => {
          const { success, message } = res.data;
          if (success) {
            dispatch(setAlert('success', 'Bulk update was successful'));
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              setRefresh(!refresh);
            }, 3000);
          } else {
            dispatch(setAlert('error', message));
          }
        });
      }
    }
  };

  //* Triggered after selecting a file
  const onFileInputChange = (event) => {
    const { files } = event.target;
    uploadFiles(files);
  };

  // * Triggered when the button for adding files is clicked
  const onTargetClick = () => {
    fileInputRef.current.click();
  };
  const [exporting, setExporting] = useState(false);

  const onExport = async () => {
    setExporting(true);
    const response = await axios.get('/agency/reports/clients-summary/export', {
      params: clientSummaryCheckbox,
    });

    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
      encoding: 'UTF-8',
    });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'clients-summary.csv';
    link.click();
    setExporting(false);
  };

  return (
    <>
      <PageHeader
        title={t('Clients.Clients')}
        left={
          userCan('clients.add') ? (
            <Link
              className="flex items-center uppercase px-2 rounded-sm py-1 border border-gray-300 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-600 focus:ring-red-300"
              to="/clients/add"
            >
              <PlusIcon className="h-4 w-4" /> Add
            </Link>
          ) : null
        }
      />
      <div className="sm:grid sm:grid-cols-4 gap-4 mb-4 items-center">
        <div className="sm:col-span-1 flex items-center bg-gray-200 rounded-md">
          <Label htmlFor="search_client" classes="px-2" textSize="xs">
            Client
          </Label>
          <Input
            name="search"
            value={search}
            onChange={onSearch}
            type="text"
            placeholder={'Search Client'}
          />
        </div>
        <div className="sm:col-span-1 flex items-center bg-gray-200 rounded-md">
          <Label htmlFor="status" classes="px-2" textSize="xs">
            Status
          </Label>
          <Select id="status" value={status} onChange={onChangeStatus}>
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="invited">Invited</option>
            <option value="registered">Registered</option>
            <option value="subscribed">Subscribed</option>
            <option value="offline">Subscription &mdash; Offline</option>
            <option value="non_renewing">
              Subscription &mdash; Non Renewing
            </option>
            <option value="paused">Subscription &mdash; Paused</option>
            <option value="unpaid">Subscription &mdash; Unpaid</option>
            <option value="dunning">Subscription &mdash; Dunning</option>
            <option value="cancelled">Subscription &mdash; Cancelled</option>
            <option value="expired">Subscription &mdash; Expired</option>
          </Select>
        </div>
        <div className="sm:col-span-1">
          <Checkbox
            id="migrated-only"
            checked={migratedOnly}
            classes="rounded"
            onChange={onMigratedOnly}
          />
          <Label htmlFor="migrated-only" classes="ml-2 text-sm">
            Show only migrated clients
          </Label>
        </div>
        <div className="sm:col-span-1">
          <div className="bg-transparent">
            <div className="-ml-4 -mt-2 flex items-center justify-end flex-wrap sm:flex-nowrap">
              {userCan('reports.revenue.view') && (
                <div className="ml-2 mt-2 flex-shrink-0">
                  <button
                    onClick={handleExportSlideOver}
                    type="button"
                    className="relative inline-flex items-center  px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Export
                  </button>
                </div>
              )}
              {userCan('clients.bulk.update') && (
                <div className="ml-2 mt-2 flex-shrink-0">
                  <input
                    onChange={onFileInputChange}
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                  />
                  <FileDrop
                    onTargetClick={onTargetClick}
                    onDrop={(files, event) => uploadFiles(files)}
                  >
                    <button
                      type="button"
                      className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PlusIcon
                        className="-ml-1 mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                      Bulk Update
                    </button>
                  </FileDrop>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <SlideOver
        open={openExportSlideOver}
        setOpen={setOpenExportSlideOver}
        title="Select fields to export"
      >
        {Object.keys(clientSummaryCheckbox).map((key, index) => {
          return (
            <div key={index}>
              <label className="flex-1 items-center text-sm text-gray-500">
                <Checkbox
                  id={key}
                  value={clientSummaryCheckbox[key]}
                  classes=" mr-2 rounded"
                  checked={clientSummaryCheckbox[key]}
                  onChange={() => {
                    setClientSummaryCheckbox({
                      ...clientSummaryCheckbox,
                      [key]: !clientSummaryCheckbox[key],
                    });
                  }}
                />
                {startCase(key)}
              </label>
            </div>
          );
        })}
        <button
          onClick={onExport}
          type="button"
          className="relative inline-flex items-center mt-6 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Export csv
        </button>
      </SlideOver>
      <Table
        columns={tableColumns}
        data={agencyClients}
        onTableChange={onTableChange}
        params={params}
        keyField="agencyClientId"
        defaultSorted={[
          {
            dataField: sortParam ? sortParam[0] : 'client',
            order: sortParam ? sortParam[1] : 'asc',
          },
        ]}
        loading={loading}
        expandRow={ExpandRow({ renderer })}
      />

      <ConfirmationModal
        title="Delete Client"
        content={`Remove ${clientForDelete?.client}?`}
        open={isOpenDelete}
        setOpen={setIsOpenDelete}
        onOkClick={deleteClient}
        onCancelClick={() => setIsOpenDelete(false)}
        okLoading={deleting}
        showOkLoading={true}
      />
    </>
  );
};

export default Overview;
