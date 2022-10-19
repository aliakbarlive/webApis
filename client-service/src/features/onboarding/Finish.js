import React from 'react';

import { Link } from 'react-router-dom';

import { Button } from 'reactstrap';

const Finish = () => {
  return (
    <div className="text-center px-4">
      <div className="mb-3">
        <h3>You are all done</h3>
        <p>
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book.
        </p>
      </div>

      <div className="d-flex flex-column align-items-center">
        <Link to="/dashboard">
          <Button className="mb-3" color="primary" size="lg">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Finish;
