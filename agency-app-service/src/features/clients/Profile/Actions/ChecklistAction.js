import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  updateClientChecklist,
  fetchClientChecklists,
} from '../../clientChecklistsSlice';

import Toggle from 'components/Forms/Toggle';
import Button from 'components/Button';
import Textarea from 'components/Forms/Textarea';

const ChecklistAction = ({ data, agencyClientId, setOpen }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (data.clientChecklist.length > 0 && data.clientChecklist[0].value) {
      setFormData(data.clientChecklist[0].value[0]);
    } else {
      setFormData(
        data.defaultValue.reduce((a, v) => ({ ...a, [v.key]: v.value }), {})
      );
    }
  }, []);

  const onInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSwitch = async (e, key) => {
    let value = { ...formData, [key]: e };
    let params = {
      checklistId: data.checklistId,
      value: [value],
    };
    setFormData(value);
    await dispatch(updateClientChecklist(agencyClientId, params));
    await dispatch(fetchClientChecklists(agencyClientId));
  };

  const onSave = async () => {
    let params = {
      checklistId: data.checklistId,
      value: [formData],
    };
    await dispatch(updateClientChecklist(agencyClientId, params));
    await dispatch(fetchClientChecklists(agencyClientId));
  };

  return (
    <>
      <ul>
        {data.defaultValue.map((el) => (
          <li key={el.key}>
            {el.type === 'toggle' ? (
              <div className="grid grid-cols-6 gap-4 my-4">
                <div className="col-span-1">
                  <Toggle
                    onChange={(e) => onSwitch(e, el.key)}
                    checked={formData[el.key] ? formData[el.key] : false}
                  />
                </div>

                <div className="col-span-5">
                  <span>{el.key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-4 my-2">
                <div className="col-span-6">
                  <span className="align-middle sm:col-span-3 md:col-span-1">
                    {el.key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <Textarea
                    id={el.key}
                    name={el.key}
                    autoComplete={el.key}
                    required
                    value={formData[el.key]}
                    className="my-4 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    onChange={onInputChange}
                  />
                  <Button color="green" classes="h-8 mr-4" onClick={onSave}>
                    Submit
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="my-4 float-right">
        <Button onClick={() => setOpen(false)} color="red" classes="h-8">
          {t('Close')}
        </Button>
      </div>
    </>
  );
};

export default ChecklistAction;
