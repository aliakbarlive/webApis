import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import { setAlert } from 'features/alerts/alertsSlice';
import Toggle from 'components/Forms/Toggle';

import {
  fetchClientChecklistsById,
  selectClientChecklist,
  addLogs,
} from '../../clientChecklistsSlice';

const CheckboxAction = ({
  data,
  agencyClientId,
  refreshParent,
  setRefreshParent,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { clientChecklist, defaultValue } = data;
  const { clientChecklistId, value } = clientChecklist[0];
  const ccList = useSelector(selectClientChecklist);

  const [positions, setPositions] = useState([...defaultValue]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  // * Get the details of a client checklist
  useEffect(() => {
    if (clientChecklistId !== null) {
      dispatch(fetchClientChecklistsById(clientChecklistId)).then(() => {
        setLoading(false);
      });
    }
  }, [dispatch, refresh, clientChecklistId]);

  if (value !== null && value.length > 0 && !loaded) {
    setLoaded(true);
    setPositions([...value]);
  }

  // * Update the value of the checklist
  const updateClientChecklist = (body) => {
    axios
      .post(`/agency/client/${agencyClientId}/checklists`, body)
      .then((res) => {
        dispatch(
          setAlert('success', t('Clients.ClientChecklists.UpdateChecklist'))
        );
        setRefresh(!refresh);
        setRefreshParent(!refreshParent);
      });
  };

  const onSwitch = async (e, key) => {
    const newPostions = positions.map((p) => {
      if (p.name === key) {
        return {
          name: key,
          assigned: e,
        };
      } else {
        return p;
      }
    });

    setPositions([...newPostions]);

    const body = {
      value: [...newPostions],
      checklistId: ccList.checklistId,
    };

    updateClientChecklist(body);

    let assign = t('Clients.ClientChecklists.ClientAssignments.Unassigned');
    if (e) {
      assign = t('Clients.ClientChecklists.ClientAssignments.Assigned');
    }
    dispatch(addLogs(clientChecklistId, `${key} is ${assign}`));
  };

  return (
    <>
      <h1 className="mb-5">
        {t('Clients.ClientChecklists.ClientAssignments.PositionsAssigned')}
      </h1>
      {!loading &&
        positions &&
        positions.map((p) => (
          <>
            <div className="grid grid-cols-6 gap-4 my-4">
              <div className="col-span-1 text-center">
                <Toggle
                  onChange={(e) => onSwitch(e, p.name)}
                  checked={p.assigned}
                />
              </div>

              <div className="col-span-5">
                <span>{p.name}</span>
              </div>
            </div>
          </>
        ))}
    </>
  );
};

export default CheckboxAction;
