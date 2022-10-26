import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon, TrashIcon } from '@heroicons/react/outline';
import React, { useEffect } from 'react';
import { isEmpty } from 'lodash';

import Input from 'components/Forms/Input';
import Label from 'components/Forms/Label';
import Textarea from 'components/Forms/Textarea';
import Button from 'components/Button';
import ConfirmationModal from 'components/ConfirmationModal';
import Error from 'components/Forms/Error';
import { userCan } from 'utils/permission';

import { addItem, updateItem, deleteItem } from './upsellItemsSlice';
import { selectAuthenticatedUser } from 'features/auth/authSlice';

const ItemSlideOver = ({ open, setOpen, refresh, setRefresh, row }) => {
  const dispatch = useDispatch();

  const authenticatedUser = useSelector(selectAuthenticatedUser);
  const [formData, setFormData] = useState(row);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [errors, setErrors] = useState(null);

  const action = row.upsellItemId ? 'edit' : 'add';

  useEffect(() => {
    setFormData(row);
  }, [row]);

  const onDataChange = (data) => {
    setFormData({ ...formData, ...data });
  };

  const onInputChange = (e) => {
    onDataChange({ [e.target.name]: e.target.value });
  };

  const saveItem = () => {
    const { name, description, code, price } = formData;
    dispatch(
      action == 'add'
        ? addItem(formData)
        : updateItem({
            upsellItemId: row.upsellItemId,
            formData: { name, description, code, price },
          })
    )
      .unwrap()
      .then((res) => {
        if (res.success) {
          setRefresh(!refresh);
          setOpen(false);
          setErrors(null);
        } else {
          setErrors(res.data);
        }
      });
  };

  const onCancel = () => {
    setOpen(false);
  };

  const onDelete = () => {
    dispatch(deleteItem(row.upsellItemId)).then(() => {
      setIsOpenDeleteModal(false);
      setOpen(false);
      setRefresh(!refresh);
    });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 overflow-hidden z-10"
        open={open}
        onClose={setOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <ConfirmationModal
            title="Delete this upsell item?"
            open={isOpenDeleteModal}
            setOpen={setIsOpenDeleteModal}
            onOkClick={() => onDelete()}
            onCancelClick={() => setIsOpenDeleteModal(false)}
            size="sm"
          />
        </div>

        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-500 sm:duration-700"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-500 sm:duration-700"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="w-screen max-w-lg">
              <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                <div className="px-4 sm:px-6">
                  {/* Start Title */}
                  <div className="flex items-start justify-between">
                    <Dialog.Title className="text-lg font-medium text-gray-900">
                      {row.name ? 'Edit' : 'Create'} Upsell Item
                    </Dialog.Title>

                    <div className="ml-3 h-7 flex items-center">
                      <button
                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => onCancel()}
                      >
                        <span className="sr-only">Close panel</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  {/* End Title */}
                  <form>
                    <div className="mt-8">
                      <div className="flex flex-col">
                        <Label>Item Name</Label>
                        <span className="col-span-2 text-gray-900 mb-3">
                          <Input
                            type="text"
                            id="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={onInputChange}
                          />
                        </span>
                        <Error>{errors?.name}</Error>
                        <Label>Description</Label>
                        <span className="col-span-2 text-gray-900 mb-3">
                          <Textarea
                            id="description"
                            name="description"
                            placeholder="Description"
                            label="description"
                            value={formData.description}
                            onChange={onInputChange}
                            rows="10"
                          />
                        </span>
                        <Error>{errors?.description}</Error>
                        <Label>Code</Label>
                        <span className="col-span-2 text-gray-900 mb-3">
                          <Input
                            type="text"
                            id="code"
                            placeholder="Code"
                            value={formData.code}
                            onChange={onInputChange}
                          />
                        </span>
                        <Error>{errors?.code}</Error>
                        <Label>Price ($)</Label>
                        <span className="col-span-2 text-gray-900 mb-3">
                          <Input
                            id="price"
                            type="number"
                            placeholder="0.00"
                            classes="text-right"
                            value={formData.price}
                            onChange={onInputChange}
                          />
                        </span>
                        <Error>{errors?.price}</Error>
                      </div>
                      <div
                        className={`flex items-start  justify-${
                          row.name ? 'between' : 'end'
                        } mt-10`}
                      >
                        {action == 'edit' &&
                        userCan(authenticatedUser, 'upsells.items.delete') ? (
                          <Button
                            classes="border-gray-100"
                            bgColor="white"
                            hoverColor="gray-50"
                            textColor="red-900"
                            onClick={() => setIsOpenDeleteModal(true)}
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4 inline mr-2" /> Delete
                          </Button>
                        ) : (
                          <>&nbsp;</>
                        )}
                        <div>
                          <Button
                            classes="border-gray-100"
                            bgColor="gray-50"
                            hoverColor="gray-300"
                            textColor="gray-700"
                            onClick={onCancel}
                          >
                            Cancel
                          </Button>
                          {/* <input
                            className={`${
                              row.name ? 'hidden' : 'block'
                            } cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:bg-red-700 bg-red-600 ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white`}
                            type="submit"
                            onClick={saveItem}
                          /> */}
                          <Button classes="ml-2" onClick={saveItem}>
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ItemSlideOver;
