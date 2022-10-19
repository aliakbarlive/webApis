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

    const queryKey = `filter[${name}]`;
    delete newParams[queryKey];

    if (value) {
      newParams[queryKey] = value;
    }
    onApplyFilter(newParams);
  };

  return (
    <select name={name} className="form-control" onChange={onChangeFilter}>
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
