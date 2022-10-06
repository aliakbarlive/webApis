import React, { useRef, useState } from 'react';
import { Popover } from '@headlessui/react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import ButtonLink from 'components/ButtonLink';
import Textarea from 'components/Forms/Textarea';
import { PencilIcon, PlusIcon } from '@heroicons/react/outline';
import { setAlert } from 'features/alerts/alertsSlice';

const EditReason = ({ client, reason, updateClientData }) => {
  const { agencyClientId } = client;

  const [saving, setSaving] = useState(false);
  const [newDescription, setNewDescription] = useState(reason);
  const closeRef = useRef();
  const dispatch = useDispatch();

  const onSaveChanges = async () => {
    setSaving(true);
    try {
      const out = await axios.post(
        `/agency/client/${agencyClientId}/nocommission`,
        {
          noCommission: client.noCommission,
          noCommissionReason: newDescription,
        }
      );
      updateClientData({ noCommissionReason: newDescription });
      closeRef.current?.click();
    } catch (error) {
      dispatch(
        setAlert('error', 'Error updating reason', error.response.data.message)
      );
    }
    setSaving(false);
  };

  return (
    <Popover className="relative leading-none w-50">
      <Popover.Button
        ref={closeRef}
        className="mt-1 text-red-500 hover:text-red-600 text-xs flex items-center"
      >
        {reason !== '' ? (
          <>
            <PencilIcon className="h-3 w-3 inline" />
            &nbsp;edit reason
          </>
        ) : (
          <>
            <PlusIcon className="h-3 w-3 inline" />
            add
          </>
        )}
      </Popover.Button>

      <Popover.Panel className="tail absolute z-10 shadow-md border bg-white text-sm rounded-md w-full">
        <div className="text-xs py-2 bg-gray-50 mb-2 px-4 text-gray-700 border-b">
          Reason
        </div>
        <div className="px-2 text-xs">
          <Textarea
            name="newDescription"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            textSize="xs"
            required
          />
        </div>
        <div className="text-xs border-t p-2 mt-2 flex justify-end">
          <ButtonLink
            onClick={onSaveChanges}
            loading={saving}
            showLoading={true}
            color="white"
            classes="bg-red-500 hover:bg-red-700 py-2 px-3 rounded-md"
            textSize="xs"
          >
            Save
          </ButtonLink>
          <Popover.Button
            as="button"
            className="rounded-md bg-gray-100 hover:bg-gray-400 py-2 px-3 ml-2"
          >
            Cancel
          </Popover.Button>
        </div>
      </Popover.Panel>
    </Popover>
  );
};
export default EditReason;
