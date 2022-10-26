import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import AssignedCells from 'features/clients/Profile/details/AssignedCells';

const AssignmentSlider = ({
  open,
  setOpen,
  refresh,
  setRefresh,
  row,
  setRow,
}) => {
  const onCancel = (e) => {
    if (e) e.preventDefault();
    setOpen(false);
  };

  const updateClientCell = (payload) => {
    if (payload.success) {
      const { cells } = payload.output;
      setRow({
        ...row,
        cells,
      });
      setRefresh(!refresh);
      setOpen(false);
    }
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
                      Assign Client to Cell
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
                  <div className="px-4 py-4 sm:px-6">
                    <hr />
                  </div>

                  <AssignedCells
                    client={row}
                    updateDetails={updateClientCell}
                  />
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AssignmentSlider;
