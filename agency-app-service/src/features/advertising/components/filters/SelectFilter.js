import React from 'react';

import Select from 'components/Forms/Select';

const SelectFilter = ({
  onApplyFilter,
  placeholder,
  name,
  options,
  params,
  className,
}) => {
  const onChangeFilter = (e) => {
    let newParams = { ...params, page: 1 };

    const { name, value } = e.target;
    delete newParams[name];

    if (value) newParams[name] = value;
    onApplyFilter(newParams);
  };

  return (
    <Select
      name={name}
      className={`appearance-none px-3 py-2 border shadow-sm placeholder-gray-400 focus:ring-red-500 focus:border-red-500 ${className}`}
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
    </Select>
  );
};

export default SelectFilter;
