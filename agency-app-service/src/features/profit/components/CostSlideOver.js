import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';

import {
  addProductCostsAsync,
  getProductCostsAsync,
  updateProductCostsAsync,
  selectSelectedProductCost,
  setSelectedProductCost,
} from '../costManagerSlice';

import Input from 'components/Forms/Input';
import DatePicker from './DatePicker';

const CostSlideOver = ({ open, setOpen, inventory }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedProductCost = useSelector(selectSelectedProductCost);

  const [isEditing, setIsEditing] = useState(false);

  const [data, setData] = useState({
    startDate: '',
    cogsAmount: '',
    shippingAmount: '',
    miscAmount: '',
  });

  useEffect(() => {
    const editing = 'productCostId' in selectedProductCost;
    setIsEditing(editing);

    if (editing) {
      const { startDate, cogsAmount, shippingAmount, miscAmount } =
        selectedProductCost;

      setData({
        startDate,
        cogsAmount,
        shippingAmount,
        miscAmount,
      });
    }
  }, [selectedProductCost]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: parseInt(value) });
  };

  const onSetStartDate = (startDate) => {
    setData({ ...data, startDate });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let form = {};
    Object.keys(data)
      .filter((key) => data[key])
      .forEach((key) => {
        form[key] = data[key];
      });

    if (isEditing) {
      await dispatch(
        updateProductCostsAsync(
          inventory.inventoryItemId,
          selectedProductCost.productCostId,
          form
        )
      );
    } else {
      await dispatch(addProductCostsAsync(inventory.inventoryItemId, form));
    }

    await dispatch(getProductCostsAsync(inventory.inventoryItemId));
    await resetForm();
    setOpen(false);
  };

  const resetForm = async () => {
    await dispatch(setSelectedProductCost({}));
    setData({
      startDate: '',
      cogsAmount: '',
      shippingAmount: '',
      miscAmount: '',
    });
  };

  const onCancel = async (e) => {
    if (e) e.preventDefault();
    await resetForm();
    setOpen(false);
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
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        {isEditing
                          ? t('CostManager.Update')
                          : t('CostManager.Add')}{' '}
                        {t('CostManager.Cost')}
                      </Dialog.Title>

                      <div className="ml-3 h-7 flex items-center">
                        <button
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => onCancel()}
                        >
                          <span className="sr-only">
                            {t('CostManager.ClosePanel')}
                          </span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-4 sm:px-6">
                    <hr />
                  </div>
                  <div className="px-4 sm:px-6">
                    <div className="flex space-x-3">
                      <div className="mr-4 flex-shrink-0 self-center">
                        <img
                          className="h-16 w-16 border border-transparent sm:rounded-lg shadow"
                          src={inventory.Listing.thumbnail}
                          alt={inventory.productName}
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 mb-1.5">
                            {inventory.productName}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-1">
                          ASIN: {inventory.asin}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-1">
                          SKU: {inventory.sellerSku}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="pb-8">
                      <DatePicker
                        onSetStartDate={onSetStartDate}
                        startDate={data.startDate}
                      />
                    </div>
                    <form
                      className="space-y-6"
                      action="#"
                      method="POST"
                      onSubmit={onSubmit}
                    >
                      <div>
                        <label
                          htmlFor="cogsAmount"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t('CostManager.CostOfGoodsPerUnit')}
                        </label>
                        <div className="mt-1">
                          <Input
                            type="number"
                            name="cogsAmount"
                            value={data.cogsAmount}
                            onChange={onInputChange}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="shippingAmount"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t('CostManager.ShippingPerUnit')}
                        </label>
                        <div className="mt-1">
                          <Input
                            type="number"
                            name="shippingAmount"
                            value={data.shippingAmount}
                            onChange={onInputChange}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="miscAmount"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t('CostManager.MiscCostPerUnit')}
                        </label>
                        <div className="mt-1">
                          <Input
                            type="number"
                            name="miscAmount"
                            value={data.miscAmount}
                            onChange={onInputChange}
                          />
                        </div>
                      </div>
                      <div className="flex flex-inventory-reverse">
                        <div className="ml-4">
                          <button
                            type="submit"
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                          >
                            {isEditing
                              ? t('CostManager.Save')
                              : t('CostManager.Add')}{' '}
                            {t('CostManager.Cost')}
                          </button>
                        </div>
                        <div className="mx-4">
                          <button
                            onClick={(e) => onCancel(e)}
                            className="inline-flex justify-center ml-2 px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                          >
                            {t('CostManager.Cancel')}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CostSlideOver;
