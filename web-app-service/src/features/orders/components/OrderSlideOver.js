import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import Moment from 'react-moment';

import ProductPreview from 'components/products/ProductPreview';

const DescriptionList = ({ children }) => (
  <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
    {children}
  </dl>
);

const ListItem = ({ title, data }) => (
  <div className="py-3 flex justify-between text-sm font-medium">
    <dt className="text-gray-500">{title}</dt>
    <dd className="text-gray-900">{data}</dd>
  </div>
);

const OrderSlideOver = ({ open, setOpen, order }) => {
  const { OrderAddress, OrderItems } = order;

  const summary = [
    { title: 'Sales Channel', data: order.salesChannel },
    { title: 'Delivery Type', data: order.shipServiceLevel },
    { title: 'Status', data: order.orderStatus },
    {
      title: 'Purchase Date',
      data: <Moment format="lll">{order.purchaseDate}</Moment>,
    },
    {
      title: 'Last Update Date',
      data: <Moment format="lll">{order.lastUpdateDate}</Moment>,
    },
  ];

  const shipping = [
    { title: 'City', data: OrderAddress ? OrderAddress.city : null },
    { title: 'State', data: OrderAddress ? OrderAddress.stateOrRegion : null },
    {
      title: 'Postal Code',
      data: OrderAddress ? OrderAddress.postalCode : null,
    },
    {
      title: 'Country',
      data: OrderAddress ? OrderAddress.countryCode : null,
    },
  ];

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
                        Order ID: {order.amazonOrderId}
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

                  <div className="mt-6 relative flex-1 px-4 sm:px-6">
                    <div className="pb-16 space-y-6">
                      {/* Summary */}
                      <div>
                        <h3 className="font-medium text-gray-900">Overview</h3>
                        <DescriptionList>
                          {summary.map(
                            ({ title, data }) =>
                              data && (
                                <ListItem
                                  key={`summary-${title}`}
                                  title={title}
                                  data={data}
                                />
                              )
                          )}
                        </DescriptionList>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900">Shipping</h3>
                        <DescriptionList>
                          {shipping.map(
                            ({ title, data }) =>
                              data && (
                                <ListItem
                                  key={`description-${title}`}
                                  title={title}
                                  data={data}
                                />
                              )
                          )}
                        </DescriptionList>
                      </div>

                      {/* Products */}
                      <div>
                        <h3 className="font-medium text-gray-900">Products</h3>
                        <table className="mt-2 min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase"
                              >
                                Name
                              </th>
                              <th
                                scope="col"
                                className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase"
                              >
                                QTY
                              </th>
                              <th
                                scope="col"
                                className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase"
                              >
                                Tax
                              </th>
                              <th
                                scope="col"
                                className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase"
                              >
                                Price
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {OrderItems &&
                              OrderItems.map((item) => {
                                return (
                                  <tr
                                    key={item.orderItemId}
                                    className="border-b"
                                  >
                                    <td className="w-52 p-4 whitespace-wrap text-sm text-gray-900">
                                      <ProductPreview
                                        productName={item.title}
                                        asin={item.asin}
                                        sku={item.sellerSku}
                                        displayImage={false}
                                        rebuildTooltip={open}
                                      />
                                    </td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                                      {item.quantityOrdered}
                                    </td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                                      {item.itemTaxAmount}
                                    </td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                                      {item.itemPriceAmount}
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
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

export default OrderSlideOver;
