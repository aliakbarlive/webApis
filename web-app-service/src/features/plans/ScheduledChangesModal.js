import { ExclamationIcon } from '@heroicons/react/solid';
import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import { dateFormatter } from 'utils/formatter';
import ZohoPlanAddonsTable from './ZohoPlanAddonsTable';

const ScheduledChangesModal = ({ open, setOpen, scheduledChanges }) => {
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
            <ZohoPlanAddonsTable subscription={scheduledChanges.subscription} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ScheduledChangesModal;
