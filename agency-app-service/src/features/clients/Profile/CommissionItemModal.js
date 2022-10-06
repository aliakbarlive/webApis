import { ConfirmationModal } from 'components';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCommission,
  deleteCommission,
  updateCommission,
} from '../commissionsSlice';
import Commission from '../Form/Commission';
import { TrashIcon } from '@heroicons/react/outline';
import { ExclamationIcon } from '@heroicons/react/solid';
import { userCan } from 'utils/permission';
import { selectAuthenticatedUser } from 'features/auth/authSlice';

const CommissionItemModal = ({
  open,
  setOpen,
  marketplaces,
  commission,
  account,
  action,
  onUpdate,
  client,
}) => {
  const authenticatedUser = useSelector(selectAuthenticatedUser);
  const [formData, setFormData] = useState(commission);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [errors, setErrors] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setFormData(commission);
  }, [commission]);

  const onDataChange = (data) => {
    setFormData({ ...formData, ...data });
  };

  const saveCommission = () => {
    dispatch(
      action == 'add'
        ? addCommission({
            ...formData,
            agencyClientId: client.agencyClientId,
            noCommission: client.noCommission,
          })
        : updateCommission({ commissionId: commission.commissionId, formData })
    )
      .unwrap()
      .then((res) => {
        if (res.success) {
          onUpdate({ data: res.data, action });
          setErrors(null);
        } else {
          setErrors(res.data);
        }
      });
  };

  const onDelete = () => {
    dispatch(deleteCommission(commission.commissionId)).then((res) => {
      setIsOpenDeleteModal(false);
      setOpen(false);

      if (res.data.output.noCommission) {
        console.log('no com');
        const { noCommission, noCommissionReason } = res.data.output;
        onUpdate({
          data: commission.commissionId,
          action: 'delete',
          noCommission,
          noCommissionReason,
        });
      } else {
        onUpdate({ data: commission.commissionId, action: 'delete' });
      }
    });
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      as={'div'}
      align="middle"
      noOverlayClick={true}
    >
      <ConfirmationModal
        title="Delete this record?"
        open={isOpenDeleteModal}
        setOpen={setIsOpenDeleteModal}
        onOkClick={() => onDelete()}
        onCancelClick={() => setIsOpenDeleteModal(false)}
        size="sm"
      />

      <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left transition-all transform bg-white shadow-xl rounded-xl">
        <ModalHeader
          title={`${action} Commission`}
          setOpen={setOpen}
          titleClasses="capitalize"
        />
        {client.noCommission && (
          <div className="bg-yellow-50 py-4 px-4 text-xs text-yellow-500">
            <ExclamationIcon className="w-5 h-5 inline text-yellow-300" />{' '}
            Adding a commission will remove the no commission status
          </div>
        )}

        <div>
          <Commission
            formData={formData}
            marketplaces={marketplaces}
            account={account}
            onDataChange={onDataChange}
            layout="flex"
            errors={errors}
          />
        </div>
        <div
          className={`px-2 py-3 text-right bg-gray-50 border-t ${
            action === 'edit' ? 'flex justify-between' : ''
          }`}
        >
          {action === 'edit' &&
          userCan(authenticatedUser, 'clients.commission.delete') ? (
            <Button
              bgColor="gray-50"
              textColor="red-700"
              hoverColor="gray-100"
              onClick={() => setIsOpenDeleteModal(true)}
            >
              <TrashIcon className="w-4 h-4 inline" />
            </Button>
          ) : (
            <>&nbsp;</>
          )}

          <div>
            <Button color="gray" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            &nbsp;
            <Button onClick={saveCommission}>Save</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CommissionItemModal;
