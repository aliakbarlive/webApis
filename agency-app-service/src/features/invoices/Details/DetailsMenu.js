import React from 'react';
import {
  MailIcon,
  PrinterIcon,
  DownloadIcon,
  PencilAltIcon,
  CurrencyDollarIcon,
  DotsHorizontalIcon,
  ChatAltIcon,
  PencilIcon,
} from '@heroicons/react/outline';

import { Menu } from '@headlessui/react';
import DropdownMenu from 'components/DropdownMenu';
import usePermissions from 'hooks/usePermissions';
import useInvoice from 'hooks/useInvoice';

const DetailsMenu = ({
  invoice,
  setIsOpenEmailModal,
  onPrintPdf,
  onDowloadPdf,
  setIsOpenCollect,
  setIsOpenPaymentModal,
  setIsOpenRecentActivities,
  setIsOpenVoid,
  setIsOpenWriteOff,
  setIsOpenConvertToOpen,
  setIsOpenCancelWriteOff,
}) => {
  const { userCan, userCanAll } = usePermissions();
  const status = useInvoice(invoice);

  const menuButtonClasses = `py-2 border-gray-200 border-r px-4 bg-white hover:bg-gray-100 flex items-center text-sm text-gray-600 hover:text-red-500`;

  return (
    <div className="bg-white flex justify-between border-l border-b border-gray-200  mb-10">
      <div className="flex">
        {userCan('invoices.email') && (
          <button
            className={menuButtonClasses}
            title="Send Email"
            onClick={() => setIsOpenEmailModal(true)}
          >
            <MailIcon className="w-4 h-4 mr-1 inline" />
            <span className="hidden sm:inline">Send Email</span>
          </button>
        )}
        {userCan('invoices.pdf.preview') && (
          <button
            className={menuButtonClasses}
            title="Preview PDF/Print"
            onClick={onPrintPdf}
          >
            <PrinterIcon className="w-4 h-4 mr-1 inline" />
            <span className="hidden sm:inline">PDF Preview</span>
          </button>
        )}
        {userCan('invoices.pdf.download') && (
          <button
            className={menuButtonClasses}
            title="Download PDF"
            onClick={onDowloadPdf}
          >
            <DownloadIcon className="w-4 h-4 mr-1 inline" />
            <span className="hidden sm:inline">Download</span>
          </button>
        )}
        {status.unpaid() &&
          status.open() &&
          status.notWrittenOff() &&
          userCanAll('invoices.collect|invoices.payment.add') && (
            <DropdownMenu
              title={
                <>
                  <CurrencyDollarIcon className="w-4 h-4 mr-1 inline" />
                  <span className="hidden sm:inline">Record Payment</span>
                </>
              }
              titleClasses="flex items-center mr-1"
              buttonBg="bg-transparent"
              buttonFontWeight="font-normal"
              hoverClasses="bg-gray-100"
              textColor="text-gray-600"
              classes="border-r text-sm z-10"
              buttonRounded=""
              hoverText="hover:text-red-500"
              dropdownWidth="w-auto"
            >
              <div className="px-1 py-1 flex flex-col">
                {status.unpaid() && userCan('invoices.collect') && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className="py-2 px-4 text-left hover:bg-gray-100 text-sm text-gray-600 hover:text-red-500"
                        onClick={() => setIsOpenCollect(true)}
                      >
                        Charge Customer
                      </button>
                    )}
                  </Menu.Item>
                )}
                {status.unpaid() && userCan('invoices.payment.add') && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className="py-2 px-4 text-left hover:bg-gray-100 text-sm text-gray-600 hover:text-red-500"
                        onClick={() => setIsOpenPaymentModal(true)}
                      >
                        Record Payment
                      </button>
                    )}
                  </Menu.Item>
                )}
              </div>
            </DropdownMenu>
          )}
        {status.unpaid() &&
          status.open() &&
          status.notWrittenOff() &&
          userCanAll('invoices.void|invoices.writeoff') && (
            <DropdownMenu
              title={<DotsHorizontalIcon className="w-5 h-5 mr-1" />}
              buttonBg="bg-transparent"
              buttonFontWeight="font-normal"
              hoverClasses="bg-gray-100"
              textColor="text-gray-600"
              classes="border-r text-sm z-10"
              buttonRounded=""
              hoverText="hover:text-red-500"
              titleClasses=""
              dropdownWidth="w-40"
              hideArrow
            >
              <div className="px-1 py-1 flex flex-col">
                {invoice.payment_made === 0 &&
                  invoice.credits_applied === 0 &&
                  userCan('invoices.void') && (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className="py-2 px-4 text-left hover:bg-gray-100 text-sm text-gray-600 hover:text-red-500"
                          onClick={() => setIsOpenVoid(true)}
                        >
                          Void
                        </button>
                      )}
                    </Menu.Item>
                  )}

                {userCan('invoices.writeoff') && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className="py-2 px-4 text-left hover:bg-gray-100 text-sm text-gray-600 hover:text-red-500"
                        onClick={() => setIsOpenWriteOff(true)}
                      >
                        Write Off
                      </button>
                    )}
                  </Menu.Item>
                )}
              </div>
            </DropdownMenu>
          )}
        {status.voided() && userCan('invoices.void') && (
          <button
            className={menuButtonClasses}
            title="convert to open"
            onClick={() => setIsOpenConvertToOpen(true)}
          >
            <PencilAltIcon className="w-4 h-4 mr-1 inline" />
            <span className="hidden sm:inline">Convert To Open</span>
          </button>
        )}
        {status.writtenOff() && userCan('invoices.writeoff') && (
          <button
            className={menuButtonClasses}
            title="Cancel write off"
            onClick={() => setIsOpenCancelWriteOff(true)}
          >
            <PencilIcon className="w-4 h-4 mr-1 inline" />
            <span className="hidden sm:inline">Cancel Write Off</span>
          </button>
        )}
      </div>
      <div>
        {userCan('invoices.history.view') && (
          <button
            className={`border-l ${menuButtonClasses}`}
            onClick={() => setIsOpenRecentActivities(true)}
          >
            <ChatAltIcon className="w-4 h-4 mr-1 inline" />
            Comments &amp; History
          </button>
        )}
      </div>
    </div>
  );
};
export default DetailsMenu;
