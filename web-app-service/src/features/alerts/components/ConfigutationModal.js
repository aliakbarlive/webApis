import React from 'react';
import { useSelector } from 'react-redux';
import { range, startCase } from 'lodash';
import { XIcon } from '@heroicons/react/outline';
import { Switch } from '@headlessui/react';
import { StarIcon } from '@heroicons/react/solid';
import { selectSelectedConfig } from '../alertsSlice';

import { Modal, Toggle } from 'components';
import classNames from 'utils/classNames';

const ConfigurationModal = ({ open, setOpen, attributes, onChange }) => {
  const config = useSelector(selectSelectedConfig);

  const updateRatingCondition = (type, value) => {
    onChange(config, 'ratingCondition', {
      type,
      value,
    });
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="inline-block align-bottom bg-white rounded-lg pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-2xl w-full">
        <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">Close</span>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="px-4 md:px-6 border-b-2 pb-3">
          <h3 className="text-md leading-6 font-medium text-gray-800">
            Monitoring Settings
          </h3>
        </div>

        <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {attributes.map((attr) => {
            return (
              <div key={attr} className="border p-4">
                <Switch.Group
                  as="div"
                  className="flex items-center justify-between"
                >
                  <span className="flex-grow flex flex-col">
                    <Switch.Description
                      as="span"
                      className="text-sm font-medium text-gray-900"
                    >
                      {startCase(attr)}
                    </Switch.Description>
                  </span>
                  <Toggle
                    checked={config[attr]}
                    onChange={() => onChange(config, attr)}
                  />
                </Switch.Group>
                {attr === 'lowStock' && (
                  <input
                    type="number"
                    className="mt-4 shadow-sm focus:ring-red-500 focus:border-red-500 block w-full text-xs border-gray-300 rounded-md"
                    value={config.lowStockThreshold}
                    onChange={(e) =>
                      onChange(
                        config,
                        'lowStockThreshold',
                        parseInt(e.target.value)
                      )
                    }
                  />
                )}
                {attr === 'rating' && (
                  <div className="flex mt-4 items-center justify-between">
                    <select
                      className="text-xs p-2 pr-8 border-gray-300 focus:ring-red-500 focus:border-red-500 rounded-md"
                      value={
                        config.ratingCondition
                          ? config.ratingCondition.type
                          : null
                      }
                      onChange={(e) =>
                        updateRatingCondition(
                          e.target.value,
                          config.ratingCondition.value
                        )
                      }
                    >
                      <option value="below" className="text-xs">
                        Below
                      </option>
                      <option value="above" className="text-xs">
                        Above
                      </option>
                    </select>

                    <div className="flex">
                      {range(1, 6).map((id) => (
                        <StarIcon
                          key={id}
                          className={classNames(
                            'h-4 w-4',
                            config.ratingCondition &&
                              config.ratingCondition.value >= id
                              ? 'text-yellow-500'
                              : 'text-gray-500'
                          )}
                          onClick={() =>
                            updateRatingCondition(
                              config.ratingCondition.type,
                              id
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default ConfigurationModal;
