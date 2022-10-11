import React from 'react';

const SelectFilter = ({
  onApplyFilter,
  placeholder,
  name,
  options,
  params,
}) => {
  const onChangeFilter = (e) => {
    let newParams = { ...params, page: 1 };

    const { name, value } = e.target;
    delete newParams[name];

    if (value) newParams[name] = value;
    onApplyFilter(newParams);
  };

  return (
    <select
      name={name}
      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
      onChange={onChangeFilter}
    >
      <option value="">{placeholder}</option>
      {options.map((option, index) => {
        return (
          <option key={index} value={option.value}>
            {option.display}
          </option>
        );
      })}
    </select>
  );
};

export default SelectFilter;
