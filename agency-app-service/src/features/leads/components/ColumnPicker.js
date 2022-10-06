import { Fragment, useState } from 'react';
import { startCase, uniqBy } from 'lodash';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';

import Modal from 'components/Modal';
import classNames from 'utils/classNames';
import Checkbox from 'components/Forms/Checkbox';

const ColumnPicker = ({ options, setTableColumns, className = '' }) => {
  const [search, setSearch] = useState('');
  const [viewOptions, setViewOptions] = useState(false);

  const onChangeCheckBox = (e) => {
    const i = options.findIndex((el) => el.dataField === e.target.id);
    const optionsCopy = [...options];
    optionsCopy[i].show = !optionsCopy[i].show;
    setTableColumns(optionsCopy);
  };

  const applyAll = () => {
    const optionsCopy = options.map((option) => {
      return {
        ...option,
        show: true,
      };
    });
    setTableColumns(optionsCopy);
  };
  return (
    <div className={className}>
      <Modal open={viewOptions} persistent={true} as="div" align="top">
        <div className="inline-block w-full max-w-xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
          <div className="p-4">
            <div className="grid grid-cols-3 border-b gap-4">
              <div className="col-span-3">
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
                        search
                          ? option.text
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          : true
                      )
                      .map((option, i) => {
                        return (
                          <div key={option.dataField}>
                            <Checkbox
                              id={option.dataField}
                              classes="my-2 mx-3"
                              checked={option.show}
                              onChange={onChangeCheckBox}
                            />
                            <label className="text-xs font-medium text-gray-700 ml-3 w-full mt-2 cursor-pointer">
                              {option.text}
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
              Close
            </button>
          </div>
        </div>
      </Modal>

      <Menu as="div" className="w-full relative inline-block text-left mr-4">
        <div>
          <button
            onClick={() => setViewOptions(true)}
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          >
            Customize Columns
          </button>
        </div>
      </Menu>
    </div>
  );
};

export default ColumnPicker;
