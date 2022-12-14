/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

const SlideOver = ({
  open,
  setOpen,
  as = null,
  title,
  children,
  titleClasses = '',
  size = 'md',
  noOverlayClick = false,
}) => {
  return (
    <Transition.Root show={open} as={as ?? Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 overflow-hidden"
        style={{ zIndex: 2 }}
        open={open}
        onClose={setOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay
            className={`absolute inset-0 ${
              noOverlayClick ? 'pointer-events-none' : ''
            }`}
          />

          <div className="fixed inset-y-0 right-0 sm:pl-10 max-w-full flex">
            <Transition.Child
              as={as ?? Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className={`w-screen max-w-${size}`}>
                <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                  <div className="px-4 sm:px-6 pt-12">
                    <div className="flex items-start justify-between">
                      <Dialog.Title
                        className={`text-lg font-medium text-gray-900 ${
                          titleClasses ?? ''
                        }`}
                      >
                        {title}
                      </Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          className="bg-white rounded-md text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 relative flex-1 px-4 sm:px-6">
                    {children}
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

export default SlideOver;
