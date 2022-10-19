import React from 'react';

import { Card, CardBody, Input } from 'reactstrap';

const SearchBar = ({ onSearch }) => {
  return (
    <Input size="lg" placeholder="Search by keyword" onChange={onSearch} />
  );
};

export default SearchBar;
