import React from 'react';
import { Dialog, Transition } from '@headlessui/react';

const ConfirmationModal = ({
  open,
  setOpen,
  onOkClick,
  onCancelClick,
  title,
  content,
  align = 'center',
}) => {
  return (
    <Transition.Root appear show={open} as="div">
      <Dialog as="div" open={open} onClose={setOpen}>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 pointer-events-none" />
            {align === 'center' && (
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
            )}

            <div className="inline-block w-full max-w-xs text-center p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-lg rounded-lg">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                {title}
              </Dialog.Title>
              <div className="mt-1">
                <p className="text-sm text-gray-500">{content}</p>
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                  onClick={onOkClick}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center ml-2 px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                  onClick={onCancelClick}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ConfirmationModal;
