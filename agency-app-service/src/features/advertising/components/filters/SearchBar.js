import React from 'react';
import Input from 'components/Forms/Input';

const SearchBar = ({
  onApplyFilter,
  placeholder,
  name = 'search',
  params,
  className,
}) => {
  const onSearch = (e) => {
    let newParams = { ...params, page: 1 };

    const { name, value } = e.target;
    newParams[name] = value;

    onApplyFilter(newParams);
  };

  return (
    <Input
      name={name}
      type="search"
      placeholder={placeholder}
      onChange={onSearch}
      classes={`appearance-none px-3 py-2 placeholder-gray-400 focus:outline-none ${className}`}
    />
  );
};

export default SearchBar;
