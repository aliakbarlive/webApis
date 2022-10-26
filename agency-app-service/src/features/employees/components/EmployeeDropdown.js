import { Listbox } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import classNames from 'utils/classNames';

const EmployeeDropdown = ({
  title,
  data,
  schema = {
    label: 'label',
    value: 'value',
    description: 'description',
  },
  selected,
  onChange,
}) => {
  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-xs font-medium text-gray-600 px-2">
            {title}
          </Listbox.Label>
          <div className="relative w-full">
            <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm">
              <span className="w-full inline-flex truncate justify-between">
                <span className="truncate capitalize">
                  {selected[schema.label]}
                </span>
                <span className="ml-2 truncate text-gray-500">
                  {selected[schema.description]}
                </span>
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {data.map((item, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    classNames(
                      active ? 'text-white bg-red-600' : 'text-gray-900',
                      'cursor-default select-none relative py-2 pl-3 pr-9'
                    )
                  }
                  value={item}
                >
                  {({ selected, active }) => (
                    <>
                      <div className="flex justify-between">
                        <span
                          className={classNames(
                            selected ? 'font-semibold' : 'font-normal',
                            'truncate capitalize'
                          )}
                        >
                          {item[schema.label]}
                        </span>
                        <span
                          className={classNames(
                            active ? 'text-red-200' : 'text-gray-500',
                            'ml-2 truncate'
                          )}
                        >
                          {item[schema.description]}
                        </span>
                      </div>

                      {selected ? (
                        <span
                          className={classNames(
                            active ? 'text-white' : 'text-red-600',
                            'absolute inset-y-0 right-0 flex items-center pr-4'
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default EmployeeDropdown;
