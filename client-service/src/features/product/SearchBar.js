import React from 'react';

import { Card, CardBody, Input } from 'reactstrap';

const SearchBar = ({ onSearch }) => {
  return (
    <Input
      size="lg"
      className="mb-4"
      placeholder="Search by Shipment Name or Destination Fulfillment Center"
      onChange={onSearch}
    />
  );
};

export default SearchBar;
