import Select from 'components/Forms/Select';
import Toggle from 'components/Toggle';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import axios from 'axios';
import {
  MinusCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/solid';
import { startCase } from 'lodash';
import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import EmailAction from './Actions/EmailAction';
import FormAction from './Actions/FormAction';
import CheckboxAction from './Actions/CheckboxAction';
import ChecklistAction from './Actions/ChecklistAction';
import UrlAction from './Actions/UrlAction';

import { CLIENT_CHECKLIST_STATUS } from '../../../utils/constants';

import {
  fetchClientChecklists,
  selectClientChecklists,
  selectLoading,
  fetchClientChecklistsLogs,
  selectLogs,
} from '../clientChecklistsSlice';

import LogsSlideOver from './components/LogsSlideOver';
import { setAlert } from 'features/alerts/alertsSlice';
import FileAction from './Actions/FileAction';
import usePermissions from 'hooks/usePermissions';

const Checklists = ({ client }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const clientChecklists = useSelector(selectClientChecklists);
  const logs = useSelector(selectLogs);
  const loading = useSelector(selectLoading);
  const [refresh, setRefresh] = useState(false);
  const [openLogs, setOpenLogs] = useState(false);
  const [ccName, setCCName] = useState('');
  const [ccId, setCCId] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedCc, setSelectedCc] = useState({});

  const { userCan, isAgencySuperUser } = usePermissions();

  const manageChecklist =
    userCan('clients.checklist.manage') || isAgencySuperUser();

  useEffect(() => {
    dispatch(fetchClientChecklists(client.agencyClientId));
  }, [dispatch, refresh]);

  useEffect(() => {
    if (ccId !== 0) {
      dispatch(fetchClientChecklistsLogs(ccId));
    }
  }, [dispatch, ccId, refresh]);

  const updateChecklist = (id, body, name) => {
    axios.post(`/agency/client/${id}/checklists`, body).then((res) => {
      dispatch(
        setAlert('success', t('Clients.ClientChecklists.UpdateChecklist'))
      );

      const { clientChecklistId } = res.data.data;

      if (clientChecklistId) {
        axios
          .post(`/agency/client/checklists/${clientChecklistId}/logs`, {
            name,
          })
          .then(() => {
            setRefresh(!refresh);
          });
      }
    });
  };

  const onChange = (e, cc) => {
    const params = {
      status: e.target.value,
      checklistId: cc.checklistId,
    };
    const taskName = `"${cc.name}" ${t(
      'Clients.ClientChecklists.MarkedAs'
    )} ${startCase(params.status)}`;
    updateChecklist(client.agencyClientId, params, taskName);
    return e;
  };

  const onSwitchChange = (e, cc) => {
    const params = {
      toggle: e,
      checklistId: cc.checklistId,
    };
    const toggle = e
      ? t('Clients.ClientChecklists.Visible')
      : t('Clients.ClientChecklists.Hidden');
    const taskName = `"${cc.name}" ${t(
      'Clients.ClientChecklists.MarkedAs'
    )} ${toggle}`;
    updateChecklist(client.agencyClientId, params, taskName);
    return e;
  };

  const displayStatusIcon = (status) => {
    let icon = '';
    const commonStyle = 'float-left w-6 mt-2 mr-3';
    switch (status) {
      case 'incomplete':
        icon = <XCircleIcon className={`text-red-400 ${commonStyle}`} />;
        break;
      case 'in-progress':
        icon = <MinusCircleIcon className={`text-yellow-400 ${commonStyle}`} />;
        break;
      case 'complete':
        icon = <CheckCircleIcon className={`text-green-400 ${commonStyle}`} />;
        break;
      default:
        icon = <XCircleIcon className={`text-red-400 ${commonStyle}`} />;
        break;
    }

    return icon;
  };

  const onClickLogs = (name, id) => {
    setCCName(name);
    setCCId(id);
    setRefresh(!refresh);
    setOpenLogs(true);
  };

  const formatChecklist = (cc) => {
    return cc.clientChecklist.length > 0
      ? cc.clientChecklist[0]
      : {
          clientChecklistId: 0,
          toggle: cc.defaultToggle,
          status: 'incomplete',
          logs: 0,
          createdAt: null,
          updatedAt: null,
        };
  };

  const formatRow = (cc) => {
    const checklist = formatChecklist(cc);

    let textColor = 'text-red-400';

    if (checklist.status !== 'incomplete') {
      textColor =
        checklist.status === 'in-progress'
          ? 'text-yellow-400'
          : 'text-green-400';
    }

    return (
      <tr key={cc.checklistId}>
        <td>
          {displayStatusIcon(checklist.status)}
          <div className="float-left w-3/4">
            <Select
              name="checklistStatus"
              className="font-medium text-sm mb-2 md:mb-0"
              id={`checklist-${cc.checklistId}`}
              value={checklist.status}
              onChange={(e) => onChange(e, cc)}
              disabled={!manageChecklist}
            >
              {CLIENT_CHECKLIST_STATUS.map((option) => {
                return (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </Select>
          </div>
        </td>
        <td>
          <button
            type="button"
            onClick={() => showAction(cc)}
            disabled={!manageChecklist}
          >
            {cc.name}
          </button>

          <br />
          {(checklist.status === 'in-progress' ||
            checklist.status === 'complete') &&
            checklist.createdAt && (
              <>
                <b className="float-left text-sm mr-2">
                  {t('Clients.ClientChecklists.Start')}
                </b>
                <span className={`float-left text-sm ${textColor}`}>
                  {moment(checklist.createdAt).format('MMM DD, YYYY')}
                </span>
              </>
            )}
          {checklist.status === 'complete' && checklist.updatedAt && (
            <>
              <ChevronDoubleRightIcon className=" float-left w-5 mr-2 ml-2" />
              <b className="float-left text-sm mr-2">
                {t('Clients.ClientChecklists.Completed')}
              </b>
              <span className={`float-left text-sm ${textColor}`}>
                {moment(checklist.updatedAt).format('MMM DD, YYYY')}
              </span>
            </>
          )}
          {checklist.logs > 0 && (
            <div className="clear-both">
              <button
                className="text-sm mr-2 underline"
                onClick={() =>
                  onClickLogs(cc.name, checklist.clientChecklistId)
                }
              >
                Logs
              </button>
            </div>
          )}
        </td>
        {manageChecklist && (
          <td className="text-right align-middle">
            <Toggle
              onChange={(e) => onSwitchChange(e, cc)}
              checked={checklist.toggle}
            />
            <label className="text-xs float-right mt-1 ml-1">
              {t('Clients.ClientChecklists.VisibleToClient')}
            </label>
          </td>
        )}
      </tr>
    );
  };

  const checklistType = [
    'email',
    'form',
    'file',
    'radio',
    'text',
    'url',
    'checkbox',
  ];

  const showAction = (cc) => {
    if (checklistType.includes(cc.checklistType)) {
      if (cc.clientChecklist.length > 0) {
        setOpen(true);
        setSelectedCc(cc);
      }
    }
  };

  return (
    <>
      <LogsSlideOver
        open={openLogs}
        setOpen={setOpenLogs}
        logs={logs}
        name={ccName}
      />
      <Modal
        open={open}
        setOpen={setOpen}
        as={'div'}
        align="top"
        persistent={true}
      >
        <div className="inline-block w-full max-w-6xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
          <ModalHeader
            title={t(`Clients.ClientChecklists.Title${selectedCc.checklistId}`)}
            setOpen={setOpen}
          />
          <div className="p-6">
            {selectedCc.checklistType === 'email' && (
              <EmailAction
                data={selectedCc}
                agencyClientId={client.agencyClientId}
                setOpen={setOpen}
              />
            )}
            {selectedCc.checklistType === 'file' && (
              <FileAction
                data={selectedCc}
                agencyClientId={client.agencyClientId}
                setOpen={setOpen}
              />
            )}
            {selectedCc.checklistType === 'form' && (
              <FormAction
                data={selectedCc}
                agencyClientId={client.agencyClientId}
                setOpen={setOpen}
              />
            )}
            {(selectedCc.checklistType === 'text' ||
              selectedCc.checklistType === 'radio') && (
              <ChecklistAction
                data={selectedCc}
                agencyClientId={client.agencyClientId}
                setOpen={setOpen}
              />
            )}
            {selectedCc.checklistType === 'url' && (
              <UrlAction
                data={selectedCc}
                agencyClientId={client.agencyClientId}
                setOpen={setOpen}
              />
            )}
            {selectedCc.checklistType === 'checkbox' && (
              <CheckboxAction
                data={selectedCc}
                agencyClientId={client.agencyClientId}
                refreshParent={refresh}
                setRefreshParent={setRefresh}
              />
            )}
          </div>
        </div>
      </Modal>
      <table className="w-full">
        <thead>
          <tr>
            <th className="w-1/4 text-left">STATUS</th>
            <th className="w-2/4 text-left">CHECKLIST</th>
            <th className="w-1/4 text-left">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            clientChecklists &&
            clientChecklists.map((cc) => formatRow(cc))}
        </tbody>
      </table>
    </>
  );
};

export default Checklists;
