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

const ForgotPasswordSuccess = () => {
  return (
    <React.Fragment>
      <Logo />

      <Card>
        <CardBody>
          <div className="text-center mt-4 px-4">
            <h1 className="h2">Check your email</h1>
            <p className="lead">
              We just emailed you instructions on how to reset your password.
            </p>
          </div>
          <div className="m-sm-4">
            <div className="text-center mt-3">
              <Link to="/login">
                <Button color="primary" size="lg">
                  Return to login
                </Button>
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default ForgotPasswordSuccess;
