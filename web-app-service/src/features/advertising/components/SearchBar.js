import React from 'react';

const SearchBar = ({ onApplyFilter, placeholder, name = 'search', params }) => {
  const onSearch = (e) => {
    let newParams = { ...params, page: 1 };

    const { name, value } = e.target;
    newParams[name] = value;

    onApplyFilter(newParams);
  };

  return (
    <input
      name={name}
      type="search"
      placeholder={placeholder}
      onChange={onSearch}
      operator="like"
      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
    />
  );
};

export default SearchBar;
