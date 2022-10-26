import { Fragment, useState } from 'react';
import { startCase, uniqBy } from 'lodash';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';

import Modal from 'components/Modal';
import classNames from 'utils/classNames';
import Checkbox from 'components/Forms/Checkbox';

const ColumnPicker = ({ options, values, onChange, className = '' }) => {
  const [search, setSearch] = useState('');
  const [viewOptions, setViewOptions] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');

  const onChangeItem = (e) => {
    const { id, checked } = e.target;
    const newValues = checked
      ? `${values},${id}`
      : values
          .split(',')
          .filter((value) => value !== id)
          .join(',');

    onChange(newValues);
  };

  const onResetToDefault = () => {
    const newValues = options
      .filter((option) => option.default)
      .map((option) => option.key)
      .join(',');

    onChange(newValues);
  };

  const applyAll = () => {
    const newValues = options.map((option) => option.key).join(',');
    onChange(newValues);
  };

  return (
    <div className={className}>
      <Modal open={viewOptions} persistent={true} as="div" align="top">
        <div className="inline-block w-full max-w-xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
          <div className="p-4">
            <div className="grid grid-cols-3 border-b gap-4">
              <nav className="space-y-1 pr-4 border-r" aria-label="Sidebar">
                <button
                  key={'all'}
                  className={classNames(
                    'all' === currentTab
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'cursor-pointer w-full flex items-center px-3 py-2 text-xs font-medium rounded-md'
                  )}
                  onClick={() => setCurrentTab('all')}
                >
                  <span className="truncate">All</span>
                </button>
                {uniqBy(options, 'category').map((item) => (
                  <button
                    key={item.category}
                    className={classNames(
                      item.category === currentTab
                        ? 'bg-gray-200 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'cursor-pointer w-full flex items-center px-3 py-2 text-xs font-medium rounded-md'
                    )}
                    onClick={() => setCurrentTab(item.category)}
                  >
                    <span className="truncate">{startCase(item.category)}</span>
                  </button>
                ))}
              </nav>

              <div className="col-span-2">
                <div className="">
                  <div className="text-xs flex text-gray-700 justify-between">
                    <p className="font-medium">Available Metrics</p>
                    <p
                      className="text-blue-500 cursor-pointer"
                      onClick={applyAll}
                    >
                      Select All
                    </p>
                  </div>
                  <input
                    type="search"
                    className="px-3 py-2 w-full text-xs my-2 border-gray-300 border rounded"
                    placeholder="Quick Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="h-64 overflow-y-scroll">
                    {options
                      .filter((option) => option.hideable)
                      .filter((option) =>
                        currentTab === 'all'
                          ? true
                          : option.category === currentTab
                      )
                      .filter((option) =>
                        search ? option.display.includes(search) : true
                      )
                      .map((option) => {
                        return (
                          <div key={option.key}>
                            <Checkbox
                              id={option.key}
                              classes="my-2 mx-3"
                              checked={values.split(',').includes(option.key)}
                              onChange={onChangeItem}
                            />
                            <label className="text-xs font-medium text-gray-700 ml-3 w-full mt-2 cursor-pointer">
                              {option.display}
                            </label>
                          </div>
                        );
                      })}
                  </div>
                </div>
                <div></div>
              </div>
            </div>

            <button
              className="m-1 mt-2 rounded border py-1 px-2"
              onClick={() => setViewOptions(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Menu as="div" className="w-full relative inline-block text-left mr-4">
        <div>
          <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
            Columns
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="z-50 origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'text-left px-4 py-2 text-sm w-full'
                    )}
                    onClick={() => setViewOptions(true)}
                  >
                    Customize Columns
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'text-left px-4 py-2 text-sm w-full'
                    )}
                    onClick={onResetToDefault}
                  >
                    Reset to Default
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default ColumnPicker;
