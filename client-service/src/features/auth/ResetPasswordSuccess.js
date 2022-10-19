import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

import Logo from 'components/Logo';

const ResetPasswordSuccess = () => {
  return (
    <React.Fragment>
      <Logo />

      <Card>
        <CardBody>
          <div className="text-center mt-4 px-4">
            <h1 className="h2">Successful password reset</h1>
            <p className="lead">
              You can now use your new password to log in to your account.
            </p>
          </div>
          <div className="m-sm-4">
            <div className="text-center mt-3">
              <Link to="/login">
                <Button color="primary" size="lg">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default ResetPasswordSuccess;
