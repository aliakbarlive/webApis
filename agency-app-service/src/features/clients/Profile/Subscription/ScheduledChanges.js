import { ExclamationIcon, TrashIcon } from '@heroicons/react/solid';
import Modal from 'components/Modal';
import ConfirmationModal from 'components/ConfirmationModal';
import { useState } from 'react';
import { dateFormatter } from 'utils/formatters';
import PlanAddonsTable from './PlanAddonsTable';
import ModalHeader from 'components/ModalHeader';

const ScheduledChanges = ({
  open,
  setOpen,
  scheduledChanges,
  onDropChanges,
}) => {
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);

  const dropChanges = () => {
    setIsOpenConfirm(false);
    onDropChanges();
  };

  return (
    <div className="sm:mx-5 ">
      <div className="flex items-center text-sm font-normal text-yellow-400 pt-3 px-5 border-t">
        <ExclamationIcon className="w-5 h-5 mr-1" /> There are some changes
        scheduled on&nbsp;
        {dateFormatter(scheduledChanges.subscription.next_billing_at)}.
        <button onClick={() => setOpen(true)} className="ml-1 text-red-600">
          View Changes
        </button>
      </div>
      <Modal align="top" open={open} setOpen={setOpen}>
        <div className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
          <ModalHeader
            title={`Changes will be effective from ${dateFormatter(
              scheduledChanges.subscription.next_billing_at
            )}.`}
            setOpen={setOpen}
            classes="bg-gray-100"
          />
          <div className="p-4">
            <PlanAddonsTable
              subscription={scheduledChanges.subscription}
              isScheduledChanges={1}
            />
          </div>

          <div className="px-6 py-4 border-t flex justify-between">
            <button
              type="button"
              className="flex items-center text-sm text-red-500"
              onClick={() => setIsOpenConfirm(true)}
            >
              <TrashIcon className="w-4 h-4" />
              &nbsp;drop the scheduled changes
            </button>
          </div>
          <ConfirmationModal
            title="Drop Scheduled Changes"
            content="Are you sure you want to continue this action?"
            open={isOpenConfirm}
            setOpen={setIsOpenConfirm}
            onOkClick={dropChanges}
            onCancelClick={() => setIsOpenConfirm(false)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ScheduledChanges;
