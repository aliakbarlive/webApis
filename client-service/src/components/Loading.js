import React from 'react';
import { Row, Col, Spinner } from 'reactstrap';

const Loading = ({ size = 'sm' }) => {
  return (
    <span>
      <Spinner type="grow" color="primary" size={size} />
      &nbsp;
      <Spinner type="grow" color="primary" size={size} />
      &nbsp;
      <Spinner type="grow" color="primary" size={size} />
      &nbsp;
      <Spinner type="grow" color="primary" size={size} />
    </span>
  );
};
export default Loading;
