import axios from 'axios';
import { ConfirmationModal } from 'components';
import Button from 'components/Button';
import { setAlert } from 'features/alerts/alertsSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TrashIcon } from '@heroicons/react/outline';

const DeleteUpsell = ({ upsell, getUpsells, closeSlideOver }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onDeleteUpsell = async () => {
    setLoading(true);
    try {
      const out = await axios.delete(`/agency/upsells/${upsell.upsellId}`);
      //console.log(out.data.success, 'ok');
      dispatch(setAlert('success', 'Upsell Deleted'));
      setOpen(false);
      closeSlideOver();
      getUpsells();
    } catch (error) {
      console.log(error);
      dispatch(setAlert('error', 'Unable to delete this request'));
    }
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <Button
        classes="mt-2 mr-2"
        bgColor="gray-50"
        textColor="red-700"
        hoverColor="gray-100"
        onClick={() => setOpen(true)}
        loading={loading}
        showLoading={true}
      >
        <TrashIcon className="w-5 h-5 inline" />
      </Button>
      <ConfirmationModal
        title="Delete Upsell Request"
        content="Are you sure you want to delete this upsell request?"
        open={open}
        setOpen={setOpen}
        onOkClick={onDeleteUpsell}
        onCancelClick={() => setOpen(false)}
        okLoading={loading}
        showOkLoading={true}
      />
    </>
  );
};

export default DeleteUpsell;
