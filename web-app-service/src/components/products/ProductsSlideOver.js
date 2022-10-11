import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';

import { Input } from 'components';

import {
  selectProducts,
  getProductsAsync,
} from '../../features/products/productsSlice';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from '../../features/accounts/accountsSlice';

const ProductsSlideOver = ({ open, setOpen, onSelect }) => {
  const dispatch = useDispatch();
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const products = useSelector(selectProducts);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: '',
    status: 'Active',
  });

  useEffect(() => {
    dispatch(getProductsAsync(params, true));
  }, [dispatch, account, marketplace, params]);

  const onChangeSearch = (search) => {
    setParams({ ...params, search });
  };

  const onLoadMore = () => {
    setParams({ ...params, page: products.page + 1 });
  };

  const allProducts = {
    asin: 'All Products',
  };

  const onClearFilter = () => {
    onSelect(allProducts);
    setParams({
      page: 1,
      pageSize: 10,
      search: '',
      status: 'Active',
    });
    setOpen(false);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 overflow-hidden z-20"
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
                        Select Product
                      </Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="px-2 sm:px-4">
                    <Input
                      placeholder="Product Title & Description"
                      onChangeInput={onChangeSearch}
                      className="block pt-2"
                    />
                  </div>

                  <div className="px-4 sm:px-6">
                    <div>
                      <ul className="divide-y divide-gray-200">
                        <li className="py-4">
                          <button
                            onClick={() => onClearFilter()}
                            className="px-2 text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Clear Filter X
                          </button>
                        </li>
                        {products.rows &&
                          products.rows.map((row, i) => {
                            return (
                              <li key={`${i}-${row.asin}`} className="py-4">
                                <div className="flex space-x-3">
                                  <div className="mr-4 flex-shrink-0 self-center">
                                    <img
                                      className="h-16 w-16 border border-transparent sm:rounded-lg shadow"
                                      src={row.thumbnail}
                                      alt={row.title}
                                    />
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <button
                                      onClick={() => onSelect(row)}
                                      className="text-left w-100"
                                    >
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-900 mb-1.5">
                                          {row.title}
                                        </p>
                                      </div>
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-1">
                                        ASIN: {row.asin}
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  </div>
                  <div className="content-center container mx-auto">
                    {products.rows && products.count > products.rows.length && (
                      <button
                        type="button"
                        className="w-full items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => onLoadMore()}
                      >
                        Load More
                      </button>
                    )}
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

export default ProductsSlideOver;
