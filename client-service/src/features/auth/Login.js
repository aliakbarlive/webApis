import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { login } from './authSlice';

import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput,
} from 'reactstrap';

import Logo from 'components/Logo';

const Login = ({ history }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onCheckboxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData, history));
  };

  return (
    <React.Fragment>
      <Logo />

      <Card>
        <CardBody>
          <div className="text-center mt-4 px-4">
            <h2>Welcome</h2>
            <p className="lead">Sign in to your account to continue</p>
          </div>

          <div className="m-sm-4">
            <Form method="POST" onSubmit={onSubmit}>
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
              <FormGroup>
                <Label>Password</Label>
                <Input
                  bsSize="lg"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={onInputChange}
                />
                <small>
                  <Link to="/forgot-password">Forgot password?</Link>
                </small>
              </FormGroup>
              <div>
                <CustomInput
                  type="checkbox"
                  id="rememberMe"
                  label="Remember me next time"
                  defaultChecked
                  onChange={onCheckboxChange}
                />
              </div>
              <div className="text-center mt-3">
                <Button color="primary" size="lg">
                  Sign in
                </Button>
              </div>

              <div className="text-center mt-4">
                <p>
                  Don't have an account yet?{' '}
                  <Link to="/register">Register.</Link>
                </p>
              </div>
            </Form>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default withRouter(Login);
