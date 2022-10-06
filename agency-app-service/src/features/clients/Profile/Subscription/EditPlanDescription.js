import React, { useRef, useState } from 'react';
import { Popover } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import ButtonLink from 'components/ButtonLink';
import { updatePlanDescription } from 'features/clients/subscriptionsSlice';
import Textarea from 'components/Forms/Textarea';
import { PencilIcon, PlusIcon } from '@heroicons/react/outline';

const EditPlanDescription = ({ subscription, setSubscription }) => {
  const { subscription_id, plan } = subscription;
  const { description, plan_code } = plan;

  const [saving, setSaving] = useState(false);
  const [newDescription, setNewDescription] = useState(description);
  const closeRef = useRef();
  const dispatch = useDispatch();

  const onSaveChanges = () => {
    setSaving(true);
    dispatch(
      updatePlanDescription(subscription_id, plan_code, newDescription)
    ).then((res) => {
      if (res?.output.code === 0) {
        closeRef.current?.click();
        setSubscription({
          ...subscription,
          plan: { ...plan, description: newDescription },
        });
      }
      setSaving(false);
    });
  };

  return (
    <Popover className="relative leading-none w-50">
      <Popover.Button
        ref={closeRef}
        className="mt-1 text-red-500 hover:text-red-600 text-xs flex items-center"
      >
        {description !== '' ? (
          <>
            <PencilIcon className="h-4 w-4 inline" />
            edit description
          </>
        ) : (
          <>
            <PlusIcon className="h-4 w-4 inline" />
            add description
          </>
        )}
      </Popover.Button>

      <Popover.Panel className="tail absolute z-10 shadow-md border bg-white text-sm rounded-md w-full">
        <div className="text-xs py-2 bg-gray-50 mb-2 px-4 text-gray-700 border-b text-sm">
          Plan Description
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
export default EditPlanDescription;
