import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { resetPassword } from './authSlice';

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

const ResetPassword = ({ history, match }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    password: '',
  });

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onReset = async (e) => {
    e.preventDefault();
    await dispatch(resetPassword(formData, match.params.token, history));
  };

  return (
    <React.Fragment>
      <Logo />

      <Card>
        <CardBody>
          <div className="text-center mt-4 px-4">
            <h1 className="h2">Reset your password</h1>
            <p className="lead">Enter your new password</p>
          </div>
          <div className="m-sm-4">
            <Form>
              <FormGroup>
                <Label>New Password</Label>
                <Input
                  bsSize="lg"
                  type="password"
                  name="password"
                  placeholder="Enter a new password"
                  onChange={onInputChange}
                />
              </FormGroup>

              {/* <FormGroup>
                <Label>Confirm Password</Label>
                <Input
                  bsSize="lg"
                  type="password"
                  name="password"
                  placeholder="Confirm new password"
                  onChange={onInputChange}
                />
              </FormGroup> */}
              <div className="text-center mt-3">
                <Link to="/dashboard/default">
                  <Button color="primary" size="lg" onClick={onReset}>
                    Reset password
                  </Button>
                </Link>
              </div>
            </Form>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default withRouter(ResetPassword);
