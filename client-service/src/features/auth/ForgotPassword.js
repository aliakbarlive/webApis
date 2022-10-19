import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { forgotPassword } from './authSlice';

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

const ForgotPassword = ({ history }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
  });

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onReset = async (e) => {
    e.preventDefault();
    await dispatch(forgotPassword(formData, history));
  };

  return (
    <React.Fragment>
      <Logo />

      <Card>
        <CardBody>
          <div className="text-center mt-4 px-4">
            <h1 className="h2">Forgot your password?</h1>
            <p className="lead">Enter your email to your reset password.</p>
          </div>
          <div className="m-sm-4">
            <Form>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  bsSize="lg"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={onInputChange}
                />
              </FormGroup>
              <div className="text-center mt-3">
                <Link to="/dashboard/default">
                  <Button color="primary" size="lg" onClick={onReset}>
                    Reset password
                  </Button>
                </Link>
              </div>

              <div className="text-center mt-4">
                <p>
                  Did you remember your password?{' '}
                  <Link to="/login">Try logging in.</Link>
                </p>
              </div>
            </Form>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default withRouter(ForgotPassword);
