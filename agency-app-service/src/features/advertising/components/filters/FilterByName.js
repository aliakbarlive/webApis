import React from 'react';
import SelectFilter from './SelectFilter';

const FilterByName = ({
  onApplyFilter,
  placeholder,
  name,
  params,
  className,
  options,
}) => {
  return (
    <SelectFilter
      name={name}
      placeholder={placeholder}
      onApplyFilter={onApplyFilter}
      params={params}
      className={className}
      options={options}
    />
  );
};

export default FilterByName;
