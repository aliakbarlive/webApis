import React from 'react';

import { Input } from 'reactstrap';

const SearchBar = ({ onApplyFilter, placeholder, name, params }) => {
  const onSearch = (e) => {
    let newParams = { ...params, page: 1 };

    const { name, value } = e.target;

    name.split(',').forEach((key) => {
      const queryKey = `filter[${key}][iLike]`;
      delete newParams[queryKey];

      if (value) {
        newParams[queryKey] = value;
      }
    });

    onApplyFilter(newParams);
  };

  return (
    <Input
      type="search"
      name={name}
      placeholder={placeholder}
      onChange={onSearch}
      operator="like"
    ></Input>
  );
};

export default SearchBar;
