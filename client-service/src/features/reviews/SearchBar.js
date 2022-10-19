import React from 'react';

import { Card, CardBody, Input } from 'reactstrap';

const SearchBar = ({ onSearch }) => {
  return (
    <Card>
      <CardBody>
        <Input
          size="lg"
          placeholder="Search by ASIN, or product name"
          onChange={onSearch}
        ></Input>
      </CardBody>
    </Card>
  );
};

export default SearchBar;
