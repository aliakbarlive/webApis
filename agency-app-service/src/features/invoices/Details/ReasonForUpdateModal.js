import Button from 'components/Button';
import Input from 'components/Forms/Input';
import Label from 'components/Forms/Label';
import RequiredAsterisk from 'components/Forms/RequiredAsterisk';
import Select from 'components/Forms/Select';
import Textarea from 'components/Forms/Textarea';
import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import { useEffect, useState } from 'react';

const ReasonForUpdateModal = ({
  invoice,
  open,
  setOpen,
  onAddReason,
  loading,
}) => {
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const onInputChange = (e) => {
    setReasonError(e.target.value === '' ? 'Reason is required' : '');
    setReason(e.target.value);
  };

  const onSubmit = () => {
    if (reason !== '') {
      onAddReason(reason);
    } else {
      setReasonError('Reason is required');
    }
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      align="top"
      as={'div'}
      noOverlayClick={true}
    >
      <div className="inline-block w-full max-w-xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
        <ModalHeader
          title={
            <span className="font-normal text-sm">
              Note down the reason for editing an invoice that has already been
              sent.
            </span>
          }
          setOpen={setOpen}
          titleClasses="font-normal"
        />

        <form method="POST" onSubmit={onSubmit}>
          <div className="py-4 px-6">
            <div className="text-red-500 text-xs">{reasonError}</div>
            <div className="mt-2">
              <Textarea
                id="description"
                onChange={onInputChange}
                value={reason}
                rows={3}
                required
              />
            </div>
          </div>
          <div className="text-right p-4 mt-2 border-t">
            <Button
              color="gray"
              onClick={() => setOpen(false)}
              classes="mr-2"
              loading={loading}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={onSubmit}
              loading={loading}
              showLoading={true}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ReasonForUpdateModal;
