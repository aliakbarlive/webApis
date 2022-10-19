import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

import InputMask from 'react-input-mask';

import { useDispatch, useSelector } from 'react-redux';
import { register, getInvitePrefill } from './authSlice';

import {
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

import Logo from 'components/Logo';

const SignUp = ({ history }) => {
  const { inviteId } = useParams();
  const { prefill } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    inviteId: null,
  });

  useEffect(() => {
    if (inviteId) {
      if (!prefill) {
        dispatch(getInvitePrefill(inviteId, history));
      } else {
        setFormData({ ...formData, email: prefill, inviteId });
      }
    }
  }, [prefill]);

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onCheckboxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData, history));
  };

  return (
    <React.Fragment>
      <Logo />

      <Card>
        <CardBody>
          <div className="text-center mt-4 px-4">
            <h1 className="h2">Get started</h1>
            <p className="lead">Fill out the details below.</p>
          </div>

          <div className="m-sm-4">
            <Form method="POST" onSubmit={onSubmit}>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label>First Name</Label>
                    <Input
                      bsSize="lg"
                      type="text"
                      name="firstName"
                      placeholder="Enter your first name"
                      required
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Last Name</Label>
                    <Input
                      bsSize="lg"
                      type="text"
                      name="lastName"
                      placeholder="Enter your last name"
                      required
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <Label>Email</Label>
                <Input
                  bsSize="lg"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  readOnly={prefill}
                  required
                  onChange={onInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Password</Label>
                <Input
                  bsSize="lg"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  onChange={onInputChange}
                />
              </FormGroup>
              <div className="text-center mt-3">
                <Button color="primary" size="lg">
                  Sign up
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4">
              <p>
                Already have an account? <Link to="/login">Log in.</Link>
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};
export default withRouter(SignUp);
